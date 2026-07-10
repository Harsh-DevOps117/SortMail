"use client";

import { CheckCircle, LogOut, Mail, Settings, Zap } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [isReplying, setIsReplying] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [isBulkSending, setIsBulkSending] = useState(false);

  const [savedRules, setSavedRules] = useState<any[]>([]);

  const fetchRules = async () => {
    try {
      const res = await fetch("/api/autorules");
      if (res.ok) {
        const data = await res.json();
        setSavedRules(data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (activeTab === 'autohandler') {
      fetchRules();
    }
  }, [activeTab]);

  // AutoHandler State
  const [ruleCategory, setRuleCategory] = useState("internship");
  const [ruleInstructions, setRuleInstructions] = useState("");
  const [targetSenders, setTargetSenders] = useState("*");
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

  const handleSendReply = async () => {
    if (!selectedEmail || !replyContent) return;
    setSendingReply(true);
    try {
      const match = selectedEmail.senderEmail.match(/<(.+)>/);
      const toEmail = match ? match[1] : selectedEmail.senderEmail;

      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: toEmail,
          subject: replySubject || selectedEmail.subject,
          content: replyContent
        }),
      });
      if (res.ok) {
        setIsReplying(false);
        setReplyContent("");
        toast.success("Reply sent successfully!");
      } else {
        toast.error("Failed to send reply.");
      }
    } catch (err) {
      toast.error("Error sending reply.");
    } finally {
      setSendingReply(false);
    }
  };

  const handleSaveRule = async () => {
    const toastId = toast.loading("Saving automation rule...");
    try {
      const res = await fetch("/api/autorules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: ruleCategory, instructions: ruleInstructions, targetSenders, attachmentUrl }),
      });
      if (res.ok) {
        toast.success("Rule saved successfully!", { id: toastId });
        fetchRules();
      } else {
        toast.error("Failed to save rule.", { id: toastId });
      }
    } catch (err) {
      toast.error("Error saving rule.", { id: toastId });
    }
  };

  const handleBulkSend = async (rule: any) => {
    if (!rule.targetSenders || rule.targetSenders === '*') {
      toast.error("Please specify explicit email addresses for manual bulk trigger (e.g., example@domain.com).");
      return;
    }
    setIsBulkSending(true);
    const toastId = toast.loading("Executing Bulk Send...");
    try {
      const res = await fetch("/api/bulk-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rule),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Successfully blasted to ${data.sentCount} targets!`, { id: toastId });
      } else {
        toast.error(data.error || "Failed to trigger bulk send.", { id: toastId });
      }
    } catch (err) {
      toast.error("Error triggering bulk send.", { id: toastId });
    } finally {
      setIsBulkSending(false);
    }
  };

  const filteredEmails = emails.filter(email => {
    if (activeTab === "inbox") {
      return selectedCategory ? email.category === selectedCategory : true;
    }
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
             <div className={`flex flex-col border-r border-neutral-200 bg-[#fafafa] flex-shrink-0 transition-all duration-300 ease-in-out ${selectedEmail ? 'w-[400px]' : 'w-full'} custom-scrollbar`}>

               {/* Filtering Bar for Inbox */}
               {activeTab === 'inbox' && (
                 <div className="p-4 border-b border-neutral-200 bg-white flex gap-2 overflow-x-auto custom-scrollbar shrink-0">
                   <button
                     onClick={() => setSelectedCategory(null)}
                     className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest whitespace-nowrap transition-colors ${!selectedCategory ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
                   >
                     All
                   </button>
                   {['internship', 'youtube', 'newsletter', 'personal', 'other'].map(cat => (
                     <button
                       key={cat}
                       onClick={() => setSelectedCategory(cat)}
                       className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-[#ff3300] text-white border border-[#ff3300]/20' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 border border-transparent'}`}
                     >
                       {cat}
                     </button>
                   ))}
                 </div>
               )}

               <div className="overflow-y-auto flex-1 custom-scrollbar">
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
                      {!isReplying && selectedEmail.needsReply && (
                        <button onClick={() => { setIsReplying(true); setReplySubject(selectedEmail.subject.startsWith('Re:') ? selectedEmail.subject : 'Re: ' + selectedEmail.subject); }} className="bg-[#ff3300] text-white px-6 py-2 text-xs font-mono uppercase tracking-widest rounded-sm shadow-sm hover:bg-[#e62e00] transition-colors">
                          Reply Now
                        </button>
                      )}
                   </div>

                   {isReplying && (
                     <div className="mb-8 border border-neutral-200 p-6 bg-white shadow-sm rounded-sm">
                       <div className="flex items-center justify-between border-b-2 border-neutral-100 pb-4 mb-4">
                          <h4 className="text-sm font-bold uppercase tracking-widest text-black flex items-center gap-2">
                            <Zap className="w-4 h-4 text-[#ff3300]" />
                            Drafting Reply
                          </h4>
                       </div>

                       <div className="space-y-4 mb-4">
                          <div className="flex items-center gap-4">
                             <label className="w-16 text-xs font-mono uppercase tracking-widest text-neutral-400">To:</label>
                             <input type="text" readOnly value={selectedEmail.senderEmail} className="flex-1 bg-neutral-50 border border-neutral-200 p-2 text-sm text-neutral-600 outline-none cursor-not-allowed" />
                          </div>
                          <div className="flex items-center gap-4">
                             <label className="w-16 text-xs font-mono uppercase tracking-widest text-neutral-400">Subj:</label>
                             <input type="text" value={replySubject} onChange={(e) => setReplySubject(e.target.value)} className="flex-1 bg-white border border-neutral-300 p-2 text-sm text-black outline-none focus:border-[#ff3300]" />
                          </div>
                       </div>

                       <textarea
                         className="w-full border-2 border-neutral-200 p-4 min-h-[250px] outline-none focus:border-[#ff3300] mb-4 text-sm font-mono leading-relaxed bg-[#fafafa]"
                         placeholder="Type your reply here..."
                         value={replyContent}
                         onChange={(e) => setReplyContent(e.target.value)}
                       />
                       <div className="flex justify-between items-center mt-4">
                         <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Powered by Gmail API</span>
                         <div className="flex gap-3">
                           <button onClick={() => setIsReplying(false)} className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-black hover:bg-neutral-100 transition-colors border border-transparent hover:border-neutral-200">
                             Cancel
                           </button>
                           <button onClick={handleSendReply} disabled={sendingReply} className="bg-[#ff3300] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-black transition-all disabled:opacity-50">
                             {sendingReply ? "Sending..." : "Send Reply"}
                           </button>
                         </div>
                       </div>
                     </div>
                   )}

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
             <div className="flex-1 p-12 overflow-y-auto bg-[#fafafa] custom-scrollbar">
               <div className="max-w-7xl mx-auto">
                 <h2 className="text-4xl font-light tracking-tighter mb-4 text-black">Auto-Handler Engine</h2>
                 <p className="text-neutral-500 mb-12 text-sm leading-relaxed max-w-2xl">
                    Configure the AI to autonomously draft and send replies to specific email classifications.
                    Upload high-resolution PDFs or Images securely to Cloudinary, and the LLM will attach them to outgoing emails matching your criteria.
                 </p>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* Left Col: Rule Config */}
                   <div className="border border-neutral-200 rounded-sm p-10 bg-white shadow-sm flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-8 text-black uppercase tracking-tight">Create Automation Rule</h3>
                        <div className="space-y-8">
                          <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-black mb-3">If AI Category Matches...</label>
                            <div className="relative">
                               <select
                                  value={ruleCategory}
                                  onChange={(e) => setRuleCategory(e.target.value)}
                                  className="w-full border-2 border-neutral-200 p-4 rounded-none bg-[#fafafa] text-black outline-none focus:border-[#ff3300] appearance-none font-medium"
                               >
                                  <option value="internship">Internship Application / Reply</option>
                                  <option value="youtube">YouTube Sponsorship / Collab</option>
                                  <option value="newsletter">Newsletter</option>
                                  <option value="personal">Personal / Direct Contact</option>
                                  <option value="other">Other / General</option>
                               </select>
                               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
                                 ▼
                               </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-black mb-3">Target Senders / Bulk Audience</label>
                            <input
                               type="text"
                               value={targetSenders}
                               onChange={(e) => setTargetSenders(e.target.value)}
                               className="w-full border-2 border-neutral-200 p-4 rounded-none bg-[#fafafa] outline-none focus:border-[#ff3300] text-sm font-mono"
                               placeholder="Use * for all senders, or enter specific emails separated by commas"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-black mb-3">System Prompt Instructions</label>
                            <textarea
                               value={ruleInstructions}
                               onChange={(e) => setRuleInstructions(e.target.value)}
                               className="w-full border-2 border-neutral-200 p-5 rounded-none bg-[#fafafa] h-40 outline-none focus:border-[#ff3300] text-sm leading-relaxed font-mono"
                               placeholder="E.g., You are my autonomous agent. Thank them for reaching out and state that I am currently open to new roles. Please refer them to my attached resume..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-black mb-3">Cloudinary Attachment (Optional)</label>
                            <label className="border-2 border-dashed border-neutral-300 rounded-none p-12 flex flex-col items-center justify-center bg-[#fafafa] cursor-pointer hover:bg-neutral-100 hover:border-black transition-all relative group">
                               <input type="file" className="hidden" onChange={handleFileUpload} />
                               {uploading ? (
                                 <div className="flex flex-col items-center gap-2">
                                   <div className="w-6 h-6 border-2 border-[#ff3300] border-t-transparent rounded-full animate-spin"></div>
                                   <span className="text-xs font-mono uppercase tracking-widest text-[#ff3300]">Uploading...</span>
                                 </div>
                               ) : attachmentUrl ? (
                                 <div className="flex flex-col items-center gap-2">
                                   <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">✓</div>
                                   <span className="text-sm font-bold text-green-700 truncate w-full text-center">Securely Attached</span>
                                   <span className="text-[10px] font-mono text-neutral-400 truncate max-w-[200px]">{attachmentUrl}</span>
                                 </div>
                               ) : (
                                 <>
                                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-neutral-200 mb-4 group-hover:scale-110 transition-transform">
                                      <Zap className="w-5 h-5 text-neutral-400" />
                                   </div>
                                   <span className="text-sm font-bold text-black mb-1">Click to upload Media</span>
                                   <span className="text-xs text-neutral-500 max-w-[250px] text-center">PDFs, Images, or Documents. Delivered via zero-latency Cloudinary CDN.</span>
                                 </>
                               )}
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 mt-8 border-t border-neutral-200">
                        <button
                          onClick={handleSaveRule}
                          className="bg-black text-white px-8 py-5 text-sm font-bold uppercase tracking-widest rounded-none w-full hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                        >
                          <Settings className="w-4 h-4"/> Save Automation Rule
                        </button>
                      </div>
                   </div>

                   {/* Right Col: Manual Execute Box */}
                   <div className="border border-neutral-200 rounded-sm p-10 bg-white shadow-sm flex flex-col h-full max-h-[850px]">
                     <div className="mb-8 shrink-0">
                       <h3 className="text-xl font-bold mb-4 text-black uppercase tracking-tight flex items-center gap-3">
                         <Zap className="w-6 h-6 text-[#ff3300]" /> Deployed Rules
                       </h3>
                       <p className="text-sm text-neutral-600 leading-relaxed font-mono">
                         Trigger your active automation rules manually. Blast out configured instructions directly to target senders without waiting for autonomous processing.
                       </p>
                     </div>

                     <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-4">
                       {savedRules.length === 0 ? (
                         <div className="p-8 text-center text-neutral-400 font-mono text-xs uppercase tracking-widest border-2 border-dashed border-neutral-200">
                           No rules deployed yet.
                         </div>
                       ) : (
                         savedRules.map((rule, idx) => (
                           <div key={idx} className="bg-neutral-50 border border-neutral-200 p-6 font-mono text-xs text-neutral-500 flex flex-col gap-4 hover:border-black transition-colors">
                              <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
                                 <span className="uppercase tracking-widest font-bold text-black text-sm">{rule.category}</span>
                                 {rule.attachmentUrl && <span className="bg-green-100 text-green-700 px-3 py-1 text-[10px] rounded-full shadow-sm">Attached</span>}
                              </div>
                              <div className="flex flex-col gap-2">
                                 <span className="uppercase tracking-widest opacity-60">Target Senders</span>
                                 <span className="font-bold text-[#ff3300] break-all">{rule.targetSenders}</span>
                              </div>
                              <button
                                onClick={() => handleBulkSend(rule)}
                                disabled={isBulkSending}
                                className="mt-4 bg-[#ff3300] text-white px-4 py-4 text-[10px] font-bold uppercase tracking-widest rounded-none w-full hover:bg-black transition-colors disabled:opacity-50"
                              >
                                {isBulkSending ? "Transmitting..." : "Execute Bulk Send"}
                              </button>
                           </div>
                         ))
                       )}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
