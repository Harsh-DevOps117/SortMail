"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";
import { Mail, Settings, Clock, LogOut, CheckCircle, Zap } from "lucide-react";

export default function DashboardView({ emails, sessionEmail }: { emails: any[], sessionEmail: string }) {
  const router = useRouter();

  // Auto-polling for new emails every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 15000);
    return () => clearInterval(interval);
  }, [router]);

  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);

  // AutoHandler State
  const [ruleCategory, setRuleCategory] = useState("Recruiter / Job Pitch");
  const [ruleInstructions, setRuleInstructions] = useState("");
  const [uploading, setUploading] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setAttachmentUrl(data.url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveRule = async () => {
    setSaveStatus("Saving...");
    try {
      const res = await fetch("/api/autorules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: ruleCategory, instructions: ruleInstructions, attachmentUrl }),
      });
      if (res.ok) {
        setSaveStatus("Rule saved successfully!");
        setTimeout(() => setSaveStatus(""), 3000);
      } else {
        setSaveStatus("Failed to save.");
      }
    } catch (err) {
      setSaveStatus("Error saving.");
    }
  };

  const filteredEmails = emails.filter(email => {
    if (activeTab === "inbox") return true;
    if (activeTab === "action") return email.needsReply;
    if (activeTab === "readlater") return !email.needsReply;
    return false;
  });

  return (
    <div className="flex h-screen bg-[#fafafa] font-sans text-black">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-200 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-8 border-b border-neutral-100 mb-4">
             <h1 className="text-2xl font-bold tracking-tighter hover:text-[#ff3300] transition-colors cursor-pointer">SortMail</h1>
             <p className="text-[10px] font-mono text-neutral-400 mt-2 truncate">{sessionEmail}</p>
          </div>
          <nav className="flex flex-col gap-2 px-4">
            <button onClick={() => { setActiveTab("inbox"); setSelectedEmail(null); }} className={`flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors rounded-md ${activeTab === 'inbox' ? 'bg-[#ff3300] text-white' : 'text-neutral-600 hover:bg-neutral-50'}`}>
               <div className="flex items-center gap-3"><Mail className="w-4 h-4"/> Inbox</div>
               <span className="text-[10px] opacity-70">{emails.length}</span>
            </button>
            <button onClick={() => { setActiveTab("action"); setSelectedEmail(null); }} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-md ${activeTab === 'action' ? 'bg-[#ff3300] text-white' : 'text-neutral-600 hover:bg-neutral-50'}`}><Zap className="w-4 h-4"/> Needs Action</button>
            <button onClick={() => { setActiveTab("readlater"); setSelectedEmail(null); }} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-md ${activeTab === 'readlater' ? 'bg-[#ff3300] text-white' : 'text-neutral-600 hover:bg-neutral-50'}`}><CheckCircle className="w-4 h-4"/> Read Later</button>
            <div className="h-px bg-neutral-100 my-2 mx-4" />
            <button onClick={() => { setActiveTab("autohandler"); setSelectedEmail(null); }} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-md ${activeTab === 'autohandler' ? 'bg-[#ff3300] text-white' : 'text-neutral-600 hover:bg-neutral-50'}`}><Settings className="w-4 h-4"/> Auto-Handler</button>
            <button onClick={() => { setActiveTab("scheduled"); setSelectedEmail(null); }} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-md ${activeTab === 'scheduled' ? 'bg-[#ff3300] text-white' : 'text-neutral-600 hover:bg-neutral-50'}`}><Clock className="w-4 h-4"/> Scheduled</button>
          </nav>
        </div>
        <div className="p-4 border-t border-neutral-200">
          <button onClick={() => signOut()} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-600 hover:text-red-500 hover:bg-red-50 w-full rounded-md transition-colors">
            <LogOut className="w-4 h-4"/> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-neutral-200 bg-white flex items-center px-8 justify-between shrink-0">
          <h2 className="text-xl font-light capitalize">{activeTab.replace("readlater", "Read Later").replace("autohandler", "Auto-Handler Rules")}</h2>
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
             {activeTab === 'inbox' || activeTab === 'action' || activeTab === 'readlater' ? `${filteredEmails.length} Items` : 'Configuration'}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
           {/* Email List */}
           {(activeTab === 'inbox' || activeTab === 'action' || activeTab === 'readlater') && (
             <div className={`overflow-y-auto border-r border-neutral-200 bg-[#fafafa] flex-shrink-0 transition-all duration-300 ease-in-out ${selectedEmail ? 'w-[400px]' : 'w-full'} custom-scrollbar`}>
               {filteredEmails.map((email, idx) => (
                 <div 
                   key={idx} 
                   onClick={() => setSelectedEmail(email)}
                   className={`p-6 border-b border-neutral-200 cursor-pointer transition-colors ${selectedEmail?.id === email.id ? 'bg-white border-l-4 border-l-[#ff3300]' : 'hover:bg-white border-l-4 border-l-transparent'}`}
                 >
                   <div className="flex justify-between items-start mb-3">
                     <span className="text-sm font-bold text-black truncate pr-4">{email.senderEmail?.split('<')[0] || 'Unknown'}</span>
                   </div>
                   <h3 className="text-base font-medium mb-2 line-clamp-1 text-black">{email.subject}</h3>
                   <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed mb-4">{email.snippet}</p>
                   
                   {/* Capsule Badges */}
                   <div className="flex gap-2 items-center flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest ${email.needsReply ? 'bg-[#ff3300]/10 text-[#ff3300] border border-[#ff3300]/20' : 'bg-neutral-100 text-neutral-500 border border-neutral-200'}`}>
                         {email.category}
                      </span>
                      {email.needsReply && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-red-50 text-red-600 border border-red-100">
                          Needs Action
                        </span>
                      )}
                   </div>
                 </div>
               ))}
               {filteredEmails.length === 0 && (
                 <div className="p-12 text-center text-neutral-400 font-mono text-xs uppercase tracking-widest mt-20">No emails found in this view</div>
               )}
             </div>
           )}

           {/* Email Detail Reading Pane */}
           {(activeTab === 'inbox' || activeTab === 'action' || activeTab === 'readlater') && selectedEmail && (
             <div className="flex-1 bg-white overflow-y-auto p-12 custom-scrollbar">
                <div className="max-w-3xl mx-auto">
                   <h2 className="text-3xl font-light tracking-tight mb-8 text-black">{selectedEmail.subject}</h2>
                   <div className="flex items-center justify-between border-b border-neutral-100 pb-6 mb-8">
                      <div>
                         <div className="font-bold text-sm text-black">{selectedEmail.senderEmail}</div>
                         <div className="text-xs text-neutral-500 mt-1">To: {sessionEmail}</div>
                      </div>
                      {selectedEmail.needsReply && (
                        <button className="bg-[#ff3300] text-white px-6 py-2 text-xs font-mono uppercase tracking-widest rounded-sm shadow-sm hover:bg-[#e62e00] transition-colors">
                          Reply Now
                        </button>
                      )}
                   </div>
                   
                   <div className="w-full mt-8 border border-neutral-200 rounded-sm overflow-hidden h-[600px] bg-white">
                      {selectedEmail.htmlBody ? (
                        <iframe 
                           title="Email Content"
                           srcDoc={selectedEmail.htmlBody}
                           className="w-full h-full border-none"
                           sandbox="allow-same-origin allow-popups"
                        />
                      ) : (
                        <div className="p-8 text-neutral-700 leading-loose prose max-w-none">
                           <p>{selectedEmail.snippet}</p>
                           <p className="mt-8 text-neutral-400 text-sm italic">Note: Plain text email. No HTML body found.</p>
                        </div>
                      )}
                   </div>
                </div>
             </div>
           )}

           {/* Settings / Auto Handler View */}
           {activeTab === 'autohandler' && (
             <div className="flex-1 p-12 overflow-y-auto bg-white custom-scrollbar">
               <div className="max-w-3xl mx-auto">
                 <h2 className="text-3xl font-light tracking-tight mb-4 text-black">Auto-Handler Rules</h2>
                 <p className="text-neutral-500 mb-12 leading-relaxed">Configure the AI to automatically reply to specific types of emails. You can also attach files securely via Cloudinary, and the LLM will send them automatically when a matching email arrives.</p>
                 
                 <div className="border border-neutral-200 rounded-xl p-8 bg-neutral-50 mb-8 shadow-sm">
                    <h3 className="text-lg font-medium mb-6 text-black border-b border-neutral-200 pb-4">Create New Rule</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">If AI Category Is...</label>
                        <select 
                           value={ruleCategory}
                           onChange={(e) => setRuleCategory(e.target.value)}
                           className="w-full border border-neutral-200 p-3 rounded-md bg-white text-black outline-none focus:border-[#ff3300]"
                        >
                           <option>Recruiter / Job Pitch</option>
                           <option>Client Inquiry</option>
                           <option>Invoice Request</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">AI Reply Instructions</label>
                        <textarea 
                           value={ruleInstructions}
                           onChange={(e) => setRuleInstructions(e.target.value)}
                           className="w-full border border-neutral-200 p-4 rounded-md bg-white h-32 outline-none focus:border-[#ff3300]" 
                           placeholder="E.g., Thank them for reaching out and say I am currently open to new roles. Please review my attached resume..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">Cloudinary Attachment (Optional)</label>
                        <label className="border-2 border-dashed border-neutral-300 rounded-md p-10 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-neutral-50 transition-colors relative">
                           <input type="file" className="hidden" onChange={handleFileUpload} />
                           {uploading ? (
                             <span className="text-sm font-medium text-[#ff3300]">Uploading to Cloudinary...</span>
                           ) : attachmentUrl ? (
                             <span className="text-sm font-medium text-green-600 truncate w-full text-center">✓ File Attached</span>
                           ) : (
                             <>
                               <span className="text-sm font-medium text-neutral-600 mb-1">Click to upload PDF or Image</span>
                               <span className="text-xs text-neutral-400">Files are securely stored via Cloudinary APIs</span>
                             </>
                           )}
                        </label>
                      </div>
                      <button 
                        onClick={handleSaveRule}
                        className="bg-black text-white px-6 py-4 text-xs font-mono uppercase tracking-widest rounded-sm w-full hover:bg-neutral-800 transition-colors mt-4"
                      >
                        Save Auto-Handler Rule
                      </button>
                      {saveStatus && (
                         <div className={`text-sm font-medium mt-2 text-center ${saveStatus.includes('success') ? 'text-green-600' : 'text-[#ff3300]'}`}>
                            {saveStatus}
                         </div>
                      )}
                    </div>
                 </div>
               </div>
             </div>
           )}

           {/* Scheduled Outbox */}
           {activeTab === 'scheduled' && (
             <div className="flex-1 p-12 overflow-y-auto bg-white flex items-center justify-center">
                <div className="text-center">
                  <Clock className="w-16 h-16 text-neutral-200 mx-auto mb-6" />
                  <h3 className="text-2xl font-light mb-2 text-black">No Scheduled Emails</h3>
                  <p className="text-neutral-500 max-w-sm mx-auto">Emails that you have scheduled for future autonomous delivery will appear here.</p>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
