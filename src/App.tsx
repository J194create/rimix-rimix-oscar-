import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputTerminal } from './components/InputTerminal';
import { SocialMediaPackView } from './components/SocialMediaPackView';
import { DigitalBannerView } from './components/DigitalBannerView';
import { PrintFlyerView } from './components/PrintFlyerView';
import { ExportModal } from './components/ExportModal';
import { RecentEventsSidebar } from './components/RecentEventsSidebar';
import { ProductionGuideModal } from './components/ProductionGuideModal';
import { TeamWorkflowBar } from './components/TeamWorkflowBar';
import { VisionReferenceUploader } from './components/VisionReferenceUploader';
import { MediaReframerModal } from './components/MediaReframerModal';
import { MediaKitExportModal } from './components/MediaKitExportModal';
import { DEFAULT_DELIVERABLE, PRESET_INPUTS } from './presets';
import { MarketingDeliverables, TeamRole, ApprovalStatus, ApprovalLog } from './types';
import { Sparkles, Shield, Compass, Sliders, CheckCircle2, ChevronDown, Layers, History, RotateCcw, BookOpen, Activity } from 'lucide-react';
import { analyzeEnergyLevel } from './utils/sentiment';

const STORAGE_KEY = 'oscar_club_recent_events_v1';

export default function App() {
  const [rawInput, setRawInput] = useState(
    'Friday Night: Golden Hour Beats with DJ Marcus. Free welcome cocktail for ladies before 11 PM. VIP tables open. Dress code: Smart Chic.'
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('friday-golden-hour');
  const [deliverables, setDeliverables] = useState<MarketingDeliverables>(DEFAULT_DELIVERABLE);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'social' | 'banner' | 'flyer'>('all');
  const [copiedAll, setCopiedAll] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportInitialFormat, setExportInitialFormat] = useState<'markdown' | 'json' | 'text' | 'csv'>('markdown');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showBrandGuide, setShowBrandGuide] = useState(false);

  // Workflow & Vision modals state
  const [currentRole, setCurrentRole] = useState<TeamRole>('manager');
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('draft');
  const [approvalLogs, setApprovalLogs] = useState<ApprovalLog[]>([]);
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isReframerOpen, setIsReframerOpen] = useState(false);
  const [isExportZipOpen, setIsExportZipOpen] = useState(false);

  // Recent events history loaded from localStorage (limited to 5)
  const [recentEvents, setRecentEvents] = useState<MarketingDeliverables[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, 5);
        }
      }
    } catch (e) {
      console.error('Failed to load recent events from localStorage:', e);
    }
    // Initialize with default deliverable as the first entry
    return [DEFAULT_DELIVERABLE];
  });

  // Save recent events to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentEvents.slice(0, 5)));
    } catch (e) {
      console.error('Failed to save recent events to localStorage:', e);
    }
  }, [recentEvents]);

  // Helper to add or update an event in history (max 5 items, latest first)
  const saveToHistory = (newEvent: MarketingDeliverables) => {
    setRecentEvents((prev) => {
      // Remove any existing duplicate by rawInput or eventName+date
      const filtered = prev.filter(
        (item) =>
          item.rawInput.trim().toLowerCase() !== newEvent.rawInput.trim().toLowerCase()
      );
      const updated = [newEvent, ...filtered].slice(0, 5);
      return updated;
    });
  };

  const handleSelectPreset = (id: string, text: string) => {
    setSelectedPresetId(id);
    setRawInput(text);
  };

  const handleLoadFromHistory = (event: MarketingDeliverables) => {
    setDeliverables(event);
    setRawInput(event.rawInput);
    setSelectedPresetId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteFromHistory = (timestamp: string) => {
    setRecentEvents((prev) => prev.filter((item) => item.generatedAt !== timestamp));
  };

  const handleClearHistory = () => {
    setRecentEvents([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerate = async () => {
    if (!rawInput.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rawInput: rawInput.trim() }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setDeliverables(data);
      saveToHistory(data);
    } catch (err: any) {
      console.warn('Network call failed, using client fallback generator:', err);
      // Fallback update
      const fallback: MarketingDeliverables = {
        ...DEFAULT_DELIVERABLE,
        eventName: rawInput.includes('Noir') ? 'Midnight Noir' : rawInput.includes('Secret') ? 'Secret Society' : 'Golden Hour Beats',
        rawInput: rawInput.trim(),
        generatedAt: new Date().toISOString(),
      };
      setDeliverables(fallback);
      saveToHistory(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyOcrToInput = (text: string) => {
    setRawInput(text);
    setSelectedPresetId(null);
    const element = document.getElementById('venue-input-textarea');
    if (element) {
      element.focus();
    }
  };

  const handleApplyVisionDeliverables = (newDeliverables: MarketingDeliverables) => {
    setDeliverables(newDeliverables);
    setRawInput(newDeliverables.rawInput);
    setSelectedPresetId(null);
    saveToHistory(newDeliverables);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleChangeStatus = (newStatus: ApprovalStatus, note?: string) => {
    setApprovalStatus(newStatus);
    const newLog: ApprovalLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      role: currentRole,
      status: newStatus,
      note: note || `Status updated to ${newStatus}`,
    };
    setApprovalLogs((prev) => [newLog, ...prev]);
  };

  const handleCopyAll = () => {
    const fullText = `=== OSCAR CLUB - 3 SYNCHRONIZED MARKETING DELIVERABLES ===
EVENT: ${deliverables.eventName}
GENERATED: ${new Date(deliverables.generatedAt).toLocaleString()}
RAW INPUT: "${deliverables.rawInput}"

============================================================
1. SOCIAL MEDIA PACK (Instagram / TikTok / Facebook)
============================================================
CAPTION:
${deliverables.socialMediaPack.caption}

KEY DETAILS:
• Date: ${deliverables.socialMediaPack.keyDetails.date}
• Time: ${deliverables.socialMediaPack.keyDetails.time}
• DJ / Artist: ${deliverables.socialMediaPack.keyDetails.djOrArtist}
• Dress Code: ${deliverables.socialMediaPack.keyDetails.dressCode}
• RSVP: ${deliverables.socialMediaPack.keyDetails.rsvpInfo}

CALL TO ACTION:
${deliverables.socialMediaPack.callToAction}

HASHTAGS:
${deliverables.socialMediaPack.hashtags.join(' ')}

============================================================
2. DIGITAL SCREEN BANNER (Imagen 3 Prompt - 16:9 Displays)
============================================================
IMAGEN 3 PROMPT:
${deliverables.digitalScreenBanner.prompt}

VISUALS SUMMARY:
${deliverables.digitalScreenBanner.visualsSummary}

EMBEDDED TEXT INSTRUCTION:
${deliverables.digitalScreenBanner.embeddedTextInstruction}

============================================================
3. DAILY BROCHURE / PRINT FLYER (3:4 Vertical Print Layout)
============================================================
HEADLINE:
${deliverables.dailyBrochureFlyer.headline}

SUBHEADERS:
${deliverables.dailyBrochureFlyer.subheaders.map((s) => `• ${s}`).join('\n')}

BODY COPY (VIP OFFERS & HIGHLIGHTS):
${deliverables.dailyBrochureFlyer.bodyCopy.map((b, i) => `${i + 1}. ${b}`).join('\n')}

IMAGEN 3 VISUAL PROMPT (3:4):
${deliverables.dailyBrochureFlyer.visualPrompt}
`;

    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#e8e8ed] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#f3e5ab]">
      {/* Global Top Header */}
      <Header
        onCopyAll={handleCopyAll}
        copiedAll={copiedAll}
        onOpenExport={() => {
          setExportInitialFormat('markdown');
          setIsExportOpen(true);
        }}
        hasDeliverables={Boolean(deliverables)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={recentEvents.length}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Brand Guidelines & Tone Strip */}
        <div className="rounded-xl bg-[#0f0f14] border border-[#21212b] p-4 flex flex-col gap-3 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[#d4af37] font-display font-bold text-xs uppercase tracking-widest">
                OSCAR Club Brand Parameters
              </span>
              <span className="text-xs text-[#5a5a6a]">•</span>
              <span className="text-xs text-[#9d9dae]">
                Autonomous Marketing Deliverables Engine
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="text-xs text-[#00f0ff] hover:text-[#90f8ff] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Production Pipeline Guide</span>
              </button>

              <span className="text-xs text-[#3a3a48]">|</span>

              <button
                onClick={() => setIsHistoryOpen(true)}
                className="text-xs text-[#baa466] hover:text-[#f5ebd1] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <History className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Recent Events History ({recentEvents.length}/5)</span>
              </button>

              <span className="text-xs text-[#3a3a48]">|</span>

              <button
                onClick={() => setShowBrandGuide(!showBrandGuide)}
                className="text-xs text-[#baa466] hover:text-[#f5ebd1] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{showBrandGuide ? 'Hide Guidelines' : 'View Brand Guidelines'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${showBrandGuide ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Collapsible Guidelines Detail */}
          {showBrandGuide && (
            <div className="pt-2 border-t border-[#1d1d28] grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0a0a0e] border border-[#1b1b24]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] block mb-1">
                  Brand Vibe
                </span>
                <p className="text-[#cfcfe0] leading-relaxed">
                  High-end luxury, exclusive nightlife, energetic, moody, cinematic.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0a0a0e] border border-[#1b1b24]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#00f0ff] block mb-1">
                  Color Palette
                </span>
                <p className="text-[#cfcfe0] leading-relaxed">
                  Deep obsidian black, brushed gold, glowing neon accents (cyan/amber).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0a0a0e] border border-[#1b1b24]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#ffaa00] block mb-1">
                  Tone of Voice
                </span>
                <p className="text-[#cfcfe0] leading-relaxed">
                  Sophisticated, exciting, exclusive, call-to-action focused.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Media Marketing Manager Team Workflow & Approval Hub */}
        <TeamWorkflowBar
          deliverables={deliverables}
          currentRole={currentRole}
          onChangeRole={setCurrentRole}
          approvalStatus={approvalStatus}
          onChangeStatus={handleChangeStatus}
          approvalLogs={approvalLogs}
          onOpenMediaReframer={() => setIsReframerOpen(true)}
          onOpenVisionStudio={() => setIsVisionOpen(true)}
          onOpenExportZip={() => setIsExportZipOpen(true)}
        />

        {/* Input Terminal */}
        <InputTerminal
          rawInput={rawInput}
          setRawInput={setRawInput}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          selectedPresetId={selectedPresetId}
          onSelectPreset={handleSelectPreset}
          onOpenHistory={() => setIsHistoryOpen(true)}
          historyCount={recentEvents.length}
          onOpenVisionStudio={() => setIsVisionOpen(true)}
        />

        {/* Deliverables Showcase Section */}
        {deliverables && (() => {
          const deliverableEnergy = analyzeEnergyLevel(deliverables.rawInput || deliverables.eventName);
          return (
            <section className="flex flex-col gap-5 mt-2">
              {/* Filter / Navigation Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#1c1c26]">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm uppercase tracking-[0.18em] font-bold text-[#f5ebd1]">
                      Synchronized Outputs
                    </span>
                    <span className="text-xs text-[#525263]">/</span>
                    <span className="text-xs text-[#00f0ff] font-medium">
                      {deliverables.eventName}
                    </span>
                  </div>

                  {/* Confirmed Energy Level Indicator */}
                  <div
                    id="deliverables-energy-badge"
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold transition-all ${deliverableEnergy.badgeBg} ${deliverableEnergy.badgeBorder} ${deliverableEnergy.badgeText}`}
                    title={`AI Sentiment & Tone Confirmation: ${deliverableEnergy.summary}`}
                  >
                    <Activity className="w-3 h-3 animate-pulse" />
                    <span>Energy Level:</span>
                    <strong className="tracking-wide">{deliverableEnergy.level}</strong>
                    <span className="text-[10px] opacity-75 hidden sm:inline">
                      • {deliverableEnergy.tempo}
                    </span>
                  </div>
                </div>

                {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#111117] border border-[#20202c]">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-[#d4af37] text-black font-bold shadow'
                      : 'text-[#8e8e9e] hover:text-[#e4e4ee]'
                  }`}
                >
                  All 3 Sections
                </button>
                <button
                  onClick={() => setActiveFilter('social')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeFilter === 'social'
                      ? 'bg-[#d4af37] text-black font-bold shadow'
                      : 'text-[#8e8e9e] hover:text-[#e4e4ee]'
                  }`}
                >
                  1. Social Media
                </button>
                <button
                  onClick={() => setActiveFilter('banner')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeFilter === 'banner'
                      ? 'bg-[#d4af37] text-black font-bold shadow'
                      : 'text-[#8e8e9e] hover:text-[#e4e4ee]'
                  }`}
                >
                  2. LED Banner (16:9)
                </button>
                <button
                  onClick={() => setActiveFilter('flyer')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeFilter === 'flyer'
                      ? 'bg-[#d4af37] text-black font-bold shadow'
                      : 'text-[#8e8e9e] hover:text-[#e4e4ee]'
                  }`}
                >
                  3. Print Flyer (3:4)
                </button>
              </div>
            </div>

            {/* Render Deliverable 1: Social Media Pack */}
            {(activeFilter === 'all' || activeFilter === 'social') && (
              <SocialMediaPackView
                data={deliverables.socialMediaPack}
                eventName={deliverables.eventName}
                vipTableOffer={deliverables.vipTableOffer}
                eventId={deliverables.eventId}
              />
            )}

            {/* Render Deliverable 2: Digital Screen Banner */}
            {(activeFilter === 'all' || activeFilter === 'banner') && (
              <DigitalBannerView
                data={deliverables.digitalScreenBanner}
                eventName={deliverables.eventName}
                rawInput={deliverables.rawInput}
              />
            )}

            {/* Render Deliverable 3: Daily Brochure / Print Flyer */}
            {(activeFilter === 'all' || activeFilter === 'flyer') && (
              <PrintFlyerView
                data={deliverables.dailyBrochureFlyer}
                eventName={deliverables.eventName}
              />
            )}
          </section>
          );
        })()}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a24] bg-[#09090c] py-6 mt-12 text-center text-xs text-[#6e6e80]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-[#d4af37] tracking-widest">
              OSCAR CLUB
            </span>
            <span>•</span>
            <span>Automated AI Marketing Assistant</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#858595]">
            <span>Deep Obsidian Black</span>
            <span>•</span>
            <span className="text-[#d4af37]">Brushed Gold</span>
            <span>•</span>
            <span className="text-[#00f0ff]">Cyan / Amber Neon</span>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      {deliverables && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          deliverables={deliverables}
          initialFormat={exportInitialFormat}
        />
      )}

      {/* Production Pipeline Guide Modal */}
      <ProductionGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenExportCsv={() => {
          setExportInitialFormat('csv');
          setIsExportOpen(true);
        }}
      />

      {/* Recent Events History Sidebar */}
      <RecentEventsSidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        recentEvents={recentEvents}
        onLoadEvent={handleLoadFromHistory}
        onClearHistory={handleClearHistory}
        onDeleteEvent={handleDeleteFromHistory}
      />

      {/* Vision Reference Image Analysis & Dynamic OCR Modal */}
      <VisionReferenceUploader
        isOpen={isVisionOpen}
        onClose={() => setIsVisionOpen(false)}
        onApplyOcrToInput={handleApplyOcrToInput}
        onApplyDeliverables={handleApplyVisionDeliverables}
      />

      {/* Media Reframer & AI Upscaler Modal (16:9, 9:16, 3:4, 1:1) */}
      <MediaReframerModal
        isOpen={isReframerOpen}
        onClose={() => setIsReframerOpen(false)}
        deliverables={deliverables}
      />

      {/* Multi-Channel Media Kit Zip Export Modal */}
      <MediaKitExportModal
        isOpen={isExportZipOpen}
        onClose={() => setIsExportZipOpen(false)}
        deliverables={deliverables}
        approvalStatus={approvalStatus}
        currentRole={currentRole}
      />
    </div>
  );
}
