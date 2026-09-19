import React, { useState, useRef, useEffect } from 'react';
import { 
  Maximize2, Download, Crop, Sparkles, CheckCircle2, Shield, Eye, Layers, 
  RefreshCw, Sliders, Smartphone, Monitor, FileSpreadsheet, Instagram
} from 'lucide-react';
import { MarketingDeliverables } from '../types';

interface MediaReframerModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliverables: MarketingDeliverables;
}

export type AspectRatioType = '16:9' | '9:16' | '3:4' | '1:1';

interface AspectRatioConfig {
  id: AspectRatioType;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  width: number;
  height: number;
  previewWidth: number;
  previewHeight: number;
  safeZoneTop: number; // in %
  safeZoneBottom: number; // in %
  safeZoneSides: number; // in %
}

const RATIOS: AspectRatioConfig[] = [
  {
    id: '16:9',
    label: '16:9 Stage LED',
    sublabel: 'Widescreen Stage & DJ Booth',
    icon: Monitor,
    width: 1920,
    height: 1080,
    previewWidth: 640,
    previewHeight: 360,
    safeZoneTop: 10,
    safeZoneBottom: 10,
    safeZoneSides: 8,
  },
  {
    id: '9:16',
    label: '9:16 Story / Reel',
    sublabel: 'Instagram & TikTok Full-Screen',
    icon: Smartphone,
    width: 1080,
    height: 1920,
    previewWidth: 270,
    previewHeight: 480,
    safeZoneTop: 16, // Keep clear of IG profile header
    safeZoneBottom: 18, // Keep clear of message bar / CTA
    safeZoneSides: 8,
  },
  {
    id: '3:4',
    label: '3:4 Print Flyer',
    sublabel: 'Venue Brochures & Table Tents',
    icon: FileSpreadsheet,
    width: 1200,
    height: 1600,
    previewWidth: 360,
    previewHeight: 480,
    safeZoneTop: 8,
    safeZoneBottom: 8,
    safeZoneSides: 8,
  },
  {
    id: '1:1',
    label: '1:1 Instagram Post',
    sublabel: 'Square Feed & Facebook Carousel',
    icon: Instagram,
    width: 1080,
    height: 1080,
    previewWidth: 400,
    previewHeight: 400,
    safeZoneTop: 10,
    safeZoneBottom: 10,
    safeZoneSides: 10,
  },
];

export const MediaReframerModal: React.FC<MediaReframerModalProps> = ({
  isOpen,
  onClose,
  deliverables,
}) => {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>('16:9');
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [upscaleScale, setUpscaleScale] = useState<1 | 2 | 4>(1);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [panOffset, setPanOffset] = useState(0); // vertical pan in %
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeRatioConfig = RATIOS.find((r) => r.id === selectedRatio) || RATIOS[0];

  // Draw the high-fidelity composite graphic onto the canvas
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const multiplier = upscaleScale;
    const targetW = activeRatioConfig.width * multiplier;
    const targetH = activeRatioConfig.height * multiplier;

    canvas.width = targetW;
    canvas.height = targetH;

    // 1. Draw Background: Obsidian gradient with volumetric gold / amber haze & cyan glow
    const bgGradient = ctx.createLinearGradient(0, 0, targetW, targetH);
    bgGradient.addColorStop(0, '#0a0a0f');
    bgGradient.addColorStop(0.4, '#121017');
    bgGradient.addColorStop(0.7, '#07070b');
    bgGradient.addColorStop(1, '#040407');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, targetW, targetH);

    // 2. Add subtle metallic grid / beam texture
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5 * multiplier;
    for (let i = 0; i < targetW; i += 60 * multiplier) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 120 * multiplier, targetH);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Volumetric gold radial spotlights
    const spotGradient = ctx.createRadialGradient(
      targetW * 0.5,
      targetH * (0.35 + panOffset / 100),
      10 * multiplier,
      targetW * 0.5,
      targetH * (0.35 + panOffset / 100),
      targetW * 0.65
    );
    spotGradient.addColorStop(0, 'rgba(212, 175, 55, 0.28)');
    spotGradient.addColorStop(0.4, 'rgba(255, 170, 0, 0.12)');
    spotGradient.addColorStop(0.8, 'rgba(0, 240, 255, 0.06)');
    spotGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = spotGradient;
    ctx.fillRect(0, 0, targetW, targetH);

    // 4. Subtle cyan neon rim lines along corners
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 2 * multiplier;
    ctx.strokeRect(30 * multiplier, 30 * multiplier, targetW - 60 * multiplier, targetH - 60 * multiplier);
    ctx.restore();

    // 5. Typography Layout inside safe zones without distortion
    ctx.textAlign = 'center';

    // Club Tagline
    ctx.font = `bold ${18 * multiplier}px "Cinzel", "Playfair Display", serif`;
    ctx.fillStyle = '#baa466';
    ctx.letterSpacing = '6px';
    const topY = targetH * 0.18 + (panOffset * targetH) / 200;
    ctx.fillText('OSCAR CLUB OFFICIAL', targetW * 0.5, topY);

    // Gold decorative divider
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(targetW * 0.5 - 40 * multiplier, topY + 12 * multiplier, 80 * multiplier, 2 * multiplier);

    // Main Event Headline
    const eventName = deliverables.eventName.toUpperCase();
    const titleSize = selectedRatio === '9:16' ? 52 * multiplier : selectedRatio === '16:9' ? 68 * multiplier : 58 * multiplier;
    ctx.font = `900 ${titleSize}px "Cinzel", "Playfair Display", serif`;

    // Drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 24 * multiplier;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8 * multiplier;

    // Metallic gold fill
    const textGrad = ctx.createLinearGradient(0, topY + 40 * multiplier, 0, topY + 140 * multiplier);
    textGrad.addColorStop(0, '#ffffff');
    textGrad.addColorStop(0.3, '#f7e7b4');
    textGrad.addColorStop(0.7, '#d4af37');
    textGrad.addColorStop(1, '#9e7a20');
    ctx.fillStyle = textGrad;
    ctx.fillText(eventName, targetW * 0.5, topY + 75 * multiplier);

    // Reset shadow
    ctx.shadowColor = 'transparent';

    // Headliner DJ
    const djName = deliverables.socialMediaPack?.keyDetails?.djOrArtist || 'DJ Marcus';
    ctx.font = `600 ${22 * multiplier}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#00f0ff';
    ctx.fillText(`FEATURING ${djName.toUpperCase()}`, targetW * 0.5, topY + 125 * multiplier);

    // Key Details (Date & Time)
    const dateText = `${deliverables.socialMediaPack?.keyDetails?.date || 'TONIGHT'} • ${deliverables.socialMediaPack?.keyDetails?.time || '10 PM - 5 AM'}`;
    ctx.font = `500 ${18 * multiplier}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#e4e4f0';
    ctx.fillText(dateText, targetW * 0.5, topY + 165 * multiplier);

    // VIP Offer Badge at bottom
    const vipOffer = deliverables.vipTableOffer || 'Ladies free before 11 PM • VIP Tables Open';
    const bottomY = targetH * 0.84;
    ctx.font = `bold ${16 * multiplier}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#f7e7b4';
    ctx.fillText(`✦ ${vipOffer.toUpperCase()} ✦`, targetW * 0.5, bottomY);

    // RSVP Concierge info
    ctx.font = `normal ${14 * multiplier}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#8f8fa5';
    ctx.fillText('VIP Concierge & Table Sanctuary: +1 (555) 019-OSCAR', targetW * 0.5, bottomY + 28 * multiplier);

  }, [isOpen, selectedRatio, upscaleScale, panOffset, deliverables]);

  if (!isOpen) return null;

  // Download the current cropped and upscaled canvas
  const handleDownloadCurrent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDownloading(true);

    try {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      const cleanName = deliverables.eventName.toLowerCase().replace(/\s+/g, '_');
      a.download = `OSCAR_${cleanName}_${selectedRatio.replace(':', 'x')}_${upscaleScale}x.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-gradient-to-b from-[#121218] via-[#0b0b0f] to-[#070709] border border-[#2e2e3e] shadow-[0_25px_65px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20202c] bg-[#0c0c11]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#d4af37]/20 to-[#00f0ff]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-display font-bold uppercase tracking-wider text-[#f5ebd1]">
                  Automatic Image Re-framing & AI Upscaling
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#f7e7b4] border border-[#d4af37]/30 font-semibold uppercase tracking-wider">
                  Distortion-Free Text
                </span>
              </div>
              <p className="text-xs text-[#808092]">
                Auto-crop graphics into 16:9 stage LED, 9:16 Story/Reel, 3:4 print flyer, and 1:1 Instagram post
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#181822] hover:bg-[#252535] text-[#9090a2] hover:text-[#f0f0f8] flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Ratio Selection Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {RATIOS.map((ratio) => {
              const Icon = ratio.icon;
              const isSelected = selectedRatio === ratio.id;
              return (
                <button
                  key={ratio.id}
                  onClick={() => setSelectedRatio(ratio.id)}
                  className={`p-3 rounded-xl border flex flex-col gap-1 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#181524] border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-[#09090d] border-[#22222f] hover:border-[#38384a] text-[#8e8e9e]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#00f0ff]' : 'text-[#8e8e9e]'}`} />
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-[#00f0ff]' : 'text-[#6e6e7e]'}`}>
                      {ratio.width}x{ratio.height}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#f5ebd1]' : 'text-[#cfcfe0]'}`}>
                    {ratio.label}
                  </span>
                  <span className="text-[10px] text-[#707082] truncate">
                    {ratio.sublabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Controls Bar: Upscale & Safe Zone toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#09090d] border border-[#20202c]">
            <div className="flex flex-wrap items-center gap-4">
              {/* AI Upscale Resolution Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#a0a0b2] flex items-center gap-1 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  AI Upscale:
                </span>
                <div className="flex items-center gap-1 bg-[#14141c] p-0.5 rounded-lg border border-[#252536]">
                  {([1, 2, 4] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setUpscaleScale(s)}
                      className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                        upscaleScale === s
                          ? 'bg-[#d4af37] text-black shadow'
                          : 'text-[#8e8e9e] hover:text-[#f0f0fa]'
                      }`}
                    >
                      {s}x {s === 2 ? 'HD' : s === 4 ? '4K Ultra' : 'Standard'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Safe Zone Toggle */}
              <label className="flex items-center gap-2 text-xs text-[#a0a0b2] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showSafeZones}
                  onChange={(e) => setShowSafeZones(e.target.checked)}
                  className="rounded border-[#3a3a4c] bg-[#12121a] text-[#00f0ff] focus:ring-0 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#00f0ff]" />
                  Display Safe Zones (UI margins)
                </span>
              </label>
            </div>

            {/* Vertical Focal Point Slider */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#a0a0b2] flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-[#88889a]" />
                Focal Shift:
              </span>
              <input
                type="range"
                min="-20"
                max="20"
                value={panOffset}
                onChange={(e) => setPanOffset(Number(e.target.value))}
                className="w-24 accent-[#d4af37] cursor-pointer"
                title="Adjust vertical composition center"
              />
              <span className="text-[11px] font-mono text-[#78788e] w-7">
                {panOffset > 0 ? `+${panOffset}%` : `${panOffset}%`}
              </span>
            </div>
          </div>

          {/* Interactive Re-framing Canvas Stage */}
          <div className="relative rounded-xl bg-[#050508] border border-[#252535] p-6 flex flex-col items-center justify-center min-h-[360px] overflow-hidden shadow-inner">
            <div
              className="relative shadow-2xl rounded-lg overflow-hidden border border-[#d4af37]/40 transition-all"
              style={{
                maxWidth: '100%',
                maxHeight: '480px',
              }}
            >
              {/* Hidden or scaled canvas */}
              <canvas
                ref={canvasRef}
                style={{
                  maxWidth: '100%',
                  maxHeight: '480px',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />

              {/* Safe Zone Visual Overlay */}
              {showSafeZones && (
                <div 
                  className="absolute inset-0 pointer-events-none border border-dashed border-[#00f0ff]/50"
                  style={{
                    top: `${activeRatioConfig.safeZoneTop}%`,
                    bottom: `${activeRatioConfig.safeZoneBottom}%`,
                    left: `${activeRatioConfig.safeZoneSides}%`,
                    right: `${activeRatioConfig.safeZoneSides}%`,
                  }}
                >
                  <span className="absolute top-1 left-1.5 text-[9px] font-mono text-[#00f0ff] uppercase bg-black/70 px-1 rounded">
                    Safe Zone ({selectedRatio})
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-[#828296]">
              <span>Resolution: <strong className="text-[#f5ebd1] font-mono">{activeRatioConfig.width * upscaleScale} × {activeRatioConfig.height * upscaleScale}px</strong></span>
              <span>•</span>
              <span>Output Format: <strong className="text-[#00f0ff]">Lossless PNG</strong></span>
              <span>•</span>
              <span>Anti-aliasing: <strong className="text-emerald-400">Sub-pixel text rasterized</strong></span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#20202c] bg-[#0c0c11] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#7e7e92]">
            <span>Selected Ratio: <strong className="text-[#f5ebd1]">{activeRatioConfig.label} ({selectedRatio})</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#161622] hover:bg-[#202030] text-xs text-[#a0a0b2] transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handleDownloadCurrent}
              disabled={isDownloading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6c66e] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_18px_rgba(212,175,55,0.3)] hover:brightness-110 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating PNG...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-black" />
                  Download Re-framed Graphic ({selectedRatio})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
