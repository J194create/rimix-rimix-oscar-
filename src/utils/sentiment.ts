export type EnergyLevelType = 'High Energy' | 'Medium Energy' | 'Lounge Vibe';

export interface EnergyAnalysis {
  level: EnergyLevelType;
  label: string;
  score: number; // 0 to 100
  tempo: string; // e.g. "128-132 BPM / Peak Hour"
  color: string; // Tailwind color class
  accentHex: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  summary: string;
  detectedKeywords: string[];
}

// Lightweight sentiment / tone keyword sets for nightlife events
const HIGH_ENERGY_KEYWORDS = [
  'banger',
  'peak',
  'bass',
  'headline',
  'headliner',
  'noir',
  'techno',
  'edm',
  'house',
  'drop',
  'fire',
  'hype',
  'party',
  'dance',
  'rave',
  'lights',
  'laser',
  'sunrise',
  'packed',
  'explosive',
  'wild',
  'clubbing',
  'dom pérignon',
  'champagne',
  'midnight',
  'beats',
  'alyssa',
  'energy',
  'massive',
  'heavy',
];

const LOUNGE_VIBE_KEYWORDS = [
  'lounge',
  'chill',
  'sunset',
  'acoustic',
  'whisky',
  'tasting',
  'flight',
  'smooth',
  'cabana',
  'rooftop',
  'afterhours',
  'velvet',
  'cocktail',
  'craft',
  'martini',
  'jazz',
  'violinist',
  'secret society',
  'deep',
  'rendezvous',
  'ambient',
  'relaxed',
  'intimate',
  'effortless',
  'mellow',
  'wine',
  'sip',
  'downtempo',
];

export function analyzeEnergyLevel(input: string): EnergyAnalysis {
  const text = (input || '').toLowerCase();
  
  const foundHigh = HIGH_ENERGY_KEYWORDS.filter((kw) => text.includes(kw));
  const foundLounge = LOUNGE_VIBE_KEYWORDS.filter((kw) => text.includes(kw));

  // Score calculation:
  // Base 50 (Balanced/Medium)
  // +10 per high energy keyword
  // -10 per lounge keyword
  let score = 50 + foundHigh.length * 12 - foundLounge.length * 12;
  
  // Clamping
  if (score > 95) score = 95;
  if (score < 15) score = 15;

  if (score >= 60) {
    return {
      level: 'High Energy',
      label: 'High Energy',
      score,
      tempo: '126–132 BPM / Peak Stage',
      color: 'text-[#ff3366]',
      accentHex: '#ff3366',
      badgeBg: 'bg-[#ff3366]/12',
      badgeBorder: 'border-[#ff3366]/35',
      badgeText: 'text-[#ff6b8b]',
      summary: 'Mainstage dancefloor drive with high-tempo club lighting and pulse-pounding sound.',
      detectedKeywords: foundHigh.slice(0, 4),
    };
  } else if (score <= 40) {
    return {
      level: 'Lounge Vibe',
      label: 'Lounge Vibe',
      score,
      tempo: '90–115 BPM / Intimate Groove',
      color: 'text-[#00f0ff]',
      accentHex: '#00f0ff',
      badgeBg: 'bg-[#00f0ff]/12',
      badgeBorder: 'border-[#00f0ff]/35',
      badgeText: 'text-[#80f6ff]',
      summary: 'Curated intimate lounge atmosphere with ambient warm lighting and signature cocktail focus.',
      detectedKeywords: foundLounge.slice(0, 4),
    };
  } else {
    return {
      level: 'Medium Energy',
      label: 'Balanced Energy',
      score,
      tempo: '118–124 BPM / Golden Hour',
      color: 'text-[#d4af37]',
      accentHex: '#d4af37',
      badgeBg: 'bg-[#d4af37]/15',
      badgeBorder: 'border-[#d4af37]/40',
      badgeText: 'text-[#f5ebd1]',
      summary: 'Chic social groove balancing upscale VIP bottle service and rhythmic dance transition.',
      detectedKeywords: [...foundHigh, ...foundLounge].slice(0, 4),
    };
  }
}
