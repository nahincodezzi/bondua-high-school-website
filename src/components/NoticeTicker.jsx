import React, { useState } from 'react';
import { useSchool } from '../context/useSchool';
import { Bell, ChevronRight, Pause, Play } from 'lucide-react';

export default function NoticeTicker() {
  const { lang, notices, setActiveTab } = useSchool();
  const [isPaused, setIsPaused] = useState(false);

  // Take latest 5 notices
  const latestNotices = notices.slice(0, 5);

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-slate-800 text-xs sm:text-sm py-2 px-4 no-print">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Badge */}
        <div className="shrink-0 flex items-center gap-1.5 bg-rose-600 text-white font-bold px-2.5 py-1 rounded text-xs shadow-sm uppercase tracking-wider font-bangla">
          <Bell className="w-3.5 h-3.5 animate-bounce" />
          <span>{lang === 'bn' ? 'জরুরি বিজ্ঞপ্তি' : 'Latest Notice'}</span>
        </div>

        {/* Marquee Ticker */}
        <div 
          className="overflow-hidden relative flex-1 cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => setActiveTab('notices')}
        >
          <div className={`whitespace-nowrap flex items-center gap-8 ${isPaused ? '' : 'animate-marquee'}`}>
            {latestNotices.map((n, idx) => (
              <span key={n.id} className="inline-flex items-center gap-2 hover:text-emerald-700 font-medium font-bangla">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>{lang === 'bn' ? n.titleBn : n.titleEn}</span>
                <span className="text-slate-400 text-xs">({n.date})</span>
                {idx < latestNotices.length - 1 && <span className="text-amber-300">✦</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="shrink-0 flex items-center gap-1.5 pl-2 border-l border-amber-200">
          <button 
            onClick={() => setIsPaused(!isPaused)} 
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-amber-100 rounded"
            title={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className="hidden sm:inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 font-bangla"
          >
            <span>{lang === 'bn' ? 'সকল নোটিশ' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
