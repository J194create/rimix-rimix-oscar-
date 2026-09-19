import React, { useMemo, useState, useRef, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, Flame, History, Activity, Mic, MicOff, Wand2, 
  CheckCircle2, Camera, Volume2, AlertCircle, Play, Square, Eraser
} from 'lucide-react';
import { PRESET_INPUTS } from '../presets';
import { analyzeEnergyLevel } from '../utils/sentiment';

interface InputTerminalProps {
  rawInput: string;
  setRawInput: (value: string | ((prev: string) => string)) => void;
  onGenerate: () => void;
  isLoading: boolean;
  selectedPresetId: string | null;
  onSelectPreset: (id: string, text: string) => void;
  onOpenHistory?: () => void;
  historyCount?: number;
  cleanedVoiceDraft?: string;
  onOpenVisionStudio?: () => void;
}

export const InputTerminal: React.FC<InputTerminalProps> = ({
  rawInput,
  setRawInput,
  onGenerate,
  isLoading,
  selectedPresetId,
  onSelectPreset,
  onOpenHistory,
  historyCount = 0,
  onOpenVisionStudio,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Recording seconds counter
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
      setInterimTranscript('');
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Real-time sentiment / energy analysis of raw input
  const energyAnalysis = useMemo(() => {
    return analyzeEnergyLevel(rawInput);
  }, [rawInput]);

  // Real-time Voice Command detection & cleaner preview
  const voiceDetection = useMemo(() => {
    const text = rawInput.trim();
    if (!text) return { isVoice: false, cleaned: '' };
    const fillers = /\b(uh+|um+|er+|yeah\s+so\s+basically|basically|like,\s*you\s*know|system,\s*create|system\s*create|please\s*create|hey\s*system)\b/gi;
    const hasFillers = fillers.test(text);
    const cleaned = text
      .replace(fillers, '')
      .replace(/^[,.:;\s]+/, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    return {
      isVoice: hasFillers || text.toLowerCase().includes('system') || text.toLowerCase().includes('uh,'),
      cleaned: cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : text,
    };
  }, [rawInput]);

  // Web Speech API Voice-to-Prompt implementation
  const toggleVoiceToPrompt = () => {
    setSpeechError(null);

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setSpeechError('Web Speech API not supported in this browser. Loaded voice command note.');
      setRawInput(
        "Uh, system, create a brochure and screen banner for Saturday night. It's the Obsidian Velvet party with DJ Alex. Ladies get free entry until 11 PM, VIP tables open, dress code is ultra smart."
      );
      return;
    }

    if (isRecording) {
      // Stop recording
      try {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      } catch (e) {
        console.error(e);
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let finalTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        setInterimTranscript(interim);

        if (finalTrans.trim()) {
          setRawInput((prev: string) => {
            const separator = prev && !prev.endsWith(' ') ? ' ' : '';
            return prev + separator + finalTrans.trim();
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission blocked. Loaded test prompt.');
          setRawInput(
            "Uh, system, create a brochure and screen banner for Saturday night. It's the Obsidian Velvet party with DJ Alex. Ladies get free entry until 11 PM, VIP tables open, dress code is ultra smart."
          );
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Speech error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error('Speech initialization error:', err);
      setSpeechError('Microphone unavailable. Loaded sample prompt.');
      setRawInput(
        "Uh, system, create a brochure and screen banner for Saturday night. It's the Obsidian Velvet party with DJ Alex. Ladies get free entry until 11 PM, VIP tables open, dress code is ultra smart."
      );
      setIsRecording(false);
    }
  };

  const handleCleanSpeechFillers = () => {
    if (voiceDetection.cleaned) {
      setRawInput(voiceDetection.cleaned);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section className="relative rounded-2xl bg-gradient-to-b from-[#111116] to-[#0a0a0d] border border-[#23232c] p-5 sm:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
      {/* Decorative top ambient glow */}
      <div className="absolute -top-10 left-1/4 w-72 h-20 bg-[#d4af37]/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-10 right-1/4 w-72 h-20 bg-[#00f0ff]/8 blur-3xl pointer-events-none rounded-full" />

      <div className="flex flex-col gap-4">
        {/* Terminal Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#d4af37] shadow-[0_0_10px_#d4af37]" />
            <h2 className="font-display text-sm uppercase tracking-[0.2em] font-semibold text-[#f0e6cb]">
              Daily Venue Input Terminal
            </h2>
            <span className="text-[11px] text-[#78788a] font-normal">
              (Voice transcripts, short notes, VIP offers, DJ lineups)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Reference Image & OCR Button */}
            {onOpenVisionStudio && (
              <button
                type="button"
                id="btn-open-vision-studio"
                onClick={onOpenVisionStudio}
                className="px-3 py-1 rounded-lg bg-[#090910] hover:bg-[#181824] border border-[#00f0ff]/40 text-[#00f0ff] hover:text-[#80f5ff] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Upload past flyer photos, venue interiors, or DJ headshots for OCR & style consistency"
              >
                <Camera className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>Reference Vision & OCR</span>
              </button>
            )}

            {/* Voice-to-Prompt Button */}
            <button
              type="button"
              id="btn-voice-to-prompt"
              onClick={toggleVoiceToPrompt}
              className={`flex items-center gap-2 px-3.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                isRecording
                  ? 'bg-red-950/80 border-red-500 text-red-200 shadow-[0_0_18px_rgba(239,68,68,0.5)] animate-pulse'
                  : 'bg-gradient-to-r from-[#171725] to-[#12121d] hover:from-[#222235] hover:to-[#1a1a2b] text-[#d4af37] border-[#d4af37]/40 hover:border-[#d4af37]'
              }`}
              title="Browser Web Speech API: Transcribes live venue manager voice notes directly into prompt"
            >
              {isRecording ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-red-400 text-red-400" />
                  <span className="flex items-center gap-1.5">
                    <span>Listening</span>
                    {/* Equalizer animation bars */}
                    <span className="flex items-center gap-0.5 h-3">
                      <span className="w-0.5 h-2 bg-red-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-0.5 h-3 bg-red-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-0.5 h-1.5 bg-red-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    <span className="font-mono text-[11px] text-red-300">{formatSeconds(recordingSeconds)}</span>
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Voice-to-Prompt</span>
                </>
              )}
            </button>

            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="text-xs text-[#baa466] hover:text-[#f7e7b4] flex items-center gap-1.5 transition-colors cursor-pointer bg-[#171722] hover:bg-[#20202e] px-2.5 py-1 rounded-md border border-[#29293a]"
              >
                <History className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>History ({historyCount})</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#a0a0b0] font-medium flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#ffaa00]" />
                Presets:
              </span>
            </div>
          </div>
        </div>

        {/* Speech Recognition Error Notice if any */}
        {speechError && (
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{speechError}</span>
            </div>
            <button
              onClick={() => setSpeechError(null)}
              className="text-[10px] text-amber-300/70 hover:text-amber-200 underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Presets Bar */}
        <div className="flex flex-wrap gap-2">
          {PRESET_INPUTS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            const isVoice = preset.id === 'voice-obsidian-velvet';
            return (
              <button
                key={preset.id}
                id={`preset-${preset.id}`}
                onClick={() => onSelectPreset(preset.id, preset.rawText)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#f7e7b4] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                    : isVoice
                    ? 'bg-[#181524] border border-[#a855f7]/40 text-[#d8b4fe] hover:border-[#a855f7]'
                    : 'bg-[#14141b] border border-[#22222d] text-[#9a9aa8] hover:text-[#e0e0ea] hover:border-[#353545]'
                }`}
              >
                <span>{preset.title}</span>
                {isVoice && (
                  <span className="text-[9px] bg-[#a855f7]/30 text-[#f3e8ff] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider">
                    Amharic Test
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Text Area with Live Energy & Voice Cleaner Indicator */}
        <div className="relative rounded-xl border border-[#272733] bg-[#0c0c10] focus-within:border-[#d4af37]/70 focus-within:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all">
          <textarea
            id="venue-input-textarea"
            rows={3}
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Enter raw venue notes or voice command transcript (e.g., 'Uh, system, create a brochure and screen banner for Saturday night. It\'s the Obsidian Velvet party with DJ Alex. Ladies get free entry until 11 PM, VIP tables open, dress code is ultra smart.')..."
            className="w-full bg-transparent p-4 text-sm text-[#f1f1f5] placeholder-[#5c5c6e] focus:outline-none resize-none font-sans leading-relaxed"
          />

          {/* Voice Command Cleaner Live Detection Banner */}
          {voiceDetection.isVoice && (
            <div className="mx-4 mb-2 p-2.5 rounded-lg bg-gradient-to-r from-[#171226] to-[#0f0c1a] border border-[#a855f7]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Wand2 className="w-3.5 h-3.5 text-[#c084fc] shrink-0" />
                <span className="font-semibold text-[#e9d5ff]">
                  Voice Command Parser Active:
                </span>
                <span className="text-[#a8a29e] hidden sm:inline">
                  Fillers parsed & dates resolved.
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#d8b4fe]">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Cleaned Draft: &ldquo;{voiceDetection.cleaned.slice(0, 40)}...&rdquo;</span>
                <button
                  type="button"
                  onClick={handleCleanSpeechFillers}
                  className="px-2 py-0.5 rounded bg-[#a855f7]/30 hover:bg-[#a855f7]/50 text-white font-medium transition-colors cursor-pointer border border-[#a855f7]/60"
                  title="Replace raw text with filler-free prompt"
                >
                  Apply Cleaned
                </button>
              </div>
            </div>
          )}

          {/* Sub-bar with characters, sentiment & energy indicator */}
          <div className="flex flex-wrap items-center justify-between border-t border-[#1a1a24] px-4 py-2 text-xs text-[#707080] gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span>{rawInput.length} characters</span>
              <span>•</span>
              <span>{rawInput.trim().split(/\s+/).filter(Boolean).length} words</span>

              {/* Real-time Energy Level indicator */}
              {rawInput.trim().length > 0 && (
                <>
                  <span className="text-[#3a3a4c]">•</span>
                  <div
                    id="energy-level-indicator"
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold transition-all ${energyAnalysis.badgeBg} ${energyAnalysis.badgeBorder} ${energyAnalysis.badgeText}`}
                    title={`AI Sentiment Check: ${energyAnalysis.summary} (Tempo: ${energyAnalysis.tempo})`}
                  >
                    <Activity className="w-3 h-3 animate-pulse" />
                    <span>Energy Level:</span>
                    <strong className="tracking-wide">{energyAnalysis.level}</strong>
                    <span className="text-[10px] opacity-75 hidden sm:inline">
                      ({energyAnalysis.tempo.split('/')[0].trim()})
                    </span>
                  </div>
                </>
              )}
            </div>

            {rawInput && (
              <button
                type="button"
                onClick={() => setRawInput('')}
                className="hover:text-[#d4af37] transition-colors cursor-pointer text-[11px]"
              >
                Clear input
              </button>
            )}
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-[#8e8e9e] flex items-center gap-1.5">
            <span className="text-[#00f0ff]">✦</span>
            Processes voice transcripts & expands prompts into 3 synchronized deliverables (English + አማርኛ).
          </p>

          <button
            id="btn-generate-deliverables"
            onClick={onGenerate}
            disabled={isLoading || !rawInput.trim()}
            className={`relative group flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              isLoading || !rawInput.trim()
                ? 'bg-[#1a1a22] text-[#606070] cursor-not-allowed border border-[#2a2a38]'
                : 'bg-gradient-to-r from-[#d4af37] via-[#e5c14d] to-[#b8952b] text-[#09090c] font-bold shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-[1.01]'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#09090c]" />
                <span>Synthesizing Nocturnal Campaign...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#09090c]" />
                <span>Generate Synchronized Deliverables</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
