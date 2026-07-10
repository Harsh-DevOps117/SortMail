"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 font-sans selection:bg-[#ff3300] selection:text-white">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter text-black mb-2 uppercase">SortMail</h1>
          <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Autonomous Triage Engine</p>
        </div>

        {/* Login Box */}
        <div className="bg-white border-2 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
           <h2 className="text-2xl font-bold tracking-tight text-black mb-2">Welcome Back</h2>
           <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
             Authenticate with your Google Workspace or Gmail account to allow the LLM to securely route your inbox.
           </p>

           {error && (
             <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-mono uppercase tracking-widest text-center">
               Authentication Error. Please try again.
             </div>
           )}

           <button 
             onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
             className="w-full bg-[#ff3300] text-white font-bold uppercase tracking-widest text-sm py-5 px-6 border-2 border-transparent hover:border-black hover:bg-black transition-all flex items-center justify-center gap-3 group"
           >
             <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
               <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
               <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
               <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
               <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
             </svg>
             Continue with Google
           </button>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] font-mono text-neutral-400 mt-12 uppercase tracking-widest">
          Secured by NextAuth & OAuth 2.0
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-mono text-xs text-neutral-400 uppercase tracking-widest">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
