import React, { useState } from 'react';
import { 
  FileArchive, Download, CheckCircle2, Folder, FileText, Image as ImageIcon, 
  Sparkles, RefreshCw, Calendar, Shield, Share2, Copy, Check
} from 'lucide-react';
import JSZip from 'jszip';
import { MarketingDeliverables, TeamRole, ApprovalStatus } from '../types';

interface MediaKitExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliverables: MarketingDeliverables;
  approvalStatus: ApprovalStatus;
  currentRole: TeamRole;
}

export const MediaKitExportModal: React.FC<MediaKitExportModalProps> = ({
  isOpen,
  onClose,
  deliverables,
  approvalStatus,
  currentRole,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Helper to render high-res canvas into Blob
  const renderCanvasGraphic = (
    width: number,
    height: number,
    aspectLabel: string
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(new Blob([''], { type: 'image/png' }));
        return;
      }

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0a0a0f');
      bgGrad.addColorStop(0.4, '#15121b');
      bgGrad.addColorStop(0.7, '#09090e');
      bgGrad.addColorStop(1, '#050508');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Gold beam / mesh
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      for (let i = 0; i < width; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 150, height);
        ctx.stroke();
      }
      ctx.restore();

      // Spotlight
      const spot = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        20,
        width * 0.5,
        height * 0.35,
        width * 0.6
      );
      spot.addColorStop(0, 'rgba(212, 175, 55, 0.3)');
      spot.addColorStop(0.5, 'rgba(255, 170, 0, 0.12)');
      spot.addColorStop(0.8, 'rgba(0, 240, 255, 0.08)');
      spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, width, height);

      // Accent border
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 3;
      ctx.strokeRect(25, 25, width - 50, height - 50);

      // Typography
      ctx.textAlign = 'center';

      // Header Tagline
      ctx.font = 'bold 20px "Cinzel", serif';
      ctx.fillStyle = '#baa466';
      ctx.fillText('OSCAR CLUB EXCLUSIVE', width * 0.5, height * 0.2);

      // Divider line
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(width * 0.5 - 50, height * 0.2 + 15, 100, 3);

      // Event Name
      const titleSize = width === 1920 ? 74 : width === 1080 && height === 1920 ? 54 : 58;
      ctx.font = `900 ${titleSize}px "Cinzel", serif`;
      const textGrad = ctx.createLinearGradient(0, height * 0.25, 0, height * 0.38);
      textGrad.addColorStop(0, '#ffffff');
      textGrad.addColorStop(0.4, '#f7e7b4');
      textGrad.addColorStop(1, '#d4af37');
      ctx.fillStyle = textGrad;
      ctx.fillText(deliverables.eventName.toUpperCase(), width * 0.5, height * 0.32);

      // DJ
      const dj = deliverables.socialMediaPack?.keyDetails?.djOrArtist || 'DJ Marcus';
      ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#00f0ff';
      ctx.fillText(`FEATURING ${dj.toUpperCase()}`, width * 0.5, height * 0.42);

      // Date / Time
      const dt = `${deliverables.socialMediaPack?.keyDetails?.date || 'TONIGHT'} • ${deliverables.socialMediaPack?.keyDetails?.time || '10 PM TILL LATE'}`;
      ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f0f0f8';
      ctx.fillText(dt, width * 0.5, height * 0.48);

      // VIP Table Offer
      const vip = deliverables.vipTableOffer || 'Ladies Complimentary Before 11 PM • VIP Mezzanine Tables';
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f7e7b4';
      ctx.fillText(`✦ ${vip.toUpperCase()} ✦`, width * 0.5, height * 0.82);

      // Aspect Ratio Label Tag
      ctx.font = '12px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText(`OSCAR CLUB ASSET • RATIO: ${aspectLabel} • ${width}x${height}`, width * 0.5, height * 0.94);

      canvas.toBlob((blob) => {
        resolve(blob || new Blob([''], { type: 'image/png' }));
      }, 'image/png');
    });
  };

  const handleGenerateZip = async () => {
    setIsGenerating(true);
    setProgress(10);
    setProgressStatus('Initializing media kit package structure...');

    try {
      const zip = new JSZip();
      const cleanEventName = deliverables.eventName.replace(/[^a-zA-Z0-9]/g, '_');
      const rootFolder = zip.folder(`OSCAR_MEDIA_KIT_${cleanEventName}`) || zip;

      // 1. LED Stage Banner Folder
      setProgress(25);
      setProgressStatus('Rendering 16:9 Stage LED Graphics (1920x1080)...');
      const ledFolder = rootFolder.folder('01_LED_Stage_Banner');
      if (ledFolder) {
        const ledBlob = await renderCanvasGraphic(1920, 1080, '16:9 Stage LED');
        ledFolder.file(`OSCAR_${cleanEventName}_16x9_LED_Stage.png`, ledBlob);
        ledFolder.file(
          'imagen3_stage_prompt.txt',
          `=== OSCAR CLUB STAGE LED PROMPT (16:9) ===\n${deliverables.digitalScreenBanner.prompt}\n\nTechnical Specifications:\nResolution: 1920x1080\nColor Space: sRGB\nRecommended Playback: Resolume Arena / Stage LED Matrix Wall (60 FPS)\nMotion Prompt: ${deliverables.digitalScreenBanner.motionPrompt || 'Volumetric amber spotlights sweeping across dark obsidian marble'}`
        );
      }

      // 2. Social Media Pack Folder
      setProgress(50);
      setProgressStatus('Rendering Social Media assets (9:16 Story & 1:1 Feed)...');
      const socialFolder = rootFolder.folder('02_Social_Media_Pack');
      if (socialFolder) {
        const storyBlob = await renderCanvasGraphic(1080, 1920, '9:16 Story / Reel');
        socialFolder.file(`OSCAR_${cleanEventName}_9x16_Story.png`, storyBlob);

        const feedBlob = await renderCanvasGraphic(1080, 1080, '1:1 Instagram Post');
        socialFolder.file(`OSCAR_${cleanEventName}_1x1_Feed.png`, feedBlob);

        socialFolder.file(
          'instagram_caption_english.txt',
          deliverables.socialMediaPack.caption || 'OSCAR Club Exclusive Event'
        );

        socialFolder.file(
          'instagram_caption_amharic.txt',
          deliverables.socialMediaPack.amharicCaption || deliverables.amharicCaption || 'ኦስካር ክለብ ልዩ የምሽት ዝግጅት'
        );

        socialFolder.file(
          'tiktok_reels_script.txt',
          `=== TIKTOK & REELS 15-SECOND SCRIPT ===\nHook: Step inside the velvet sanctuary of OSCAR Club.\n\nVisuals: Dynamic panning across backlit onyx cocktail lounge, champagne cascades, amber light beams.\n\nCall To Action: ${deliverables.socialMediaPack.callToAction || 'Link in bio for VIP table reservations.'}`
        );

        socialFolder.file(
          'hashtags.txt',
          (deliverables.socialMediaPack.hashtags || ['#OSCARClub', '#AddisNightlife', '#LuxuryNightclub']).join(' ')
        );
      }

      // 3. Print Collateral Folder
      setProgress(75);
      setProgressStatus('Packaging 3:4 Print Flyer & Venue Brochure...');
      const printFolder = rootFolder.folder('03_Print_Collateral');
      if (printFolder) {
        const flyerBlob = await renderCanvasGraphic(1200, 1600, '3:4 Print Flyer');
        printFolder.file(`OSCAR_${cleanEventName}_3x4_Flyer.png`, flyerBlob);

        printFolder.file(
          'venue_brochure_copy.txt',
          `=== OSCAR CLUB PRINT BROCHURE COPY ===\nHeadline: ${deliverables.dailyBrochureFlyer.headline || ''}\nSubheaders:\n${deliverables.dailyBrochureFlyer.subheaders.map((s) => `• ${s}`).join('\n')}\n\nBody Copy:\n${deliverables.dailyBrochureFlyer.bodyCopy.join('\n\n')}\n\nVIP Table Offer:\n${deliverables.vipTableOffer || ''}\n\nVisual Prompt:\n${deliverables.dailyBrochureFlyer.visualPrompt || ''}`
        );

        printFolder.file(
          'print_shop_specs.txt',
          'PRINT PRODUCTION SPECIFICATIONS:\nTrim Size: 3:4 Aspect (A4 / 8.5x11 scale)\nBleed: 3mm on all edges\nStock: 350gsm Silk Finish with Gold Foil Stamp on OSCAR logo\nColor Profile: Fogra39 / CMYK'
        );
      }

      // 4. Staff Briefing & Schedule Folder
      setProgress(90);
      setProgressStatus('Compiling Venue Staff Briefing & Production Schedule...');
      const briefingFolder = rootFolder.folder('04_Venue_Staff_Briefing');
      if (briefingFolder) {
        briefingFolder.file(
          'event_manifest.json',
          JSON.stringify(
            {
              eventName: deliverables.eventName,
              vipOffer: deliverables.vipTableOffer,
              details: deliverables.socialMediaPack.keyDetails,
              approvalStatus,
              exportedAt: new Date().toISOString(),
            },
            null,
            2
          )
        );

        briefingFolder.file(
          'vip_host_talking_points.txt',
          `VIP HOST & DOOR CONCIERGE BRIEFING:\nEvent: ${deliverables.eventName}\nHeadliner: ${deliverables.socialMediaPack?.keyDetails?.djOrArtist}\nDoor Policy: Ladies complimentary entry until 11:00 PM\nDress Code: ${deliverables.socialMediaPack?.keyDetails?.dressCode || 'Ultra Smart Chic'}\nVIP Table Inquiries: Direct to Head Sommelier & VIP Concierge Desk`
        );
      }

      // Generate Zip Blob
      setProgress(98);
      setProgressStatus('Compressing media kit archive into .ZIP...');
      const zipContent = await zip.generateAsync({ type: 'blob' });

      // Trigger download
      const downloadUrl = URL.createObjectURL(zipContent);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `OSCAR_CLUB_MEDIA_KIT_${cleanEventName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setProgress(100);
      setProgressStatus('Export complete! Media kit downloaded.');
    } catch (err) {
      console.error('Media kit export error:', err);
      setProgressStatus('Export failed. Please try again.');
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 1200);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(`https://drive.google.com/drive/folders/oscar-club-${deliverables.eventName.toLowerCase().replace(/\s+/g, '-')}-media-kit`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl flex flex-col rounded-2xl bg-gradient-to-b from-[#121218] via-[#0b0b0f] to-[#070709] border border-[#2e2e3e] shadow-[0_25px_65px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20202c] bg-[#0c0c11]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#d4af37]/20 to-[#00f0ff]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <FileArchive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-display font-bold uppercase tracking-wider text-[#f5ebd1]">
                  Multi-Channel Media Kit Export (.ZIP)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#f7e7b4] border border-[#d4af37]/30 font-semibold uppercase tracking-wider">
                  Full Bundle
                </span>
              </div>
              <p className="text-xs text-[#808092]">
                Resized graphics, video scripts, Amharic & English captions, and staff briefing
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
        <div className="p-6 flex flex-col gap-5">
          {/* Manifest Directory Tree */}
          <div className="rounded-xl bg-[#07070b] border border-[#1e1e2c] p-4 flex flex-col gap-3 font-mono text-xs">
            <span className="text-[#a0a0b2] font-sans font-semibold uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#181824]">
              <Folder className="w-4 h-4 text-[#d4af37]" />
              Media Kit Package Contents:
            </span>

            <div className="space-y-2.5 text-[#cfcfe0]">
              {/* Folder 1 */}
              <div className="flex flex-col gap-1 pl-2 border-l border-[#252536]">
                <span className="text-[#d4af37] font-bold flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5" /> 01_LED_Stage_Banner/
                </span>
                <span className="text-[11px] text-[#808096] pl-5 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-[#00f0ff]" /> OSCAR_Stage_16x9_LED.png (1920x1080 60Hz)
                </span>
                <span className="text-[11px] text-[#808096] pl-5 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#baa466]" /> imagen3_stage_prompt.txt
                </span>
              </div>

              {/* Folder 2 */}
              <div className="flex flex-col gap-1 pl-2 border-l border-[#252536]">
                <span className="text-[#00f0ff] font-bold flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5" /> 02_Social_Media_Pack/
                </span>
                <span className="text-[11px] text-[#808096] pl-5 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-[#00f0ff]" /> OSCAR_Story_9x16.png (1080x1920)
                </span>
                <span className="text-[11px] text-[#808096] pl-5 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-[#00f0ff]" /> OSCAR_Feed_1x1.png (1080x1080)
                </span>
                <span className="text-[11px] text-[#808096] pl-5 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#baa466]" /> instagram_caption_en.txt + amharic.txt
                </span>
                <span className="text-[11px] text-[#808096] pl-5 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#baa466]" /> tiktok_reels_script.txt & hashtags.txt
                </span>
              </div>

              {/* Folder 3 */}
              <div className="flex flex-col gap-1 pl-2 border-l border-[#252536]">
                <span className="text-[#ffaa00] font-bold flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5" /> 03_Print_Collateral/
                </span>
                <span className="text-[11px] text-[#808096] pl-5 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-[#00f0ff]" /> OSCAR_Flyer_3x4.png (1200x1600)
                </span>
                <span className="text-[11px] text-[#808096] pl-5 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#baa466]" /> venue_brochure_copy.txt & print_specs.txt
                </span>
              </div>

              {/* Folder 4 */}
              <div className="flex flex-col gap-1 pl-2 border-l border-[#252536]">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5" /> 04_Venue_Staff_Briefing/
                </span>
                <span className="text-[11px] text-[#808096] pl-5 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-emerald-400" /> event_manifest.json (Approval & Details)
                </span>
                <span className="text-[11px] text-[#808096] pl-5 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-emerald-400" /> vip_host_talking_points.txt
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar if generating */}
          {isGenerating && (
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#09090e] border border-[#232332]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#f5ebd1] flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-[#d4af37] animate-spin" />
                  {progressStatus}
                </span>
                <span className="font-mono text-[#00f0ff]">{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#181824] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#d4af37] to-[#00f0ff] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Google Drive / Cloud Share Section */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#09090d] border border-[#1e1e2c]">
            <div className="flex items-center gap-2 text-xs text-[#a0a0b2]">
              <Share2 className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>Shareable Cloud Media Kit Link</span>
            </div>
            <button
              onClick={handleCopyShareLink}
              className="text-xs text-[#00f0ff] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Drive Link'}</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#20202c] bg-[#0c0c11] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#161622] hover:bg-[#202030] text-xs text-[#a0a0b2] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerateZip}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6c66e] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:brightness-110 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Generating Archive...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-black" />
                <span>Generate & Download .ZIP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
