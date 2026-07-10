import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import AutoRule from "@/models/AutoRule";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { category, instructions, attachmentUrl } = await request.json();

    // Upsert rule based on category (one rule per category)
    const rule = await AutoRule.findOneAndUpdate(
      { userId: user._id, category },
      { instructions, attachmentUrl, createdAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, rule });
  } catch (error) {
    console.error('Failed to save auto rule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const rules = await AutoRule.find({ userId: user._id });
    return NextResponse.json({ rules });
  } catch (error) {
    console.error('Failed to fetch auto rules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
