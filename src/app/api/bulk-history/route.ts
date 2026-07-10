import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import BulkHistory from "@/models/BulkHistory";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const history = await BulkHistory.find({ userId: user._id }).sort({ createdAt: -1 }).limit(20);
    return NextResponse.json(history);
  } catch (error) {
    console.error('Failed to fetch bulk history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
