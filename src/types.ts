export interface KeyDetails {
  date: string;
  time: string;
  djOrArtist: string;
  dressCode: string;
  rsvpInfo: string;
}

export interface SocialMediaPack {
  caption: string;
  amharicCaption?: string;
  keyDetails: KeyDetails;
  callToAction: string;
  hashtags: string[];
}

export interface DigitalScreenBanner {
  aspectRatio: string;
  eventName: string;
  prompt: string;
  visualsSummary: string;
  embeddedTextInstruction: string;
  motionPrompt?: string;
}

export interface DailyBrochureFlyer {
  headline: string;
  subheaders: string[];
  bodyCopy: string[];
  visualPrompt: string;
}

export interface MarketingDeliverables {
  eventId?: string;
  eventName: string;
  rawInput: string;
  cleanedVoiceInput?: string;
  promptExpanded?: boolean;
  amharicCaption?: string;
  motionPrompt?: string;
  socialMediaPack: SocialMediaPack;
  digitalScreenBanner: DigitalScreenBanner;
  dailyBrochureFlyer: DailyBrochureFlyer;
  vipTableOffer?: string;
  generatedAt: string;
}

export interface VisionStyleAnalysis {
  dominantColors: string[];
  lightingMood: string;
  typographyStyle: string;
  artisticVibe: string;
  imagen3Prompt: string;
  midjourneyPrompt: string;
}

export interface OcrExtraction {
  title: string;
  date: string;
  time: string;
  djOrArtist: string;
  offers: string;
  dressCode: string;
  rawExtractedText: string;
}

export interface ReferenceImageAnalysis {
  id: string;
  imageUrl: string;
  fileName: string;
  visualStyle: VisionStyleAnalysis;
  ocr: OcrExtraction;
  suggestedVenueInput: string;
}

export type TeamRole = 'manager' | 'creator' | 'designer';
export type ApprovalStatus = 'draft' | 'pending_approval' | 'approved';

export interface ApprovalLog {
  id: string;
  timestamp: string;
  role: TeamRole;
  action?: string;
  status?: ApprovalStatus;
  note: string;
}

export interface PublishingTask {
  id: string;
  title: string;
  targetTime: string;
  channel: 'instagram_story' | 'led_banner' | 'print_flyer' | 'vip_concierge' | 'doors_open';
  assignedRole: TeamRole;
  completed: boolean;
  notes: string;
}

export interface PresetVenueInput {
  id: string;
  title: string;
  category: string;
  rawText: string;
}
