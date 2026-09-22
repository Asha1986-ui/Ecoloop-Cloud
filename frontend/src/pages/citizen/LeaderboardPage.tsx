import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Flame, 
  MapPin, 
  Sparkles, 
  Coins, 
  Recycle,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { impactService } from '../../services';
import { LeaderboardEntry } from '../../types';

export const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'overall' | 'monthly' | 'weekly'>('overall');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await impactService.getLeaderboard(timeframe);
        setLeaderboard(data);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [timeframe]);

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-200" />
              Municipal Recycling Champions
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Community Eco-Leaderboard
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base">
              Celebrate your neighborhood's top recyclers. Climb the municipal ranks by scheduling regular doorstep pickups and verifying clean PET plastic.
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="bg-black/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex items-center gap-1 self-start md:self-center">
            {(['weekly', 'monthly', 'overall'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-all ${
                  timeframe === tf
                    ? 'bg-white text-emerald-900 shadow-md font-bold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 h-64 animate-pulse border border-gray-100"></div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-8 h-80 animate-pulse border border-gray-100"></div>
        </div>
      ) : (
        <>
          {/* Podium for Top 3 */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
              {/* Silver (Rank 2) */}
              {topThree[1] && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col items-center text-center relative order-2 md:order-1 hover:border-slate-400 transition-all">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center -mt-12 shadow-md">
                    <Medal className="w-7 h-7 text-slate-500" />
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    Rank #2
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg mt-3 flex items-center gap-1.5">
                    {topThree[1].name}
                    {topThree[1].isCurrentUser && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">YOU</span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {topThree[1].city}
                  </p>
                  <div className="w-full mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-xs text-gray-400">Bottles</p>
                      <p className="font-extrabold text-gray-800 text-sm">{topThree[1].bottlesRecycled}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">EcoCredits</p>
                      <p className="font-extrabold text-emerald-600 text-sm">+{topThree[1].ecoCreditsEarned}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Gold (Rank 1) */}
              {topThree[0] && (
                <div className="bg-gradient-to-b from-amber-50/70 via-white to-white rounded-2xl border-2 border-amber-300 p-7 shadow-lg flex flex-col items-center text-center relative order-1 md:order-2 hover:border-amber-400 transition-all scale-105 z-10">
                  <div className="w-16 h-16 rounded-full bg-amber-400 border-4 border-white flex items-center justify-center -mt-14 shadow-xl text-white">
                    <Crown className="w-9 h-9 text-white drop-shadow-sm" />
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                    🏆 Champion #1
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-xl mt-3 flex items-center gap-1.5">
                    {topThree[0].name}
                    {topThree[0].isCurrentUser && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">YOU</span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" /> {topThree[0].city}
                  </p>
                  <div className="w-full mt-5 pt-4 border-t border-amber-100 grid grid-cols-2 gap-2 text-center bg-amber-50/50 rounded-xl p-3">
                    <div>
                      <p className="text-xs text-amber-900/70 font-semibold">Bottles Recycled</p>
                      <p className="font-extrabold text-gray-900 text-base">{topThree[0].bottlesRecycled}</p>
                    </div>
                    <div>
                      <p className="text-xs text-amber-900/70 font-semibold">EcoCredits</p>
                      <p className="font-extrabold text-emerald-700 text-base">+{topThree[0].ecoCreditsEarned}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bronze (Rank 3) */}
              {topThree[2] && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col items-center text-center relative order-3 md:order-3 hover:border-amber-700/40 transition-all">
                  <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-600/40 flex items-center justify-center -mt-12 shadow-md">
                    <Medal className="w-7 h-7 text-amber-700" />
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    Rank #3
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg mt-3 flex items-center gap-1.5">
                    {topThree[2].name}
                    {topThree[2].isCurrentUser && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">YOU</span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {topThree[2].city}
                  </p>
                  <div className="w-full mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-xs text-gray-400">Bottles</p>
                      <p className="font-extrabold text-gray-800 text-sm">{topThree[2].bottlesRecycled}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">EcoCredits</p>
                      <p className="font-extrabold text-emerald-600 text-sm">+{topThree[2].ecoCreditsEarned}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Municipal Roster</h2>
              <p className="text-sm text-gray-500">Continuous scoring based on audited PET plastic verification.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                    <th className="py-4 px-6">Rank</th>
                    <th className="py-4 px-6">Citizen</th>
                    <th className="py-4 px-6">City / Ward</th>
                    <th className="py-4 px-6 text-right">Bottles Verified</th>
                    <th className="py-4 px-6 text-right">Plastic (kg)</th>
                    <th className="py-4 px-6 text-right">EcoCredits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.userId}
                      className={`transition-colors ${
                        entry.isCurrentUser
                          ? 'bg-emerald-50/70 font-semibold text-emerald-950'
                          : 'hover:bg-gray-50/60 text-gray-700'
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              entry.rank === 1
                                ? 'bg-amber-400 text-white'
                                : entry.rank === 2
                                ? 'bg-slate-300 text-slate-800'
                                : entry.rank === 3
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {entry.rank}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                            {entry.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-gray-900 font-semibold">{entry.name}</span>
                            {entry.isCurrentUser && (
                              <span className="ml-2 text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold tracking-wider">
                                YOU
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        <span className="flex items-center gap-1.5 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {entry.city}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-gray-900">
                        {entry.bottlesRecycled.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right text-gray-600">
                        {entry.plasticWeightKg.toFixed(2)} kg
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-emerald-600">
                        +{entry.ecoCreditsEarned.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default LeaderboardPage;
