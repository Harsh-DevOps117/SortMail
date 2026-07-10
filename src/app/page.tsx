import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#ff3300] selection:text-white">
      {/* Abstract Red Lines Background (mimicking the vector art) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center opacity-[0.15]">
        <svg viewBox="0 0 100 100" className="w-[150vw] h-[150vh] stroke-[#ff3300] fill-none" strokeWidth="0.1">
           <path d="M0,50 L100,50 M50,0 L50,100 M20,20 L80,80 M20,80 L80,20" />
           <circle cx="50" cy="50" r="20" strokeDasharray="1,1" />
           <circle cx="50" cy="50" r="30" />
        </svg>
      </div>

      <nav className="relative z-10 flex items-center justify-between p-8 md:px-24 border-b border-neutral-100 bg-white/90 backdrop-blur-md">
        <div className="text-xl md:text-2xl font-bold tracking-tighter text-black">SortMail</div>
        <LoginButton />
      </nav>

      <main className="relative z-10 flex flex-col items-start px-8 md:px-24 pt-32 pb-24 max-w-[1600px] mx-auto">
        <h1 className="text-[4rem] sm:text-[6rem] md:text-[8rem] font-light tracking-tighter mb-8 leading-[0.9] text-black">
          The Smartest Way<br />to Sort Email.
        </h1>
        
        <p className="text-xl md:text-2xl text-neutral-500 max-w-2xl mb-12 font-light leading-relaxed">
          Go live with inbox zero in seconds, not hours, with SortMail's modern AI triage platform.
        </p>

        {/* Highlight Section */}
        <div className="mt-32 w-full">
           <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-8">01 &nbsp; Platform Comparison</div>
           <h2 className="text-[3rem] md:text-[5rem] font-light tracking-tighter mb-12 text-black leading-[1]">Not Just Smarter, <br className="md:hidden" />900% Faster</h2>
           
           <div className="bg-[#ff3300] text-white p-8 md:p-24 relative overflow-hidden flex flex-col justify-end min-h-[300px] md:min-h-[500px]">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[800px] md:h-[800px] border border-white/20 rounded-full translate-x-1/3 -translate-y-1/3 flex items-center justify-center">
                 <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-white/20 rounded-full flex items-center justify-center">
                    <div className="w-[200px] h-[200px] md:w-[400px] md:h-[400px] border border-white/20 rounded-full flex items-center justify-center">
                       <span className="text-4xl text-white">*</span>
                    </div>
                 </div>
              </div>
              <p className="text-xs md:text-sm font-mono uppercase tracking-widest mb-4 opacity-80">With SortMail</p>
              <p className="text-5xl md:text-[7rem] font-light tracking-tighter leading-none">0 Inbox</p>
           </div>
           
           <div className="bg-[#f5f5f5] text-black p-8 md:p-24 flex flex-col justify-end min-h-[250px] md:min-h-[400px]">
              <p className="text-xs md:text-sm font-mono uppercase tracking-widest mb-4 text-neutral-400">Other Mail Clients</p>
              <p className="text-5xl md:text-[7rem] font-light tracking-tighter text-neutral-300 leading-none">999+ Unread</p>
           </div>
        </div>

        {/* Feature Teasers */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 w-full border-t border-neutral-200 pt-24">
          <div className="flex flex-col border-l-2 border-[#ff3300] pl-8">
            <h3 className="text-3xl md:text-5xl font-light text-black mb-6 leading-tight">No more building bespoke rules for every newsletter.</h3>
            <p className="text-neutral-500 font-light text-lg">SortMail's LLM instantly detects promotional noise and removes it.</p>
          </div>
          <div className="flex flex-col border-l-2 border-[#ff3300] pl-8">
            <h3 className="text-3xl md:text-5xl font-light text-black mb-6 leading-tight">No more missing the emails that actually matter.</h3>
            <p className="text-neutral-500 font-light text-lg">Important messages are triaged and tagged automatically.</p>
          </div>
        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-neutral-200 bg-white py-12 px-8 md:px-24 flex flex-col md:flex-row justify-between items-center text-xs font-mono tracking-widest uppercase text-neutral-400">
        <div>&copy; 2026 SortMail Platform</div>
        <div className="flex gap-8 mt-6 md:mt-0">
          <a href="#" className="hover:text-[#ff3300] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#ff3300] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#ff3300] transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
