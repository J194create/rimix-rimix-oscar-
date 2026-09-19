import { MarketingDeliverables, SocialMediaPack } from '../types';

export interface CaptionVariant {
  id: 'vip' | 'fomo' | 'urgent';
  label: string;
  badge: string;
  targetAudience: string;
  caption: string;
  callToAction: string;
  hashtags: string[];
}

export interface LanguageTranslation {
  code: 'en' | 'am' | 'fr' | 'ar' | 'es';
  name: string;
  nativeName: string;
  flag: string;
  caption: string;
  callToAction: string;
  headlinePrint: string;
}

export interface MotionLoopSpec {
  modelName: string; // e.g. "Runway Gen-3 Alpha / Luma Dream Machine"
  duration: string; // "5 Seconds Seamless Loop"
  fps: string; // "24 FPS Cinematic"
  aspectRatio: string; // "16:9 Widescreen"
  cameraMotion: string;
  prompt: string;
  technicalParams: string;
}

export interface StaffTask {
  id: string;
  time: string;
  phase: string;
  title: string;
  description: string;
  channel: 'Input' | 'Design' | 'Screens' | 'Social' | 'Doors';
  completed?: boolean;
}

// Generate 3 Distinct A/B Variants for Social Media
export function getCaptionVariants(deliverables: MarketingDeliverables): CaptionVariant[] {
  const name = deliverables.eventName;
  const dj = deliverables.socialMediaPack.keyDetails.djOrArtist;
  const date = deliverables.socialMediaPack.keyDetails.date;
  const offer = deliverables.vipTableOffer || 'Complimentary welcome cocktails before 11 PM';

  return [
    {
      id: 'vip',
      label: 'Exclusive VIP & High-Spend',
      badge: 'Bespoke Sanctuary',
      targetAudience: 'VIP Table Clients, High-Rollers & Private Mezzanine Parties',
      caption: `Indulge in private nocturnal opulence. ✨ Tonight for ${name}, OSCAR Club reserves its mezzanine suites for those who command the night. Featuring curated sound architecture by ${dj}, bespoke Dom Pérignon rituals, and dedicated table concierge. ${offer}. Elevate your nightlife benchmark. 🍾🥂`,
      callToAction: 'Private Mezzanine Booths & VIP Champagne Lounges available by direct concierge arrangement only.',
      hashtags: ['#OSCARClubVIP', '#NocturnalLuxury', '#VIPTableService', '#DomPerignon', '#HighEndNightlife', '#ObsidianSanctuary'],
    },
    {
      id: 'fomo',
      label: 'General Public & FOMO',
      badge: 'Main Room Energy',
      targetAudience: 'Dancefloor Patrons, House/Techno Enthusiasts & Weekend Crowds',
      caption: `The city’s most anticipated weekend frequency is here. 🔥 ${name} hits OSCAR Club ${date}. ${dj} takes the deck beneath 3,000 lasers and our custom crystal-clear soundwall. Dance till the early morning hours in an ocean of brushed gold and deep obsidian shadows. You don’t want to be hearing about this tomorrow. ⚡🎧`,
      callToAction: 'Priority guest list registration is filling rapidly. Secure your entrance before midnight capacity.',
      hashtags: ['#OSCARClub', `#${name.replace(/\s+/g, '')}`, '#AddisNightlife', '#NightlifeCulture', '#ClubbingVibes', '#WeekendEnergy', '#ElectronicMusic'],
    },
    {
      id: 'urgent',
      label: 'Urgent Last-Call & Guest List',
      badge: 'Final Availability',
      targetAudience: 'Late RSVPers, Spontaneous Night Owls & Waitlisted Guests',
      caption: `FINAL CALL // DOORS AT 10 PM. ⏳ Tonight’s ${name} at OSCAR Club is nearing full venue reservation. Only 2 mezzanine VIP booths remain, and the complimentary cocktail perk (${offer}) expires sharply at 11:00 PM. ${dj} is on stage. Move fast or miss the night. 🍸🚨`,
      callToAction: 'Final priority entry passes closing in 2 hours. Register via WhatsApp concierge or link in bio immediately.',
      hashtags: ['#OSCARClub', '#LastCall', '#AddisNightlife', '#GuestListClosing', '#NightlifeTonight', '#VIPFinalTickets'],
    },
  ];
}

// Generate Multi-Language Luxury Nocturnal Translations
export function getLanguageTranslations(deliverables: MarketingDeliverables): Record<string, LanguageTranslation> {
  const name = deliverables.eventName;
  const dj = deliverables.socialMediaPack.keyDetails.djOrArtist;
  const existingAmharic = deliverables.socialMediaPack.amharicCaption;

  return {
    en: {
      code: 'en',
      name: 'English (Original)',
      nativeName: 'English',
      flag: '🇬🇧',
      caption: deliverables.socialMediaPack.caption,
      callToAction: deliverables.socialMediaPack.callToAction,
      headlinePrint: deliverables.dailyBrochureFlyer.headline,
    },
    am: {
      code: 'am',
      name: 'Amharic (አማርኛ - Habesha Luxury)',
      nativeName: 'አማርኛ',
      flag: '🇪🇹',
      caption: existingAmharic || (name.toLowerCase().includes('obsidian') || name.toLowerCase().includes('velvet')
        ? `በዚህ ቅዳሜ በኦስካር ክለብ ልዩ የኦብሰዲያን ቬልቬት ምሽት ከዲጄ ${dj || 'አለክስ'} ጋር ይዝናኑ። ለሴቶች እስከ ምሽቱ 5:00 ሰዓት ነፃ መግቢያ ተዘጋጅቷል። የቪአይፒ (VIP) ጠረጴዛዎን አስቀድመው ይያዙ። 🍸✨`
        : `በኦስካር ክለብ (OSCAR Club) እጅግ ዘመናዊና ማራኪ የምሽት ህይወትን ይለማመዱ። ✨ ዛሬ ማታ ልዩ ዝግጅት « ${name} » ከዲጄ ${dj} ጋር ይጠብቆታል። የኦብሰዲያን ጥቁርና የወርቅ ድምቀት በአስደናቂ የሙዚቃ ቅንብር ታጅቧል። የቪአይፒ (VIP) ጠረጴዛዎን አሁኑኑ ያስይዙ። 🍸💫`),
      callToAction: 'የቪአይፒ (VIP) ጠረጴዛዎች ውስን ስለሆኑ አስቀድመው በኮንሲየርጅ ይያዙ ወይም በክብር እንግዶች ዝርዝር ይመዝገቡ።',
      headlinePrint: `ኦስካር ክለብ ያቀርባል፡ ${name.toUpperCase()}`,
    },
    fr: {
      code: 'fr',
      name: 'French (Nocturnal Luxury)',
      nativeName: 'Français',
      flag: '🇫🇷',
      caption: `Pénétrez dans l’aura d’un luxe nocturne absolu. ✨ Ce soir, le Club OSCAR célèbre « ${name} ». Immergez-vous là où les ombres d'obsidienne profonde fusionnent avec l'or brossé et les reflets néon. Avec ${dj} aux commandes d’une architecture sonore envoûtante. Une expérience de haute voltige vous attend. 🍸💫`,
      callToAction: 'Les tables VIP sont strictement limitées. Réservez votre sanctuaire privé auprès de notre conciergerie dès maintenant.',
      headlinePrint: `CLUB OSCAR PRÉSENTE : ${name.toUpperCase()}`,
    },
    ar: {
      code: 'ar',
      name: 'Arabic (Gulf Luxury)',
      nativeName: 'العربية',
      flag: '🇦🇪',
      caption: `ادخل إلى عالم الفخامة الليلية الاستثنائية. ✨ الليلة في نادي أوسكار (OSCAR Club)، نقدم لكم « ${name} ». استمتع بأجواء ساحرة تمزج بين سواد الأوبسيديان والذهب المصقول مع أنغام الفنان ${dj}. تجربة ترفيهية لا تُنسى في صالات الـ VIP الفاخرة. 🍸✨`,
      callToAction: 'طاولات كبار الشخصيات محدودة للغاية. احجز صالتك الخاصة عبر الكونسيرج الآن.',
      headlinePrint: `نادي أوسكار يقدم: ${name.toUpperCase()}`,
    },
    es: {
      code: 'es',
      name: 'Spanish (Iberian Chic)',
      nativeName: 'Español',
      flag: '🇪🇸',
      caption: `Adéntrate en el aura del lujo nocturno supremo. ✨ Esta noche en OSCAR Club presentamos « ${name} ». Déjate envolver por sombras de obsidiana profunda, oro cepillado y frecuencias sonoras hipnóticas de la mano de ${dj}. Una noche inolvidable te espera. 🍸💫`,
      callToAction: 'Mesas VIP estrictamente limitadas. Reserva tu espacio exclusivo antes del cierre del listado.',
      headlinePrint: `OSCAR CLUB PRESENTA: ${name.toUpperCase()}`,
    },
  };
}

// Generate Runway Gen-3 / Luma Dream Machine 5-Second Video Loop Spec
export function getMotionLoopSpec(deliverables: MarketingDeliverables): MotionLoopSpec {
  const name = deliverables.eventName;

  return {
    modelName: 'Runway Gen-3 Alpha / Luma Dream Machine / Kling 1.5',
    duration: '5 Seconds (Seamless Infinite Loop)',
    fps: '24 FPS (Cinematic High Bitrate UHD)',
    aspectRatio: '16:9 Widescreen (3840x2160 LED Wall)',
    cameraMotion: 'Slow cinematic tracking push-in along polished black marble floor, subtle camera tilt-up, seamless seamless loop transition.',
    prompt: `Cinematic 5-second seamless motion loop for luxury nightclub OSCAR Club stage screens. Volumetric amber and gold laser beams sweeping through atmospheric hazy club darkness. Polished obsidian floor reflecting shimmering gold dust and floating champagne bubbles. Embedded bold 3D metallic gold typography in center reading "OSCAR CLUB - ${name.toUpperCase()}" with subtle light sheen passing across beveled letters. Deep cinematic shadows, elegant slow movement, 4k ultra-high definition, 24fps looping perfection.`,
    technicalParams: `--ar 16:9 --motion 3 --fps 24 --loop true --camera push_in --lighting volumetric_gold --quality 4k`,
  };
}

// Generate Suggested Staff Task Schedule
export function getStaffTasks(deliverables: MarketingDeliverables): StaffTask[] {
  const name = deliverables.eventName;
  const dj = deliverables.socialMediaPack.keyDetails.djOrArtist;

  return [
    {
      id: 'task-1',
      time: '02:00 PM',
      phase: 'Planning & AI Ingestion',
      title: 'Input Raw Venue Notes into Terminal',
      description: `Ingest ${name} details (${dj}, VIP drink perks, dress code) into OSCAR Marketing Suite.`,
      channel: 'Input',
    },
    {
      id: 'task-2',
      time: '02:01 PM',
      phase: 'Batch Template Push',
      title: 'Export CSV to Canva Bulk Create / Webhook',
      description: 'Download campaign CSV and map variables to Canva story & flyer templates.',
      channel: 'Design',
    },
    {
      id: 'task-3',
      time: '02:05 PM',
      phase: 'Stage Visual Generation',
      title: 'Render 16:9 Banner & 5s Video Loop',
      description: 'Feed widescreen prompt into Imagen 3 & Runway Gen-3 for the main-stage LED array.',
      channel: 'Screens',
    },
    {
      id: 'task-4',
      time: '02:10 PM',
      phase: 'Distribution',
      title: 'Schedule Posts in Meta Business Suite',
      description: 'Distribute Instagram feed post, TikTok clip, and VIP broadcast via Buffer or Meta Suite.',
      channel: 'Social',
    },
    {
      id: 'task-5',
      time: '05:00 PM',
      phase: 'Engagement',
      title: 'Publish FOMO Teaser Story',
      description: 'Post 15-second countdown story highlighting table reservations and drink specials.',
      channel: 'Social',
    },
    {
      id: 'task-6',
      time: '09:30 PM',
      phase: 'Stage Setup',
      title: 'Load Stage Screens & Sound Check',
      description: `Confirm 16:9 LED visual assets for ${name} are synced to Resolume / stage playback server.`,
      channel: 'Screens',
    },
    {
      id: 'task-7',
      time: '10:00 PM',
      phase: 'Doors Open',
      title: 'Doors Open / VIP Welcome Concierge',
      description: 'Welcome first arrivals with signature welcome cocktails and seat mezzanine VIP booths.',
      channel: 'Doors',
    },
  ];
}

// Generate Google Calendar Link & .ICS Download Content
export function generateIcsCalendar(deliverables: MarketingDeliverables): string {
  const name = deliverables.eventName;
  const now = new Date();
  
  // Format for tomorrow 22:00 to next morning 05:00
  const eventDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const startYear = eventDate.getFullYear();
  const startMonth = String(eventDate.getMonth() + 1).padStart(2, '0');
  const startDay = String(eventDate.getDate()).padStart(2, '0');
  
  const startStamp = `${startYear}${startMonth}${startDay}T220000Z`;
  const endStamp = `${startYear}${startMonth}${startDay}T050000Z`;
  const createdStamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OSCAR Club//Marketing Suite//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:oscar-${deliverables.eventId || '20260919'}@oscarclub.vip`,
    `DTSTAMP:${createdStamp}`,
    `DTSTART:${startStamp}`,
    `DTEND:${endStamp}`,
    `SUMMARY:OSCAR Club: ${name}`,
    `DESCRIPTION:OSCAR Club Marketing & Production Schedule\\nDJ: ${deliverables.socialMediaPack.keyDetails.djOrArtist}\\nRSVP: ${deliverables.socialMediaPack.keyDetails.rsvpInfo}\\n\\nProduction Milestone: Ensure all 16:9 LED visual loops & Meta Suite schedules are active 24 hours prior.`,
    'LOCATION:OSCAR Club Main Room & Mezzanine Lounge',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'DESCRIPTION:OSCAR Club 24h Production Deadline: Confirm LED screens & flyers',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

// Generate Google Calendar Direct Web URL
export function generateGoogleCalendarUrl(deliverables: MarketingDeliverables): string {
  const name = encodeURIComponent(`OSCAR Club: ${deliverables.eventName}`);
  const details = encodeURIComponent(
    `OSCAR Club Event & Production Schedule\nDJ / Artist: ${deliverables.socialMediaPack.keyDetails.djOrArtist}\nTable Offer: ${deliverables.vipTableOffer || 'Complimentary cocktails before 11 PM'}\nRSVP: ${deliverables.socialMediaPack.keyDetails.rsvpInfo}\n\nMarketing Deliverables synced via OSCAR Marketing Suite.`
  );
  const location = encodeURIComponent('OSCAR Club Main Room & VIP Lounge');
  
  const now = new Date();
  const targetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const y = targetDate.getFullYear();
  const m = String(targetDate.getMonth() + 1).padStart(2, '0');
  const d = String(targetDate.getDate()).padStart(2, '0');
  
  const dates = `${y}${m}${d}T220000Z/${y}${m}${d}T050000Z`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${name}&dates=${dates}&details=${details}&location=${location}`;
}
