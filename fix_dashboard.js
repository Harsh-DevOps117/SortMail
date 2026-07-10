const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

// 1. Add imports
code = code.replace(
  'import { CheckCircle, LogOut, Mail, Settings, Zap, Clock } from "lucide-react";',
  'import { CheckCircle, LogOut, Mail, Settings, Zap, Clock, Menu, X, ArrowLeft } from "lucide-react";'
);

// 2. Add state
code = code.replace(
  'const [activeTab, setActiveTab] = useState("inbox");',
  'const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\n  const [activeTab, setActiveTab] = useState("inbox");'
);

// 3. Update activeTab setters to also close menu
code = code.replace(/setActiveTab\("inbox"\); setSelectedEmail\(null\);/g, 'setActiveTab("inbox"); setSelectedEmail(null); setIsMobileMenuOpen(false);');
code = code.replace(/setActiveTab\("action"\); setSelectedEmail\(null\);/g, 'setActiveTab("action"); setSelectedEmail(null); setIsMobileMenuOpen(false);');
code = code.replace(/setActiveTab\("readlater"\); setSelectedEmail\(null\);/g, 'setActiveTab("readlater"); setSelectedEmail(null); setIsMobileMenuOpen(false);');
code = code.replace(/setActiveTab\("autohandler"\); setSelectedEmail\(null\);/g, 'setActiveTab("autohandler"); setSelectedEmail(null); setIsMobileMenuOpen(false);');

// 4. Update the layout root and sidebar
code = code.replace(
  '<div className="flex h-screen bg-[#fafafa] font-sans text-black">',
  `<div className="flex h-screen bg-[#fafafa] font-sans text-black relative">
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}`
);

code = code.replace(
  '<div className="w-64 bg-white border-r border-neutral-200 flex flex-col justify-between shrink-0">',
  '<div className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 flex flex-col justify-between shrink-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>'
);

// 5. Update header with hamburger menu
code = code.replace(
  '<header className="h-20 border-b border-neutral-200 bg-white flex items-center px-8 justify-between shrink-0">',
  `<header className="h-20 border-b border-neutral-200 bg-white flex items-center px-4 md:px-8 justify-between shrink-0">`
);

code = code.replace(
  '<h2 className="text-xl font-light capitalize">{activeTab.replace("readlater", "Read Later").replace("autohandler", "Auto-Handler Rules")}</h2>',
  `<div className="flex items-center gap-3">
            <button className="md:hidden p-2 -ml-2 text-neutral-600" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg md:text-xl font-light capitalize">{activeTab.replace("readlater", "Read Later").replace("autohandler", "Auto-Handler Rules")}</h2>
          </div>`
);

// 6. Update the main list/detail container to handle mobile view toggling
code = code.replace(
  '<div className="flex-1 flex overflow-hidden">',
  '<div className="flex-1 flex overflow-hidden relative">'
);

code = code.replace(
  '             <div className={`flex flex-col border-r border-neutral-200 bg-[#fafafa] flex-shrink-0 transition-all duration-300 ease-in-out ${selectedEmail ? \'w-[400px]\' : \'w-full\'} custom-scrollbar`}>',
  '             <div className={`flex flex-col border-r border-neutral-200 bg-[#fafafa] flex-shrink-0 transition-all duration-300 ease-in-out ${selectedEmail ? \'hidden md:flex md:w-[400px]\' : \'w-full md:w-[400px]\'} custom-scrollbar`}>'
);

code = code.replace(
  '             <div className="flex-1 bg-white overflow-y-auto p-12 custom-scrollbar">',
  '             <div className="flex-1 bg-white overflow-y-auto p-4 md:p-12 custom-scrollbar w-full absolute inset-0 md:static z-10">'
);

code = code.replace(
  '                 <div className="max-w-3xl mx-auto">',
  `                 <div className="max-w-3xl mx-auto">
                   <button onClick={() => setSelectedEmail(null)} className="md:hidden mb-6 flex items-center gap-2 text-sm text-neutral-500 hover:text-black">
                     <ArrowLeft className="w-4 h-4" /> Back to List
                   </button>`
);

// 7. Auto-handler layout
code = code.replace(
  '<div className="flex-1 p-12 overflow-y-auto bg-[#fafafa] custom-scrollbar">',
  '<div className="flex-1 p-4 md:p-12 overflow-y-auto bg-[#fafafa] custom-scrollbar">'
);

code = code.replace(
  '<div className="flex flex-col gap-6 h-full max-h-[850px]">',
  '<div className="flex flex-col gap-6 h-full lg:max-h-[850px]">'
);

code = code.replace(
  '<label className="border-2 border-dashed border-neutral-300 rounded-none p-12 flex flex-col items-center justify-center bg-[#fafafa] cursor-pointer hover:bg-neutral-100 hover:border-black transition-all relative group">',
  '<label className="border-2 border-dashed border-neutral-300 rounded-none p-6 md:p-12 flex flex-col items-center justify-center bg-[#fafafa] cursor-pointer hover:bg-neutral-100 hover:border-black transition-all relative group">'
);


fs.writeFileSync('src/components/DashboardView.tsx', code);
