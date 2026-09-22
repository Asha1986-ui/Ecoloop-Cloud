import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  MapPin, 
  Mail, 
  Phone, 
  UserCheck, 
  UserX, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { adminService } from '../../services';
import { Collector } from '../../types';
import Modal from '../../components/common/Modal';

export const CollectorManagementPage: React.FC = () => {
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // Modal state
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: 'Bangalore'
  });
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchCollectors = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCollectors();
      setCollectors(data);
    } catch (err) {
      console.error('Failed to load collectors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  const handleToggleStatus = async (id: number) => {
    try {
      setActionLoadingId(id);
      await adminService.toggleUserStatus(id);
      await fetchCollectors();
    } catch (err) {
      console.error('Failed to toggle collector status', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      setCreateError(null);
      await adminService.createCollector(createForm);
      setIsCreateOpen(false);
      setCreateForm({ name: '', email: '', password: '', phone: '', city: 'Bangalore' });
      await fetchCollectors();
    } catch (err: any) {
      setCreateError(err.response?.data?.message || 'Failed to create collector.');
    } finally {
      setCreateLoading(false);
    }
  };

  const filtered = collectors.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collection Fleet Management</h1>
          <p className="text-sm text-gray-500">
            Onboard certified municipal recycling agents, monitor audits, and manage territory coverage.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Onboard Field Collector
          </button>
          <button
            onClick={fetchCollectors}
            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search collector by name, zone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium">
          Showing {filtered.length} of {collectors.length} active agents
        </span>
      </div>

      {/* Collectors Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No Field Collectors Found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Click "Onboard Field Collector" to register your first recovery partner.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                  <th className="py-4 px-6">Collector</th>
                  <th className="py-4 px-6">Assigned Hub / City</th>
                  <th className="py-4 px-6 text-center">Fulfilled Pickups</th>
                  <th className="py-4 px-6 text-right">Bottles Recovered</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filtered.map((collector) => (
                  <tr key={collector.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{collector.name}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {collector.email}
                          </div>
                          {collector.phone && (
                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" /> {collector.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <span className="flex items-center gap-1 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {collector.city || 'Bangalore'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-semibold text-gray-800">
                      {collector.completedPickupsCount || 0}
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-emerald-600">
                      {(collector.totalBottlesCollected || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        collector.active 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {collector.active ? 'Active Fleet' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(collector.id)}
                        disabled={actionLoadingId === collector.id}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          collector.active
                            ? 'bg-red-50 hover:bg-red-100 text-red-700'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {collector.active ? (
                          <>
                            <UserX className="w-3.5 h-3.5" /> Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" /> Activate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Onboard Collector Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Onboard Authorized Field Collector"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {createError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {createError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Collector Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={createForm.name}
              onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Official Work Email *</label>
            <input
              type="email"
              required
              placeholder="e.g. collector.ramesh@ecoloop.com"
              value={createForm.email}
              onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Initial Password *</label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={createForm.password}
              onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Contact Phone</label>
              <input
                type="tel"
                placeholder="+91 98765 00000"
                value={createForm.phone}
                onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Operating City / Ward</label>
              <input
                type="text"
                placeholder="e.g. Bangalore"
                value={createForm.city}
                onChange={(e) => setCreateForm(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
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
              {createLoading ? 'Onboarding...' : 'Create Agent Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default CollectorManagementPage;
