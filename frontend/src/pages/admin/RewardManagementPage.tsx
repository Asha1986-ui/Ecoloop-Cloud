import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Plus, 
  Trash2, 
  Coins, 
  ShieldCheck, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2,
  Ticket,
  Bus,
  Zap,
  Sparkles
} from 'lucide-react';
import { rewardService, adminService } from '../../services';
import { Reward, RewardCategory } from '../../types';
import Modal from '../../components/common/Modal';

export const RewardManagementPage: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'COUPON' as RewardCategory,
    creditsRequired: 100,
    provider: '',
    governmentApproved: false,
    stockCount: 100
  });
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const data = await rewardService.getRewards();
      setRewards(data);
    } catch (err) {
      console.error('Failed to load rewards', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this reward from the public catalog?')) return;
    try {
      setActionLoadingId(id);
      await adminService.deleteReward(id);
      await fetchRewards();
    } catch (err) {
      console.error('Failed to delete reward', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      setCreateError(null);
      await adminService.createReward({
        ...form,
        available: true
      });
      setIsCreateOpen(false);
      setForm({
        name: '',
        description: '',
        category: 'COUPON',
        creditsRequired: 100,
        provider: '',
        governmentApproved: false,
        stockCount: 100
      });
      await fetchRewards();
    } catch (err: any) {
      setCreateError(err.response?.data?.message || 'Failed to create reward.');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">EcoCredits Reward Marketplace Catalog</h1>
          <p className="text-sm text-gray-500">
            Curate partner incentives, public transit subsidies, and municipal green perks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Reward Item
          </button>
          <button
            onClick={fetchRewards}
            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Rewards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white rounded-2xl p-6 h-48 animate-pulse border border-gray-100"></div>
          ))}
        </div>
      ) : rewards.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
          <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900">No Rewards in Catalog</h3>
          <p className="text-sm text-gray-500 mt-1">Click "Add Reward Item" to list your first redeemable perk.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 relative"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {reward.category}
                  </span>
                  {reward.governmentApproved && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      Gov Certified
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-xs text-gray-400 font-semibold">{reward.provider}</span>
                  <h3 className="font-bold text-gray-900 text-lg">{reward.name}</h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{reward.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Coins className="w-4 h-4" />
                    <span>{reward.creditsRequired} Credits</span>
                  </div>
                  <span className="text-gray-500">
                    Stock: <strong>{reward.stockCount ?? 'Unlimited'}</strong>
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                  reward.available ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {reward.available ? 'Active Catalog' : 'Hidden'}
                </span>
                <button
                  onClick={() => handleDelete(reward.id)}
                  disabled={actionLoadingId === reward.id}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete Reward"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Reward Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Marketplace Reward"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {createError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {createError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Reward Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. ₹100 Metro Rail Transit Pass"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Provider / Brand *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bangalore Metro"
                value={form.provider}
                onChange={(e) => setForm(prev => ({ ...prev, provider: e.target.value }))}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as RewardCategory }))}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="COUPON">Grocery & Food Coupon</option>
                <option value="TRANSPORT">Public Transit</option>
                <option value="UTILITY">Utility Bill Discount</option>
                <option value="SPECIAL">Special Municipal Perk</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Credits Required *</label>
              <input
                type="number"
                min="10"
                step="5"
                required
                value={form.creditsRequired}
                onChange={(e) => setForm(prev => ({ ...prev, creditsRequired: Number(e.target.value) }))}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Stock Inventory</label>
              <input
                type="number"
                min="1"
                value={form.stockCount}
                onChange={(e) => setForm(prev => ({ ...prev, stockCount: Number(e.target.value) }))}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Description & Usage Instructions *</label>
            <textarea
              rows={2}
              required
              placeholder="Explain how residents redeem this benefit..."
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="govApproved"
              checked={form.governmentApproved}
              onChange={(e) => setForm(prev => ({ ...prev, governmentApproved: e.target.checked }))}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
            />
            <label htmlFor="govApproved" className="text-xs font-medium text-gray-700 cursor-pointer">
              Official Government / Municipal Subsidized Initiative
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {createLoading ? 'Publishing...' : 'Publish Reward'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default RewardManagementPage;
