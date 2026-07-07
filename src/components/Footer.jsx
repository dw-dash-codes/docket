export default function Footer({ onPrivacyClick, onTermsClick }) {
  return (
    <footer className="w-full bg-transparent border-t border-slate-200/60 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 mt-10">
      <div className="flex items-center gap-2">
        <span className="font-bold text-slate-700 tracking-wide">Docket</span>
        <span className="text-slate-300">|</span>
        <span>&copy; 2026 DW-DashCodes. All rights reserved.</span>
      </div>
      <div className="flex items-center gap-4 font-medium">
        <button 
          onClick={onPrivacyClick} 
          className="hover:text-indigo-600 transition-colors cursor-pointer"
        >
          Privacy Policy
        </button>
        <button 
          onClick={onTermsClick} 
          className="hover:text-indigo-600 transition-colors cursor-pointer"
        >
          Terms of Service
        </button>
      </div>
    </footer>
  );
}