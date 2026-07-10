import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchRecentEmails } from "@/lib/gmail";
import { redirect } from "next/navigation";
import DashboardView from "@/components/DashboardView";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Dashboard({ searchParams }: { searchParams: { pageToken?: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/");
  }

  let emails: any[] = [];
  let errorMsg = null;
  
  try {
    const data = await fetchRecentEmails(session.user.email, searchParams.pageToken);
    emails = data.emails;
  } catch (error) {
    console.error("Failed to fetch emails:", error);
    errorMsg = "Failed to load emails from Google. Make sure you granted the Gmail permissions.";
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-8">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 font-mono text-sm max-w-lg">
          ERROR: {errorMsg}
        </div>
      </div>
    );
  }

  return <DashboardView emails={emails} sessionEmail={session.user.email} />;
}
