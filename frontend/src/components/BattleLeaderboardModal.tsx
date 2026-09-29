import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { BattleLeaderboardResponse, RankTier, RankDivision } from '../types/game';
import { PodiumLeaderboard, LeaderboardItem, SeasonInfo } from './ui/PodiumLeaderboard';

export interface BattleLeaderboardModalProps {
  onClose: () => void;
  onPlayBattle: () => void;
}

export const BattleLeaderboardModal: React.FC<BattleLeaderboardModalProps> = ({
  onClose,
  onPlayBattle,
}) => {
  const [data, setData] = useState<BattleLeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'Season' | 'AllTime'>('Season');

  const fetchLeaderboard = async (tab: 'Season' | 'AllTime') => {
    try {
      setIsLoading(true);
      const res = await api.getBattleLeaderboard(tab, 1, 100);
      setData(res);
    } catch (err) {
      console.error('Failed to fetch battle leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab]);

  // Map API items to PodiumLeaderboard items
  const items: LeaderboardItem[] = (data?.items || []).map((item) => ({
    rankPosition: item.rankPosition,
    userId: item.userId,
    displayName: item.displayName,
    avatarUrl: item.avatarUrl,
    tier: (item.tier as RankTier) || 'Bronze',
    division: (item.division as RankDivision) || 'III',
    trophy: item.trophy,
    winRate: item.winRate,
    winStreak: item.winStreak,
    isCurrentUser: data?.myRank?.userId === item.userId,
  }));

  const myRankItem: LeaderboardItem | null = data?.myRank
    ? {
        rankPosition: data.myRank.rankPosition,
        userId: data.myRank.userId,
        displayName: data.myRank.displayName,
        avatarUrl: data.myRank.avatarUrl,
        tier: (data.myRank.tier as RankTier) || 'Bronze',
        division: (data.myRank.division as RankDivision) || 'III',
        trophy: data.myRank.trophy,
        winRate: data.myRank.winRate,
        winStreak: data.myRank.winStreak,
        isCurrentUser: true,
      }
    : null;

  const seasonInfo: SeasonInfo | undefined = data?.season
    ? {
        name: data.season.name,
        seasonNumber: data.season.seasonNumber,
        daysRemaining: data.season.daysRemaining,
      }
    : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-y-auto flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-20 cursor-pointer"
          title="Đóng bảng xếp hạng"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoading && !data ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            <span className="text-sm font-bold">Đang tải bảng xếp hạng đấu thủ...</span>
          </div>
        ) : (
          <PodiumLeaderboard
            items={items}
            myRank={myRankItem}
            season={seasonInfo}
            activeTab={activeTab}
            onTabChange={(newTab) => setActiveTab(newTab)}
            onPlayBattleClick={() => {
              onClose();
              onPlayBattle();
            }}
          />
        )}
      </div>
    </div>
  );
};
