import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30 overflow-hidden relative flex flex-col items-center justify-center font-sans">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] opacity-50 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] opacity-50 mix-blend-screen pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <main className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 text-neutral-300 text-sm font-medium mb-10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Next-Gen AI Email Triage
        </div>

        {/* Hero Title */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
          <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">Sort</span>
          <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">Mail</span>
        </h1>
        
        {/* Hero Subtitle */}
        <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mb-14 leading-relaxed font-medium">
          Stop drowning in promotional noise. SortMail uses specialized NLP to automatically triage your inbox and highlight <span className="text-white font-semibold">what actually needs a reply.</span>
        </p>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-24">
          <LoginButton />
        </div>

        {/* Feature Teasers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 p-8 rounded-3xl hover:border-indigo-500/30 transition-all duration-300 hover:bg-neutral-900/80 group">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-100 mb-3">Smart Classification</h3>
            <p className="text-neutral-500 leading-relaxed text-sm">Uses advanced stemming and token optimization to classify emails accurately without massive API costs.</p>
          </div>

          <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 p-8 rounded-3xl hover:border-purple-500/30 transition-all duration-300 hover:bg-neutral-900/80 group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-100 mb-3">SaaS-Grade Triage</h3>
            <p className="text-neutral-500 leading-relaxed text-sm">Automatically ignores newsletters and blasts by detecting unsubscribe headers instantly.</p>
          </div>

          <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 p-8 rounded-3xl hover:border-blue-500/30 transition-all duration-300 hover:bg-neutral-900/80 group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-100 mb-3">Auto-Replies</h3>
            <p className="text-neutral-500 leading-relaxed text-sm">Set up rules to automatically draft and send context-aware replies to specific categories.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
