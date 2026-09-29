import React, { useState, useEffect } from 'react';
import { X, Users, Gift, Sparkles, Trophy, Plus, LogIn, Check, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRetentionStore } from '../services/useRetentionStore';
import { Button } from './ui/Button';
import { soundManager } from '../utils/sound';

interface StudySquadModalProps {
  onClose: () => void;
}

export const StudySquadModal: React.FC<StudySquadModalProps> = ({ onClose }) => {
  const { mySquad, loadSquad, createSquad, joinSquad, claimSquadReward, loading } = useRetentionStore();

  const [tab, setTab] = useState<'squad' | 'join' | 'create'>('squad');
  const [squadCodeInput, setSquadCodeInput] = useState<string>('');
  const [newSquadName, setNewSquadName] = useState<string>('');
  const [newSquadDesc, setNewSquadDesc] = useState<string>('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    loadSquad();
  }, [loadSquad]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimReward = async () => {
    soundManager.playClick();
    try {
      const res = await claimSquadReward();
      if (res.success) {
        soundManager.playCorrect();
        confetti({ particleCount: 90, spread: 80 });
      } else {
        soundManager.playWrong();
      }
      setActionMsg(res.message);
      setTimeout(() => setActionMsg(null), 4000);
    } catch (err: any) {
      setActionMsg(err.message);
      setTimeout(() => setActionMsg(null), 4000);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!squadCodeInput.trim()) return;
    try {
      await joinSquad({ squadCode: squadCodeInput.trim() });
      soundManager.playCorrect();
      setTab('squad');
    } catch (err: any) {
      soundManager.playWrong();
      setActionMsg(err.message);
      setTimeout(() => setActionMsg(null), 4000);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName.trim()) return;
    try {
      await createSquad({ name: newSquadName.trim(), description: newSquadDesc.trim() });
      soundManager.playCorrect();
      setTab('squad');
    } catch (err: any) {
      soundManager.playWrong();
      setActionMsg(err.message);
      setTimeout(() => setActionMsg(null), 4000);
    }
  };

  const goalXp = mySquad?.weeklyGoalXp || 5000;
  const currentXp = mySquad?.currentWeeklyXp || 0;
  const progressPercent = Math.min(100, Math.round((currentXp / goalXp) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl shadow-indigo-500/10 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Biệt Đội Học Tập (Study Squads)
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">5 - 10 Thành Viên</span>
              </h2>
              <p className="text-xs text-slate-400">
                Cùng nhau học tập, tích lũy 5,000 XP để mở Rương Siêu Cấp Nhóm hàng tuần
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

        {actionMsg && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 text-xs text-center font-medium">
            {actionMsg}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && !mySquad && (
            <div className="py-16 text-center text-slate-400 text-sm">
              Đang tải thông tin nhóm học tập...
            </div>
          )}

          {!mySquad && !loading && (
            <div className="space-y-6">
              <div className="flex border-b border-slate-800 gap-4">
                <button
                  onClick={() => setTab('join')}
                  className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    tab === 'join' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-4 h-4" /> Tham gia nhóm bằng Mã
                </button>
                <button
                  onClick={() => setTab('create')}
                  className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    tab === 'create' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" /> Tạo Biệt Đội Mới
                </button>
              </div>

              {tab === 'join' && (
                <form onSubmit={handleJoin} className="space-y-4 max-w-md mx-auto py-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-base font-bold text-white">Nhập Mã Biệt Đội (Squad Code)</h3>
                    <p className="text-xs text-slate-400">Hỏi bạn bè mã 6 ký tự để cùng cày điểm XP</p>
                  </div>

                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Ví dụ: IELTS9, SQUAD1"
                    value={squadCodeInput}
                    onChange={e => setSquadCodeInput(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white font-mono text-center tracking-widest text-lg uppercase focus:outline-none focus:border-indigo-500"
                  />

                  <Button variant="primary" type="submit" className="w-full">
                    Gia Nhập Biệt Đội
                  </Button>
                </form>
              )}

              {tab === 'create' && (
                <form onSubmit={handleCreate} className="space-y-4 max-w-md mx-auto py-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Tên Biệt Đội</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: The IELTS Overcomers"
                      value={newSquadName}
                      onChange={e => setNewSquadName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Mục tiêu / Mô tả nhóm</label>
                    <textarea
                      rows={3}
                      placeholder="Cùng nhau đạt 5,000 XP mỗi tuần để lấy Băng Bảo Vệ..."
                      value={newSquadDesc}
                      onChange={e => setNewSquadDesc(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <Button variant="primary" type="submit" className="w-full">
                    Tạo Nhóm & Mời Bạn Bè
                  </Button>
                </form>
              )}
            </div>
          )}

          {mySquad && (
            <div className="space-y-6">
              {/* Squad Header Card */}
              <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/60 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-white">{mySquad.name}</h3>
                    {mySquad.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{mySquad.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(mySquad.squadCode)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-indigo-300 transition-colors"
                    >
                      <span>Mã: {mySquad.squadCode}</span>
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-xs px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                      {mySquad.memberCount} / {mySquad.maxMembers} thành viên
                    </span>
                  </div>
                </div>

                {/* Progress bar to 5000 XP */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-amber-400" /> Mục tiêu Rương Siêu Cấp Tuần
                    </span>
                    <span className="font-extrabold text-white">
                      {currentXp.toLocaleString()} / {goalXp.toLocaleString()} XP ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Reward Claim Box */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-400">
                    Đóng góp của bạn: <span className="font-bold text-indigo-300">{mySquad.currentUserContributionXp} XP</span>{' '}
                    (Cần tối thiểu 100 XP để nhận quà)
                  </div>

                  <button
                    disabled={!mySquad.isEligibleForReward || mySquad.hasClaimedReward}
                    onClick={handleClaimReward}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      mySquad.hasClaimedReward
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : mySquad.isEligibleForReward
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {mySquad.hasClaimedReward ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Đã nhận quà tuần
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Mở Rương Siêu Cấp (+150 Xu & Freeze)
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Bảng Cống Hiến Thành Viên
                </h4>

                <div className="space-y-2">
                  {mySquad.members.map((m, idx) => (
                    <div
                      key={m.userId}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs transition-all ${
                        m.isCurrentUser
                          ? 'bg-indigo-950/40 border-indigo-500/40'
                          : 'bg-slate-800/40 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-[10px]">
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-200">{m.userName}</span>
                            {m.role === 'Leader' && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Trưởng nhóm
                              </span>
                            )}
                            {idx === 0 && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-0.5">
                                <Trophy className="w-2.5 h-2.5" /> MVP
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {m.hasReachedThreshold ? 'Đã đạt chỉ tiêu 100 XP' : 'Chưa đủ 100 XP'}
                          </span>
                        </div>
                      </div>

                      <div className="font-extrabold text-white text-sm">
                        {m.weeklyXp.toLocaleString()} <span className="text-xs text-indigo-400 font-normal">XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
