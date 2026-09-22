import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle, 
  Navigation, 
  PackageCheck, 
  ArrowRight,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { collectorService } from '../../services';
import { PickupRequest, PickupRoute } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';
import StatCard from '../../components/common/StatCard';
import PickupVerificationModal from './PickupVerificationModal';

export const CollectorDashboard: React.FC = () => {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [availablePickups, setAvailablePickups] = useState<PickupRequest[]>([]);
  const [route, setRoute] = useState<PickupRoute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'assigned' | 'available'>('all');
  const [selectedForVerify, setSelectedForVerify] = useState<PickupRequest | null>(null);
  const [claimingAll, setClaimingAll] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pickupsData, availableData, routeData] = await Promise.all([
        collectorService.getAssignedPickups(),
        collectorService.getAvailablePickups(),
        collectorService.getTodayRoute()
      ]);
      setPickups(pickupsData);
      setAvailablePickups(availableData);
      setRoute(routeData);
    } catch (err) {
      console.error('Failed to load collector dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartTrip = async (id: number) => {
    try {
      await collectorService.updateStatus(id, 'COLLECTOR_ON_THE_WAY');
      fetchData();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleClaimPickup = async (id: number) => {
    try {
      setClaimingId(id);
      await collectorService.claimPickup(id);
      await fetchData();
    } catch (err) {
      console.error('Failed to claim pickup', err);
    } finally {
      setClaimingId(null);
    }
  };

  const handleClaimAll = async () => {
    try {
      setClaimingAll(true);
      await collectorService.claimAllAvailable();
      await fetchData();
    } catch (err) {
      console.error('Failed to claim all pickups', err);
    } finally {
      setClaimingAll(false);
    }
  };

  // Stats calculation
  const allPickups = [...availablePickups, ...pickups.filter(p => !availablePickups.some(a => a.id === p.id))].sort((a, b) => b.id - a.id);
  const totalAssigned = pickups.length;
  const pendingPickups = pickups.filter(p => p.status === 'ASSIGNED' || p.status === 'COLLECTOR_ON_THE_WAY');
  const completedPickups = pickups.filter(p => p.status === 'VERIFIED' || p.status === 'CREDITS_AWARDED' || p.status === 'COLLECTED');
  const totalBottles = completedPickups.reduce((acc, p) => acc + (p.actualBottleCount || p.estimatedBottleCount || 0), 0);

  // Next active stop
  const nextStop = route.find(s => s.status === 'ASSIGNED' || s.status === 'COLLECTOR_ON_THE_WAY');

  const displayList = 
    activeTab === 'available' 
      ? availablePickups 
      : activeTab === 'assigned' 
        ? pickups 
        : allPickups;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <Truck className="w-3.5 h-3.5" />
              Verified Recycling Field Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Collector Operations Hub
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base">
              Manage your assigned neighborhood recycling stops, optimize collection routes, and perform audited bottle counts for instant citizen reward dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/collector/route"
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all"
            >
              <Navigation className="w-4 h-4" />
              Launch Optimized Route
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="All Community Stops"
          value={loading ? '...' : allPickups.length}
          icon={Truck}
          color="emerald"
        />
        <StatCard
          title="Available in Area"
          value={loading ? '...' : availablePickups.length}
          icon={AlertCircle}
          color="blue"
        />
        <StatCard
          title="Assigned to Me"
          value={loading ? '...' : totalAssigned}
          icon={PackageCheck}
          color="teal"
        />
        <StatCard
          title="Bottles Recovered"
          value={loading ? '...' : totalBottles.toLocaleString()}
          icon={Sparkles}
          color="amber"
        />
      </div>

      {/* New Community Requests Alert Banner */}
      {availablePickups.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-sm animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                <Truck className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span>{availablePickups.length} New Citizen Pickup Request{availablePickups.length > 1 ? 's' : ''} in Your Area!</span>
                  <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 rounded-full font-bold">Action Needed</span>
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Citizens have scheduled recyclable pickups. Accept stops to assign them to your route and notify the residents.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('available')}
                className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                View Requests ({availablePickups.length})
              </button>
              <button
                onClick={handleClaimAll}
                disabled={claimingAll}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {claimingAll ? 'Claiming All...' : `Claim All Stops (${availablePickups.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Immediate Next Stop Callout */}
      {nextStop && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-2xl border-2 border-emerald-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                  Next Priority Stop • #{nextStop.stopNumber}
                </span>
                <StatusBadge status={nextStop.status} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{nextStop.citizenName}</h2>
              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                {nextStop.address}, {nextStop.city}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" /> Slot: {nextStop.timeSlot}
                </span>
                <span className="flex items-center gap-1 font-semibold text-gray-700">
                  📦 Estimated: {nextStop.estimatedBottles || 10} Bottles
                </span>
                {nextStop.citizenPhone && (
                  <a
                    href={`tel:${nextStop.citizenPhone}`}
                    className="flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" /> {nextStop.citizenPhone}
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${nextStop.address}, ${nextStop.city}`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Navigation className="w-4 h-4 text-blue-600" />
                Google Maps Navigation
              </a>
              {nextStop.status === 'ASSIGNED' ? (
                <button
                  onClick={() => handleStartTrip(nextStop.pickupId)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Truck className="w-4 h-4" />
                  Start Trip
                </button>
              ) : (
                <button
                  onClick={() => {
                    const found = pickups.find(p => p.id === nextStop.pickupId);
                    if (found) setSelectedForVerify(found);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Audit & Verify
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pickups Table with Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Stops ({allPickups.length})
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'available'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>Available to Claim</span>
              {availablePickups.length > 0 && (
                <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                  activeTab === 'available' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {availablePickups.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('assigned')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'assigned'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              My Assigned Stops ({pickups.length})
            </button>
          </div>
          <Link
            to="/collector/pickups"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : displayList.length === 0 ? (
          <div className="p-12 text-center">
            <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">
              {activeTab === 'available' ? 'No Unassigned Pickups' : 'No Pickups Found'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'available'
                ? 'All citizen requests in your city have already been assigned or claimed.'
                : 'No recycling requests found for this filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Citizen</th>
                  <th className="py-4 px-6">Address</th>
                  <th className="py-4 px-6">Slot</th>
                  <th className="py-4 px-6">Est. Bottles</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {displayList.slice(0, 10).map((pickup) => (
                  <tr key={pickup.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-gray-500">#{pickup.id}</td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">{pickup.citizenName}</div>
                      {pickup.citizenPhone && (
                        <span className="text-xs text-gray-400">{pickup.citizenPhone}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate" title={pickup.address}>
                      {pickup.address}, {pickup.city}
                    </td>
                    <td className="py-4 px-6 text-gray-600 whitespace-nowrap">
                      {pickup.timeSlot}
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-800">
                      {pickup.actualBottleCount ? (
                        <span className="text-emerald-700 font-bold">{pickup.actualBottleCount} (Verified)</span>
                      ) : (
                        <span>{pickup.estimatedBottleCount || 10} est.</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={pickup.status} />
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      {pickup.status === 'REQUESTED' && (
                        <button
                          onClick={() => handleClaimPickup(pickup.id)}
                          disabled={claimingId === pickup.id}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-colors inline-flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          {claimingId === pickup.id ? 'Claiming...' : 'Accept / Claim'}
                        </button>
                      )}
                      {pickup.status === 'ASSIGNED' && (
                        <button
                          onClick={() => handleStartTrip(pickup.id)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Start Trip
                        </button>
                      )}
                      {pickup.status === 'COLLECTOR_ON_THE_WAY' && (
                        <button
                          onClick={() => setSelectedForVerify(pickup)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                        >
                          Audit & Verify
                        </button>
                      )}
                      {(pickup.status === 'VERIFIED' || pickup.status === 'CREDITS_AWARDED') && (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit Modal */}
      <PickupVerificationModal
        pickup={selectedForVerify}
        isOpen={!!selectedForVerify}
        onClose={() => setSelectedForVerify(null)}
        onSuccess={fetchData}
      />
    </div>
  );
};
export default CollectorDashboard;
