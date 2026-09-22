import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  UserPlus, 
  Truck, 
  Clock, 
  MapPin, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { adminService } from '../../services';
import { PickupRequest, Collector, PickupStatus } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

export const PickupManagementPage: React.FC = () => {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Assign Modal
  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);
  const [selectedCollectorId, setSelectedCollectorId] = useState<number | ''>('');
  const [assignLoading, setAssignLoading] = useState<boolean>(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pickupsData, collectorsData] = await Promise.all([
        adminService.getAllPickups(statusFilter === 'ALL' ? undefined : statusFilter),
        adminService.getCollectors()
      ]);
      setPickups(pickupsData);
      setCollectors(collectorsData.filter(c => c.active));
    } catch (err) {
      console.error('Failed to load pickups/collectors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleOpenAssign = (pickup: PickupRequest) => {
    setSelectedPickup(pickup);
    setSelectedCollectorId(pickup.collectorId || '');
    setAssignError(null);
  };

  const handleConfirmAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPickup || !selectedCollectorId) return;

    try {
      setAssignLoading(true);
      setAssignError(null);
      await adminService.assignCollector(selectedPickup.id, Number(selectedCollectorId));
      setSelectedPickup(null);
      await fetchData();
    } catch (err: any) {
      setAssignError(err.response?.data?.message || 'Failed to assign collector.');
    } finally {
      setAssignLoading(false);
    }
  };

  const filtered = pickups.filter(p => 
    p.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toString().includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doorstep Logistics & Dispatch</h1>
          <p className="text-sm text-gray-500">
            Audit collection requests across municipal wards, manage route assignments, and verify chain-of-custody.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Requests
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {[
            { label: 'All Pickups', value: 'ALL' },
            { label: 'Unassigned', value: 'REQUESTED' },
            { label: 'Assigned', value: 'ASSIGNED' },
            { label: 'On Route', value: 'COLLECTOR_ON_THE_WAY' },
            { label: 'Verified', value: 'VERIFIED' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.value
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search citizen or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Pickups Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No Pickups Found</h3>
            <p className="text-sm text-gray-500 mt-1">No requests match the current filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Citizen</th>
                  <th className="py-4 px-6">Pickup Location</th>
                  <th className="py-4 px-6">Date & Slot</th>
                  <th className="py-4 px-6">Bottles</th>
                  <th className="py-4 px-6">Assigned Collector</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Dispatch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filtered.map((pickup) => (
                  <tr key={pickup.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-gray-400">
                      #{pickup.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">{pickup.citizenName}</div>
                      {pickup.citizenPhone && (
                        <div className="text-xs text-gray-400">{pickup.citizenPhone}</div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate" title={pickup.address}>
                      <span className="flex items-center gap-1 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {pickup.address}, {pickup.city}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-gray-700">
                      <div className="text-xs font-medium">{pickup.pickupDate}</div>
                      <div className="text-xs text-gray-400">{pickup.timeSlot}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-800">
                      {pickup.actualBottleCount ? (
                        <span className="text-emerald-700">{pickup.actualBottleCount} (Audit)</span>
                      ) : (
                        <span>{pickup.estimatedBottleCount || 10} est.</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {pickup.collectorName ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-teal-800 rounded-lg text-xs font-semibold">
                          <Truck className="w-3.5 h-3.5 text-teal-600" />
                          {pickup.collectorName}
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg">
                          Unallocated
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={pickup.status} />
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      {pickup.status === 'REQUESTED' || pickup.status === 'ASSIGNED' ? (
                        <button
                          onClick={() => handleOpenAssign(pickup)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          {pickup.collectorName ? 'Reassign' : 'Assign'}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Collector Modal */}
      <Modal
        isOpen={!!selectedPickup}
        onClose={() => setSelectedPickup(null)}
        title="Assign Fleet Collector"
      >
        {selectedPickup && (
          <form onSubmit={handleConfirmAssign} className="space-y-4">
            {assignError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {assignError}
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs space-y-1">
              <span className="text-gray-400 font-bold uppercase">Pickup Destination:</span>
              <p className="font-bold text-gray-900 text-sm">{selectedPickup.citizenName}</p>
              <p className="text-gray-600">{selectedPickup.address}, {selectedPickup.city}</p>
              <p className="text-gray-600">Slot: {selectedPickup.pickupDate} ({selectedPickup.timeSlot})</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Choose Available Field Collector *</label>
              <select
                required
                value={selectedCollectorId}
                onChange={(e) => setSelectedCollectorId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="">Select a registered collector...</option>
                {collectors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city} - {c.completedPickupsCount || 0} completed)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedPickup(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={assignLoading || !selectedCollectorId}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                {assignLoading ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
export default PickupManagementPage;
