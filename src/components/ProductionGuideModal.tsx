import React from 'react';
import { X, ExternalLink, Sparkles, Layers, FileSpreadsheet, Monitor, Share2, Check, ArrowRight, Clock, Calendar, CheckCircle2, Zap } from 'lucide-react';

interface ProductionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenExportCsv?: () => void;
}

export const ProductionGuideModal: React.FC<ProductionGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenExportCsv,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0e0e14] border border-[#2b2b3d] shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#212130] bg-[#11111a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1c1a10] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#f5ebd1]">
                Direct Production Pipeline & Staff Workflow
              </h3>
              <p className="text-xs text-[#808095]">
                How to turn OSCAR Club AI prompts into published graphics & campaigns every day
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#181824] hover:bg-[#222234] text-[#a0a0b2] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-xs text-[#cecee0] leading-relaxed">
          {/* Daily Staff Schedule Timeline Banner */}
          <div className="rounded-xl bg-gradient-to-r from-[#171408] via-[#12121c] to-[#0c0c14] border border-[#d4af37]/40 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <h4 className="font-display font-bold text-sm text-[#f5ecd2]">
                  Suggested Daily Workflow for Staff
                </h4>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#d4af37]/15 text-[#f5ebd1] border border-[#d4af37]/30">
                10-Minute Daily Execution
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
              <div className="p-2.5 rounded-lg bg-[#0a0a0e] border border-[#222230] flex items-start gap-2.5">
                <span className="font-mono text-xs font-bold text-[#d4af37] bg-[#1a170a] px-2 py-0.5 rounded border border-[#d4af37]/30">
                  02:00 PM
                </span>
                <p className="text-[#c5c5d8] text-[11px] leading-snug">
                  Venue manager inputs bullet points into the AI Studio input terminal.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0a0a0e] border border-[#222230] flex items-start gap-2.5">
                <span className="font-mono text-xs font-bold text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 rounded border border-[#00f0ff]/30">
                  02:01 PM
                </span>
                <p className="text-[#c5c5d8] text-[11px] leading-snug">
                  Download generated <strong className="text-[#f5ebd1]">.csv</strong> or trigger webhook to push data to design templates.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0a0a0e] border border-[#222230] flex items-start gap-2.5">
                <span className="font-mono text-xs font-bold text-[#ffaa00] bg-[#ffaa00]/10 px-2 py-0.5 rounded border border-[#ffaa00]/30">
                  02:05 PM
                </span>
                <p className="text-[#c5c5d8] text-[11px] leading-snug">
                  Feed the 16:9 display prompt into Imagen 3 or motion generator for main-room LED screens.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0a0a0e] border border-[#222230] flex items-start gap-2.5">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  02:10 PM
                </span>
                <p className="text-[#c5c5d8] text-[11px] leading-snug">
                  Publish scheduled posts to Instagram, TikTok, and Meta Business Suite.
                </p>
              </div>
            </div>
          </div>

          {/* Step 1: Digital Screens & Banners */}
          <div className="rounded-xl bg-[#12121b] border border-[#242436] p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#181826] border border-[#2b2b3e] text-[#00f0ff] font-bold flex items-center justify-center text-[11px]">
                  1
                </span>
                <h4 className="font-display font-bold text-sm text-[#f5ecd2] flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-[#00f0ff]" />
                  For Digital Screens & Stage LED Displays
                </h4>
              </div>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
                16:9 Widescreen
              </span>
            </div>
            <p className="text-[#a5a5bb]">
              Copy the <strong className="text-[#f5ebd1]">Imagen 3 Widescreen Prompt</strong> generated in Channel 2 directly into Google Imagen 3 (via Vertex AI / AI Studio) or Midjourney.
            </p>
            <div className="bg-[#09090d] p-3 rounded-lg border border-[#1d1d2b] font-mono text-[11px] text-[#9090a8]">
              Tip: The prompt already includes exact lighting (volumetric gold rays, obsidian marble, glowing cyan neon) and embedded text directions for crisp stage visuals.
            </div>
          </div>

          {/* Step 2: Social Media Automation */}
          <div className="rounded-xl bg-[#12121b] border border-[#242436] p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#181826] border border-[#2b2b3e] text-[#d4af37] font-bold flex items-center justify-center text-[11px]">
                  2
                </span>
                <h4 className="font-display font-bold text-sm text-[#f5ecd2] flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#d4af37]" />
                  For Social Media Distribution
                </h4>
              </div>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#d4af37]/10 text-[#f3e5ab] border border-[#d4af37]/30">
                Instagram / TikTok / FB
              </span>
            </div>
            <p className="text-[#a5a5bb]">
              Use the <strong className="text-[#f5ebd1]">"Copy Caption"</strong> or <strong className="text-[#f5ebd1]">"Copy Hashtags"</strong> button to paste directly into <strong className="text-[#f3e5ab]">Meta Business Suite</strong>, <strong className="text-[#f3e5ab]">Later</strong>, or <strong className="text-[#f3e5ab]">Buffer</strong> to schedule your daily posts across all channels.
            </p>
          </div>

          {/* Step 3: Canva & Adobe Express Bulk Automation */}
          <div className="rounded-xl bg-[#12121b] border border-[#242436] p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#181826] border border-[#2b2b3e] text-[#ffaa00] font-bold flex items-center justify-center text-[11px]">
                  3
                </span>
                <h4 className="font-display font-bold text-sm text-[#f5ecd2] flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#ffaa00]" />
                  For Automated Design Automation (Canva & Adobe Express)
                </h4>
              </div>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#ffaa00]/10 text-[#ffaa00] border border-[#ffaa00]/30">
                CSV Bulk Create
              </span>
            </div>
            <p className="text-[#a5a5bb]">
              Export your daily campaign as a CSV table. Connect this CSV directly into <strong className="text-[#f5ebd1]">Canva Bulk Create</strong> or the <strong className="text-[#f5ebd1]">Adobe Express Tagged Elements API</strong> to instantly populate branded flyer and story templates without manual copy-pasting.
            </p>
            {onOpenExportCsv && (
              <button
                onClick={() => {
                  onClose();
                  onOpenExportCsv();
                }}
                className="self-start mt-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a170a] hover:bg-[#28220f] border border-[#d4af37]/40 text-[#f5ebd1] font-semibold text-xs transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Open CSV Export for Canva Bulk Create</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Step 4: Multi-Model Video Loops (Runway / Luma) */}
          <div className="rounded-xl bg-[#12121b] border border-[#242436] p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#181826] border border-[#2b2b3e] text-[#00f0ff] font-bold flex items-center justify-center text-[11px]">
                  4
                </span>
                <h4 className="font-display font-bold text-sm text-[#f5ecd2] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#00f0ff]" />
                  Main-Stage Dynamic Video Loops (Runway Gen-3 / Luma)
                </h4>
              </div>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
                5s UHD Loops
              </span>
            </div>
            <p className="text-[#a5a5bb]">
              Switch Deliverable 02 to <strong className="text-[#f5ebd1]">"Runway / Luma (5s Loop)"</strong> mode to copy camera push-in parameters, 24fps seamless loop constraints, and lighting cues directly into generative video platforms for LED stage walls.
            </p>
          </div>

          {/* Step 5: Webhooks & 24h Production Calendar */}
          <div className="rounded-xl bg-[#12121b] border border-[#242436] p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#181826] border border-[#2b2b3e] text-[#ff3366] font-bold flex items-center justify-center text-[11px]">
                  5
                </span>
                <h4 className="font-display font-bold text-sm text-[#f5ecd2] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#ff3366]" />
                  Webhooks & 24h Production Calendar
                </h4>
              </div>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#ff3366]/10 text-[#ff6b8b] border border-[#ff3366]/30">
                Automated Sync
              </span>
            </div>
            <p className="text-[#a5a5bb]">
              Use the <strong className="text-[#f5ebd1]">Webhook Dispatcher</strong> in the Export Suite to trigger instant notifications to Zapier, Make.com, or Meta Suite. Sync the 24-hour advance deadline to <strong className="text-[#f5ebd1]">Google Calendar</strong> or download an <strong className="text-[#f5ebd1]">.ICS</strong> event so production teams sign off on assets before doors open.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#20202e] bg-[#0d0d12] flex items-center justify-between">
          <span className="text-[11px] text-[#717182]">
            OSCAR Club Nocturnal Operations Pipeline
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1a1a26] hover:bg-[#252538] text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
