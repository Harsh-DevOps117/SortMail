import { google } from 'googleapis';
import connectToDatabase from './mongodb';
import User from '@/models/User';
import Email from '@/models/Email';
import { classifyEmail } from './llm';

function extractBody(payload: any): string {
  if (!payload) return '';

    let htmlBody = '';
  let textBody = '';

  function traverse(part: any) {
    if (part.mimeType === 'text/html' && part.body?.data) {
      htmlBody = Buffer.from(part.body.data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
    } else if (part.mimeType === 'text/plain' && part.body?.data) {
      textBody = Buffer.from(part.body.data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
    }

        if (part.parts) {
      for (const p of part.parts) {
        traverse(p);
      }
    }
  }

    traverse(payload);

    if (htmlBody) return htmlBody;
  if (textBody) return textBody;

    if (payload.body?.data) {
    return Buffer.from(payload.body.data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
  }

    return '';
}

function decodeHTMLEntities(text: string) {
  if (!text) return '';
  return text
    .replace(/&#39;?/g, "'")
    .replace(/&quot;?/g, '"')
    .replace(/&amp;?/g, '&')
    .replace(/&lt;?/g, '<')
    .replace(/&gt;?/g, '>')
    .replace(/&#8204;?/g, '')
    .replace(/&nbsp;?/g, ' ');
}

export async function fetchRecentEmails(userEmail: string, pageToken?: string) {
  await connectToDatabase();

    const user = await User.findOne({ email: userEmail });
  if (!user || !user.accessToken) {
    throw new Error('User not found or not authenticated with Google');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

    oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread', 
      maxResults: 15,
      pageToken: pageToken || undefined,
    });

    const messages = response.data.messages || [];
    const nextPageToken = response.data.nextPageToken || null;

    const detailedEmails = await Promise.all(
      messages.map(async (msg) => {
        if (!msg.id) return null;

        const existingEmail = await Email.findOne({ messageId: msg.id });
        if (existingEmail) {
          return existingEmail;
        }

        const msgDetail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full',
        });

        const headers = msgDetail.data.payload?.headers || [];
        const subjectHeader = headers.find(h => h.name === 'Subject');
        const fromHeader = headers.find(h => h.name === 'From');
        const unsubscribeHeader = headers.find(h => h.name?.toLowerCase() === 'list-unsubscribe');

        const subject = subjectHeader ? subjectHeader.value : 'No Subject';
        const from = fromHeader ? fromHeader.value : 'Unknown';
        const snippet = decodeHTMLEntities(msgDetail.data.snippet || '');
        const hasUnsubscribe = !!unsubscribeHeader;

                const htmlBody = extractBody(msgDetail.data.payload);

        const llmResult = await classifyEmail(subject || '', snippet, hasUnsubscribe);

        const newEmail = await Email.create({
          userId: user._id,
          messageId: msg.id,
          threadId: msgDetail.data.threadId,
          subject: subject,
          senderEmail: from, 
          snippet: snippet,
          htmlBody: htmlBody,
          category: llmResult.category,
          needsReply: llmResult.needsReply,
          receivedAt: new Date(),
        });

        return newEmail;
      })
    );

    return {
      emails: detailedEmails.filter(email => email !== null),
      nextPageToken
    };
  } catch (error) {
    console.error('Error fetching Gmail:', error);
    throw error;
  }
}

export async function sendEmail(userEmail: string, to: string, subject: string, textContent: string, htmlContent?: string) {
  await connectToDatabase();

    const user = await User.findOne({ email: userEmail });
  if (!user || !user.accessToken) {
    throw new Error('User not found or not authenticated with Google');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

    oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    htmlContent || textContent,
  ];

  const message = messageParts.join('\r\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
