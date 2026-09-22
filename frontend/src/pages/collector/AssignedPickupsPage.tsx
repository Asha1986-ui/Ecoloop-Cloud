import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Search, 
  Filter, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Clock, 
  RefreshCw,
  Scale,
  Navigation
} from 'lucide-react';
import { collectorService } from '../../services';
import { PickupRequest, PickupStatus } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';
import PickupVerificationModal from './PickupVerificationModal';

export const AssignedPickupsPage: React.FC = () => {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [availablePickups, setAvailablePickups] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedForVerify, setSelectedForVerify] = useState<PickupRequest | null>(null);
  const [claimingId, setClaimingId] = useState<number | null>(null);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const [assignedData, availableData] = await Promise.all([
        collectorService.getAssignedPickups(),
        collectorService.getAvailablePickups()
      ]);
      setPickups(assignedData);
      setAvailablePickups(availableData);
    } catch (err) {
      console.error('Failed to load assigned pickups', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleStatusChange = async (id: number, status: PickupStatus) => {
    try {
      await collectorService.updateStatus(id, status);
      fetchPickups();
    } catch (err) {
      console.error('Failed to change pickup status', err);
    }
  };

  const handleClaim = async (id: number) => {
    try {
      setClaimingId(id);
      await collectorService.claimPickup(id);
      await fetchPickups();
    } catch (err) {
      console.error('Failed to claim pickup', err);
    } finally {
      setClaimingId(null);
    }
  };

  const allCombined = [...availablePickups, ...pickups.filter(p => !availablePickups.some(a => a.id === p.id))].sort((a, b) => b.id - a.id);
  const currentList = 
    statusFilter === 'AVAILABLE' 
      ? availablePickups 
      : statusFilter === 'ALL' 
        ? allCombined 
        : pickups;

  const filteredPickups = currentList.filter((pickup) => {
    const matchesStatus = 
      statusFilter === 'ALL' ||
      statusFilter === 'AVAILABLE' ||
      (statusFilter === 'PENDING' && (pickup.status === 'ASSIGNED' || pickup.status === 'COLLECTOR_ON_THE_WAY')) ||
      (statusFilter === 'COMPLETED' && (pickup.status === 'VERIFIED' || pickup.status === 'CREDITS_AWARDED' || pickup.status === 'COLLECTED')) ||
      pickup.status === statusFilter;

    const matchesSearch = 
      pickup.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pickup.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pickup.id.toString().includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doorstep Collection Requests</h1>
          <p className="text-sm text-gray-500">
            View, navigate to, and verify scheduled citizen plastic recycling batches.
          </p>
        </div>
        <button
          onClick={fetchPickups}
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
            { label: `All Stops (${allCombined.length})`, value: 'ALL' },
            { label: `Available to Claim (${availablePickups.length})`, value: 'AVAILABLE' },
            { label: `Pending Action (${pickups.filter(p => p.status === 'ASSIGNED' || p.status === 'COLLECTOR_ON_THE_WAY').length})`, value: 'PENDING' },
            { label: `Assigned (${pickups.filter(p => p.status === 'ASSIGNED').length})`, value: 'ASSIGNED' },
            { label: `On The Way (${pickups.filter(p => p.status === 'COLLECTOR_ON_THE_WAY').length})`, value: 'COLLECTOR_ON_THE_WAY' },
            { label: `Completed (${pickups.filter(p => p.status === 'VERIFIED' || p.status === 'CREDITS_AWARDED' || p.status === 'COLLECTED').length})`, value: 'COMPLETED' }
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
            placeholder="Search citizen or street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Pickup Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white rounded-2xl p-6 h-48 animate-pulse border border-gray-100"></div>
          ))}
        </div>
      ) : filteredPickups.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
          <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900">No Matching Pickups</h3>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search criteria or filter tabs above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPickups.map((pickup) => (
            <div
              key={pickup.id}
              className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-200 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-gray-400">
                    ID #{pickup.id}
                  </span>
                  <StatusBadge status={pickup.status} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">{pickup.citizenName}</h3>
                  <p className="text-sm text-gray-600 flex items-start gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pickup.address}, {pickup.city}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-xl">
                  <div>
                    <span className="text-gray-400 block">Scheduled Slot</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {pickup.timeSlot}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Bottles Volume</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
                      <Scale className="w-3.5 h-3.5 text-gray-400" />
                      {pickup.actualBottleCount !== undefined && pickup.actualBottleCount !== null ? (
                        <strong className="text-emerald-700">{pickup.actualBottleCount} (Verified)</strong>
                      ) : (
                        <span>{pickup.estimatedBottleCount || 10} Estimated</span>
                      )}
                    </span>
                  </div>
                </div>

                {pickup.notes && (
                  <p className="text-xs text-gray-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                    Citizen note: "{pickup.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {pickup.citizenPhone && (
                    <a
                      href={`tel:${pickup.citizenPhone}`}
                      className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors border border-gray-200"
                      title="Call Citizen"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${pickup.address}, ${pickup.city}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-gray-200"
                    title="Open in Maps"
                  >
                    <Navigation className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  {pickup.status === 'REQUESTED' && (
                    <button
                      onClick={() => handleClaim(pickup.id)}
                      disabled={claimingId === pickup.id}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      {claimingId === pickup.id ? 'Claiming...' : 'Accept / Claim'}
                    </button>
                  )}
                  {pickup.status === 'ASSIGNED' && (
                    <button
                      onClick={() => handleStatusChange(pickup.id, 'COLLECTOR_ON_THE_WAY')}
                      className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      Mark On The Way
                    </button>
                  )}
                  {pickup.status === 'COLLECTOR_ON_THE_WAY' && (
                    <button
                      onClick={() => setSelectedForVerify(pickup)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                    >
                      Audit & Verify
                    </button>
                  )}
                  {(pickup.status === 'VERIFIED' || pickup.status === 'CREDITS_AWARDED') && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> EcoCredits Awarded
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verification Modal */}
      <PickupVerificationModal
        pickup={selectedForVerify}
        isOpen={!!selectedForVerify}
        onClose={() => setSelectedForVerify(null)}
        onSuccess={fetchPickups}
      />
    </div>
  );
};
export default AssignedPickupsPage;
