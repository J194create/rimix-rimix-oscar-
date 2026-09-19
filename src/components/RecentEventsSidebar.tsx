import React from 'react';
import { MarketingDeliverables } from '../types';
import { History, X, RotateCcw, Calendar, Trash2, ArrowRight, Clock, Music, Sparkles } from 'lucide-react';

interface RecentEventsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  recentEvents: MarketingDeliverables[];
  currentEventId?: string;
  onLoadEvent: (event: MarketingDeliverables) => void;
  onClearHistory: () => void;
  onDeleteEvent: (timestamp: string) => void;
}

export const RecentEventsSidebar: React.FC<RecentEventsSidebarProps> = ({
  isOpen,
  onClose,
  recentEvents,
  onLoadEvent,
  onClearHistory,
  onDeleteEvent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <div className="relative w-full max-w-md bg-[#0b0b0f] border-l border-[#242433] h-full shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f2d] bg-[#0f0f15]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#181824] border border-[#2b2b3d] flex items-center justify-center text-[#d4af37]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm tracking-wide text-[#f5ebd1]">
                  Recent Events History
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#f3e5ab] border border-[#d4af37]/30">
                  {recentEvents.length}/5 Saved
                </span>
              </div>
              <p className="text-[11px] text-[#7d7d8e]">
                Stored locally in browser • Instant re-editing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#151520] hover:bg-[#202030] text-[#9a9aa8] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {recentEvents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3 text-[#6c6c7d]">
              <div className="w-12 h-12 rounded-xl bg-[#14141c] border border-[#232330] flex items-center justify-center text-[#4b4b5a]">
                <History className="w-6 h-6" />
              </div>
              <p className="text-xs">No recent events stored yet.</p>
              <p className="text-[11px] text-[#555566] max-w-xs">
                When you process raw daily venue inputs, the last 5 generated campaigns will automatically be saved here.
              </p>
            </div>
          ) : (
            recentEvents.map((item, index) => {
              const dateFormatted = new Date(item.generatedAt).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.generatedAt || index}
                  className="group relative rounded-xl bg-[#111118] hover:bg-[#151520] border border-[#222230] hover:border-[#d4af37]/50 p-4 transition-all duration-200 flex flex-col gap-2.5 shadow-sm"
                >
                  {/* Top bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1c1c28] border border-[#2d2d3e] text-[#d4af37]">
                        #{index + 1}
                      </span>
                      <h4 className="font-display font-bold text-sm text-[#f3e5ab] group-hover:text-[#ffea9f] transition-colors line-clamp-1">
                        {item.eventName}
                      </h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEvent(item.generatedAt);
                      }}
                      className="text-[#656577] hover:text-red-400 p-1 transition-colors cursor-pointer"
                      title="Remove from history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Raw input snippet */}
                  <p className="text-xs text-[#a0a0b2] line-clamp-2 italic leading-relaxed bg-[#0a0a0e] p-2.5 rounded-lg border border-[#1b1b26]">
                    "{item.rawInput}"
                  </p>

                  {/* Key metadata pills */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#8e8e9e]">
                    <span className="flex items-center gap-1 bg-[#161622] px-2 py-0.5 rounded border border-[#262638]">
                      <Calendar className="w-3 h-3 text-[#d4af37]" />
                      {item.socialMediaPack.keyDetails.date || 'Event'}
                    </span>
                    <span className="flex items-center gap-1 bg-[#161622] px-2 py-0.5 rounded border border-[#262638]">
                      <Music className="w-3 h-3 text-[#00f0ff]" />
                      {item.socialMediaPack.keyDetails.djOrArtist || 'DJ'}
                    </span>
                    <span className="flex items-center gap-1 text-[#656577] ml-auto">
                      <Clock className="w-3 h-3" />
                      {dateFormatted}
                    </span>
                  </div>

                  {/* Reload and re-edit button */}
                  <button
                    onClick={() => {
                      onLoadEvent(item);
                      onClose();
                    }}
                    className="mt-1 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#181826] hover:bg-[#d4af37] hover:text-black border border-[#2d2d42] hover:border-[#d4af37] text-xs font-semibold text-[#f1ede2] transition-all duration-200 cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reload & Re-Edit Campaign</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {recentEvents.length > 0 && (
          <div className="p-4 border-t border-[#1f1f2d] bg-[#0c0c12] flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="text-xs text-[#8c8c9a] hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>

            <span className="text-[11px] text-[#636373]">
              Auto-syncs up to 5 events
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
