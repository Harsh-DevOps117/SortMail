import { google } from 'googleapis';
import connectToDatabase from './mongodb';
import User from '@/models/User';

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
    // 1. Fetch unread emails with pagination
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread', 
      maxResults: 15,
      pageToken: pageToken || undefined, // Pass token if we have it
    });

    const messages = response.data.messages || [];
    const nextPageToken = response.data.nextPageToken || null; // Google gives us the next page
    
    // 2. Fetch the full content
    const detailedEmails = await Promise.all(
      messages.map(async (msg) => {
        if (!msg.id) return null;
        
        const msgDetail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full',
        });

        const headers = msgDetail.data.payload?.headers || [];
        const subjectHeader = headers.find(h => h.name === 'Subject');
        const fromHeader = headers.find(h => h.name === 'From');
        const unsubscribeHeader = headers.find(h => h.name?.toLowerCase() === 'list-unsubscribe');

        return {
          id: msg.id,
          threadId: msgDetail.data.threadId,
          snippet: msgDetail.data.snippet,
          subject: subjectHeader ? subjectHeader.value : 'No Subject',
          from: fromHeader ? fromHeader.value : 'Unknown',
          hasUnsubscribe: !!unsubscribeHeader,
        };
      })
    );

    // Return both the emails AND the token for the next page
    return {
      emails: detailedEmails.filter(email => email !== null),
      nextPageToken
    };
  } catch (error) {
    console.error('Error fetching Gmail:', error);
    throw error;
  }
}
