import React, { useState, useMemo } from 'react';
import { DigitalScreenBanner } from '../types';
import { Monitor, Copy, Check, Sparkles, Layers, Sliders, Maximize2, Video, Film, Play, Repeat } from 'lucide-react';
import { bannerImg } from '../assets';
import { getMotionLoopSpec } from '../utils/marketingEnhancements';

interface DigitalBannerViewProps {
  data: DigitalScreenBanner;
  eventName: string;
  rawInput?: string;
}

export const DigitalBannerView: React.FC<DigitalBannerViewProps> = ({ data, eventName, rawInput }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedInstruction, setCopiedInstruction] = useState(false);
  const [copiedMotionPrompt, setCopiedMotionPrompt] = useState(false);
  const [ledScanline, setLedScanline] = useState(true);
  const [activeModelMode, setActiveModelMode] = useState<'imagen' | 'runway'>('imagen');

  const motionSpec = useMemo(() => {
    return getMotionLoopSpec({
      eventName,
      rawInput: rawInput || eventName,
      socialMediaPack: {
        caption: '',
        keyDetails: { date: '', time: '', djOrArtist: '', dressCode: '', rsvpInfo: '' },
        callToAction: '',
        hashtags: [],
      },
      digitalScreenBanner: data,
      dailyBrochureFlyer: { headline: '', subheaders: [], bodyCopy: [], visualPrompt: '' },
      generatedAt: new Date().toISOString(),
    });
  }, [eventName, rawInput, data]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(data.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyInstruction = () => {
    navigator.clipboard.writeText(data.embeddedTextInstruction);
    setCopiedInstruction(true);
    setTimeout(() => setCopiedInstruction(false), 2000);
  };

  const handleCopyMotionPrompt = () => {
    navigator.clipboard.writeText(data.motionPrompt || motionSpec.prompt);
    setCopiedMotionPrompt(true);
    setTimeout(() => setCopiedMotionPrompt(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-[#0d0d12] border border-[#23232f] p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col gap-5">
      {/* Glow accent */}
      <div className="absolute top-0 left-1/3 w-64 h-32 bg-[#d4af37]/8 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1f1f2a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161622] border border-[#2d2d3f] flex items-center justify-center text-[#ffaa00]">
            <Monitor className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
                Deliverable 02
              </span>
              <span className="text-xs text-[#525263]">/</span>
              <h3 className="font-display text-sm tracking-wider font-bold text-[#f1ede2]">
                DIGITAL SCREEN BANNER & STAGE LOOPS
              </h3>
            </div>
            <p className="text-xs text-[#828292]">
              Multi-Model Generation: Imagen 3 Graphics & Runway / Luma 5s Video Loops
            </p>
          </div>
        </div>

        {/* Multi-Model Selector Bar */}
        <div className="flex items-center gap-2">
          <div className="p-0.5 rounded-lg bg-[#14141c] border border-[#272738] flex items-center gap-1">
            <button
              onClick={() => setActiveModelMode('imagen')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeModelMode === 'imagen'
                  ? 'bg-[#d4af37] text-black shadow-xs font-bold'
                  : 'text-[#9090a2] hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Imagen 3 (16:9 Graphic)</span>
            </button>
            <button
              onClick={() => setActiveModelMode('runway')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeModelMode === 'runway'
                  ? 'bg-gradient-to-r from-[#00f0ff] to-[#3a99ff] text-black shadow-xs font-bold'
                  : 'text-[#9090a2] hover:text-white'
              }`}
            >
              <Film className="w-3 h-3" />
              <span>Runway / Luma (5s Loop)</span>
            </button>
          </div>

          <button
            id="btn-copy-banner-prompt"
            onClick={activeModelMode === 'imagen' ? handleCopyPrompt : handleCopyMotionPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a26] hover:bg-[#252536] border border-[#303046] text-xs text-[#e8e8f2] transition-colors cursor-pointer"
          >
            {(activeModelMode === 'imagen' ? copiedPrompt : copiedMotionPrompt) ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Prompt Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Copy {activeModelMode === 'imagen' ? 'Imagen 3' : 'Runway Video'} Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 16:9 Widescreen LED Display Simulator */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-[#828292]">
          <span className="font-medium flex items-center gap-1 text-[#d8d8e4]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live LED Display Stage Simulator (16:9 Widescreen)
          </span>
          <button
            onClick={() => setLedScanline(!ledScanline)}
            className="hover:text-[#d4af37] transition-colors cursor-pointer text-[11px]"
          >
            {ledScanline ? 'Disable LED Grid Effect' : 'Enable LED Grid Effect'}
          </button>
        </div>

        {/* Outer LED casing */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#1c1c24] via-[#0f0f14] to-[#08080a] p-3 sm:p-4 border-2 border-[#2b2b3b] shadow-[0_15px_40px_rgba(0,0,0,0.85)]">
          {/* Stage Top LED light bar */}
          <div className="flex justify-between items-center px-4 pb-2 text-[9px] text-[#5e5e70] uppercase tracking-widest font-mono">
            <span>STAGE SCREEN 01 // 3840x2160 UHD</span>
            <span className="text-[#d4af37]">OSCAR CLUB MAIN ROOM</span>
          </div>

          {/* 16:9 Screen */}
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black border border-[#2a2a38] shadow-inner group">
            <img
              src={bannerImg}
              alt="16:9 Digital LED Screen Banner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-1000"
            />

            {/* LED Screen Grid / Scanline overlay if enabled */}
            {ledScanline && (
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04))',
                  backgroundSize: '100% 4px, 6px 100%',
                }}
              />
            )}

            {/* Ambient vignette & lighting effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

            {/* Glowing neon side accents */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#00f0ff]/20 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#ffaa00]/20 to-transparent pointer-events-none" />

            {/* Centered Bold Metallic Gold Text as required */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="relative py-2 px-6 rounded-lg bg-black/40 backdrop-blur-xs border border-[#d4af37]/30 shadow-[0_0_35px_rgba(212,175,55,0.25)]">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.4em] text-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff] block mb-1">
                  NOCTURNAL EXPERIENCE
                </span>
                <h2 className="font-display font-black text-xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[0.18em] bg-gradient-to-b from-[#fff2cc] via-[#d4af37] to-[#8f6d1d] bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                  OSCAR CLUB - {data.eventName.toUpperCase()}
                </h2>
                <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-2" />
              </div>
            </div>

            {/* Corner screen meta */}
            <div className="absolute bottom-3 left-4 text-[10px] text-[#f0e6cb] bg-black/70 px-2.5 py-1 rounded backdrop-blur-md border border-[#353545]">
              <span className="text-[#00f0ff] font-bold">● REC</span> 16:9 LED Widescreen Display
            </div>

            <div className="absolute bottom-3 right-4 text-[10px] text-[#e8c868] bg-black/70 px-2.5 py-1 rounded backdrop-blur-md border border-[#353545]">
              BRUSHED GOLD METALLIC
            </div>
          </div>
        </div>
      </div>

      {/* Prompt Display: Conditionally changes based on activeModelMode */}
      {activeModelMode === 'imagen' ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Imagen 3 Photorealistic Prompt (16:9 Display Asset)
            </span>
            <button
              onClick={handleCopyPrompt}
              className="text-[11px] text-[#9090a2] hover:text-[#f0ede6] transition-colors cursor-pointer flex items-center gap-1"
            >
              {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
            </button>
          </div>

          <div className="rounded-xl bg-[#09090d] border border-[#242433] p-4 text-xs font-mono text-[#dcdce5] leading-relaxed select-all">
            {data.prompt}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#00f0ff] flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              Runway Gen-3 / Luma Dream Machine (5s Seamless Video Loop Prompt)
            </span>
            <button
              onClick={handleCopyMotionPrompt}
              className="text-[11px] text-[#9090a2] hover:text-[#f0ede6] transition-colors cursor-pointer flex items-center gap-1"
            >
              {copiedMotionPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedMotionPrompt ? 'Copied' : 'Copy Loop Prompt'}</span>
            </button>
          </div>

          <div className="rounded-xl bg-[#09090d] border border-[#00f0ff]/30 p-4 text-xs font-mono text-[#dcdce5] leading-relaxed select-all">
            {data.motionPrompt || motionSpec.prompt}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#9090aa]">
            <span className="px-2 py-0.5 rounded bg-[#161622] border border-[#2c2c3e] text-[#00f0ff] font-mono">
              Duration: {motionSpec.duration}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#161622] border border-[#2c2c3e] text-[#d4af37] font-mono">
              Framerate: {motionSpec.fps}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#161622] border border-[#2c2c3e] text-[#e0e0f0] font-mono">
              Params: {motionSpec.technicalParams}
            </span>
          </div>
        </div>
      )}

      {/* Visuals & Embedded Text Requirement Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visuals Checklist */}
        <div className="rounded-xl bg-[#121218] border border-[#22222f] p-4 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#a0a0b2] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#00f0ff]" />
            {activeModelMode === 'imagen' ? 'Visual Architecture Requirements' : 'Motion Camera Choreography'}
          </span>
          <p className="text-xs text-[#cecee0] leading-relaxed">
            {activeModelMode === 'imagen' ? data.visualsSummary : motionSpec.cameraMotion}
          </p>
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-[#9898aa]">
            <span className="flex items-center gap-1">
              <span className="text-[#d4af37]">✓</span> Dark moody backdrop
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[#d4af37]">✓</span> Golden light beams
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[#d4af37]">✓</span> Luxury bar ambiance
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[#d4af37]">✓</span> {activeModelMode === 'imagen' ? 'Neon glow (cyan/amber)' : '24fps Seamless loop'}
            </span>
          </div>
        </div>

        {/* Embedded Text Instruction */}
        <div className="rounded-xl bg-[#14120e] border border-[#d4af37]/30 p-4 flex flex-col justify-between gap-2">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                Mandatory Embedded Text Instruction
              </span>
              <button
                onClick={handleCopyInstruction}
                className="text-[10px] text-[#baa466] hover:text-[#f3e5ab] transition-colors cursor-pointer"
              >
                {copiedInstruction ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs font-medium text-[#f4ecd8] mt-1 leading-relaxed">
              {data.embeddedTextInstruction}
            </p>
          </div>
          <div className="text-[10px] text-[#948455] italic">
            *Explicitly instructed to render in bold metallic gold font on LED displays.
          </div>
        </div>
      </div>
    </div>
  );
};
