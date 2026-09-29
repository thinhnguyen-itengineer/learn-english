import React, { useState } from 'react';
import { 
  Mic, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Activity,
  Award,
  RefreshCw
} from 'lucide-react';
import { Button } from './Button';

export interface PhonemeToken {
  phoneme: string; // e.g. "ʃ", "iː", "s", "e", "l", "z"
  ipa: string;
  score: number; // 0 - 100
  feedback?: string; // e.g. "Âm gió /ʃ/ hơi yếu, cần chu môi tròn hơn"
}

export interface WordPhonemeBreakdown {
  word: string;
  phonemes: PhonemeToken[];
  wordScore: number;
}

export interface PhonemeHeatmapCardProps {
  targetPhrase: string;
  transcriptSpoken?: string;
  wordsBreakdown: WordPhonemeBreakdown[];
  overallScore: number;
  fluencyScore: number;
  pronunciationScore: number;
  grammarScore?: number;
  cefrLevel?: 'A2' | 'B1' | 'B2' | 'C1';
  onListenModel?: () => void;
  onRecordAgain?: () => void;
  isLoading?: boolean;
}

export const PhonemeHeatmapCard: React.FC<PhonemeHeatmapCardProps> = ({
  targetPhrase,
  transcriptSpoken,
  wordsBreakdown,
  overallScore,
  fluencyScore,
  pronunciationScore,
  grammarScore,
  cefrLevel = 'B2',
  onListenModel,
  onRecordAgain,
  isLoading = false,
}) => {
  const [selectedPhoneme, setSelectedPhoneme] = useState<PhonemeToken | null>(null);

  const getPhonemeColor = (score: number) => {
    if (score >= 85) {
      return {
        bg: 'bg-emerald-950/70 hover:bg-emerald-900',
        border: 'border-emerald-500/70',
        text: 'text-emerald-300',
        badge: 'bg-emerald-500 text-emerald-950',
      };
    }
    if (score >= 60) {
      return {
        bg: 'bg-amber-950/70 hover:bg-amber-900',
        border: 'border-amber-500/70',
        text: 'text-amber-300',
        badge: 'bg-amber-500 text-yellow-950',
      };
    }
    return {
      bg: 'bg-rose-950/70 hover:bg-rose-900',
      border: 'border-rose-500/70',
      text: 'text-rose-300',
      badge: 'bg-rose-500 text-white',
    };
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-rose-500/40 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-5 md:p-7 shadow-[0_8px_30px_rgba(244,63,94,0.2)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/40 shadow-3d-speaking">
            <Mic className="w-7 h-7 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-600/40">
                AI Speaking Coach
              </span>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-600/40">
                CEFR: {cefrLevel}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-white mt-0.5">
              Bản Đồ Nhiệt Âm Vị (Phoneme Heatmap)
            </h3>
          </div>
        </div>

        {/* Listen Model CTA */}
        <Button
          variant="outline"
          size="sm"
          onClick={onListenModel}
          leftIcon={<Volume2 className="w-4 h-4 text-rose-400" />}
        >
          Nghe Phát Âm Bản Xứ
        </Button>
      </div>

      {/* Target Phrase & Phoneme Breakdown Grid */}
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-5 mb-5">
        <div className="text-xs uppercase font-bold text-slate-400 mb-2">
          Câu mẫu luyện phát âm:
        </div>
        <p className="text-base md:text-lg font-black text-white mb-5 leading-relaxed">
          "{targetPhrase}"
        </p>

        {/* Word and Phoneme Chips */}
        <div className="flex flex-wrap items-start gap-4">
          {wordsBreakdown.map((wb, wIdx) => (
            <div key={wIdx} className="flex flex-col items-center bg-slate-900/80 rounded-2xl p-2.5 border border-slate-700/80">
              <span className="text-sm font-extrabold text-white mb-2">
                {wb.word}
              </span>

              {/* Phoneme badges */}
              <div className="flex items-center gap-1.5">
                {wb.phonemes.map((ph, pIdx) => {
                  const style = getPhonemeColor(ph.score);
                  const isSelected = selectedPhoneme?.phoneme === ph.phoneme && selectedPhoneme?.ipa === ph.ipa;

                  return (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setSelectedPhoneme(ph)}
                      className={`px-2 py-1 rounded-xl border-2 font-mono text-xs font-bold transition-all cursor-pointer ${style.bg} ${style.border} ${style.text} ${
                        isSelected ? 'scale-110 shadow-lg ring-2 ring-white/50' : ''
                      }`}
                      title={`Bấm xem hướng dẫn phát âm /${ph.ipa}/ (${ph.score}%)`}
                    >
                      /{ph.ipa}/
                    </button>
                  );
                })}
              </div>

              <span className="text-[10px] font-bold text-slate-400 mt-1.5">
                {wb.wordScore}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Phoneme Diagnostic Box */}
      {selectedPhoneme && (
        <div className="rounded-2xl bg-rose-950/40 border border-rose-500/50 p-4 mb-5 animate-pop-bounce flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 font-mono font-bold text-sm">
            /{selectedPhoneme.ipa}/
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-rose-300">
                Phân tích khẩu hình & âm vị:
              </span>
              <span className="text-xs font-bold text-rose-400">
                Độ chuẩn xác: {selectedPhoneme.score}%
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-200 mt-1">
              {selectedPhoneme.feedback || 'Âm vị được phát âm tốt, hãy duy trì độ vang và nhấn đúng trọng âm.'}
            </p>
          </div>
        </div>
      )}

      {/* Heatmap Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-5 text-xs font-bold text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          Xanh lá: Chuẩn bản xứ (≥85%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          Vàng: Tạm ổn (60% - 84%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          Đỏ: Cần chỉnh khẩu hình (&lt;60%)
        </span>
      </div>

      {/* Post-Session 4 Metric Scorecard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-3 text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Tổng Điểm</span>
          <span className="text-xl md:text-2xl font-black text-rose-400">{overallScore}%</span>
        </div>
        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-3 text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Độ Trôi Chảy (Fluency)</span>
          <span className="text-xl md:text-2xl font-black text-emerald-400">{fluencyScore}%</span>
        </div>
        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-3 text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Phát Âm (Pronunciation)</span>
          <span className="text-xl md:text-2xl font-black text-amber-400">{pronunciationScore}%</span>
        </div>
        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-3 text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Ngữ Pháp (Grammar)</span>
          <span className="text-xl md:text-2xl font-black text-sky-400">
            {grammarScore !== undefined ? `${grammarScore}%` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Record Again CTA */}
      <div className="flex justify-end">
        <Button
          variant="speaking"
          size="md"
          isLoading={isLoading}
          onClick={onRecordAgain}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="shadow-3d-speaking font-black"
        >
          Thu Âm Lại Lần Nữa
        </Button>
      </div>
    </div>
  );
};
