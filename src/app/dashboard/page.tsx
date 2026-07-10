import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchRecentEmails } from "@/lib/gmail";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  // 1. Get the logged-in user
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/"); // Send them back to the login page if not authenticated
  }

  // 2. Fetch real emails from Gmail
  let emails: any[] = [];
  let errorMsg = null;
  
  try {
    emails = await fetchRecentEmails(session.user.email);
  } catch (error) {
    console.error("Failed to fetch emails:", error);
    errorMsg = "Failed to load emails from Google. Make sure you granted the Gmail permissions.";
  }

  // 3. Simple Client-Side Triage (Before LLM)
  // If it has an unsubscribe link, it's a newsletter/promotion (Read Later)
  // Otherwise, we assume it's a direct email (Needs Action)
  const needsActionEmails = emails.filter(e => !e.hasUnsubscribe);
  const readLaterEmails = emails.filter(e => e.hasUnsubscribe);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 font-sans">
      <header className="mb-12 max-w-7xl mx-auto flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent pb-2">
            SortMail
          </h1>
          <p className="text-neutral-400 mt-2 text-lg">Welcome back, {session.user.name}</p>
        </div>
      </header>

      {errorMsg && (
        <div className="max-w-7xl mx-auto mb-8 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl">
          {errorMsg}
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Action Required Column */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-red-400">Needs Action</h2>
            <span className="bg-red-500/10 text-red-400 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">{needsActionEmails.length}</span>
          </div>
          
          <div className="space-y-4">
            {needsActionEmails.length === 0 && <p className="text-neutral-500 text-sm">No action required right now!</p>}
            
            {needsActionEmails.map((email, idx) => (
              <div key={idx} className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 hover:border-red-500/50 transition-all duration-300 cursor-pointer group hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-semibold text-neutral-300 truncate max-w-[200px]">{email.from.split('<')[0]}</span>
                </div>
                <h3 className="font-bold text-lg text-neutral-100 mb-2 group-hover:text-white transition-colors">{email.subject}</h3>
                <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">{email.snippet}</p>
                <div className="mt-5 flex gap-2">
                  <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-md font-bold animate-pulse">Reply Required</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Read Later Column (Promotions/Newsletters) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-400">FYI / Read Later</h2>
             <span className="bg-blue-500/10 text-blue-400 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">{readLaterEmails.length}</span>
          </div>
          
          <div className="space-y-4">
             {readLaterEmails.length === 0 && <p className="text-neutral-500 text-sm">Inbox zero for newsletters!</p>}

             {readLaterEmails.map((email, idx) => (
              <div key={idx} className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-semibold text-neutral-400 truncate max-w-[200px]">{email.from.split('<')[0]}</span>
                </div>
                <h3 className="font-medium text-neutral-300 mb-1">{email.subject}</h3>
                <p className="text-xs text-neutral-500 line-clamp-2 mt-2">{email.snippet}</p>
                <div className="mt-3 flex gap-2">
                  <span className="text-xs bg-neutral-800 text-neutral-400 border border-neutral-700 px-2.5 py-1 rounded-md font-medium">Newsletter</span>
                </div>
              </div>
             ))}
          </div>
        </div>

        {/* Auto-Replied Column (Coming soon when we add LLM) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-emerald-400">Auto-Handled</h2>
          </div>
          <div className="space-y-4 flex flex-col items-center justify-center h-48 text-center border-2 border-dashed border-emerald-900/30 rounded-2xl">
              <svg className="w-8 h-8 text-emerald-500/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-emerald-500/50 font-medium">LLM Auto-Replies<br/>Coming Soon</p>
          </div>
        </div>

      </div>
    </div>
  );
}
