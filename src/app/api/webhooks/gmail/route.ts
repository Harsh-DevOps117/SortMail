import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { optimizeEmailForLLM } from '@/lib/nlp';
import User from '@/models/User';

// Google Cloud Pub/Sub sends a POST request to this endpoint when a new email arrives
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Google Pub/Sub sends data in a 'message.data' base64 encoded string
    if (!body.message || !body.message.data) {
      return NextResponse.json({ error: 'Invalid Pub/Sub message format' }, { status: 400 });
    }

    const decodedData = Buffer.from(body.message.data, 'base64').toString('utf-8');
    const parsedData = JSON.parse(decodedData);
    
    // The data contains the emailAddress and historyId of the new event
    const { emailAddress, historyId } = parsedData;
    console.log(`[Webhook] New email activity for: ${emailAddress}, historyId: ${historyId}`);

    // --- NEXT STEPS (To be implemented once we get actual API keys) ---
    // 1. await connectToDatabase();
    // 2. const user = await User.findOne({ email: emailAddress });
    // 3. Call Gmail API using user.accessToken & historyId to get the raw HTML body.
    // 4. Check for 'List-Unsubscribe' header (SaaS optimization).
    // 5. const denseText = optimizeEmailForLLM(rawHtml);
    // 6. Send 'denseText' to messh_api (LLM) for classification.
    // 7. Save the "Needs Reply" tag to MongoDB.

    return NextResponse.json({ success: true, message: "Webhook received successfully" });
  } catch (error) {
    console.error('[Webhook Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
