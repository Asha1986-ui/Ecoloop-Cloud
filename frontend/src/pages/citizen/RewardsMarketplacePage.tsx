import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Search, 
  Coins, 
  ShieldCheck, 
  Ticket, 
  Bus, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  History,
  AlertCircle
} from 'lucide-react';
import { rewardService, walletService } from '../../services';
import { Reward, RedeemResult, RedemptionHistory, RewardCategory } from '../../types';
import Modal from '../../components/common/Modal';

const CATEGORIES: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: 'All Rewards', value: 'ALL', icon: Gift },
  { label: 'Grocery & Food', value: 'COUPON', icon: Ticket },
  { label: 'Public Transit', value: 'TRANSPORT', icon: Bus },
  { label: 'Utility Bills', value: 'UTILITY', icon: Zap },
  { label: 'Special Perks', value: 'SPECIAL', icon: Sparkles }
];

export const RewardsMarketplacePage: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionHistory[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'history'>('marketplace');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);
  const [redeemResult, setRedeemResult] = useState<RedeemResult | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rewardsData, walletData, redemptionsData] = await Promise.all([
        rewardService.getRewards(),
        walletService.getWallet(),
        rewardService.getMyRedemptions()
      ]);
      setRewards(rewardsData);
      setBalance(walletData.balance);
      setRedemptions(redemptionsData);
    } catch (err) {
      console.error('Failed to load marketplace data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenRedeemModal = (reward: Reward) => {
    setErrorMsg(null);
    setSelectedReward(reward);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    try {
      setIsRedeeming(true);
      setErrorMsg(null);
      const result = await rewardService.redeemReward(selectedReward.id);
      setRedeemResult(result);
      setSelectedReward(null);
      // Refresh balance & redemptions
      const [walletData, redemptionsData] = await Promise.all([
        walletService.getWallet(),
        rewardService.getMyRedemptions()
      ]);
      setBalance(walletData.balance);
      setRedemptions(redemptionsData);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to redeem reward. Please try again.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const filteredRewards = rewards.filter((r) => {
    const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: RewardCategory) => {
    switch (category) {
      case 'TRANSPORT': return <Bus className="w-5 h-5 text-blue-500" />;
      case 'UTILITY': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'SPECIAL': return <Sparkles className="w-5 h-5 text-purple-500" />;
      default: return <Ticket className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              EcoCredits Marketplace
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Turn Recycling into Real Perks
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base max-w-xl">
              Exchange your verified EcoCredits for discounted public transit tokens, grocery coupons, green energy subsidies, and municipal rewards.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-center gap-4 min-w-[240px]">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
              <Coins className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs text-emerald-100 uppercase tracking-wider font-medium">Your Available Balance</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">{balance.toLocaleString()}</span>
                <span className="text-xs text-emerald-200 font-semibold">Credits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'marketplace'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Gift className="w-4 h-4 text-emerald-600" />
            Browse Catalog
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <History className="w-4 h-4 text-emerald-600" />
            My Redemptions ({redemptions.length})
          </button>
        </div>

        {activeTab === 'marketplace' && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search rewards or brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        )}
      </div>

      {/* Content Area */}
      {activeTab === 'marketplace' ? (
        <div className="space-y-6">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Catalog Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4">
                  <div className="h-40 bg-gray-100 rounded-xl"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-10 bg-gray-100 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : filteredRewards.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-900">No Rewards Found</h3>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search query or selecting a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((reward) => {
                const canAfford = balance >= reward.creditsRequired;
                return (
                  <div
                    key={reward.id}
                    className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Card Banner / Image Placeholder */}
                      <div className="h-36 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 p-4 relative flex flex-col justify-between border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold text-gray-800 shadow-sm">
                            {getCategoryIcon(reward.category)}
                            {reward.provider}
                          </span>
                          {reward.governmentApproved && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium border border-emerald-200" title="Officially backed by Municipal Clean City Initiative">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              Gov Backed
                            </span>
                          )}
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white rounded-xl font-bold text-sm shadow-md">
                            <Coins className="w-4 h-4" />
                            {reward.creditsRequired} Credits
                          </div>
                          {reward.stockCount !== undefined && reward.stockCount < 20 && (
                            <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                              Only {reward.stockCount} left
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">
                          {reward.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {reward.description}
                        </p>
                      </div>
                    </div>

                    {/* Action footer */}
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => handleOpenRedeemModal(reward)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                          canAfford
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                      >
                        {canAfford ? (
                          <>
                            <Gift className="w-4 h-4" />
                            Redeem Reward
                          </>
                        ) : (
                          `Need ${(reward.creditsRequired - balance)} More Credits`
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Redemptions History Tab */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your Redeemed Vouchers</h2>
              <p className="text-sm text-gray-500">Present these alphanumeric codes at checkout or billing portals.</p>
            </div>
          </div>

          {redemptions.length === 0 ? (
            <div className="p-12 text-center">
              <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-900">No Vouchers Yet</h3>
              <p className="text-sm text-gray-500 mt-1">
                You haven't redeemed any rewards yet. Browse the catalog to claim vouchers!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {redemptions.map((redemption) => (
                <div key={redemption.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md uppercase">
                        {redemption.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        Redeemed on {new Date(redemption.redeemedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-base">{redemption.rewardName}</h4>
                    <p className="text-xs text-gray-500">Spent {redemption.creditsUsed} EcoCredits</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl font-mono font-bold text-emerald-800 text-sm tracking-wider select-all">
                      {redemption.redemptionCode}
                    </div>
                    <button
                      onClick={() => handleCopyCode(redemption.redemptionCode)}
                      className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Copy Code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Redeem Confirmation Modal */}
      <Modal
        isOpen={!!selectedReward}
        onClose={() => setSelectedReward(null)}
        title="Confirm Reward Redemption"
      >
        {selectedReward && (
          <div className="space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                {selectedReward.provider}
              </span>
              <h4 className="font-bold text-gray-900 text-lg">{selectedReward.name}</h4>
              <p className="text-sm text-gray-600">{selectedReward.description}</p>
            </div>

            <div className="space-y-2 border-t border-b border-gray-100 py-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Current Balance:</span>
                <span className="font-semibold text-gray-900">{balance} Credits</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Cost:</span>
                <span className="font-bold text-red-600">-{selectedReward.creditsRequired} Credits</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-dashed border-gray-200">
                <span className="text-gray-700 font-medium">Balance After Redemption:</span>
                <span className="font-bold text-emerald-600">{balance - selectedReward.creditsRequired} Credits</span>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              By redeeming, a unique digital voucher code will be issued instantly. This deduction cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedReward(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRedeem}
                disabled={isRedeeming}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
              >
                {isRedeeming ? 'Processing...' : 'Confirm & Redeem'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Redemption Success Modal */}
      <Modal
        isOpen={!!redeemResult}
        onClose={() => setRedeemResult(null)}
        title="Redemption Successful!"
      >
        {redeemResult && (
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900">{redeemResult.rewardName}</h4>
              <p className="text-sm text-gray-500 mt-1">Here is your single-use voucher code:</p>
            </div>

            {/* Code Box */}
            <div className="bg-gray-50 border-2 border-dashed border-emerald-300 rounded-2xl p-5 relative">
              <span className="font-mono text-2xl font-extrabold text-emerald-700 tracking-wider block">
                {redeemResult.redemptionCode}
              </span>
              <button
                onClick={() => handleCopyCode(redeemResult.redemptionCode)}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                {copiedCode ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Voucher Code
                  </>
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 p-4 rounded-xl text-left text-xs text-gray-600 space-y-1">
              <span className="font-semibold text-gray-800 block">How to Use:</span>
              <p>{redeemResult.instructions || 'Show this code at the merchant counter or apply during online billing.'}</p>
            </div>

            <button
              onClick={() => {
                setRedeemResult(null);
                setActiveTab('history');
              }}
              className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-all"
            >
              View in My Redemptions
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default RewardsMarketplacePage;
