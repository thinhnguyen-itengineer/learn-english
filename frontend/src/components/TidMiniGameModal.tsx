import React, { useState, useEffect } from 'react';
import { X, Trophy, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from './ui/Button';
import { DictationDashCard, DictationFormField } from './ui/DictationDashCard';
import { SkimScanCard, TfnAnswer } from './ui/SkimScanCard';
import { CollocationSatelliteCard, CollocationOption } from './ui/CollocationSatelliteCard';
import { MinimalPairsCard, MinimalPairOption } from './ui/MinimalPairsCard';
import { soundManager } from '../utils/sound';

interface TidMiniGameModalProps {
  gameCode: string;
  onClose: () => void;
  onComplete: (score: number, xpEarned: number) => void;
}

export const TidMiniGameModal: React.FC<TidMiniGameModalProps> = ({
  gameCode,
  onClose,
  onComplete,
}) => {
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  // 1. Dictation Dash state
  const [dictationPlays, setDictationPlays] = useState<number>(0);
  const [dictationIsPlaying, setDictationIsPlaying] = useState<boolean>(false);
  const [dictationTimeLeft, setDictationTimeLeft] = useState<number>(45);
  const [dictationSubmitted, setDictationSubmitted] = useState<boolean>(false);
  const [dictationFields, setDictationFields] = useState<DictationFormField[]>([
    {
      id: 'guest_name',
      label: 'Tên khách hàng (Customer Name):',
      placeholder: 'Gõ họ tên đã nghe...',
      userValue: '',
      correctValue: 'Arthur Pendleton',
      hint: 'Nghe kỹ cách đánh vần họ: P-E-N-D-L-E-T-O-N',
      status: 'idle',
    },
    {
      id: 'phone_number',
      label: 'Số điện thoại liên hệ (Phone):',
      placeholder: 'Gõ số điện thoại...',
      userValue: '',
      correctValue: '07945821903',
      hint: 'Số điện thoại di động Anh gồm 11 chữ số',
      status: 'idle',
    },
    {
      id: 'room_type',
      label: 'Loại phòng (Room Type):',
      placeholder: 'Gõ loại phòng...',
      userValue: '',
      correctValue: 'Deluxe Suite',
      hint: 'Phòng cao cấp hướng nhìn ra biển',
      status: 'idle',
    },
  ]);

  // 2. Skim & Scan Sprint state
  const [skimAnswered, setSkimAnswered] = useState<boolean>(false);
  const [selectedTfn, setSelectedTfn] = useState<TfnAnswer | undefined>(undefined);

  // 3. Collocation Chain state
  const [collocationAnswered, setCollocationAnswered] = useState<boolean>(false);
  const [selectedCollocationId, setSelectedCollocationId] = useState<string | undefined>(undefined);
  const [collocationCombo, setCollocationCombo] = useState<number>(1.5);

  // 4. Minimal Pairs state
  const [minimalPairsAnswered, setMinimalPairsAnswered] = useState<boolean>(false);
  const [selectedPairId, setSelectedPairId] = useState<string | undefined>(undefined);
  const [pairAudioPlaying, setPairAudioPlaying] = useState<boolean>(false);
  const [pairTimeLeft, setPairTimeLeft] = useState<number>(8);

  // Timer for Dictation Dash
  useEffect(() => {
    if (gameCode !== 'DICTATION_DASH' || dictationSubmitted || isFinished) return;
    const timer = setInterval(() => {
      setDictationTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleDictationSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameCode, dictationSubmitted, isFinished]);

  // Timer for Minimal Pairs
  useEffect(() => {
    if (gameCode !== 'MINIMAL_PAIRS' || minimalPairsAnswered || isFinished) return;
    const timer = setInterval(() => {
      setPairTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameCode, minimalPairsAnswered, isFinished]);

  // Dictation Audio Simulation
  const handlePlayDictationAudio = () => {
    if (dictationPlays >= 2 || dictationIsPlaying) return;
    setDictationIsPlaying(true);
    setDictationPlays((p) => p + 1);

    const speech = new SpeechSynthesisUtterance(
      "Good morning, Sunrise Hotel reservations. My name is Arthur Pendleton. That's P-E-N-D-L-E-T-O-N. My mobile number is 07945821903. I'd like to book a Deluxe Suite for two nights."
    );
    speech.lang = 'en-GB';
    speech.rate = 0.9;
    speech.onend = () => setDictationIsPlaying(false);
    speech.onerror = () => setDictationIsPlaying(false);
    window.speechSynthesis.speak(speech);
  };

  const handleDictationFieldChange = (id: string, value: string) => {
    setDictationFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, userValue: value } : f))
    );
  };

  const handleDictationSubmit = () => {
    setDictationSubmitted(true);
    let correctCount = 0;
    const updated = dictationFields.map((f) => {
      const cleanUser = f.userValue.trim().toLowerCase().replace(/\s+/g, '');
      const cleanCorrect = (f.correctValue || '').trim().toLowerCase().replace(/\s+/g, '');
      const isRight = cleanUser.length > 0 && (cleanUser === cleanCorrect || cleanCorrect.includes(cleanUser));
      if (isRight) correctCount++;
      return {
        ...f,
        status: (isRight ? 'correct' : 'wrong') as 'correct' | 'wrong',
      };
    });
    setDictationFields(updated);

    const score = correctCount * 100;
    setFinalScore(score);
    if (correctCount > 0) {
      soundManager.playSuccess();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
      soundManager.playWrong();
    }
  };

  // Skim Scan handler
  const handleSelectTfn = (ans: TfnAnswer) => {
    if (skimAnswered) return;
    setSelectedTfn(ans);
    setSkimAnswered(true);
    const isCorrect = ans === 'TRUE';
    const score = isCorrect ? 200 : 0;
    setFinalScore(score);
    if (isCorrect) {
      soundManager.playSuccess();
      confetti({ particleCount: 60, spread: 70 });
    } else {
      soundManager.playWrong();
    }
  };

  // Collocation handler
  const handleSelectCollocation = (optionId: string) => {
    if (collocationAnswered) return;
    setSelectedCollocationId(optionId);
    setCollocationAnswered(true);
    const isCorrect = optionId === 'c1';
    const score = isCorrect ? 250 : 50;
    setFinalScore(score);
    if (isCorrect) {
      soundManager.playSuccess();
      confetti({ particleCount: 70, spread: 80 });
    } else {
      soundManager.playWrong();
    }
  };

  // Minimal pairs handler
  const handlePlayPairAudio = () => {
    setPairAudioPlaying(true);
    const speech = new SpeechSynthesisUtterance('sheep');
    speech.lang = 'en-US';
    speech.rate = 0.85;
    speech.onend = () => setPairAudioPlaying(false);
    speech.onerror = () => setPairAudioPlaying(false);
    window.speechSynthesis.speak(speech);
  };

  const handleSelectMinimalPair = (id: string) => {
    if (minimalPairsAnswered) return;
    setSelectedPairId(id);
    setMinimalPairsAnswered(true);
    const isCorrect = id === 'p1';
    const score = isCorrect ? 150 : 0;
    setFinalScore(score);
    if (isCorrect) {
      soundManager.playSuccess();
      confetti({ particleCount: 80, spread: 90 });
    } else {
      soundManager.playWrong();
    }
  };

  const handleFinishGame = () => {
    setIsFinished(true);
    const xp = Math.max(20, Math.round(finalScore / 2));
    onComplete(finalScore, xp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-20 w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all shadow-lg"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Game Content Switcher */}
        {!isFinished ? (
          <div>
            {gameCode === 'DICTATION_DASH' && (
              <div className="space-y-4">
                <DictationDashCard
                  formTitle="Phiếu Đặt Phòng: Sunrise Hotel"
                  formSubtitle="IELTS Listening Section 1: Note & Form Completion (TID Inspired)"
                  scenario="Bạn hãy lắng nghe cuộc điện thoại đặt phòng khách sạn và hoàn thành các thông tin còn thiếu:"
                  audioPlayCount={dictationPlays}
                  maxAudioPlays={2}
                  isPlayingAudio={dictationIsPlaying}
                  timeLeft={dictationTimeLeft}
                  totalTime={45}
                  fields={dictationFields}
                  isSubmitted={dictationSubmitted}
                  onPlayAudio={handlePlayDictationAudio}
                  onFieldChange={handleDictationFieldChange}
                  onSubmit={handleDictationSubmit}
                  onNext={handleFinishGame}
                />
                {dictationSubmitted && (
                  <div className="flex justify-end">
                    <Button variant="emerald" size="lg" onClick={handleFinishGame}>
                      Hoàn thành & Xem Kết Quả (+{finalScore} Điểm)
                    </Button>
                  </div>
                )}
              </div>
            )}

            {gameCode === 'SKIM_SCAN_SPRINT' && (
              <div className="space-y-4">
                <SkimScanCard
                  topic="Khoa học Môi trường (Environmental Science)"
                  passageText="Honeybees communicate the location of floral resources through a specialized sequence of movements known as the waggle dance. By running in a figure-eight pattern and vibrating their abdomen, the duration of the central waggle run correlates directly to the distance of the food source, with one second indicating approximately one kilometer."
                  wordCount={52}
                  statement="The longer the waggle run lasts, the further away the food source is located."
                  selectedAnswer={selectedTfn}
                  correctAnswer="TRUE"
                  evidenceSentence="the duration of the central waggle run correlates directly to the distance of the food source"
                  explanationVi="Đoạn văn nêu rõ: 'the duration of the central waggle run correlates directly to the distance of the food source' (thời lượng tỷ lệ thuận trực tiếp với khoảng cách). Do đó nhận định này hoàn toàn đúng (TRUE)."
                  isAnswered={skimAnswered}
                  onSelectAnswer={handleSelectTfn}
                  onNextQuestion={handleFinishGame}
                />
                {skimAnswered && (
                  <div className="flex justify-end">
                    <Button variant="emerald" size="lg" onClick={handleFinishGame}>
                      Hoàn tất ván đọc (+{finalScore} Điểm)
                    </Button>
                  </div>
                )}
              </div>
            )}

            {gameCode === 'COLLOCATION_CHAIN' && (
              <div className="space-y-4">
                <CollocationSatelliteCard
                  coreWord="RESEARCH"
                  coreWordType="Noun (Danh từ học thuật)"
                  targetCollocation="Conduct research"
                  exampleSentence="The university is planning to conduct extensive research into renewable energy sources."
                  meaningVi="Tiến hành nghiên cứu khoa học (Chuẩn mực học thuật C1/C2 thay vì dùng sai 'make research')"
                  options={[
                    { id: 'c1', word: 'Conduct', isCorrect: true },
                    { id: 'c2', word: 'Make', isCorrect: false },
                    { id: 'c3', word: 'Create', isCorrect: false },
                    { id: 'c4', word: 'Perform', isCorrect: false },
                  ]}
                  selectedOptionId={selectedCollocationId}
                  comboMultiplier={collocationCombo}
                  isAnswered={collocationAnswered}
                  onSelectOption={handleSelectCollocation}
                  onNext={handleFinishGame}
                />
                {collocationAnswered && (
                  <div className="flex justify-end">
                    <Button variant="emerald" size="lg" onClick={handleFinishGame}>
                      Hoàn thành ván ghép (+{finalScore} Điểm)
                    </Button>
                  </div>
                )}
              </div>
            )}

            {gameCode === 'MINIMAL_PAIRS' && (
              <div className="space-y-4">
                <MinimalPairsCard
                  phoneticFocus="/iː/ vs /ɪ/ (Long E vs Short I)"
                  targetOptionId="p1"
                  options={[
                    {
                      id: 'p1',
                      word: 'Sheep',
                      ipa: '/ʃiːp/',
                      meaningVi: 'Con cừu (Nguyên âm dài /iː/)',
                      isTargetWord: true,
                    },
                    {
                      id: 'p2',
                      word: 'Ship',
                      ipa: '/ʃɪp/',
                      meaningVi: 'Con tàu (Nguyên âm ngắn /ɪ/)',
                      isTargetWord: false,
                    },
                  ]}
                  selectedOptionId={selectedPairId}
                  isPlayingAudio={pairAudioPlaying}
                  timeLeft={pairTimeLeft}
                  totalTime={8}
                  streakCount={3}
                  isAnswered={minimalPairsAnswered}
                  onPlayAudio={handlePlayPairAudio}
                  onSelectOption={handleSelectMinimalPair}
                  onNext={handleFinishGame}
                />
                {minimalPairsAnswered && (
                  <div className="flex justify-end">
                    <Button variant="emerald" size="lg" onClick={handleFinishGame}>
                      Hoàn tất ván đấu âm (+{finalScore} Điểm)
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Finished Celebration Card */
          <div className="rounded-3xl bg-slate-900 border-2 border-emerald-500/50 p-8 text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Xuất Sắc! Hoàn Thành Thử Thách</h3>
              <p className="mt-1 text-sm text-slate-300">
                Tiến độ kỹ năng của bạn đã được cập nhật thành công vào Cổng 4 Kỹ Năng.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-xs text-slate-400 block">Điểm đạt được</span>
                <span className="text-2xl font-black text-amber-400 font-mono">+{finalScore}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-xs text-slate-400 block">Kinh nghiệm XP</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  +{Math.max(20, Math.round(finalScore / 2))} XP
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Button variant="primary" size="lg" onClick={onClose}>
                Quay Lại Cổng 4 Kỹ Năng
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
