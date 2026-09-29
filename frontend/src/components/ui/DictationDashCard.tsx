import React, { useState } from 'react';
import { Volume2, RotateCcw, Check, X, Clock, HelpCircle, FileText, Send } from 'lucide-react';
import { Button } from './Button';

export interface DictationFormField {
  id: string;
  label: string;
  placeholder: string;
  userValue: string;
  correctValue?: string;
  hint?: string;
  status?: 'idle' | 'correct' | 'wrong';
}

export interface DictationDashCardProps {
  formTitle: string;
  formSubtitle?: string;
  scenario: string; // e.g. "Cuộc gọi đặt phòng khách sạn tại Oxford"
  audioPlayCount: number;
  maxAudioPlays: number;
  isPlayingAudio: boolean;
  timeLeft: number;
  totalTime: number;
  fields: DictationFormField[];
  isSubmitted: boolean;
  onPlayAudio: () => void;
  onFieldChange: (id: string, value: string) => void;
  onSubmit: () => void;
  onNext?: () => void;
  className?: string;
}

export const DictationDashCard: React.FC<DictationDashCardProps> = ({
  formTitle,
  formSubtitle = 'IELTS Listening Section 1: Note & Form Completion',
  scenario,
  audioPlayCount,
  maxAudioPlays = 2,
  isPlayingAudio,
  timeLeft,
  totalTime = 45,
  fields,
  isSubmitted,
  onPlayAudio,
  onFieldChange,
  onSubmit,
  onNext,
  className = '',
}) => {
  const remainingPlays = Math.max(0, maxAudioPlays - audioPlayCount);
  const timePercent = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));
  const isTimeCritical = timeLeft <= 10;

  return (
    <div
      className={`
        w-full max-w-2xl mx-auto rounded-3xl bg-slate-900/95 border-2 border-slate-800
        shadow-2xl overflow-hidden ${className}
      `}
    >
      {/* Top Header Bar */}
      <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-white">{formTitle}</h2>
            <p className="text-xs text-slate-400">{formSubtitle}</p>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} />
          <span
            className={`font-mono text-base font-black ${
              isTimeCritical ? 'text-rose-400 animate-pulse' : 'text-slate-200'
            }`}
          >
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </span>
        </div>
      </div>

      {/* Timer Progress Bar */}
      <div className="w-full h-1.5 bg-slate-950">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isTimeCritical ? 'bg-rose-500' : 'bg-sky-500'
          }`}
          style={{ width: `${timePercent}%` }}
        />
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Scenario Audio Player Bar */}
        <div className="rounded-2xl bg-slate-950/80 border border-sky-500/30 p-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
              Bối cảnh nghe:
            </span>
            <p className="text-xs md:text-sm font-semibold text-slate-200 mt-0.5">
              {scenario}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">
              Lượt nghe còn lại:{' '}
              <strong className="text-sky-300 font-mono">
                {remainingPlays}/{maxAudioPlays}
              </strong>
            </span>
            <Button
              variant="sky"
              size="sm"
              disabled={remainingPlays <= 0 || isPlayingAudio}
              onClick={onPlayAudio}
              leftIcon={<Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />}
            >
              {isPlayingAudio ? 'Đang phát...' : 'Nghe Audio'}
            </Button>
          </div>
        </div>

        {/* Paper Form Layout */}
        <div className="rounded-2xl bg-slate-950/90 border-2 border-slate-800 p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Official Application Form
            </span>
            <span className="text-xs font-medium text-slate-500 italic">
              * Điền chính xác keyword đã nghe
            </span>
          </div>

          <div className="space-y-4">
            {fields.map((field, idx) => {
              const isCorrect = field.status === 'correct';
              const isWrong = field.status === 'wrong';

              return (
                <div key={field.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={field.id}
                      className="text-xs md:text-sm font-bold text-slate-300 flex items-center gap-1.5"
                    >
                      <span className="text-slate-500 font-mono">0{idx + 1}.</span>
                      <span>{field.label}:</span>
                    </label>
                    {field.hint && (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" />
                        {field.hint}
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      id={field.id}
                      type="text"
                      disabled={isSubmitted}
                      value={field.userValue}
                      placeholder={field.placeholder}
                      onChange={(e) => onFieldChange(field.id, e.target.value)}
                      className={`
                        w-full px-4 py-2.5 rounded-xl font-mono text-sm font-bold text-white
                        bg-slate-900 border-2 transition-all outline-none
                        focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20
                        ${
                          isCorrect
                            ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300 pr-10'
                            : isWrong
                            ? 'border-rose-500 bg-rose-950/30 text-rose-300 pr-10'
                            : 'border-slate-700 hover:border-slate-600'
                        }
                      `}
                    />
                    {isCorrect && (
                      <Check className="w-5 h-5 text-emerald-400 absolute right-3 top-3" />
                    )}
                    {isWrong && (
                      <X className="w-5 h-5 text-rose-400 absolute right-3 top-3" />
                    )}
                  </div>

                  {/* Correction feedback */}
                  {isWrong && field.correctValue && (
                    <p className="text-xs text-rose-400 font-mono mt-1">
                      Đáp án đúng: <span className="font-bold underline">{field.correctValue}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {!isSubmitted ? (
            <Button
              variant="sky"
              size="lg"
              onClick={onSubmit}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Nộp Biểu Mẫu (Submit)
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={onNext}
            >
              Ván Tiếp Theo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
