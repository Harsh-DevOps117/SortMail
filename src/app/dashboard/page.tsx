import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchRecentEmails } from "@/lib/gmail";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Dashboard({ searchParams }: { searchParams: { pageToken?: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/");
  }

  let emails: any[] = [];
  let nextPageToken = null;
  let errorMsg = null;
  
  try {
    const data = await fetchRecentEmails(session.user.email, searchParams.pageToken);
    emails = data.emails;
    nextPageToken = data.nextPageToken;
  } catch (error) {
    console.error("Failed to fetch emails:", error);
    errorMsg = "Failed to load emails from Google. Make sure you granted the Gmail permissions.";
  }

  const needsActionEmails = emails.filter(e => !e.hasUnsubscribe);
  const readLaterEmails = emails.filter(e => e.hasUnsubscribe);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 font-sans">
      <header className="mb-10 max-w-[1400px] mx-auto flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent pb-1">
            SortMail
          </h1>
          <p className="text-neutral-400 mt-1 text-sm font-medium">Welcome back, {session.user.name}</p>
        </div>
        
        {/* Pagination Controls */}
        <div className="flex gap-4">
          <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm">
            Refresh
          </Link>
          {nextPageToken && (
            <Link href={`/dashboard?pageToken=${nextPageToken}`} className="px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold hover:bg-indigo-500/20 transition-all shadow-[0_0_10px_rgba(99,102,241,0.1)]">
              Next Page →
            </Link>
          )}
        </div>
      </header>

      {errorMsg && (
        <div className="max-w-[1400px] mx-auto mb-8 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Main Grid with Custom Heights for Scrollable Columns */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Action Required Column */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col h-[75vh]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 className="text-xl font-bold text-red-400">Needs Action</h2>
            <span className="bg-red-500/10 text-red-400 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{needsActionEmails.length}</span>
          </div>
          
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-grow pb-4">
            {needsActionEmails.length === 0 && <p className="text-neutral-500 text-sm text-center mt-10">No action required right now!</p>}
            
            {needsActionEmails.map((email, idx) => (
              <div key={idx} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 hover:border-red-500/50 transition-all duration-300 cursor-pointer group hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-neutral-300 truncate max-w-[200px]">{email.from.split('<')[0]}</span>
                </div>
                <h3 className="font-bold text-base text-neutral-100 mb-1.5 group-hover:text-white transition-colors line-clamp-1">{email.subject}</h3>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{email.snippet}</p>
                <div className="mt-3 flex gap-2">
                  <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Reply Required</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Read Later Column */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex flex-col h-[75vh]">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 className="text-xl font-bold text-blue-400">FYI / Read Later</h2>
             <span className="bg-blue-500/10 text-blue-400 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{readLaterEmails.length}</span>
          </div>
          
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-grow pb-4">
             {readLaterEmails.length === 0 && <p className="text-neutral-500 text-sm text-center mt-10">Inbox zero for newsletters!</p>}

             {readLaterEmails.map((email, idx) => (
              <div key={idx} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-neutral-400 truncate max-w-[200px]">{email.from.split('<')[0]}</span>
                </div>
                <h3 className="font-medium text-sm text-neutral-300 mb-1 line-clamp-1">{email.subject}</h3>
                <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1.5">{email.snippet}</p>
              </div>
             ))}
          </div>
        </div>

        {/* Auto-Replied Column */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex flex-col h-[75vh]">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 className="text-xl font-bold text-emerald-400">Auto-Handled</h2>
          </div>
          <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-emerald-900/30 rounded-2xl">
              <svg className="w-8 h-8 text-emerald-500/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-emerald-500/50 font-medium text-sm">LLM Auto-Replies<br/>Coming Soon</p>
          </div>
        </div>

      </div>
    </div>
  );
}
