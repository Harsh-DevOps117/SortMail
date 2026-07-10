import { google } from 'googleapis';
import connectToDatabase from './mongodb';
import User from '@/models/User';
import Email from '@/models/Email';
import { classifyEmail } from './llm';

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
    
    // Process emails in parallel
    const detailedEmails = await Promise.all(
      messages.map(async (msg) => {
        if (!msg.id) return null;

        // 1. Check if we already classified and saved this email in MongoDB!
        const existingEmail = await Email.findOne({ messageId: msg.id });
        if (existingEmail) {
          return existingEmail;
        }
        
        // 2. If it's new, fetch the full content from Gmail
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
        const snippet = msgDetail.data.snippet || '';
        const hasUnsubscribe = !!unsubscribeHeader;

        // 3. Let the LLM Decide the Category & Action!
        // We pass the snippet as the HTML body for now to save tokens, it contains the core context.
        const llmResult = await classifyEmail(subject || '', snippet, hasUnsubscribe);

        // 4. Save to MongoDB so we never have to run the LLM on this email again
        const newEmail = await Email.create({
          userId: user._id,
          messageId: msg.id,
          threadId: msgDetail.data.threadId,
          subject: subject,
          senderEmail: from, // Mongoose schema expects senderEmail, not 'from'
          snippet: snippet,
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
