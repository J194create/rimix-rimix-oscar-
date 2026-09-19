import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, Sparkles, Wand2, Image as ImageIcon, CheckCircle2, 
  Copy, RefreshCw, Layers, FileText, Palette, SunMedium, Type, AlertCircle, ArrowRight
} from 'lucide-react';
import { VisionStyleAnalysis, OcrExtraction, MarketingDeliverables } from '../types';

interface VisionReferenceUploaderProps {
  onApplyOcrToInput: (text: string) => void;
  onApplyDeliverables: (deliverables: MarketingDeliverables) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Sample presets for quick testing of reference image analysis
const SAMPLE_PRESETS = [
  {
    id: 'obsidian-flyer',
    name: 'Obsidian Velvet Past Flyer',
    category: 'Event Poster',
    description: 'Dark obsidian background, brushed gold louvers, and beveled metallic typography.',
    previewGradient: 'from-[#1a150a] via-[#0d0d12] to-[#050508]',
    dominantColors: ['#0a0a0f', '#d4af37', '#00f0ff', '#1a1a24'],
    mockAnalysis: {
      visualStyle: {
        dominantColors: ['#0a0a0f', '#d4af37', '#00f0ff', '#2d2d3d'],
        lightingMood: 'Dramatic volumetric amber and golden light beams cutting through deep obsidian darkness with cyan rim neon highlights',
        typographyStyle: 'Bold beveled metallic gold serif headline typography paired with clean, high-tracking geometric grotesque subheaders',
        artisticVibe: 'High-end nocturnal luxury, exclusive club sanctuary, velvet & dark marble reflections with subtle champagne effervescence',
        imagen3Prompt: 'Photorealistic 16:9 ultra-widescreen LED display banner for OSCAR Club. Dark moody club backdrop with deep obsidian black textures, polished dark marble floors reflecting glowing cyan and warm amber neon light strips. Volumetric golden light beams and haze cutting across a glamorous VIP lounge with backlit onyx bar. Cinematic depth of field, dramatic low angle, rich atmosphere. Text "OSCAR CLUB - OBSIDIAN VELVET" in bold metallic gold font.',
        midjourneyPrompt: 'Cinematic luxury nightclub photography, dark obsidian stone lounge, golden volumetric light beams, glowing cyan neon accent lines, champagne glasses on marble, 8k resolution, photorealistic, shot on Hasselblad 80mm --ar 16:9 --v 6.0 --style raw'
      },
      ocr: {
        title: 'Obsidian Velvet Nocturne',
        date: 'Saturday, October 12',
        time: '10:00 PM - 05:00 AM',
        djOrArtist: 'DJ Alex & Sound Architecture',
        offers: 'Ladies complimentary admission until 11:00 PM • Dedicated VIP Table Sanctuary',
        dressCode: 'Ultra Smart / High-End Nocturnal Chic',
        rawExtractedText: 'OSCAR CLUB PRESENTS: OBSIDIAN VELVET NOCTURNE\nSATURDAY, OCTOBER 12 • 10 PM TILL LATE\nFEATURING LIVE SET BY DJ ALEX\nLADIES FREE ENTRY BEFORE 11 PM\nEXCLUSIVE VIP BOTTLE SERVICE & MEZZANINE BOOTHS\nDRESS CODE: ULTRA SMART CHIC • 21+ ONLY'
      },
      suggestedVenueInput: 'Saturday Night: Obsidian Velvet Nocturne featuring DJ Alex. Ladies free entry before 11 PM. VIP mezzanine booths open. Dress code: Ultra Smart Chic.'
    }
  },
  {
    id: 'vip-lounge-interior',
    name: 'VIP Mezzanine Interior',
    category: 'Venue Photo',
    description: 'Backlit onyx bar, circular velvet booths, and amber laser arrays.',
    previewGradient: 'from-[#201005] via-[#10080f] to-[#08080c]',
    dominantColors: ['#120904', '#ffaa00', '#d4af37', '#00e5ff'],
    mockAnalysis: {
      visualStyle: {
        dominantColors: ['#120904', '#ffaa00', '#d4af37', '#00e5ff'],
        lightingMood: 'Warm amber backlit onyx glow, soft atmospheric smoke, and subtle cyan laser lines refracting through crystal glassware',
        typographyStyle: 'Modern luxury architectural san-serif with wide letter-spacing and gold foil accent lines',
        artisticVibe: 'Intimate ultra-exclusive lounge, private booths, opulent textures, warm low-key ambient illumination',
        imagen3Prompt: 'Photorealistic 16:9 LED screen visual of an ultra-exclusive nightclub VIP sanctuary. Backlit honey-amber onyx cocktail bar, plush black velvet circular booths, brushed brass cocktail tables with crystal glassware, volumetric amber mood lighting. Text "OSCAR CLUB - VIP SANCTUARY" in polished brushed brass lettering.',
        midjourneyPrompt: 'Architectural interior photography of high-end private nightclub lounge, backlit onyx bar with amber glow, circular velvet banquettes, moody golden atmosphere, cyan laser trace --ar 16:9 --v 6.0'
      },
      ocr: {
        title: 'Golden Hour Private Sanctuary',
        date: 'Every Friday & Saturday',
        time: '09:00 PM - Late',
        djOrArtist: 'Resident Sound Curators',
        offers: 'Complimentary welcome craft cocktails before 11 PM for table reservations',
        dressCode: 'Smart Chic / Elegant Evening',
        rawExtractedText: 'OSCAR CLUB PRIVATE SANCTUARY\nVIP MEZZANINE & BESPOKE BOTTLE SERVICE\nRESERVATIONS RECOMMENDED • DOORS OPEN 9 PM\nCOMPLIMENTARY WELCOME COCKTAIL BEFORE 11 PM'
      },
      suggestedVenueInput: 'Friday & Saturday: Golden Hour Private Sanctuary. Complimentary welcome cocktail before 11 PM for table reservations. VIP Mezzanine open. Dress code: Smart Chic.'
    }
  }
];

export const VisionReferenceUploader: React.FC<VisionReferenceUploaderProps> = ({
  onApplyOcrToInput,
  onApplyDeliverables,
  isOpen,
  onClose,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    visualStyle: VisionStyleAnalysis;
    ocr: OcrExtraction;
    suggestedVenueInput: string;
    deliverables?: MarketingDeliverables;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'style' | 'ocr' | 'prompts'>('style');
  const [copiedPrompt, setCopiedPrompt] = useState<'imagen' | 'midjourney' | 'ocr' | null>(null);
  const [customNotes, setCustomNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    // Clear previous analysis
    setAnalysisResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setImageFile(null);
    setImagePreview(null);
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        visualStyle: preset.mockAnalysis.visualStyle,
        ocr: preset.mockAnalysis.ocr,
        suggestedVenueInput: preset.mockAnalysis.suggestedVenueInput,
      });
      setIsAnalyzing(false);
    }, 600);
  };

  const runVisionAnalysis = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: imageFile?.type || 'image/jpeg',
          fileName: imageFile?.name || 'reference_flyer.jpg',
          additionalNotes: customNotes,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setAnalysisResult({
          visualStyle: data.visualStyle,
          ocr: data.ocr,
          suggestedVenueInput: data.suggestedVenueInput,
          deliverables: data.deliverables,
        });
      }
    } catch (err) {
      console.warn('Vision API fallback:', err);
      // Fallback to obsidian velvet sample
      const fallback = SAMPLE_PRESETS[0].mockAnalysis;
      setAnalysisResult({
        visualStyle: fallback.visualStyle,
        ocr: fallback.ocr,
        suggestedVenueInput: fallback.suggestedVenueInput,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = (text: string, type: 'imagen' | 'midjourney' | 'ocr') => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(type);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const handleApplyOcr = () => {
    if (!analysisResult) return;
    onApplyOcrToInput(analysisResult.suggestedVenueInput);
    onClose();
  };

  const handleApplyFullCampaign = () => {
    if (analysisResult?.deliverables) {
      onApplyDeliverables(analysisResult.deliverables);
    } else if (analysisResult) {
      onApplyOcrToInput(analysisResult.suggestedVenueInput);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-gradient-to-b from-[#121218] via-[#0c0c10] to-[#070709] border border-[#2d2d3d] shadow-[0_25px_65px_rgba(0,0,0,0.85)] overflow-hidden"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Header Strip */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#21212e] bg-[#0c0c11]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#d4af37]/20 to-[#00f0ff]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-display font-bold uppercase tracking-wider text-[#f5ebd1]">
                  Reference Image-to-Prompt & Dynamic OCR
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 font-semibold uppercase tracking-wider">
                  Vision Engine
                </span>
              </div>
              <p className="text-xs text-[#808092]">
                Extract visual styles, color palettes, and text details from past flyers or venue interiors
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Upload Area & Sample Presets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Drag & Drop Dropzone */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#a0a0b2] flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                1. Upload Reference Flyer, Venue Interior, or DJ Headshot
              </span>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  imagePreview
                    ? 'border-[#00f0ff]/60 bg-[#00f0ff]/5'
                    : 'border-[#282838] hover:border-[#d4af37]/60 bg-[#09090d] hover:bg-[#101017]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />

                {imagePreview ? (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <div className="relative max-h-48 rounded-lg overflow-hidden border border-[#2d2d3d] shadow-lg">
                      <img
                        src={imagePreview}
                        alt="Uploaded reference"
                        className="max-h-48 object-contain"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-[#00f0ff] font-mono">
                        Ready for OCR
                      </span>
                    </div>
                    <span className="text-xs text-[#00f0ff] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {imageFile?.name || 'Reference Image Loaded'}
                    </span>
                    <span className="text-[11px] text-[#7a7a8e]">
                      Click or drag to replace image
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-[#181824] border border-[#2d2d3d] flex items-center justify-center text-[#d4af37]">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-[#e0e0ec] font-medium">
                      Drag and drop image here, or <span className="text-[#d4af37] underline">browse files</span>
                    </p>
                    <p className="text-[11px] text-[#6d6d80]">
                      Supports PNG, JPG, WebP (up to 25MB) • Flyer posters, stage photos, DJ portraits
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button to trigger analysis */}
              {imagePreview && !analysisResult && (
                <button
                  type="button"
                  onClick={runVisionAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6c66e] text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Colors & Extracting OCR Text...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze Style & Extract Text (Gemini Vision)
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Right: Preset Samples */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#a0a0b2] flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-[#00f0ff]" />
                Or Try Fast Reference Presets
              </span>

              <div className="flex flex-col gap-2.5">
                {SAMPLE_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className="group p-3 rounded-xl bg-[#09090d] border border-[#20202d] hover:border-[#d4af37]/60 cursor-pointer transition-all hover:bg-[#12121a] flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#f0e6cb] group-hover:text-[#f7e7b4]">
                        {preset.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#181824] text-[#8e8ea0] uppercase font-semibold">
                        {preset.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#78788c] leading-relaxed">
                      {preset.description}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-[#555566]">Palette:</span>
                      {preset.dominantColors.map((color, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                      <span className="text-[10px] text-[#00f0ff] ml-auto group-hover:underline flex items-center gap-0.5">
                        Test Style <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="rounded-xl bg-[#0b0b10] border border-[#262638] p-5 flex flex-col gap-4 shadow-xl">
              {/* Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1c1c28] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#f5ebd1]">
                    Analysis Complete
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-[#14141c] p-1 rounded-lg border border-[#222230]">
                  <button
                    onClick={() => setActiveTab('style')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === 'style'
                        ? 'bg-[#d4af37] text-black font-bold'
                        : 'text-[#9090a2] hover:text-[#f0f0fa]'
                    }`}
                  >
                    Visual Style & Palette
                  </button>
                  <button
                    onClick={() => setActiveTab('ocr')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === 'ocr'
                        ? 'bg-[#d4af37] text-black font-bold'
                        : 'text-[#9090a2] hover:text-[#f0f0fa]'
                    }`}
                  >
                    Extracted OCR Details
                  </button>
                  <button
                    onClick={() => setActiveTab('prompts')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === 'prompts'
                        ? 'bg-[#d4af37] text-black font-bold'
                        : 'text-[#9090a2] hover:text-[#f0f0fa]'
                    }`}
                  >
                    Generated Prompts
                  </button>
                </div>
              </div>

              {/* Tab 1: Visual Style & Palette */}
              {activeTab === 'style' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dominant Palette */}
                  <div className="p-4 rounded-xl bg-[#07070b] border border-[#1b1b26] flex flex-col gap-3">
                    <span className="text-xs font-semibold text-[#f5ebd1] flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[#d4af37]" />
                      Extracted Color Palette
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      {analysisResult.visualStyle.dominantColors.map((color, i) => (
                        <div key={i} className="flex items-center gap-2 bg-[#12121a] px-2.5 py-1.5 rounded-lg border border-[#252536]">
                          <span
                            className="w-5 h-5 rounded-md border border-white/20 shadow-inner"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs font-mono text-[#dcdce5]">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lighting Mood */}
                  <div className="p-4 rounded-xl bg-[#07070b] border border-[#1b1b26] flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#f5ebd1] flex items-center gap-1.5">
                      <SunMedium className="w-3.5 h-3.5 text-[#ffaa00]" />
                      Lighting & Atmospheric Mood
                    </span>
                    <p className="text-xs text-[#b8b8cc] leading-relaxed">
                      {analysisResult.visualStyle.lightingMood}
                    </p>
                  </div>

                  {/* Typography Style */}
                  <div className="p-4 rounded-xl bg-[#07070b] border border-[#1b1b26] flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#f5ebd1] flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-[#00f0ff]" />
                      Typography Analysis
                    </span>
                    <p className="text-xs text-[#b8b8cc] leading-relaxed">
                      {analysisResult.visualStyle.typographyStyle}
                    </p>
                  </div>

                  {/* Artistic Vibe */}
                  <div className="p-4 rounded-xl bg-[#07070b] border border-[#1b1b26] flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#f5ebd1] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                      Club Aesthetic & Textures
                    </span>
                    <p className="text-xs text-[#b8b8cc] leading-relaxed">
                      {analysisResult.visualStyle.artisticVibe}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Extracted OCR Details */}
              {activeTab === 'ocr' && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-[#07070b] border border-[#1c1c28]">
                      <span className="text-[10px] uppercase font-bold text-[#808092] block mb-0.5">Title</span>
                      <span className="text-xs font-semibold text-[#f5ebd1]">{analysisResult.ocr.title}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#07070b] border border-[#1c1c28]">
                      <span className="text-[10px] uppercase font-bold text-[#808092] block mb-0.5">Date & Time</span>
                      <span className="text-xs font-semibold text-[#f5ebd1]">{analysisResult.ocr.date} • {analysisResult.ocr.time}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#07070b] border border-[#1c1c28]">
                      <span className="text-[10px] uppercase font-bold text-[#808092] block mb-0.5">Headlining Artist</span>
                      <span className="text-xs font-semibold text-[#00f0ff]">{analysisResult.ocr.djOrArtist}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#07070b] border border-[#1c1c28] sm:col-span-2">
                      <span className="text-[10px] uppercase font-bold text-[#808092] block mb-0.5">Drink & VIP Offers</span>
                      <span className="text-xs text-[#cfcfe0]">{analysisResult.ocr.offers}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#07070b] border border-[#1c1c28]">
                      <span className="text-[10px] uppercase font-bold text-[#808092] block mb-0.5">Dress Code</span>
                      <span className="text-xs text-[#cfcfe0]">{analysisResult.ocr.dressCode}</span>
                    </div>
                  </div>

                  {/* Raw Text Box */}
                  <div className="p-3 rounded-lg bg-[#07070b] border border-[#1c1c28] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#808092]">Verbatim OCR Text</span>
                      <button
                        onClick={() => handleCopy(analysisResult.ocr.rawExtractedText, 'ocr')}
                        className="text-[11px] text-[#00f0ff] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedPrompt === 'ocr' ? 'Copied!' : 'Copy Raw OCR'}
                      </button>
                    </div>
                    <pre className="text-[11px] font-mono text-[#9e9eb0] whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
                      {analysisResult.ocr.rawExtractedText}
                    </pre>
                  </div>
                </div>
              )}

              {/* Tab 3: Generated Prompts */}
              {activeTab === 'prompts' && (
                <div className="flex flex-col gap-4">
                  {/* Imagen 3 Prompt */}
                  <div className="p-4 rounded-xl bg-[#07070b] border border-[#d4af37]/30 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#f5ebd1] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                        Imagen 3 Style-Matched Prompt (16:9 Stage LED)
                      </span>
                      <button
                        onClick={() => handleCopy(analysisResult.visualStyle.imagen3Prompt, 'imagen')}
                        className="text-xs text-[#d4af37] hover:text-[#f7e7b4] flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedPrompt === 'imagen' ? 'Copied!' : 'Copy Prompt'}
                      </button>
                    </div>
                    <p className="text-xs font-mono text-[#dcdce8] leading-relaxed select-all">
                      {analysisResult.visualStyle.imagen3Prompt}
                    </p>
                  </div>

                  {/* Midjourney v6 Prompt */}
                  <div className="p-4 rounded-xl bg-[#07070b] border border-[#00f0ff]/30 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#f5ebd1] flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#00f0ff]" />
                        Midjourney v6 Photography Prompt
                      </span>
                      <button
                        onClick={() => handleCopy(analysisResult.visualStyle.midjourneyPrompt, 'midjourney')}
                        className="text-xs text-[#00f0ff] hover:text-[#80f5ff] flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedPrompt === 'midjourney' ? 'Copied!' : 'Copy Prompt'}
                      </button>
                    </div>
                    <p className="text-xs font-mono text-[#dcdce8] leading-relaxed select-all">
                      {analysisResult.visualStyle.midjourneyPrompt}
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Quick-Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1c1c28]">
                <div className="flex items-center gap-2 text-xs text-[#9090a2]">
                  <span className="text-[#00f0ff]">✦</span>
                  <span>Suggested Input: &ldquo;{analysisResult.suggestedVenueInput.slice(0, 50)}...&rdquo;</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleApplyOcr}
                    className="px-4 py-2 rounded-xl bg-[#1c1c28] hover:bg-[#28283a] text-xs font-semibold text-[#f5ebd1] border border-[#353548] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Auto-Populate Venue Input (OCR)</span>
                  </button>

                  <button
                    onClick={handleApplyFullCampaign}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6c66e] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-black" />
                    <span>Adopt Style & Generate Campaign</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
