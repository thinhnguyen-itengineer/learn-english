import React, { useState, useEffect } from 'react';
import { 
  X, 
  Coins, 
  Flame, 
  Trophy, 
  Edit3, 
  Check, 
  Sparkles, 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Shirt, 
  ShoppingBag,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { useProfileAndInventoryStore } from '../../services/useProfileAndInventoryStore';
import { useAvatarStore } from '../../services/useAvatarStore';
import { ModularAvatar } from './ModularAvatar';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFittingRoom: () => void;
  onOpenWardrobe: () => void;
}

const TITLE_OPTIONS = [
  'Tân binh Ngôn ngữ',
  'Học giả Anh ngữ',
  'Chiến thần Đấu 1v1',
  'Bậc thầy Ngữ pháp',
  'Thợ săn Từ vựng',
  'Kiện tướng Tốc độ',
  'Thần thoại Học đường'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenFittingRoom,
  onOpenWardrobe
}) => {
  const { 
    profile, 
    fetchProfile, 
    updateTitle, 
    updateBio, 
    transactions, 
    fetchTransactions, 
    loading 
  } = useProfileAndInventoryStore();

  const { activeConfig } = useAvatarStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'ledger'>('overview');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
      fetchTransactions(1, 25);
    }
  }, [isOpen, fetchProfile, fetchTransactions]);

  useEffect(() => {
    if (profile) {
      setBioInput(profile.bio || '');
      setSelectedTitle(profile.currentTitle || 'Tân binh Ngôn ngữ');
    }
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveBio = async () => {
    const success = await updateBio(bioInput);
    if (success) {
      setIsEditingBio(false);
      showToast('Đã cập nhật tiểu sử cá nhân!');
    }
  };

  const handleSelectTitle = async (title: string) => {
    setSelectedTitle(title);
    setIsEditingTitle(false);
    const success = await updateTitle(title);
    if (success) {
      showToast(`Đã thay đổi danh hiệu thành: "${title}"!`);
    }
  };

  if (!isOpen) return null;

  const avatarConfigToUse = profile?.avatarConfig || activeConfig;
  const skills = profile?.skillsMastery || {
    listeningScore: 78,
    readingScore: 85,
    writingScore: 64,
    speakingScore: 72
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black bg-gradient-to-r from-white via-indigo-200 to-emerald-300 bg-clip-text text-transparent">
                Hồ Sơ Cá Nhân & Avatar
              </h2>
              <p className="text-xs text-slate-400">
                Quản lý danh hiệu, chỉ số kỹ năng và lịch sử điểm thưởng Token
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Selector */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab('ledger')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'ledger'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Sổ cái Token
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast notification */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Check className="w-4 h-4" />
            {toastMessage}
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'overview' ? (
            <>
              {/* Hero Showcase Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-gradient-to-br from-slate-800/40 via-indigo-950/20 to-slate-900 border border-slate-800 p-6 rounded-3xl">
                {/* Left: Avatar Bust Stage */}
                <div className="md:col-span-4 flex flex-col items-center">
                  <div className="relative w-48 h-48 rounded-full bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-slate-900 border-2 border-indigo-500/40 p-2 shadow-2xl shadow-indigo-500/10 flex items-center justify-center overflow-hidden">
                    <ModularAvatar
                      config={avatarConfigToUse}
                      mode="bust"
                      size={180}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex gap-2 mt-4 w-full">
                    <button
                      onClick={onOpenWardrobe}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-indigo-300 hover:text-indigo-200 cursor-pointer"
                    >
                      <Shirt className="w-3.5 h-3.5" />
                      Tủ Đồ
                    </button>
                    <button
                      onClick={onOpenFittingRoom}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-xs font-black text-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Cửa Hàng
                    </button>
                  </div>
                </div>

                {/* Right: User Information & Bio */}
                <div className="md:col-span-8 flex flex-col justify-center space-y-4">
                  {/* User display name & title badge */}
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-black text-white">
                        {profile?.displayName || 'Người chơi'}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
                        Cấp {profile?.level || 1}
                      </span>
                    </div>

                    {/* Title Selector */}
                    <div className="relative mt-2">
                      {!isEditingTitle ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{selectedTitle}</span>
                          <button
                            onClick={() => setIsEditingTitle(true)}
                            className="text-slate-400 hover:text-white cursor-pointer ml-1"
                            title="Đổi danh hiệu"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-slate-800 border border-slate-700">
                          {TITLE_OPTIONS.map(title => (
                            <button
                              key={title}
                              onClick={() => handleSelectTitle(title)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                selectedTitle === title
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
                              }`}
                            >
                              {title}
                            </button>
                          ))}
                          <button
                            onClick={() => setIsEditingTitle(false)}
                            className="px-2 py-1 text-xs text-slate-400 hover:text-white"
                          >
                            Đóng
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3.5 relative">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-400">Tiểu sử (Bio)</span>
                      {!isEditingBio ? (
                        <button
                          onClick={() => setIsEditingBio(true)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <Edit3 className="w-3 h-3" /> Sửa
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setIsEditingBio(false)}
                            className="text-xs text-slate-400 hover:text-white cursor-pointer"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={handleSaveBio}
                            className="text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-2 py-0.5 rounded cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Lưu
                          </button>
                        </div>
                      )}
                    </div>

                    {!isEditingBio ? (
                      <p className="text-sm text-slate-300 italic">
                        {profile?.bio || 'Chưa có tiểu sử. Hãy viết vài dòng giới thiệu về bản thân!'}
                      </p>
                    ) : (
                      <textarea
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        maxLength={160}
                        rows={2}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                        placeholder="Nhập tiểu sử ngắn của bạn..."
                      />
                    )}
                  </div>

                  {/* Quick Stats Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-2.5 flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-medium">Số dư Token</div>
                        <div className="text-sm font-black text-amber-400">
                          {profile?.tokenBalance?.toLocaleString() || 0}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-2.5 flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                        <Flame className="w-4 h-4 fill-orange-400 text-orange-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-medium">Chuỗi Streak</div>
                        <div className="text-sm font-black text-orange-400">
                          {profile?.currentStreak || 0} ngày
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-2.5 flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Trophy className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-medium">Tổng XP</div>
                        <div className="text-sm font-black text-emerald-400">
                          {profile?.totalXp?.toLocaleString() || 0}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-2.5 flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-medium">Kỷ lục Streak</div>
                        <div className="text-sm font-black text-cyan-400">
                          {profile?.highestStreak || profile?.currentStreak || 0} ngày
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4-Skills Mastery & Anti-Inflation Daily Token Cap */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: 4-Skills Mastery Radar/Pill Bars */}
                <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-3xl space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Năng lực 4 Kỹ Năng Ngôn Ngữ
                  </h4>

                  <div className="space-y-3.5">
                    {/* Listening */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="flex items-center gap-1.5 text-sky-400">
                          <Headphones className="w-3.5 h-3.5" /> Nghe (Listening)
                        </span>
                        <span className="text-slate-200">{skills.listeningScore}/100</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-blue-400 rounded-full transition-all duration-500"
                          style={{ width: `${skills.listeningScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Reading */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <BookOpen className="w-3.5 h-3.5" /> Đọc (Reading)
                        </span>
                        <span className="text-slate-200">{skills.readingScore}/100</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${skills.readingScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Writing */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="flex items-center gap-1.5 text-amber-400">
                          <PenTool className="w-3.5 h-3.5" /> Viết (Writing)
                        </span>
                        <span className="text-slate-200">{skills.writingScore}/100</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
                          style={{ width: `${skills.writingScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Speaking */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="flex items-center gap-1.5 text-purple-400">
                          <Mic className="w-3.5 h-3.5" /> Nói (Speaking)
                        </span>
                        <span className="text-slate-200">{skills.speakingScore}/100</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-500"
                          style={{ width: `${skills.speakingScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Anti-Inflation Token Cap & Token Ledger Summary */}
                <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-3xl space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Coins className="w-4 h-4 text-amber-400" />
                      Hạn Ngạch Kiếm Token Hôm Nay
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Cơ chế chống lạm phát: Sau 600 tokens/ngày, tỷ lệ nhận thưởng sẽ giảm còn 20%.
                    </p>

                    <div className="mt-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-300">Đã tích lũy hôm nay:</span>
                        <span className="text-sm font-black text-amber-400">
                          {profile?.dailyTokensEarned || 0} / {profile?.dailyTokensCap || 600} 🪙
                        </span>
                      </div>

                      <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            (profile?.dailyTokensEarned || 0) >= (profile?.dailyTokensCap || 600)
                              ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              ((profile?.dailyTokensEarned || 0) / (profile?.dailyTokensCap || 600)) * 100
                            )}%`
                          }}
                        />
                      </div>

                      <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
                        <span>Reset lúc 00:00 UTC</span>
                        <span>Tổng đã kiếm trọn đời: {profile?.totalTokensEarned?.toLocaleString() || 0} 🪙</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('ledger')}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-400 hover:text-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <History className="w-4 h-4" />
                    Xem Chi Tiết Sổ Cái Token (Ledger)
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Token Ledger Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-amber-400" />
                    Lịch Sử Biến Động Số Dư (Token Ledger)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Mọi giao dịch nạp, thưởng game và thanh toán cửa hàng đều được ghi nhận bất biến
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                  Số dư hiện tại: {profile?.tokenBalance?.toLocaleString() || 0} 🪙
                </div>
              </div>

              {/* Ledger Table */}
              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto max-h-[50vh]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/90 text-slate-400 font-bold sticky top-0 border-b border-slate-700">
                      <tr>
                        <th className="p-3">Thời gian</th>
                        <th className="p-3">Hạng mục / Lý do</th>
                        <th className="p-3 text-right">Biến động</th>
                        <th className="p-3 text-right">Số dư sau GD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500">
                            Chưa có giao dịch nào được ghi nhận.
                          </td>
                        </tr>
                      ) : (
                        transactions.map((tx) => {
                          const isPositive = tx.amount > 0;
                          return (
                            <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                              <td className="p-3 text-slate-400 whitespace-nowrap">
                                {new Date(tx.createdAt).toLocaleString('vi-VN', {
                                  month: 'numeric',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="p-3">
                                <div className="font-semibold text-slate-200">{tx.description}</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                                  {tx.transactionType} {tx.sourceCategory ? `• ${tx.sourceCategory}` : ''}
                                </div>
                              </td>
                              <td className="p-3 text-right whitespace-nowrap font-black">
                                <span
                                  className={`inline-flex items-center gap-1 ${
                                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                                  }`}
                                >
                                  {isPositive ? (
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  ) : (
                                    <ArrowDownLeft className="w-3.5 h-3.5" />
                                  )}
                                  {isPositive ? `+${tx.amount}` : tx.amount} 🪙
                                </span>
                              </td>
                              <td className="p-3 text-right whitespace-nowrap font-bold text-slate-300">
                                {tx.balanceAfter.toLocaleString()} 🪙
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Avatar & Gamified Shop Subsystem v1.0
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
