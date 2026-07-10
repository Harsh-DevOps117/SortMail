import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendEmail } from "@/lib/gmail";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { category, instructions, targetSenders, attachmentUrl } = await request.json();
    
    if (!targetSenders || !instructions) {
      return NextResponse.json({ error: 'Missing required configuration fields' }, { status: 400 });
    }

    const targets = targetSenders.split(',').map((s: string) => s.trim()).filter(Boolean);
    
    if (targets.length === 0 || targets[0] === '*') {
      return NextResponse.json({ error: 'Please specify explicit email addresses for manual bulk trigger (e.g., example@domain.com).' }, { status: 400 });
    }

    let successCount = 0;
    for (const target of targets) {
      try {
        const subject = `Message regarding: ${category}`;
        // In a real hackathon app, we might use LLM to draft it, but direct instructions work as body too.
        let body = instructions;
        if (attachmentUrl) {
           body += `<br><br><a href="${attachmentUrl}">View Attached Document</a>`;
        }
        await sendEmail(session.user.email, target, subject, body, body);
        successCount++;
      } catch (err) {
         console.error(`Failed to send bulk email to ${target}`, err);
      }
    }

    return NextResponse.json({ success: true, sentCount: successCount });
  } catch (error) {
    console.error('Failed to trigger bulk send:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
