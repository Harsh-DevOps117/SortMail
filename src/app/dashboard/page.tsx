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

  const needsActionEmails = emails.filter(e => e.needsReply === true);
  const readLaterEmails = emails.filter(e => e.needsReply === false);

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans selection:bg-[#ff3300] selection:text-white pb-12">
      
      {/* Navbar / Header */}
      <nav className="bg-white border-b border-neutral-200 px-8 py-6 mb-12 flex justify-between items-center sticky top-0 z-50">
         <div className="flex items-baseline gap-4">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-black hover:text-[#ff3300] transition-colors">SortMail</Link>
            <span className="text-neutral-400 font-mono text-xs uppercase tracking-widest hidden md:inline">Triage Dashboard</span>
         </div>
         <div className="flex items-center gap-4 md:gap-6">
            <span className="text-sm font-medium text-neutral-500 hidden md:inline">{session.user.email}</span>
            <div className="flex gap-3">
               <Link href="/dashboard" className="px-4 py-3 border border-neutral-200 text-black text-xs font-mono uppercase tracking-widest hover:bg-neutral-50 transition-colors">
                 Refresh
               </Link>
               {nextPageToken && (
                 <Link href={`/dashboard?pageToken=${nextPageToken}`} className="px-4 py-3 bg-[#ff3300] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#e62e00] transition-colors">
                   Next Page →
                 </Link>
               )}
            </div>
         </div>
      </nav>

      {errorMsg && (
        <div className="max-w-[1600px] mx-auto mb-8 bg-red-50 border border-red-200 text-red-600 p-4 font-mono text-sm px-8">
          ERROR: {errorMsg}
        </div>
      )}

      {/* Main Grid with Custom Heights for Scrollable Columns */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Action Required Column */}
        <div className="bg-white border border-[#ff3300]/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 relative flex flex-col h-[75vh]">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#ff3300]" />
          <div className="flex items-center justify-between mb-6 flex-shrink-0 border-b border-neutral-100 pb-4">
            <h2 className="text-xl font-light tracking-tight text-black">Action Required</h2>
            <span className="bg-[#ff3300] text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest">{needsActionEmails.length} Items</span>
          </div>
          
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow pb-4">
            {needsActionEmails.length === 0 && <p className="text-neutral-400 font-mono text-xs uppercase tracking-widest text-center mt-10">Inbox Zero</p>}
            
            {needsActionEmails.map((email, idx) => (
              <div key={idx} className="bg-neutral-50 p-5 border border-neutral-100 hover:border-[#ff3300]/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-black truncate max-w-[200px]">{email.from.split('<')[0]}</span>
                </div>
                <h3 className="font-medium text-lg text-black mb-2 group-hover:text-[#ff3300] transition-colors line-clamp-1">{email.subject}</h3>
                <p className="text-sm text-neutral-500 font-light line-clamp-2 leading-relaxed">{email.snippet}</p>
                <div className="mt-4 flex gap-3 items-center">
                  <span className="text-[10px] text-[#ff3300] font-mono uppercase tracking-widest font-bold">● Reply</span>
                  <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">{email.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Read Later Column */}
        <div className="bg-white border border-neutral-200 p-6 flex flex-col h-[75vh]">
          <div className="flex items-center justify-between mb-6 flex-shrink-0 border-b border-neutral-100 pb-4">
            <h2 className="text-xl font-light tracking-tight text-neutral-500">Read Later</h2>
             <span className="bg-neutral-100 text-neutral-500 text-[10px] px-2 py-1 font-mono uppercase tracking-widest">{readLaterEmails.length} Items</span>
          </div>
          
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow pb-4">
             {readLaterEmails.length === 0 && <p className="text-neutral-400 font-mono text-xs uppercase tracking-widest text-center mt-10">Inbox Zero</p>}

             {readLaterEmails.map((email, idx) => (
              <div key={idx} className="bg-white p-4 border border-neutral-100 hover:bg-neutral-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-neutral-700 truncate max-w-[200px]">{email.from.split('<')[0]}</span>
                </div>
                <h3 className="font-medium text-sm text-black mb-1 line-clamp-1">{email.subject}</h3>
                <p className="text-xs font-light text-neutral-500 line-clamp-2 mt-2 leading-relaxed">{email.snippet}</p>
                <div className="mt-3 flex gap-2">
                  <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">{email.category}</span>
                </div>
              </div>
             ))}
          </div>
        </div>

        {/* Auto-Handled Column */}
        <div className="bg-[#f5f5f5] border border-neutral-200 p-6 flex flex-col h-[75vh] hidden lg:flex">
          <div className="flex items-center justify-between mb-6 flex-shrink-0 border-b border-neutral-200 pb-4">
            <h2 className="text-xl font-light tracking-tight text-neutral-400">Auto-Handled</h2>
          </div>
          <div className="flex flex-col items-center justify-center h-full text-center border border-dashed border-neutral-300">
              <span className="text-5xl font-light text-neutral-300 mb-6">*</span>
              <p className="text-neutral-400 font-mono text-xs uppercase tracking-widest leading-loose">LLM Agent<br/>Operational</p>
          </div>
        </div>

      </div>
    </div>
  );
}
