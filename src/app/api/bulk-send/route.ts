import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendEmail } from "@/lib/gmail";
import { generateContextualReply, generateBroadcastEmail } from '@/lib/llm';
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Email from "@/models/Email";
import BulkHistory from "@/models/BulkHistory";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { category, instructions, targetSenders, attachmentUrl } = await request.json();

        if (!targetSenders || !instructions) {
      return NextResponse.json({ error: 'Missing required configuration fields' }, { status: 400 });
    }

    let successCount = 0;

        if (targetSenders === '*') {
      const emailsToReply = await Email.find({ userId: user._id, category, needsReply: true });
      if (emailsToReply.length === 0) {
        return NextResponse.json({ error: `No unhandled emails found in the '${category}' category.` }, { status: 400 });
      }

      for (const email of emailsToReply) {
        try {
          const draft = await generateContextualReply(email.snippet || email.subject, instructions);
          let finalBody = draft.body;
          if (attachmentUrl) {
             finalBody += `<br><br><a href="${attachmentUrl}">View Attached Document</a>`;
          }

                    const match = email.senderEmail.match(/<(.+)>/);
          const toEmail = match ? match[1] : email.senderEmail;

                    await sendEmail(session.user.email, toEmail, draft.subject, finalBody, finalBody);
          email.needsReply = false;
          await email.save();
          successCount++;
        } catch (err) {
           console.error(`Failed to send contextual reply to ${email.senderEmail}`, err);
        }
      }

      await BulkHistory.create({
        userId: user._id,
        category,
        targetCount: successCount,
        type: 'contextual_reply'
      });

    } else {
      const targets = targetSenders.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (targets.length === 0) {
        return NextResponse.json({ error: 'Invalid target senders' }, { status: 400 });
      }

      const draft = await generateBroadcastEmail(instructions);
      let finalBody = draft.body;
      if (attachmentUrl) {
         finalBody += `<br><br><a href="${attachmentUrl}">View Attached Document</a>`;
      }

      for (const target of targets) {
        try {
          await sendEmail(session.user.email, target, draft.subject, finalBody, finalBody);
          successCount++;
        } catch (err) {
           console.error(`Failed to send bulk email to ${target}`, err);
        }
      }

            await BulkHistory.create({
        userId: user._id,
        category,
        targetCount: successCount,
        type: 'broadcast'
      });
    }

    return NextResponse.json({ success: true, sentCount: successCount });
  } catch (error) {
    console.error('Failed to trigger bulk send:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
