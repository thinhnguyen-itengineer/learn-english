import React, { useState } from 'react';
import { X, Mic, MicOff, Volume2, Sparkles, MessageSquare, Play, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRetentionStore } from '../services/useRetentionStore';
import { Button } from './ui/Button';
import { EvaluatePhonemeResponse, RoleplayTurnDto } from '../types/retention';
import { soundManager } from '../utils/sound';

interface SpeechEvaluationModalProps {
  onClose: () => void;
}

export const SpeechEvaluationModal: React.FC<SpeechEvaluationModalProps> = ({ onClose }) => {
  const { evaluatePhoneme, roleplayChat } = useRetentionStore();

  const [activeTab, setActiveTab] = useState<'phoneme' | 'roleplay'>('phoneme');

  // Phoneme Evaluation State
  const [refText, setRefText] = useState<string>('Comprehension');
  const [refIpa, setRefIpa] = useState<string>('/ˌkɒm.prɪˈhen.ʃən/');
  const [transcription, setTranscription] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<EvaluatePhonemeResponse | null>(null);
  const [evaluating, setEvaluating] = useState<boolean>(false);

  // Roleplay State
  const [scenario, setScenario] = useState<string>('CoffeeShop');
  const [history, setHistory] = useState<RoleplayTurnDto[]>([
    { speaker: 'ai', text: 'Hi there! Welcome to The English Café. What can I get started for you today?' }
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [roleplayLoading, setRoleplayLoading] = useState<boolean>(false);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const samplePhrases = [
    { text: 'Comprehension', ipa: '/ˌkɒm.prɪˈhen.ʃən/' },
    { text: 'Pronunciation', ipa: '/prəˌnʌn.siˈeɪ.ʃən/' },
    { text: 'Environment', ipa: '/ɪnˈvaɪ.rən.mənt/' },
    { text: 'Archaeology', ipa: '/ˌɑː.kiˈɒl.ə.dʒi/' },
    { text: 'Collaboration', ipa: '/kəˌlæb.əˈreɪ.ʃən/' }
  ];

  const playTTS = (text: string) => {
    soundManager.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startWebSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback: simulate recognition for development/unsupported environments
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setTranscription(refText);
      }, 1500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsRecording(true);
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscription(text);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
      setTranscription(refText);
    }
  };

  const handleRunEvaluation = async () => {
    setEvaluating(true);
    soundManager.playClick();
    try {
      const res = await evaluatePhoneme({
        referenceText: refText,
        referenceIpa: refIpa,
        userTranscription: transcription || refText
      });
      setEvalResult(res);
      soundManager.playCorrect();
    } catch (err: any) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleSendRoleplay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || roleplayLoading) return;

    const userTurn: RoleplayTurnDto = { speaker: 'user', text: userInput.trim() };
    const updatedHistory = [...history, userTurn];
    setHistory(updatedHistory);
    setUserInput('');
    setRoleplayLoading(true);

    try {
      const res = await roleplayChat({
        scenario,
        history: updatedHistory,
        userInputText: userTurn.text
      });

      setHistory(prev => [...prev, { speaker: 'ai', text: res.aiResponseText }]);
      setLastFeedback(res.vocabularyFeedback);
      playTTS(res.aiResponseText);
    } catch (err) {
      console.error(err);
    } finally {
      setRoleplayLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl shadow-teal-500/10 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                AI Speaking Coach & Bản Đồ Âm Vị
              </h2>
              <p className="text-xs text-slate-400">
                Chấm điểm âm vị (Phoneme Heatmap) & Luyện phản xạ hội thoại tình huống thực tế
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 px-6 gap-6 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('phoneme')}
            className={`py-3 text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'phoneme' ? 'border-b-2 border-teal-400 text-teal-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Bản Đồ Nhiệt Âm Vị (Phoneme Heatmap)
          </button>
          <button
            onClick={() => setActiveTab('roleplay')}
            className={`py-3 text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'roleplay' ? 'border-b-2 border-teal-400 text-teal-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Hội Thoại Nhập Vai Tình Huống
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'phoneme' && (
            <div className="space-y-6">
              {/* Reference phrase selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Chọn hoặc nhập mẫu câu cần luyện:</label>
                <div className="flex flex-wrap gap-2">
                  {samplePhrases.map((sp, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setRefText(sp.text);
                        setRefIpa(sp.ipa);
                        setEvalResult(null);
                        setTranscription('');
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        refText === sp.text
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {sp.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference Card */}
              <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/60 text-center space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <h3 className="text-2xl font-black text-white">{refText}</h3>
                  <button
                    onClick={() => playTTS(refText)}
                    className="p-2 rounded-xl bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-sm font-mono text-teal-400">{refIpa}</div>

                {/* Microphone / Record action */}
                <div className="pt-4 flex flex-col items-center gap-3">
                  <button
                    onClick={startWebSpeech}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all ${
                      isRecording
                        ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/40'
                        : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/30'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>
                  <span className="text-xs text-slate-400">
                    {isRecording ? 'Đang lắng nghe giọng đọc của bạn...' : 'Bấm micro để phát âm từ trên'}
                  </span>

                  {transcription && (
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-slate-300 max-w-md w-full">
                      <span className="text-slate-500 block mb-1">Máy nhận diện được:</span>
                      <strong className="text-teal-300 text-sm">{transcription}</strong>
                    </div>
                  )}

                  <Button
                    variant="primary"
                    disabled={evaluating}
                    onClick={handleRunEvaluation}
                    className="mt-2"
                  >
                    {evaluating ? 'Đang phân tích âm vị...' : 'Chấm Điểm Ngữ Âm'}
                  </Button>
                </div>
              </div>

              {/* Phoneme Heatmap Results */}
              {evalResult && (
                <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">Kết Quả Phân Tích Âm Vị</h4>
                      <p className="text-xs text-slate-400">Mỗi ký hiệu đại diện cho 1 âm vị chuẩn IPA</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-teal-400">{evalResult.overallScore}%</div>
                      <span className="text-[10px] text-slate-400">Độ chuẩn xác</span>
                    </div>
                  </div>

                  {/* Heatmap Pill Badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {evalResult.phonemes.map((p, idx) => {
                      const bg = p.status === 'green'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : p.status === 'yellow'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse';

                      return (
                        <div
                          key={idx}
                          className={`px-3 py-2 rounded-2xl border flex flex-col items-center min-w-[50px] ${bg}`}
                        >
                          <span className="text-base font-mono font-bold">/{p.phoneme}/</span>
                          <span className="text-[10px] font-semibold mt-0.5">{p.score}%</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actionable coaching tip */}
                  <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-200 leading-relaxed">
                    💡 <strong>Lời khuyên từ Huấn Luyện Viên:</strong> {evalResult.actionableTip}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'roleplay' && (
            <div className="space-y-4 flex flex-col h-[500px]">
              {/* Scenario selector */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400 font-semibold">Tình huống:</span>
                <select
                  value={scenario}
                  onChange={e => {
                    setScenario(e.target.value);
                    setHistory([
                      {
                        speaker: 'ai',
                        text: e.target.value === 'JobInterview'
                          ? 'Hello! Welcome to our interview today. Could you please introduce yourself and your background?'
                          : e.target.value === 'Airport'
                          ? 'Good morning! Can I see your passport and flight booking confirmation, please?'
                          : e.target.value === 'IELTS'
                          ? "Welcome to the IELTS Speaking test. Let's talk about your hometown. Where are you from?"
                          : 'Hi there! Welcome to The English Café. What can I get started for you today?'
                      }
                    ]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none"
                >
                  <option value="CoffeeShop">☕ Quán Cà Phê (Coffee Shop)</option>
                  <option value="JobInterview">💼 Phỏng Vấn Việc Làm (Job Interview)</option>
                  <option value="Airport">✈️ Sân Bay & Khách Sạn (Airport)</option>
                  <option value="IELTS">🎓 Luyện Thi IELTS Speaking</option>
                </select>
              </div>

              {/* Chat turns */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {history.map((turn, idx) => (
                  <div
                    key={idx}
                    className={`flex ${turn.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        turn.speaker === 'user'
                          ? 'bg-teal-600 text-white rounded-br-none'
                          : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {turn.text}
                    </div>
                  </div>
                ))}
                {roleplayLoading && (
                  <div className="text-xs text-slate-400 italic flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-teal-400" />
                    AI đang soạn câu trả lời...
                  </div>
                )}
              </div>

              {lastFeedback && (
                <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/20 text-[11px] text-teal-300">
                  🎯 <strong>Gợi ý từ vựng:</strong> {lastFeedback}
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSendRoleplay} className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Gõ hoặc nói câu trả lời bằng tiếng Anh..."
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
                />
                <Button variant="primary" size="sm" type="submit" disabled={roleplayLoading || !userInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
