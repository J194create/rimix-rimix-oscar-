import { MarketingDeliverables, PresetVenueInput } from './types';

export const PRESET_INPUTS: PresetVenueInput[] = [
  {
    id: 'voice-obsidian-velvet',
    title: '🎙️ Voice Command: Obsidian Velvet (Saturday)',
    category: 'Voice Command / Test',
    rawText: "Uh, system, create a brochure and screen banner for Saturday night. It's the Obsidian Velvet party with DJ Alex. Ladies get free entry until 11 PM, VIP tables open, dress code is ultra smart.",
  },
  {
    id: 'friday-golden-hour',
    title: 'Friday Night: Golden Hour Beats',
    category: 'Signature Night',
    rawText: 'Friday Night: Golden Hour Beats with DJ Marcus. Free welcome cocktail for ladies before 11 PM. VIP tables open. Dress code: Smart Chic.',
  },
  {
    id: 'saturday-midnight-noir',
    title: 'Saturday Noir: Deep Frequency',
    category: 'Weekend Headliner',
    rawText: 'Saturday Midnight Noir featuring international sensation DJ Alyssa Drake. Exclusive Dom Pérignon bottle service packages, private mezzanine booths. Doors open 10 PM until sunrise. Dress code: Black Tie Avant-Garde.',
  },
  {
    id: 'thursday-secret-society',
    title: 'Thursday: Secret Society & Rare Spirits',
    category: 'Members & VIP',
    rawText: 'Thursday Rendezvous: Secret Society acoustic tech-house set with Marcus & Guest Violinist. Rare Japanese whisky tasting flight at the Obsidian Bar. Complimentary entry on guest list before midnight. Dress code: High Fashion Chic.',
  },
  {
    id: 'sunday-velvet-sunset',
    title: 'Sunday: Velvet Sunset Afterhours',
    category: 'Lounge & Chill',
    rawText: 'Sunday Sunset to Midnight: Velvet Afterhours with resident DJ Kaelen. Half-price craft martinis from 8-10 PM. Rooftop cabanas available by reservation. Dress code: Effortless Luxury.',
  }
];

export const DEFAULT_DELIVERABLE: MarketingDeliverables = {
  eventId: 'OSCAR_2026_0919',
  eventName: 'Golden Hour Beats',
  vipTableOffer: 'Complimentary welcome cocktail before 11 PM',
  rawInput: 'Friday Night: Golden Hour Beats with DJ Marcus. Free welcome cocktail for ladies before 11 PM. VIP tables open. Dress code: Smart Chic.',
  cleanedVoiceInput: 'Friday Night: Golden Hour Beats featuring DJ Marcus. Complimentary welcome cocktail for ladies until 11:00 PM. VIP mezzanine table reservations active. Dress code: Smart Chic.',
  promptExpanded: true,
  generatedAt: new Date().toISOString(),
  socialMediaPack: {
    caption: 'Step into the aura of pure nocturnal luxury. ✨ This Friday, surrender to the intoxicating frequencies of Golden Hour Beats headlined by DJ Marcus. Immerse yourself under the obsidian glow, where gilded shadows meet pulse-pounding rhythm. Arrive early to savor an exclusive complimentary welcome cocktail crafted for our ladies before 11 PM. Your elevated weekend begins at OSCAR. 🍸💫',
    amharicCaption: 'በዚህ አርብ በኦስካር ክለብ ልዩ የወርቃማ ሰዓት ምሽት ከዲጄ ማርከስ ጋር ይዝናኑ። ለሴቶች እስከ ምሽቱ 5:00 ሰዓት ነፃ የእንኳን ደህና መጡ ኮክቴል ተዘጋጅቷል። የቪአይፒ (VIP) ጠረጴዛዎን አስቀድመው ይያዙ። 🍸✨',
    keyDetails: {
      date: 'Friday Night (This Week)',
      time: '10:00 PM - Late (Cocktails complimentary until 11:00 PM)',
      djOrArtist: 'DJ Marcus (Main Stage)',
      dressCode: 'Smart Chic / Ultra-Sophisticated (Strictly Enforced)',
      rsvpInfo: 'VIP Table Concierge & Priority Guest List via link in bio / WhatsApp +1 (555) 019-OSCAR',
    },
    callToAction: 'Tables are strictly limited. Reserve your private VIP booth or register for the exclusive guest list now.',
    hashtags: [
      '#OSCARClub',
      '#GoldenHourBeats',
      '#AddisNightlife',
      '#ExclusiveNightlife',
      '#LuxuryClubbing',
      '#DJMarcus',
      '#VIPExperience',
      '#ObsidianAndGold',
      '#NightlifeElite'
    ]
  },
  digitalScreenBanner: {
    aspectRatio: '16:9',
    eventName: 'Golden Hour Beats',
    prompt: 'Photorealistic ultra-widescreen 16:9 digital LED banner for exclusive high-end nightclub. Dark moody club backdrop with deep obsidian black textures and polished dark marble floors reflecting amber and cyan neon glow. Volumetric golden light beams and laser rays cutting through atmospheric haze and dry-ice fog. In the background, glamorous VIP crowd enjoying champagne bottle service at an opulent backlit onyx bar. Cinematic depth of field with dramatic low-angle perspective. Crisp photorealistic render with embedded text: Text "OSCAR CLUB - GOLDEN HOUR BEATS" clearly rendered in bold metallic gold font centered with brushed bronze bevels and subtle warm halo backlighting.',
    visualsSummary: 'Dark moody club backdrop, golden volumetric light beams cutting through haze, luxury bar ambiance with amber neon reflections, cinematic depth of field, high contrast metallic finish.',
    embeddedTextInstruction: 'Text "OSCAR CLUB - GOLDEN HOUR BEATS" clearly rendered in bold metallic gold font with crisp edges and soft gold specular highlights.'
  },
  dailyBrochureFlyer: {
    headline: 'OSCAR CLUB PRESENTS: GOLDEN HOUR BEATS',
    subheaders: [
      'AN EXCLUSIVE FRIDAY NIGHT EXPERIENCE FEATURING DJ MARCUS',
      'OBSIDIAN LUXURY • IMMERSIVE SOUND • PRIVATE VIP SANCTUARY'
    ],
    bodyCopy: [
      'COMPLIMENTARY WELCOME COCKTAIL: Specially curated mixology welcome cocktail for all ladies arriving before 11:00 PM.',
      'VIP TABLE SANCTUARY: Dedicated bottle service, personal security concierge, and premium panoramic views of the main booth.',
      'AUDIO-VISUAL EUPHORIA: Cinematic sound engineering and hypnotic light architecture headlined live by DJ Marcus.'
    ],
    visualPrompt: 'Photorealistic vertical 3:4 aspect ratio luxury nightlife print flyer background. Deep obsidian black and dark bronze stone backdrop with subtle golden sparkles and champagne effervescence rising through the frame. Dramatic top-down warm amber spotlights illuminating crystal glassware, premium champagne bottles with condensation, and subtle cyan laser accent lines across a dark moody lounge. Cinematic depth of field, opulent textures, negative space reserved at center for typography, 8k resolution editorial print quality.'
  }
};
