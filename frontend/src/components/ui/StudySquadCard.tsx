import React, { useState } from 'react';
import { 
  Users, 
  Copy, 
  Check, 
  Crown, 
  Gift, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { Button } from './Button';

export interface SquadMember {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  role: 'leader' | 'member';
  weeklyXpContribution: number;
  isCurrentUser: boolean;
}

export interface StudySquadCardProps {
  squadId: string;
  squadName: string;
  inviteCode: string;
  memberCount: number;
  maxMembers?: number; // default 10
  currentWeeklyXp: number;
  targetWeeklyXp?: number; // default 5000
  chestTierUnlocked: 0 | 1 | 2 | 3; // 0: None, 1: Wood (1000), 2: Silver (2500), 3: Mega (5000)
  userContribution: number;
  minContributionRequired?: number; // default 100
  isChestClaimed?: boolean;
  members: SquadMember[];
  onClaimSquadChest?: (tier: number) => void;
  onInviteFriends?: () => void;
  isLoading?: boolean;
}

export const StudySquadCard: React.FC<StudySquadCardProps> = ({
  squadName,
  inviteCode,
  memberCount,
  maxMembers = 10,
  currentWeeklyXp,
  targetWeeklyXp = 5000,
  chestTierUnlocked,
  userContribution,
  minContributionRequired = 100,
  isChestClaimed = false,
  members,
  onClaimSquadChest,
  onInviteFriends,
  isLoading = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = Math.min(100, Math.round((currentWeeklyXp / targetWeeklyXp) * 100));
  const isEligible = userContribution >= minContributionRequired;
  const canClaim = chestTierUnlocked > 0 && isEligible && !isChestClaimed;

  // Find squad MVP
  const mvp = [...members].sort((a, b) => b.weeklyXpContribution - a.weeklyXpContribution)[0];

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-500/40 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-5 md:p-7 shadow-[0_8px_30px_rgba(99,102,241,0.2)]">
      {/* Background Team Lights */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Header: Squad Identity & Invite Code */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 shadow-3d-squad">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-600/40">
                Nhóm Học Tập Study Squad
              </span>
              <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                {memberCount}/{maxMembers} thành viên
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white mt-0.5">
              {squadName}
            </h3>
          </div>
        </div>

        {/* Invite Code Badge with Copy */}
        <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 p-1.5 pl-3 rounded-2xl">
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-slate-400">Mã Mời Nhóm</div>
            <div className="text-sm font-black font-mono tracking-wider text-indigo-300">
              {inviteCode}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer shadow-3d-squad active:shadow-none active:translate-y-[2px]"
            title="Sao chép mã mời"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collaborative Goal Milestone Bar */}
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-amber-400" />
            Mục tiêu tích lũy tuần của nhóm (5,000 XP)
          </span>
          <span className="text-sm font-black text-amber-300">
            {currentWeeklyXp.toLocaleString()} / {targetWeeklyXp.toLocaleString()} XP
          </span>
        </div>

        {/* Progress Track */}
        <div className="relative w-full h-3.5 bg-slate-900 rounded-full overflow-hidden mb-3 border border-slate-700">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 3 Milestone Chest Markers */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`p-2 rounded-xl border ${
            chestTierUnlocked >= 1 
              ? 'bg-amber-950/40 border-amber-600/50 text-amber-300' 
              : 'bg-slate-800/40 border-slate-700/50 text-slate-500'
          }`}>
            <span className="font-black block text-[11px]">Mốc 1 (1,000 XP)</span>
            <span className="text-[10px]">Rương Gỗ (+20 Coins)</span>
          </div>

          <div className={`p-2 rounded-xl border ${
            chestTierUnlocked >= 2 
              ? 'bg-slate-300/20 border-slate-400/50 text-slate-200' 
              : 'bg-slate-800/40 border-slate-700/50 text-slate-500'
          }`}>
            <span className="font-black block text-[11px]">Mốc 2 (2,500 XP)</span>
            <span className="text-[10px]">Rương Bạc (+50C & x2 XP)</span>
          </div>

          <div className={`p-2 rounded-xl border ${
            chestTierUnlocked >= 3 
              ? 'bg-yellow-500/20 border-yellow-400/60 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)] animate-pulse-subtle' 
              : 'bg-slate-800/40 border-slate-700/50 text-slate-500'
          }`}>
            <span className="font-black block text-[11px] text-yellow-400">Hòm Siêu Cấp (5,000 XP)</span>
            <span className="text-[10px]">Rương Vàng (+150C & Freeze)</span>
          </div>
        </div>
      </div>

      {/* Anti-Free-Riding Eligibility & Chest Claim */}
      <div className="rounded-2xl bg-slate-800/90 border border-slate-700 p-4 mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">Đóng góp của bạn tuần này:</span>
            <span className="text-sm font-black text-indigo-300">
              {userContribution.toLocaleString()} XP
            </span>
            {isEligible ? (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-600/40 flex items-center gap-1">
                <Check className="w-3 h-3" /> Đủ điều kiện nhận rương
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded-md border border-amber-600/40 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Cần tối thiểu {minContributionRequired} XP ({userContribution}/{minContributionRequired})
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Quy tắc công bằng: Thành viên cần đóng góp ít nhất 100 XP để cùng nhận quà rương với nhóm.
          </p>
        </div>

        <div>
          {isChestClaimed ? (
            <button
              disabled
              className="px-4 py-2 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Đã Nhận Quà Tuần
            </button>
          ) : canClaim ? (
            <Button
              variant="gold"
              size="md"
              isLoading={isLoading}
              onClick={() => onClaimSquadChest && onClaimSquadChest(chestTierUnlocked)}
              leftIcon={<Gift className="w-4 h-4" />}
              className="shadow-3d-gold font-black"
            >
              Mở Khóa Rương Cấp {chestTierUnlocked}!
            </Button>
          ) : (
            <button
              disabled
              className="px-4 py-2 rounded-2xl bg-slate-800 border border-slate-700 text-slate-500 text-xs font-bold"
            >
              {chestTierUnlocked === 0 ? 'Chưa mở mốc rương nào' : 'Chưa đủ điều kiện nhận'}
            </button>
          )}
        </div>
      </div>

      {/* Member Contribution Roster */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            Bảng Đóng Góp Thành Viên
          </span>
          {mvp && (
            <span className="text-xs text-yellow-400 font-bold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
              Squad MVP: {mvp.displayName} ({mvp.weeklyXpContribution} XP)
            </span>
          )}
        </div>

        <div className="space-y-2">
          {members.map((member, idx) => {
            const isLeader = member.role === 'leader';
            const isSquadMvp = mvp?.userId === member.userId;

            return (
              <div
                key={member.userId}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  member.isCurrentUser
                    ? 'bg-indigo-950/60 border-indigo-500/50'
                    : 'bg-slate-800/40 border-slate-700/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-center text-xs font-bold text-slate-500">
                    #{idx + 1}
                  </span>
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white overflow-hidden border border-slate-600">
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.displayName} className="w-full h-full object-cover" />
                      ) : (
                        member.displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    {isSquadMvp && (
                      <Crown className="w-3.5 h-3.5 text-yellow-400 absolute -top-1 -right-1" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${member.isCurrentUser ? 'text-indigo-300 font-black' : 'text-white'}`}>
                        {member.displayName}
                      </span>
                      {isLeader && (
                        <span className="text-[9px] uppercase font-black bg-amber-500 text-yellow-950 px-1.5 py-0.2 rounded">
                          Trưởng Nhóm
                        </span>
                      )}
                      {member.isCurrentUser && (
                        <span className="text-[9px] uppercase font-black bg-indigo-500 text-white px-1.5 py-0.2 rounded">
                          Bạn
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-amber-300">
                    {member.weeklyXpContribution.toLocaleString()} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
