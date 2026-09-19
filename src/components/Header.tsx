import React from 'react';
import { Sparkles, Crown, Radio, Copy, Check, Download, History, BookOpen } from 'lucide-react';

interface HeaderProps {
  onCopyAll: () => void;
  copiedAll: boolean;
  onOpenExport: () => void;
  hasDeliverables: boolean;
  onOpenHistory: () => void;
  historyCount: number;
  onOpenGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onCopyAll,
  copiedAll,
  onOpenExport,
  hasDeliverables,
  onOpenHistory,
  historyCount,
  onOpenGuide,
}) => {
  return (
    <header className="relative border-b border-[#22201d] bg-[#09090c]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#997c21] to-[#1a1708] p-[1px] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <div className="w-full h-full bg-[#0d0d10] rounded-[11px] flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#d4af37]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display tracking-[0.22em] text-lg font-bold text-[#f5ecd2]">
                OSCAR <span className="text-[#d4af37]">CLUB</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#f3e5ab] border border-[#d4af37]/30">
                AI Marketing Suite
              </span>
            </div>
            <p className="text-xs text-[#8c8c99] tracking-wide">
              Synchronized 3-Channel Nocturnal Campaign Engine
            </p>
          </div>
        </div>

        {/* Status indicator & Actions */}
        <div className="flex items-center gap-3">
          {onOpenGuide && (
            <button
              id="btn-open-production-guide"
              onClick={onOpenGuide}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14141c] hover:bg-[#1f1f2c] border border-[#272738] hover:border-[#00f0ff]/50 text-xs font-medium text-[#d8d8e5] transition-all cursor-pointer group"
              title="View production pipeline workflow for Imagen 3, Meta Suite & Canva"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#00f0ff] group-hover:scale-110 transition-transform" />
              <span>Production Pipeline</span>
            </button>
          )}

          <button
            id="btn-open-recent-history"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14141c] hover:bg-[#1f1f2c] border border-[#272738] hover:border-[#d4af37]/50 text-xs font-medium text-[#d8d8e5] transition-all cursor-pointer group"
            title="View recent generated event history (stores up to 5)"
          >
            <History className="w-3.5 h-3.5 text-[#d4af37] group-hover:rotate-[-30deg] transition-transform" />
            <span>Recent Events</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#d4af37]/20 text-[#f5ebd1] border border-[#d4af37]/40">
                {historyCount}
              </span>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121217] border border-[#23232c] text-xs text-[#a0a0b0]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
            </span>
            <span className="font-medium text-[#dcdce5]">System Online</span>
          </div>

          {hasDeliverables && (
            <>
              <button
                id="btn-copy-all"
                onClick={onCopyAll}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#16161e] hover:bg-[#20202c] border border-[#2f2f3e] text-xs font-medium text-[#eaeaf0] transition-colors cursor-pointer"
                title="Copy all 3 deliverables to clipboard"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">All Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Copy All</span>
                  </>
                )}
              </button>

              <button
                id="btn-export-suite"
                onClick={onOpenExport}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b39023] hover:from-[#e5c14d] hover:to-[#c4a132] text-black font-semibold text-xs tracking-wide shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-black" />
                <span>Export Suite</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
