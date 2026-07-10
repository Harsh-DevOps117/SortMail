import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 font-sans">
      <header className="mb-12 max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent pb-2">
          SortMail
        </h1>
        <p className="text-neutral-400 mt-2 text-lg">Sorting the noise. Showing what actually needs a reply.</p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Action Required Column */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-red-400">Needs Action</h2>
            <span className="bg-red-500/10 text-red-400 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">Priority</span>
          </div>
          
          <div className="space-y-4">
            {/* Example Email Card */}
            <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 hover:border-red-500/50 transition-all duration-300 cursor-pointer group hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-semibold text-neutral-300">Recruiter @ Google</span>
                <span className="text-xs text-neutral-500 font-medium">10m ago</span>
              </div>
              <h3 className="font-bold text-lg text-neutral-100 mb-2 group-hover:text-white transition-colors">Software Engineering Internship</h3>
              <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">Hi Harsh, we are reviewing your application and would love to schedule a quick phone screening. Are you available?</p>
              <div className="mt-5 flex gap-2">
                <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-md font-medium">Internship</span>
                <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-md font-bold animate-pulse">Reply Required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Read Later Column */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-400">FYI / Read Later</h2>
          </div>
          <div className="space-y-4">
             <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 opacity-75 hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-neutral-400">Unstop Updates</span>
              </div>
              <h3 className="font-medium text-neutral-300 mb-1">Apply for these 10 hackathons</h3>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-neutral-800 text-neutral-400 border border-neutral-700 px-2.5 py-1 rounded-md font-medium">Newsletter</span>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Replied Column */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-emerald-400">Auto-Handled</h2>
          </div>
          <div className="space-y-4">
             <div className="bg-neutral-950 p-5 rounded-2xl border border-emerald-900/30 relative overflow-hidden group">
               <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="flex justify-between items-start mb-2 relative z-10">
                <span className="text-sm font-semibold text-neutral-400">YouTube Creator</span>
              </div>
              <h3 className="font-medium text-neutral-300 mb-1 relative z-10">Collab Request</h3>
              <p className="text-sm text-emerald-500 mt-3 font-medium flex items-center gap-1.5 relative z-10">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                AI replied with your standard rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
