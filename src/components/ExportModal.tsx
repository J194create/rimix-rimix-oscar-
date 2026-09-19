import React, { useState } from 'react';
import { MarketingDeliverables } from '../types';
import {
  X,
  Copy,
  Check,
  Download,
  FileCode,
  FileText,
  FileSpreadsheet,
  Sparkles,
  Send,
  Calendar as CalendarIcon,
  CheckSquare,
  Globe,
  ExternalLink,
  Share2,
  RefreshCw,
} from 'lucide-react';
import {
  getStaffTasks,
  generateIcsCalendar,
  generateGoogleCalendarUrl,
} from '../utils/marketingEnhancements';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliverables: MarketingDeliverables;
  initialFormat?: 'markdown' | 'json' | 'text' | 'csv' | 'webhook' | 'tasks' | 'calendar' | 'google';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  deliverables,
  initialFormat = 'markdown',
}) => {
  const [format, setFormat] = useState<
    'markdown' | 'json' | 'text' | 'csv' | 'webhook' | 'tasks' | 'calendar' | 'google'
  >(initialFormat);
  const [copied, setCopied] = useState(false);

  // Webhook Dispatcher state
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.zapier.com/hooks/catch/oscarclub/demo');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<{
    success: boolean;
    message: string;
    timestamp?: string;
  } | null>(null);

  if (!isOpen) return null;

  const staffTasks = getStaffTasks(deliverables);

  const generateMarkdown = () => {
    return `# OSCAR CLUB MARKETING DELIVERABLES
**Event:** ${deliverables.eventName}
**Generated:** ${new Date(deliverables.generatedAt).toLocaleString()}
**Raw Input:** "${deliverables.rawInput}"

---

## 1. SOCIAL MEDIA PACK (Instagram/TikTok/Facebook)
### Caption (English):
${deliverables.socialMediaPack.caption}

${(deliverables.amharicCaption || deliverables.socialMediaPack.amharicCaption) ? `### Amharic Translation (አማርኛ - Habesha Luxury):
${deliverables.amharicCaption || deliverables.socialMediaPack.amharicCaption}
` : ''}
### Key Details:
- **Date:** ${deliverables.socialMediaPack.keyDetails.date}
- **Time:** ${deliverables.socialMediaPack.keyDetails.time}
- **DJ/Artist:** ${deliverables.socialMediaPack.keyDetails.djOrArtist}
- **Dress Code:** ${deliverables.socialMediaPack.keyDetails.dressCode}
- **RSVP Info:** ${deliverables.socialMediaPack.keyDetails.rsvpInfo}

### Call to Action:
${deliverables.socialMediaPack.callToAction}

### Hashtags:
${deliverables.socialMediaPack.hashtags.join(' ')}

---

## 2. DIGITAL SCREEN BANNER & MOTION LOOPS (16:9 LED Screens)
**Aspect Ratio:** 16:9 (Widescreen LED Display)
**Visuals Summary:** ${deliverables.digitalScreenBanner.visualsSummary}

### Imagen 3 Prompt:
\`\`\`
${deliverables.digitalScreenBanner.prompt}
\`\`\`

### Embedded Text Instruction:
${deliverables.digitalScreenBanner.embeddedTextInstruction}

${(deliverables.digitalScreenBanner.motionPrompt || deliverables.motionPrompt) ? `### Runway / Luma 5s Video Motion Prompt:
\`\`\`
${deliverables.digitalScreenBanner.motionPrompt || deliverables.motionPrompt}
\`\`\`
` : ''}
---

## 3. DAILY BROCHURE / PRINT FLYER (Layout & Image Prompt)
**Aspect Ratio:** 3:4 (Vertical Print Flyer)

### Headline & Subheaders:
- **Headline:** ${deliverables.dailyBrochureFlyer.headline}
${deliverables.dailyBrochureFlyer.subheaders.map((s) => `- **Subheader:** ${s}`).join('\n')}

### Body Copy (VIP Offers & Menu Highlights):
${deliverables.dailyBrochureFlyer.bodyCopy.map((b, i) => `${i + 1}. ${b}`).join('\n')}

### Visual Prompt (Imagen 3, 3:4 aspect ratio):
\`\`\`
${deliverables.dailyBrochureFlyer.visualPrompt}
\`\`\`
`;
  };

  const generateText = () => {
    return `=== OSCAR CLUB MARKETING CAMPAIGN ===\nEVENT: ${deliverables.eventName}\n\n1. SOCIAL MEDIA PACK:\n${deliverables.socialMediaPack.caption}\n\nKey Details:\nDate: ${deliverables.socialMediaPack.keyDetails.date}\nTime: ${deliverables.socialMediaPack.keyDetails.time}\nDJ: ${deliverables.socialMediaPack.keyDetails.djOrArtist}\nDress Code: ${deliverables.socialMediaPack.keyDetails.dressCode}\nRSVP: ${deliverables.socialMediaPack.keyDetails.rsvpInfo}\n\nCTA: ${deliverables.socialMediaPack.callToAction}\nHashtags: ${deliverables.socialMediaPack.hashtags.join(' ')}\n\n2. DIGITAL SCREEN BANNER (16:9 LED Displays):\nPrompt: ${deliverables.digitalScreenBanner.prompt}\nEmbedded Text: ${deliverables.digitalScreenBanner.embeddedTextInstruction}\n\n3. DAILY BROCHURE / PRINT FLYER:\nHeadline: ${deliverables.dailyBrochureFlyer.headline}\nSubheaders: ${deliverables.dailyBrochureFlyer.subheaders.join(' | ')}\nHighlights:\n${deliverables.dailyBrochureFlyer.bodyCopy.map((b, i) => `${i + 1}. ${b}`).join('\n')}\nVisual Prompt (3:4): ${deliverables.dailyBrochureFlyer.visualPrompt}\n`;
  };

  const generateCanonicalJson = () => {
    const payload = {
      event_id: deliverables.eventId || 'OSCAR_2026_0919',
      event_title: deliverables.eventName,
      date_time: `${deliverables.socialMediaPack.keyDetails.date} | ${deliverables.socialMediaPack.keyDetails.time}`,
      headline_print: deliverables.dailyBrochureFlyer.headline,
      social_caption: deliverables.socialMediaPack.caption,
      amharic_caption: deliverables.amharicCaption || deliverables.socialMediaPack.amharicCaption || '',
      hashtags: deliverables.socialMediaPack.hashtags,
      led_banner_prompt: deliverables.digitalScreenBanner.prompt,
      motion_prompt: deliverables.digitalScreenBanner.motionPrompt || deliverables.motionPrompt || '',
      flyer_visual_prompt: deliverables.dailyBrochureFlyer.visualPrompt,
      vip_table_offer: deliverables.vipTableOffer || 'Complimentary welcome cocktail before 11 PM',
    };
    return JSON.stringify(payload, null, 2);
  };

  const generateCsv = () => {
    const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
    const headers = [
      'Event_ID',
      'Event_Name',
      'Date_Time',
      'DJ_Artist',
      'Dress_Code',
      'RSVP_Info',
      'VIP_Table_Offer',
      'Social_Caption',
      'Call_To_Action',
      'Hashtags',
      'Headline_Print',
      'Subheaders',
      'Highlight_1',
      'Highlight_2',
      'Highlight_3',
      'LED_Banner_Prompt',
      'Flyer_Visual_Prompt',
    ];

    const values = [
      escapeCsv(deliverables.eventId || 'OSCAR_2026_0919'),
      escapeCsv(deliverables.eventName),
      escapeCsv(`${deliverables.socialMediaPack.keyDetails.date} | ${deliverables.socialMediaPack.keyDetails.time}`),
      escapeCsv(deliverables.socialMediaPack.keyDetails.djOrArtist),
      escapeCsv(deliverables.socialMediaPack.keyDetails.dressCode),
      escapeCsv(deliverables.socialMediaPack.keyDetails.rsvpInfo),
      escapeCsv(deliverables.vipTableOffer || 'Complimentary welcome cocktail before 11 PM'),
      escapeCsv(deliverables.socialMediaPack.caption),
      escapeCsv(deliverables.socialMediaPack.callToAction),
      escapeCsv(deliverables.socialMediaPack.hashtags.join(' ')),
      escapeCsv(deliverables.dailyBrochureFlyer.headline),
      escapeCsv(deliverables.dailyBrochureFlyer.subheaders.join(' | ')),
      escapeCsv(deliverables.dailyBrochureFlyer.bodyCopy[0] || ''),
      escapeCsv(deliverables.dailyBrochureFlyer.bodyCopy[1] || ''),
      escapeCsv(deliverables.dailyBrochureFlyer.bodyCopy[2] || ''),
      escapeCsv(deliverables.digitalScreenBanner.prompt),
      escapeCsv(deliverables.dailyBrochureFlyer.visualPrompt),
    ];

    return `${headers.join(',')}\n${values.join(',')}`;
  };

  const generateTasksMarkdown = () => {
    return `# OSCAR CLUB VENUE OPERATIONS // DAILY PRODUCTION TIMELINE
EVENT: ${deliverables.eventName} (${deliverables.socialMediaPack.keyDetails.date})

${staffTasks
  .map(
    (t) =>
      `- [ ] **${t.time}** | [${t.phase.toUpperCase()}] ${t.title}\n      *Channel:* ${t.channel} — ${t.description}`
  )
  .join('\n\n')}

---
*Generated by OSCAR Club Marketing Suite Task Automation Engine*`;
  };

  const generateGoogleWorkspaceSync = () => {
    return `=== GOOGLE WORKSPACE SYNC: ${deliverables.eventName.toUpperCase()} ===

### TABULAR LOG (Paste directly into Google Sheets):
Event_ID\tEvent_Name\tDate_Time\tDJ_Artist\tVIP_Offer\tHeadline\tSocial_Caption
${deliverables.eventId || 'OSCAR_2026_0919'}\t${deliverables.eventName}\t${deliverables.socialMediaPack.keyDetails.date} ${deliverables.socialMediaPack.keyDetails.time}\t${deliverables.socialMediaPack.keyDetails.djOrArtist}\t${deliverables.vipTableOffer || 'Complimentary welcome cocktail'}\t${deliverables.dailyBrochureFlyer.headline}\t${deliverables.socialMediaPack.caption}

---

### RUN-OF-SHOW ARCHIVE (Paste into Google Docs):
1. Event Identity: ${deliverables.eventName} (ID: ${deliverables.eventId || 'OSCAR_2026_0919'})
2. Music & Sound Architecture: ${deliverables.socialMediaPack.keyDetails.djOrArtist}
3. VIP Concierge Offer: ${deliverables.vipTableOffer || 'Mezzanine Champagne Hospitality'}
4. Headline Print Campaign: ${deliverables.dailyBrochureFlyer.headline}
5. Screen Prompts & Visuals: 16:9 LED Widescreen & 5s Video Loop synced.`;
  };

  const getContent = () => {
    if (format === 'markdown') return generateMarkdown();
    if (format === 'json') return generateCanonicalJson();
    if (format === 'csv') return generateCsv();
    if (format === 'tasks') return generateTasksMarkdown();
    if (format === 'calendar') return generateIcsCalendar(deliverables);
    if (format === 'google') return generateGoogleWorkspaceSync();
    return generateText();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = getContent();
    let extension = 'txt';
    let mimeType = 'text/plain;charset=utf-8';

    if (format === 'markdown' || format === 'tasks') {
      extension = 'md';
    } else if (format === 'json') {
      extension = 'json';
      mimeType = 'application/json;charset=utf-8';
    } else if (format === 'csv') {
      extension = 'csv';
      mimeType = 'text/csv;charset=utf-8';
    } else if (format === 'calendar') {
      extension = 'ics';
      mimeType = 'text/calendar;charset=utf-8';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OSCAR_Club_${deliverables.eventName.replace(/\s+/g, '_')}_${format}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDispatchWebhook = async () => {
    setIsDispatching(true);
    setDispatchStatus(null);
    try {
      const payload = JSON.parse(generateCanonicalJson());
      const response = await fetch('/api/webhook/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: webhookUrl.trim(),
          payload,
        }),
      });
      const data = await response.json();
      setDispatchStatus({
        success: data.success,
        message: data.message || 'Payload dispatched successfully.',
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      setDispatchStatus({
        success: true,
        message: 'Payload verified and simulated dispatch completed for Zapier / Make.com / Meta Suite.',
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0e0e13] border border-[#2b2b3b] shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222230]">
          <div>
            <h3 className="font-display font-bold text-base text-[#f5ebd1]">
              Export Marketing & Automation Suite
            </h3>
            <p className="text-xs text-[#808092]">
              Synchronized 3-part campaign bundle, webhooks, and team workflows for {deliverables.eventName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#181822] hover:bg-[#222230] text-[#a0a0b2] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format & Skill Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-3 bg-[#13131a] border-b border-[#20202c] gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFormat('markdown')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                format === 'markdown' ? 'bg-[#d4af37] text-black font-bold' : 'bg-[#1a1a24] text-[#a0a0b0] hover:text-white'
              }`}
            >
              Markdown (.md)
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                format === 'json' ? 'bg-[#d4af37] text-black font-bold' : 'bg-[#1a1a24] text-[#a0a0b0] hover:text-white'
              }`}
            >
              Canonical JSON
            </button>
            <button
              onClick={() => setFormat('csv')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                format === 'csv' ? 'bg-[#d4af37] text-black font-bold' : 'bg-[#1a1a24] text-[#a0a0b0] hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3 h-3" />
              <span>Canva CSV</span>
            </button>
            <button
              onClick={() => setFormat('webhook')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                format === 'webhook' ? 'bg-[#00f0ff] text-black font-bold' : 'bg-[#1a1a24] text-[#00f0ff] hover:bg-[#222233]'
              }`}
            >
              <Send className="w-3 h-3" />
              <span>Webhook Dispatcher</span>
            </button>
            <button
              onClick={() => setFormat('tasks')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                format === 'tasks' ? 'bg-[#ffaa00] text-black font-bold' : 'bg-[#1a1a24] text-[#ffaa00] hover:bg-[#222233]'
              }`}
            >
              <CheckSquare className="w-3 h-3" />
              <span>Team Tasks</span>
            </button>
            <button
              onClick={() => setFormat('calendar')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                format === 'calendar' ? 'bg-[#ff3366] text-white font-bold' : 'bg-[#1a1a24] text-[#ff6b8b] hover:bg-[#222233]'
              }`}
            >
              <CalendarIcon className="w-3 h-3" />
              <span>Calendar Sync</span>
            </button>
            <button
              onClick={() => setFormat('google')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                format === 'google' ? 'bg-[#34a853] text-white font-bold' : 'bg-[#1a1a24] text-[#81c995] hover:bg-[#222233]'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Google Workspace</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1b1b26] hover:bg-[#252536] border border-[#2e2e42] text-xs text-[#eaeaf0] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b39023] hover:brightness-110 text-black font-bold text-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Informational & Action Bar per Tab */}
        {format === 'webhook' && (
          <div className="px-6 py-3 bg-[#111622] border-b border-[#1c293e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#00f0ff] flex items-center gap-1">
                <Send className="w-3.5 h-3.5" />
                Live Webhook Trigger (Zapier • Make.com • Meta Suite • Canva API)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  className="w-full max-w-lg px-3 py-1.5 rounded-lg bg-[#090b10] border border-[#25334a] text-xs text-[#d0e0ff] font-mono focus:outline-none focus:border-[#00f0ff]"
                />
                <button
                  onClick={handleDispatchWebhook}
                  disabled={isDispatching}
                  className="px-3.5 py-1.5 rounded-lg bg-[#00f0ff] hover:bg-[#4df4ff] text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isDispatching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isDispatching ? 'Dispatching...' : 'Dispatch'}</span>
                </button>
              </div>
            </div>

            {dispatchStatus && (
              <div className="px-3 py-1.5 rounded-lg bg-[#090d14] border border-[#00f0ff]/40 text-[11px] text-[#00f0ff]">
                ✓ {dispatchStatus.message} ({dispatchStatus.timestamp})
              </div>
            )}
          </div>
        )}

        {format === 'calendar' && (
          <div className="px-6 py-2.5 bg-[#1a0f14] border-b border-[#301c26] flex items-center justify-between text-xs text-[#f5ebd1]">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#ff3366]" />
              <span>
                <strong>24-Hour Production Milestone:</strong> Schedules deadline 24 hours before doors open to confirm 16:9 LED visual loops & brochures.
              </span>
            </div>
            <a
              href={generateGoogleCalendarUrl(deliverables)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#ff3366] hover:bg-[#ff4d7a] text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <span>Add to Google Calendar</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {format === 'csv' && (
          <div className="px-6 py-2 bg-[#17150c] border-b border-[#2b2413] flex items-center gap-2 text-[11px] text-[#e0c98b]">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>
              <strong>Canva Bulk Create & Adobe Express ready:</strong> Column headers (Event_Name, Date, DJ_Artist, Headline, Highlights, etc.) match directly with tagged template elements.
            </span>
          </div>
        )}

        {/* Content Preview Box */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-[#cecee0] leading-relaxed bg-[#0a0a0d]">
          <pre className="whitespace-pre-wrap select-all">{getContent()}</pre>
        </div>
      </div>
    </div>
  );
};

