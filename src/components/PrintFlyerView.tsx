import React, { useState } from 'react';
import { DailyBrochureFlyer } from '../types';
import { FileText, Copy, Check, Sparkles, Printer, Sliders, Type, List } from 'lucide-react';
import { flyerImg } from '../assets';

interface PrintFlyerViewProps {
  data: DailyBrochureFlyer;
  eventName: string;
}

export const PrintFlyerView: React.FC<PrintFlyerViewProps> = ({ data, eventName }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedHierarchy, setCopiedHierarchy] = useState(false);
  const [showCropMarks, setShowCropMarks] = useState(true);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(data.visualPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyHierarchy = () => {
    const text = `=== OSCAR CLUB PRINT FLYER COPY ===\n\nHEADLINE:\n${data.headline}\n\nSUBHEADERS:\n${data.subheaders.map((s) => `• ${s}`).join('\n')}\n\nBODY COPY (VIP OFFERS & HIGHLIGHTS):\n${data.bodyCopy.map((b) => `• ${b}`).join('\n')}\n\nIMAGEN 3 VISUAL PROMPT (3:4 VERTICAL):\n${data.visualPrompt}`;
    navigator.clipboard.writeText(text);
    setCopiedHierarchy(true);
    setTimeout(() => setCopiedHierarchy(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-2xl bg-[#0d0d12] border border-[#23232f] p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col gap-5">
      {/* Glow accent */}
      <div className="absolute top-0 right-1/4 w-60 h-32 bg-[#ffaa00]/6 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1f1f2a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161622] border border-[#2d2d3f] flex items-center justify-center text-[#d4af37]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
                Deliverable 03
              </span>
              <span className="text-xs text-[#525263]">/</span>
              <h3 className="font-display text-sm tracking-wider font-bold text-[#f1ede2]">
                DAILY BROCHURE / PRINT FLYER
              </h3>
            </div>
            <p className="text-xs text-[#828292]">
              Print-Ready Layout & Imagen 3 Visual Prompt (3:4 Vertical)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-print-flyer"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14141c] hover:bg-[#1f1f2a] border border-[#292938] text-xs text-[#d2d2e0] transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>Print Layout</span>
          </button>

          <button
            id="btn-copy-flyer-copy"
            onClick={handleCopyHierarchy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a26] hover:bg-[#252536] border border-[#303046] text-xs text-[#e8e8f2] transition-colors cursor-pointer"
          >
            {copiedHierarchy ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Copy Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Two Column Layout: Content & 3:4 Vertical Flyer Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Typography Hierarchy & Imagen 3 Prompt */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Typography Hierarchy Section */}
          <div className="rounded-xl bg-[#121218] border border-[#242433] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" />
                Print-Ready Typography Hierarchy
              </span>
              <span className="text-[10px] text-[#78788c] uppercase tracking-wider">
                Editorial Grade
              </span>
            </div>

            {/* Headline Display */}
            <div className="p-3 rounded-lg bg-[#0a0a0e] border border-[#1f1f2c]">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#707084] block mb-1">
                Primary Headline
              </span>
              <h2 className="font-display font-black text-base sm:text-lg text-[#f5ebd1] tracking-wide">
                {data.headline}
              </h2>
            </div>

            {/* Subheaders Display */}
            <div className="p-3 rounded-lg bg-[#0a0a0e] border border-[#1f1f2c] flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#707084] block">
                Subheaders Hierarchy
              </span>
              {data.subheaders.map((sub, i) => (
                <div key={i} className="text-xs font-medium text-[#c8c8d8] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  <span>{sub}</span>
                </div>
              ))}
            </div>

            {/* 3-Bullet Body Copy Summary */}
            <div className="p-3 rounded-lg bg-[#0a0a0e] border border-[#1f1f2c] flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#707084] flex items-center gap-1">
                <List className="w-3 h-3 text-[#ffaa00]" />
                Body Copy (Concise 3-Bullet Summary of VIP Offers & Highlights)
              </span>
              <div className="flex flex-col gap-2 pt-1">
                {data.bodyCopy.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#e4e4ed] leading-relaxed">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#d4af37]/20 text-[#f5ebd1] border border-[#d4af37]/40 shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <span className="font-normal">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Imagen 3 Visual Prompt Box */}
          <div className="rounded-xl bg-[#121218] border border-[#242433] p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00f0ff] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Visual Prompt (Imagen 3 • 3:4 Vertical Aspect Ratio)
              </span>
              <button
                onClick={handleCopyPrompt}
                className="text-[11px] text-[#9090a2] hover:text-[#f0ede6] transition-colors cursor-pointer flex items-center gap-1"
              >
                {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
              </button>
            </div>

            <p className="text-xs font-mono text-[#ceceda] bg-[#09090d] border border-[#1d1d28] p-3.5 rounded-lg leading-relaxed select-all">
              {data.visualPrompt}
            </p>

            <div className="flex items-center justify-between text-[11px] text-[#707084] pt-1">
              <span>Optimized for print flyers, table cards & VIP brochures</span>
              <span className="text-[#d4af37]">3:4 Aspect Ratio</span>
            </div>
          </div>
        </div>

        {/* Right: 3:4 Vertical Printable Flyer Simulator */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-[#828292]">
            <span className="font-medium text-[#d8d8e4] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
              3:4 Vertical Print Simulator
            </span>
            <button
              onClick={() => setShowCropMarks(!showCropMarks)}
              className="text-[11px] hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              {showCropMarks ? 'Hide Crop Marks' : 'Show Crop Marks'}
            </button>
          </div>

          {/* Physical Sheet Container */}
          <div className="relative p-3 sm:p-5 rounded-2xl bg-[#14141c] border border-[#252533] shadow-2xl overflow-hidden">
            {/* Crop Marks on corners */}
            {showCropMarks && (
              <>
                <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#555] pointer-events-none" />
                <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#555] pointer-events-none" />
                <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#555] pointer-events-none" />
                <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#555] pointer-events-none" />
              </>
            )}

            {/* Flyer Sheet (3:4 aspect ratio) */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#070709] border border-[#d4af37]/40 shadow-[0_10px_35px_rgba(0,0,0,0.9)] flex flex-col justify-between p-5 sm:p-6 text-white group">
              {/* Background Art with Overlay */}
              <img
                src={flyerImg}
                alt="3:4 Flyer Background Asset"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-1000 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-black/95 pointer-events-none" />

              {/* Gold border inset frame */}
              <div className="absolute inset-2 border border-[#d4af37]/30 rounded-lg pointer-events-none" />

              {/* Top: Emblem & Header */}
              <div className="relative z-10 text-center flex flex-col items-center">
                <div className="text-[9px] uppercase tracking-[0.35em] text-[#d4af37] font-semibold mb-1">
                  EXCLUSIVE NOCTURNE
                </div>
                <h3 className="font-display font-extrabold text-sm sm:text-base tracking-[0.2em] text-[#fbf8f0] border-b border-[#d4af37]/40 pb-1 px-4">
                  OSCAR CLUB
                </h3>
              </div>

              {/* Middle: Main Title & Event Info */}
              <div className="relative z-10 text-center my-auto flex flex-col items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#00f0ff] font-mono bg-black/60 px-2 py-0.5 rounded border border-[#00f0ff]/30">
                  PRESENTS
                </span>
                <h2 className="font-display font-black text-lg sm:text-xl text-[#f3e5ab] leading-tight tracking-wide drop-shadow-md">
                  {eventName.toUpperCase()}
                </h2>
                <div className="text-[10px] text-[#e0e0e8] font-medium max-w-xs leading-snug">
                  {data.subheaders[0] || 'AN UNPARALLELED NIGHT OF EXCLUSIVE SOUND & LUXURY'}
                </div>
              </div>

              {/* Bottom: 3-Bullet Highlights & RSVP Footer */}
              <div className="relative z-10 flex flex-col gap-2 pt-2 border-t border-[#d4af37]/30">
                <div className="space-y-1 text-[9px] sm:text-[10px] text-[#e8e8f2]">
                  {data.bodyCopy.slice(0, 3).map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 leading-tight">
                      <span className="text-[#d4af37] font-bold">◆</span>
                      <span className="line-clamp-2">{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[8px] uppercase tracking-wider text-[#a0a0b2] pt-1">
                  <span>VIP TABLE CONCIERGE</span>
                  <span className="text-[#d4af37] font-bold">SMART CHIC REQUIRED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
