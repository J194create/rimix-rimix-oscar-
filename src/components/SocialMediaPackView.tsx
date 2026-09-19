import React, { useState, useMemo } from 'react';
import { SocialMediaPack } from '../types';
import { Copy, Check, Instagram, Calendar, Clock, Music, Sparkles, UserCheck, PhoneCall, Hash, Eye, Globe, Split, Flame, Shield, ArrowRight } from 'lucide-react';
import { bannerImg } from '../assets';
import { getCaptionVariants, getLanguageTranslations } from '../utils/marketingEnhancements';

interface SocialMediaPackViewProps {
  data: SocialMediaPack;
  eventName: string;
  vipTableOffer?: string;
  eventId?: string;
  rawInput?: string;
}

export const SocialMediaPackView: React.FC<SocialMediaPackViewProps> = ({
  data,
  eventName,
  vipTableOffer,
  eventId,
  rawInput,
}) => {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedFullPack, setCopiedFullPack] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);

  // A/B Variant Selection: 'vip' | 'fomo' | 'urgent'
  const [activeVariant, setActiveVariant] = useState<'default' | 'vip' | 'fomo' | 'urgent'>('default');

  // Multi-Language Selection: 'en' | 'am' | 'fr' | 'ar' | 'es'
  const [activeLang, setActiveLang] = useState<'en' | 'am' | 'fr' | 'ar' | 'es'>('en');
  const [showBilingualAmharic, setShowBilingualAmharic] = useState(true);

  // Mock deliverable wrapper for helper
  const deliverableContext = useMemo(() => {
    return {
      eventId,
      eventName,
      rawInput: rawInput || eventName,
      socialMediaPack: data,
      digitalScreenBanner: {
        aspectRatio: '16:9',
        eventName,
        prompt: '',
        visualsSummary: '',
        embeddedTextInstruction: '',
      },
      dailyBrochureFlyer: {
        headline: `OSCAR CLUB PRESENTS: ${eventName.toUpperCase()}`,
        subheaders: [],
        bodyCopy: [],
        visualPrompt: '',
      },
      vipTableOffer,
      generatedAt: new Date().toISOString(),
    };
  }, [data, eventName, vipTableOffer, eventId, rawInput]);

  const variants = useMemo(() => getCaptionVariants(deliverableContext), [deliverableContext]);
  const translations = useMemo(() => getLanguageTranslations(deliverableContext), [deliverableContext]);

  // Determine current active caption to display & copy
  const currentCaption = useMemo(() => {
    if (activeLang !== 'en') {
      return translations[activeLang]?.caption || data.caption;
    }
    if (activeVariant === 'vip') return variants[0].caption;
    if (activeVariant === 'fomo') return variants[1].caption;
    if (activeVariant === 'urgent') return variants[2].caption;
    return data.caption;
  }, [activeLang, activeVariant, translations, variants, data.caption]);

  const currentCta = useMemo(() => {
    if (activeLang !== 'en') {
      return translations[activeLang]?.callToAction || data.callToAction;
    }
    if (activeVariant === 'vip') return variants[0].callToAction;
    if (activeVariant === 'fomo') return variants[1].callToAction;
    if (activeVariant === 'urgent') return variants[2].callToAction;
    return data.callToAction;
  }, [activeLang, activeVariant, translations, variants, data.callToAction]);

  const currentHashtags = useMemo(() => {
    if (activeVariant === 'vip') return variants[0].hashtags;
    if (activeVariant === 'fomo') return variants[1].hashtags;
    if (activeVariant === 'urgent') return variants[2].hashtags;
    return data.hashtags;
  }, [activeVariant, variants, data.hashtags]);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(currentCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(currentHashtags.join(' '));
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const handleCopyFull = () => {
    const fullText = `=== OSCAR CLUB SOCIAL MEDIA PACK (${activeVariant.toUpperCase()} / ${activeLang.toUpperCase()}) ===\n\n${currentCaption}\n\nKEY DETAILS:\n• Date: ${data.keyDetails.date}\n• Time: ${data.keyDetails.time}\n• DJ / Artist: ${data.keyDetails.djOrArtist}\n• Dress Code: ${data.keyDetails.dressCode}\n• RSVP: ${data.keyDetails.rsvpInfo}\n${vipTableOffer ? `• VIP Offer: ${vipTableOffer}\n` : ''}\nCALL TO ACTION:\n${currentCta}\n\n${currentHashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedFullPack(true);
    setTimeout(() => setCopiedFullPack(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-[#0d0d12] border border-[#23232f] p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col gap-5">
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#00f0ff]/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1f1f2a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161622] border border-[#2d2d3f] flex items-center justify-center text-[#d4af37]">
            <Instagram className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
                Deliverable 01
              </span>
              <span className="text-xs text-[#525263]">/</span>
              <h3 className="font-display text-sm tracking-wider font-bold text-[#f1ede2]">
                SOCIAL MEDIA PACK
              </h3>
            </div>
            <p className="text-xs text-[#828292]">
              Instagram • TikTok • Facebook Channels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="toggle-social-preview"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14141c] hover:bg-[#1c1c28] border border-[#262634] text-xs text-[#b5b5c5] transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>{showLivePreview ? 'Hide Feed Preview' : 'Show Feed Preview'}</span>
          </button>

          <button
            id="btn-copy-social-pack"
            onClick={handleCopyFull}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a26] hover:bg-[#252536] border border-[#303046] text-xs text-[#e8e8f2] transition-colors cursor-pointer"
          >
            {copiedFullPack ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Copy Pack</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Layout: 2 Columns when preview open */}
      <div className={`grid grid-cols-1 ${showLivePreview ? 'lg:grid-cols-12' : ''} gap-5`}>
        {/* Left / Primary Content */}
        <div className={`${showLivePreview ? 'lg:col-span-7' : 'w-full'} flex flex-col gap-4`}>
          {/* Controls Bar: A/B Variant Generator & Multi-Language Translation */}
          <div className="rounded-xl bg-[#0f0f15] border border-[#232333] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* A/B Variant Pills */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9898aa] flex items-center gap-1">
                <Split className="w-3 h-3 text-[#d4af37]" />
                A/B Audience Variant
              </span>
              <div className="flex flex-wrap items-center gap-1">
                <button
                  onClick={() => {
                    setActiveVariant('default');
                    setActiveLang('en');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeVariant === 'default' && activeLang === 'en'
                      ? 'bg-[#d4af37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                      : 'bg-[#181824] hover:bg-[#222234] text-[#a0a0b5] border border-[#2b2b3e]'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => {
                    setActiveVariant('vip');
                    setActiveLang('en');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    activeVariant === 'vip' && activeLang === 'en'
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#e8c868] text-black font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                      : 'bg-[#181824] hover:bg-[#222234] text-[#e8c868] border border-[#d4af37]/30'
                  }`}
                  title="Exclusive VIP & High-Spend Table Guests"
                >
                  <Shield className="w-3 h-3" />
                  <span>VIP Sanctuary</span>
                </button>
                <button
                  onClick={() => {
                    setActiveVariant('fomo');
                    setActiveLang('en');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    activeVariant === 'fomo' && activeLang === 'en'
                      ? 'bg-gradient-to-r from-[#00f0ff] to-[#3a99ff] text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                      : 'bg-[#181824] hover:bg-[#222234] text-[#00f0ff] border border-[#00f0ff]/30'
                  }`}
                  title="General Public & Weekend Dancefloor FOMO"
                >
                  <Flame className="w-3 h-3" />
                  <span>FOMO Energy</span>
                </button>
                <button
                  onClick={() => {
                    setActiveVariant('urgent');
                    setActiveLang('en');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    activeVariant === 'urgent' && activeLang === 'en'
                      ? 'bg-gradient-to-r from-[#ff3366] to-[#ff6b8b] text-white font-bold shadow-[0_0_12px_rgba(255,51,102,0.4)]'
                      : 'bg-[#181824] hover:bg-[#222234] text-[#ff6b8b] border border-[#ff3366]/30'
                  }`}
                  title="Urgent Last-Call & Waitlist Closes"
                >
                  <Clock className="w-3 h-3" />
                  <span>Last-Call</span>
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex flex-col gap-1 sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9898aa] flex items-center gap-1">
                <Globe className="w-3 h-3 text-[#00f0ff]" />
                Language
              </span>
              <div className="flex flex-wrap items-center gap-1 p-0.5 rounded-lg bg-[#14141c] border border-[#262638]">
                {(['en', 'am', 'fr', 'ar', 'es'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      activeLang === lang
                        ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 shadow-xs'
                        : 'text-[#858599] hover:text-[#e0e0f0]'
                    }`}
                    title={translations[lang]?.name}
                  >
                    {translations[lang]?.flag} {lang === 'am' ? 'አማርኛ' : lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Caption Box */}
          <div className="rounded-xl bg-[#121218] border border-[#232330] p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {activeVariant !== 'default'
                    ? `Variant: ${activeVariant === 'vip' ? 'Exclusive VIP' : activeVariant === 'fomo' ? 'General Public FOMO' : 'Urgent Last-Call'}`
                    : 'Luxury Caption (English)'}
                </span>
                {activeLang !== 'en' && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 font-semibold">
                    {translations[activeLang]?.nativeName}
                  </span>
                )}
              </div>
              <button
                id="btn-copy-caption"
                onClick={handleCopyCaption}
                className="flex items-center gap-1 text-[11px] text-[#9090a2] hover:text-[#f0ede6] transition-colors cursor-pointer"
              >
                {copiedCaption ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCaption ? 'Copied' : 'Copy Caption'}</span>
              </button>
            </div>
            <p className="text-sm text-[#ececf2] whitespace-pre-wrap leading-relaxed font-normal">
              {currentCaption}
            </p>
          </div>

          {/* Dedicated Amharic Luxury Translation Card (Deliverable 01 Requirement) */}
          {translations.am?.caption && (
            <div className="rounded-xl bg-gradient-to-r from-[#17140a] via-[#12121a] to-[#0c0c14] border border-[#d4af37]/40 p-4 flex flex-col gap-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#f5ebd1] flex items-center gap-1.5">
                    <span>🇪🇹 Amharic Translation (አማርኛ - Habesha Luxury)</span>
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#f7e7b4] border border-[#d4af37]/30 font-semibold uppercase tracking-wider">
                    Bilingual Sync
                  </span>
                </div>
                <button
                  id="btn-copy-amharic"
                  onClick={() => {
                    navigator.clipboard.writeText(translations.am.caption);
                    setCopiedCaption(true);
                    setTimeout(() => setCopiedCaption(false), 2000);
                  }}
                  className="flex items-center gap-1 text-[11px] text-[#baa466] hover:text-[#f7e7b4] transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3 text-[#d4af37]" />
                  <span>Copy አማርኛ</span>
                </button>
              </div>
              <p className="text-sm text-[#f5ebd1] leading-relaxed font-medium">
                {translations.am.caption}
              </p>
            </div>
          )}

          {/* Key Details Grid */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9a9aa8]">
              Key Event Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-[#121218] border border-[#22222f] p-3 flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#737385] font-semibold">
                    Date
                  </div>
                  <div className="text-xs font-medium text-[#e4e4ed]">
                    {data.keyDetails.date}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-[#121218] border border-[#22222f] p-3 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#737385] font-semibold">
                    Time
                  </div>
                  <div className="text-xs font-medium text-[#e4e4ed]">
                    {data.keyDetails.time}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-[#121218] border border-[#22222f] p-3 flex items-start gap-2.5">
                <Music className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#737385] font-semibold">
                    DJ / Artist
                  </div>
                  <div className="text-xs font-medium text-[#e4e4ed]">
                    {data.keyDetails.djOrArtist}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-[#121218] border border-[#22222f] p-3 flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-[#ffaa00] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#737385] font-semibold">
                    Dress Code
                  </div>
                  <div className="text-xs font-medium text-[#e4e4ed]">
                    {data.keyDetails.dressCode}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 rounded-xl bg-[#121218] border border-[#22222f] p-3 flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#737385] font-semibold">
                    RSVP & VIP Bookings
                  </div>
                  <div className="text-xs font-medium text-[#e4e4ed]">
                    {data.keyDetails.rsvpInfo}
                  </div>
                </div>
              </div>

              {vipTableOffer && (
                <div className="sm:col-span-2 rounded-xl bg-gradient-to-r from-[#1c180a] to-[#121218] border border-[#d4af37]/40 p-3 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-bold">
                        VIP Table Offer & Special
                      </span>
                      {eventId && (
                        <span className="text-[10px] font-mono text-[#828299] px-1.5 py-0.2 bg-[#09090d] rounded border border-[#232330]">
                          {eventId}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-[#f5ebd1] mt-0.5">
                      {vipTableOffer}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <div className="rounded-xl bg-gradient-to-r from-[#17150c] to-[#12121a] border border-[#d4af37]/30 p-3.5 flex items-start gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#d4af37]/20 text-[#f5ebd1] border border-[#d4af37]/40 shrink-0">
              CTA
            </span>
            <p className="text-xs font-semibold text-[#f0e7d0] leading-relaxed">
              {currentCta}
            </p>
          </div>

          {/* Hashtags */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9a9aa8] flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-[#00f0ff]" />
                Hyper-Relevant Hashtags ({currentHashtags.length})
              </span>
              <button
                id="btn-copy-hashtags"
                onClick={handleCopyHashtags}
                className="text-[11px] text-[#9090a2] hover:text-[#f0ede6] transition-colors cursor-pointer flex items-center gap-1"
              >
                {copiedHashtags ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHashtags ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentHashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#14141d] border border-[#272738] text-[#00f0ff]/90 hover:text-[#00f0ff] hover:border-[#00f0ff]/40 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Instagram Feed Card Simulator */}
        {showLivePreview && (
          <div className="lg:col-span-5 flex flex-col">
            <div className="rounded-2xl bg-[#09090d] border border-[#272736] p-4 flex flex-col gap-3 shadow-2xl">
              {/* Top account bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#00f0ff] p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-display text-[10px] font-black text-[#d4af37]">
                      O
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#f5ebd1]">oscarclub.official</span>
                      <span className="w-3 h-3 rounded-full bg-[#00f0ff] flex items-center justify-center text-[7px] text-black font-black">
                        ✓
                      </span>
                    </div>
                    <span className="text-[10px] text-[#6e6e80]">Exclusive Nightlife • VIP Sanctuary</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">
                  Preview
                </span>
              </div>

              {/* Feed Image */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-black border border-[#1f1f2c] group">
                <img
                  src={bannerImg}
                  alt="OSCAR Club Event Visual"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#d4af37] bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-[#d4af37]/30">
                      FRIDAY SIGNATURE
                    </span>
                    <h4 className="font-display font-bold text-sm text-[#fbf8f0] drop-shadow-md">
                      {eventName}
                    </h4>
                  </div>
                  <span className="text-[10px] font-semibold text-[#f1ede2] bg-[#d4af37]/80 text-black px-2 py-0.5 rounded shadow">
                    VIP TABLES
                  </span>
                </div>
              </div>

              {/* Engagement icons */}
              <div className="flex items-center justify-between text-xs text-[#a0a0b2] pt-1">
                <div className="flex items-center gap-3">
                  <span className="hover:text-red-400 cursor-pointer">❤️ 4,821</span>
                  <span className="hover:text-white cursor-pointer">💬 319</span>
                  <span className="hover:text-white cursor-pointer">✈️</span>
                </div>
                <span className="text-[10px] text-[#707082]">Saved by 1.2k</span>
              </div>

              {/* Live Caption Render */}
              <div className="text-xs text-[#d2d2dc] space-y-2 max-h-48 overflow-y-auto pr-1">
                <p>
                  <span className="font-bold text-[#f5ebd1] mr-1.5">oscarclub.official</span>
                  {currentCaption}
                </p>
                {activeLang === 'en' && translations.am?.caption && (
                  <p className="text-[#e2d5b0] pt-1 border-t border-[#1e1e2c] font-sans">
                    <span className="text-[10px] text-[#baa466] font-bold block mb-0.5">አማርኛ (Amharic)</span>
                    {translations.am.caption}
                  </p>
                )}
                <div className="pt-1 text-[11px] text-[#00f0ff]/90 flex flex-wrap gap-1">
                  {currentHashtags.map((h, i) => (
                    <span key={i}>{h}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
