"use client";

import { motion } from "framer-motion";
import LoginButton from "@/components/LoginButton";
import { ArrowRight, BrainCircuit, ShieldCheck, Zap, MailOpen, ChevronDown, Check } from "lucide-react";
import { useState } from "react";

const faqs = [
  { question: "How does the LLM classification work?", answer: "We use a universal routing gateway (MeshAPI) to pass a highly-compressed, NLP-optimized version of your emails to state-of-the-art models like GPT-4o. It determines the category and action required without storing your data." },
  { question: "Is my email data secure?", answer: "Yes. SortMail never stores the body of your emails. We only store metadata (like thread IDs and LLM categories) in our database. The OAuth tokens are securely encrypted." },
  { question: "Can I customize the categories?", answer: "In the pro version, you can define your own arbitrary categories (e.g. 'Invoices', 'Client X') and the LLM will automatically adapt its sorting logic." },
  { question: "How does it handle newsletters?", answer: "It checks standard email headers (like List-Unsubscribe) instantly. If it's a blast, it skips the expensive LLM processing entirely and routes it to Read Later." }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#ff3300] selection:text-white">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 md:px-16 py-6 bg-white/80 backdrop-blur-xl border-b border-neutral-100">
        <div className="text-xl font-bold tracking-tighter text-black flex items-center gap-2">
          <span className="w-4 h-4 bg-[#ff3300] inline-block"></span>
          SortMail
        </div>
        <div className="hidden md:flex gap-8 text-xs font-mono uppercase tracking-widest text-neutral-500">
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#comparison" className="hover:text-black transition-colors">Comparison</a>
          <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
        </div>
        <LoginButton />
      </nav>

      {/* Hero Section */}
      <main className="relative pt-40 pb-32 px-8 md:px-16 max-w-[1600px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <div className="z-10 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-[4rem] sm:text-[6rem] xl:text-[8rem] font-light tracking-tighter leading-[0.9] text-black mb-8">
                The Smartest<br />Way to Sort<br />Your Email.
              </h1>
              <p className="text-xl md:text-2xl text-neutral-500 max-w-lg mb-12 font-light leading-relaxed">
                Connect your inbox once. Never read a promotional email again. Go live with inbox zero in seconds.
              </p>
              <div className="flex gap-4 items-center">
                <LoginButton />
                <a href="#comparison" className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-neutral-400 hover:text-[#ff3300] transition-colors ml-4">
                  See How <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Simulation (The Email Triage Factory) */}
          <div className="relative h-[600px] hidden lg:block overflow-visible mt-12 w-full bg-[#fdfdfd] border border-neutral-100 shadow-[0_0_100px_rgba(0,0,0,0.02)]">
            
            {/* The Central LLM Engine (Scanner) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-[#ff3300] bg-white z-20 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,51,0,0.1)]">
               <motion.div 
                 className="absolute top-0 w-full h-1 bg-[#ff3300] shadow-[0_0_20px_#ff3300]"
                 animate={{ top: ["0%", "100%", "0%"] }}
                 transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
               />
               <BrainCircuit className="w-12 h-12 text-[#ff3300] mb-6" />
               <span className="font-mono text-xs uppercase tracking-widest text-[#ff3300] text-center leading-loose">MeshAPI<br/>Triage Node</span>
            </div>

            {/* Incoming Unsorted Emails (Left Side) */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-40 h-full flex flex-col justify-center gap-12 pl-12">
               {[1, 2, 3].map((i) => (
                 <motion.div 
                   key={`in-${i}`}
                   className="w-24 h-16 bg-white border border-neutral-300 flex items-center justify-center relative shadow-sm"
                   initial={{ x: -100, opacity: 0 }}
                   animate={{ x: [0, 160], opacity: [0, 1, 0], scale: [1, 1, 0.8] }}
                   transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: "easeIn" }}
                 >
                   <div className="absolute w-full h-full border-t border-neutral-300 [clip-path:polygon(50%_50%,100%_0,0_0)] opacity-50" />
                   <div className="w-1/2 h-1 bg-neutral-200 mt-4" />
                 </motion.div>
               ))}
            </div>

            {/* Outgoing Sorted Buckets (Right Side) */}
            <div className="absolute top-0 right-12 h-full flex flex-col justify-between py-12 w-56">
              
              {/* Action Required Bucket */}
              <div className="relative w-full h-32 border-2 border-dashed border-[#ff3300] bg-[#ff3300]/5 flex flex-col items-center justify-center">
                 <span className="font-mono text-[10px] uppercase tracking-widest text-[#ff3300] mb-2 font-bold">Action Required</span>
                 <motion.div 
                   className="absolute left-[-160px] w-20 h-12 bg-white border-2 border-[#ff3300] z-10 shadow-sm"
                   initial={{ x: -50, opacity: 0 }}
                   animate={{ x: 120, opacity: [0, 1, 0] }}
                   transition={{ duration: 4, repeat: Infinity, delay: 0.8, ease: "easeOut" }}
                 >
                    <div className="absolute w-full h-full border-t border-[#ff3300] [clip-path:polygon(50%_50%,100%_0,0_0)] opacity-50" />
                 </motion.div>
              </div>

              {/* Read Later Bucket */}
              <div className="relative w-full h-32 border-2 border-dashed border-neutral-200 bg-neutral-50 flex flex-col items-center justify-center">
                 <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Read Later</span>
                 <motion.div 
                   className="absolute left-[-160px] w-20 h-12 bg-white border border-neutral-300 z-10 opacity-70"
                   initial={{ x: -50, opacity: 0 }}
                   animate={{ x: 120, opacity: [0, 1, 0] }}
                   transition={{ duration: 4, repeat: Infinity, delay: 2.1, ease: "easeOut" }}
                 >
                    <div className="absolute w-full h-full border-t border-neutral-300 [clip-path:polygon(50%_50%,100%_0,0_0)] opacity-50" />
                 </motion.div>
              </div>

              {/* Auto-Handled Bucket */}
              <div className="relative w-full h-32 border-2 border-dashed border-neutral-200 bg-neutral-50 flex flex-col items-center justify-center">
                 <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Auto-Handled</span>
                 <motion.div 
                   className="absolute left-[-160px] w-20 h-12 bg-white border border-neutral-300 z-10 opacity-40"
                   initial={{ x: -50, opacity: 0 }}
                   animate={{ x: 120, opacity: [0, 1, 0] }}
                   transition={{ duration: 4, repeat: Infinity, delay: 3.4, ease: "easeOut" }}
                 >
                    <div className="absolute w-full h-full border-t border-neutral-300 [clip-path:polygon(50%_50%,100%_0,0_0)] opacity-50" />
                 </motion.div>
              </div>

            </div>

            {/* Connection Lines (SVG) */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
               {/* Into Engine */}
               <path d="M 0 300 L 350 300" fill="none" stroke="#e5e5e5" strokeWidth="2" strokeDasharray="6,6" />
               {/* Out of Engine to Action */}
               <path d="M 600 300 L 650 300 L 650 110 L 720 110" fill="none" stroke="#ff3300" strokeWidth="2" strokeDasharray="6,6" className="opacity-40" />
               {/* Out of Engine to Read Later */}
               <path d="M 600 300 L 720 300" fill="none" stroke="#d4d4d8" strokeWidth="2" strokeDasharray="6,6" />
               {/* Out of Engine to Auto */}
               <path d="M 600 300 L 650 300 L 650 490 L 720 490" fill="none" stroke="#d4d4d8" strokeWidth="2" strokeDasharray="6,6" />
            </svg>

          </div>
        </div>
      </main>

      {/* Capabilities Banner */}
      <section className="border-y border-neutral-100 bg-neutral-50 py-16 px-8">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center justify-center gap-10">
          <span className="text-sm md:text-base font-mono uppercase tracking-widest text-[#ff3300] font-bold">Platform Capabilities</span>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 text-neutral-700 font-light text-xl md:text-2xl tracking-tight">
             <div className="flex items-center gap-4"><Check className="w-6 h-6 text-[#ff3300]"/> Universal LLM Routing</div>
             <div className="flex items-center gap-4"><Check className="w-6 h-6 text-[#ff3300]"/> Zero-Latency Triage</div>
             <div className="flex items-center gap-4"><Check className="w-6 h-6 text-[#ff3300]"/> Privacy-First Architecture</div>
             <div className="flex items-center gap-4"><Check className="w-6 h-6 text-[#ff3300]"/> Automated Handlers</div>
          </div>
        </div>
      </section>

      {/* Redesigned Features Stack */}
      <section id="features" className="py-32 px-8 md:px-16 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-neutral-200 pb-16">
           <div>
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-8">01 &nbsp; Core Capabilities</div>
              <h2 className="text-[3rem] md:text-[5rem] font-light tracking-tighter text-black leading-[1]">Built for scale,<br/>designed for focus.</h2>
           </div>
        </div>
        
        <div className="flex flex-col gap-6 bg-neutral-50 p-6 border border-neutral-100">
          <div className="bg-white border border-neutral-200 p-8 md:p-16 flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center hover:border-[#ff3300] hover:shadow-[0_20px_60px_rgba(255,51,0,0.05)] transition-all duration-300">
            <div className="w-20 h-20 border-[1.5px] border-[#ff3300] flex items-center justify-center shrink-0 shadow-[-8px_8px_0_rgba(255,51,0,0.1)] bg-white">
               <BrainCircuit className="w-8 h-8 text-[#ff3300]" />
            </div>
            <div>
               <h3 className="text-3xl md:text-5xl font-light tracking-tight text-black mb-6">LLM Classification</h3>
               <p className="text-xl md:text-2xl font-light text-neutral-500 max-w-4xl leading-relaxed">No manual rules. Our engine understands the context of your emails and triages them automatically.</p>
            </div>
          </div>
          
          <div className="bg-white border border-neutral-200 p-8 md:p-16 flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center hover:border-[#ff3300] hover:shadow-[0_20px_60px_rgba(255,51,0,0.05)] transition-all duration-300">
            <div className="w-20 h-20 border-[1.5px] border-[#ff3300] flex items-center justify-center shrink-0 shadow-[-8px_8px_0_rgba(255,51,0,0.1)] bg-white">
               <Zap className="w-8 h-8 text-[#ff3300]" />
            </div>
            <div>
               <h3 className="text-3xl md:text-5xl font-light tracking-tight text-black mb-6">Zero Latency Processing</h3>
               <p className="text-xl md:text-2xl font-light text-neutral-500 max-w-4xl leading-relaxed">Using advanced NLP token compression, we process your inbox 900% faster than legacy systems.</p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-8 md:p-16 flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center hover:border-[#ff3300] hover:shadow-[0_20px_60px_rgba(255,51,0,0.05)] transition-all duration-300">
            <div className="w-20 h-20 border-[1.5px] border-[#ff3300] flex items-center justify-center shrink-0 shadow-[-8px_8px_0_rgba(255,51,0,0.1)] bg-white">
               <ShieldCheck className="w-8 h-8 text-[#ff3300]" />
            </div>
            <div>
               <h3 className="text-3xl md:text-5xl font-light tracking-tight text-black mb-6">Private & Secure</h3>
               <p className="text-xl md:text-2xl font-light text-neutral-500 max-w-4xl leading-relaxed">We never store your email bodies. Metadata is processed statelessly and discarded.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Block */}
      <section id="comparison" className="py-24 px-8 md:px-16 max-w-[1600px] mx-auto">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-8">02 &nbsp; Platform Comparison</div>
        
        <div className="flex flex-col md:flex-row h-[800px] md:h-[600px] w-full group/comp cursor-crosshair">
          {/* SortMail Side */}
          <div className="flex-1 md:hover:flex-[1.5] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#ff3300] text-white p-12 md:p-24 relative overflow-hidden flex flex-col justify-end border border-[#ff3300] group/left">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] border border-white/20 rounded-full translate-x-1/4 -translate-y-1/4 flex items-center justify-center group-hover/left:scale-110 transition-transform duration-1000 ease-out">
                <div className="w-[400px] h-[400px] border border-white/20 rounded-full flex items-center justify-center">
                   <div className="w-[200px] h-[200px] border border-white/20 rounded-full flex items-center justify-center">
                      <motion.span 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="text-4xl text-white inline-block"
                      >*</motion.span>
                   </div>
                </div>
             </div>
             
             {/* Simulated Fast Processing (Speed Lines) */}
             <div className="absolute inset-0 opacity-0 group-hover/left:opacity-100 transition-opacity duration-700 pointer-events-none">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div 
                    key={`speed-${i}`}
                    className="absolute w-1 h-64 bg-white/10 rotate-45"
                    initial={{ top: "-50%", left: `${i * 30}%` }}
                    animate={{ top: "150%", left: `${(i * 30) - 30}%` }}
                    transition={{ duration: 1.5 + Math.random(), repeat: Infinity, ease: "linear", delay: i * 0.3 }}
                  />
                ))}
             </div>

             <div className="relative z-10">
               <p className="text-xs font-mono uppercase tracking-widest mb-4 opacity-80 translate-y-4 group-hover/left:translate-y-0 transition-transform duration-500 ease-out">With SortMail</p>
               <p className="text-[4rem] sm:text-[5rem] md:text-[7rem] font-light tracking-tighter leading-none group-hover/left:scale-105 origin-bottom-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">100% Signal</p>
               <div className="mt-8 flex items-center gap-2 text-sm font-mono opacity-0 group-hover/left:opacity-100 translate-y-4 group-hover/left:translate-y-0 transition-all duration-700 delay-150">
                 <Check className="w-5 h-5"/> Only see the emails that matter
               </div>
             </div>
          </div>
          
          {/* Legacy Side */}
          <div className="flex-1 md:hover:flex-[1.5] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-neutral-50 text-black p-12 md:p-24 flex flex-col justify-end border-y md:border-y-0 md:border-r md:border-t md:border-b border-neutral-200 relative overflow-hidden group/right grayscale hover:grayscale-0">
             
             {/* Messy Data Background Pattern */}
             <div className="absolute inset-0 opacity-10 group-hover/right:opacity-40 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_center,_#000_1px,_transparent_1px)] bg-[size:15px_15px]" />
             
             <div className="relative z-10">
               <p className="text-xs font-mono uppercase tracking-widest mb-4 text-neutral-400 translate-y-4 group-hover/right:translate-y-0 transition-transform duration-500 ease-out">Legacy Mail Clients</p>
               <p className="text-[4rem] sm:text-[5rem] md:text-[7rem] font-light tracking-tighter text-neutral-300 leading-none group-hover/right:scale-105 origin-bottom-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/right:text-neutral-800">99% Noise</p>
               <div className="mt-8 flex items-center gap-2 text-sm font-mono text-neutral-400 opacity-0 group-hover/right:opacity-100 translate-y-4 group-hover/right:translate-y-0 transition-all duration-700 delay-150">
                  Drowning in promotional blasts
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-8 md:px-16 max-w-[1000px] mx-auto">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-8 text-center">03 &nbsp; Frequently Asked Questions</div>
        <h2 className="text-[3rem] md:text-[4rem] font-light tracking-tighter mb-16 text-black leading-[1] text-center">We solved email,<br/>so you don't have to.</h2>
        
        <div className="border-t border-neutral-200">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-neutral-200">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full py-8 flex justify-between items-center text-left hover:text-[#ff3300] transition-colors"
              >
                <span className="text-xl md:text-2xl font-light tracking-tight">{faq.question}</span>
                <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-[#ff3300]" : "text-neutral-300"}`} />
              </button>
              <motion.div 
                initial={false}
                animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                className="overflow-hidden"
              >
                <p className="pb-8 text-neutral-500 font-light leading-relaxed max-w-3xl">
                  {faq.answer}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Massive Call to Action */}
      <section className="bg-[#ff3300] py-32 px-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-5xl md:text-[7rem] font-light tracking-tighter mb-12 text-white leading-[0.9]">Ready to stop<br/>sorting?</h2>
        <LoginButton variant="white" />
      </section>

      {/* Robust Footer */}
      <footer className="bg-neutral-950 text-white pt-24 pb-12 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-24 border-b border-neutral-800 pb-24">
          <div className="col-span-1 md:col-span-2">
            <div className="text-3xl font-bold tracking-tighter mb-6 flex items-center gap-2">
              <span className="w-5 h-5 bg-[#ff3300] inline-block"></span>
              SortMail
            </div>
            <p className="text-neutral-500 font-light max-w-sm">
              The definitive AI triage platform offering a modern developer experience, pre-built LLM integrations, and easy management of your inbox.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-600 mb-6">Product</h4>
            <ul className="space-y-4 font-light text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">Platform</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-600 mb-6">Company</h4>
            <ul className="space-y-4 font-light text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center text-xs font-mono tracking-widest uppercase text-neutral-600">
          <div>&copy; 2026 SortMail AI. All rights reserved.</div>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
