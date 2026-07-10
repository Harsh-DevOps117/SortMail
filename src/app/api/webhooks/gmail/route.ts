import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { optimizeEmailForLLM } from '@/lib/nlp';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.message || !body.message.data) {
      return NextResponse.json({ error: 'Invalid Pub/Sub message format' }, { status: 400 });
    }

    const decodedData = Buffer.from(body.message.data, 'base64').toString('utf-8');
    const parsedData = JSON.parse(decodedData);

    const { emailAddress, historyId } = parsedData;
    console.log(`[Webhook] New email activity for: ${emailAddress}, historyId: ${historyId}`);


    return NextResponse.json({ success: true, message: "Webhook received successfully" });
  } catch (error) {
    console.error('[Webhook Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
