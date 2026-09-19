import { MarketingDeliverables } from '../types';

export interface PromptTemplateItem {
  id: string;
  name: string;
  ratio: '16:9' | '3:4' | '9:16';
  targetDevice: string;
  bestFor: string;
  prompt: string;
  negativePrompt: string;
  parameters: string;
}

/**
 * Structured Image Prompt Templates for AI Generators (Imagen 3, Midjourney v6, Flux.1)
 * Adheres strictly to the user specifications and OSCAR Club nocturnal luxury aesthetic.
 */
export function getStructuredPromptTemplates(deliverables: MarketingDeliverables): PromptTemplateItem[] {
  const eventName = deliverables.eventName.toUpperCase();

  return [
    {
      id: 'led-16x9',
      name: '16:9 Stage LED Screen Banner',
      ratio: '16:9',
      targetDevice: 'Resolume Arena / Stage LED Matrix Wall / DJ Booth Backdrop',
      bestFor: 'Imagen 3, Midjourney v6, Flux.1 Schnell / Dev',
      prompt: `Photorealistic 16:9 widescreen LED banner for luxury nightclub OSCAR Club. Dark obsidian marble background, dramatic golden volumetric spotlights cutting through subtle smoke and haze, backlit VIP onyx bar with bottles of champagne, cyan and amber neon rim lights. Center text rendered in bold embossed metallic gold font reading 'OSCAR CLUB - ${eventName}'. Ultra-detailed 8K resolution, cinematic lighting.`,
      negativePrompt: 'blurry, low resolution, cheap neon signs, oversaturated rainbow colors, cartoon, flat illustration, distorted text, noisy compression, amateur photography.',
      parameters: '--ar 16:9 --style raw --v 6.0 --s 250',
    },
    {
      id: 'flyer-3x4',
      name: '3:4 Printable Flyer Background',
      ratio: '3:4',
      targetDevice: 'Commercial Print Shop / A4 Promo Posters / Table Tent Cards',
      bestFor: 'Imagen 3 Editorial, Midjourney v6, Adobe Firefly',
      prompt: `Vertical 3:4 aspect ratio print flyer background for an exclusive nightlife event. Deep obsidian black and brushed bronze stone backdrop with suspended gold dust particles and champagne bubbles. Top-down warm golden spotlight illuminating a crystal cocktail glass on a dark moody table, atmospheric depth of field, clear high-contrast negative space in top half reserved for typography.`,
      negativePrompt: 'watermark, random illegible text, low-res texture, cluttered top half, washed-out blacks, bright daylight, oversaturated colors.',
      parameters: '--ar 3:4 --style raw --v 6.0 --s 200',
    },
    {
      id: 'story-9x16',
      name: '9:16 Instagram / TikTok Story Motion Visual',
      ratio: '9:16',
      targetDevice: 'Instagram Stories / Reels / TikTok / WhatsApp Status',
      bestFor: 'Runway Gen-3, Luma Dream Machine, Kling 1.5, Imagen 3 Vertical',
      prompt: `Vertical 9:16 portrait video frame visual. Cinematic luxury lounge atmosphere inside OSCAR Club, dark polished surfaces, glowing amber LED strip lighting along velvet booths, floating golden light bokeh, high fashion, dark nocturnal aesthetics, ultra-detailed.`,
      negativePrompt: 'shaky camera, pixelation, daytime light, casual street attire, distorted human anatomy, glitchy artifacts.',
      parameters: '--ar 9:16 --motion 4 --fps 24 --camera push_in',
    },
  ];
}
