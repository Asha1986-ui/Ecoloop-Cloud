import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pickupService } from '../../services';
import { PickupRequest } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { useNotification } from '../../context/NotificationContext';
import { 
  Recycle, Calendar, Clock, MapPin, 
  ChevronRight, PlusCircle, XCircle 
} from 'lucide-react';

export const MyPickupsPage: React.FC = () => {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const { showToast } = useNotification();

  const loadPickups = async () => {
    try {
      const data = await pickupService.getCitizenPickups();
      setPickups(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadPickups();
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this pickup request?')) return;
    setCancelling(true);
    try {
      await pickupService.cancelPickup(id);
      showToast('Pickup request cancelled.', 'info');
      setSelectedPickup(null);
      loadPickups();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Could not cancel pickup', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const filteredPickups = pickups.filter((p) => {
    if (filter === 'PENDING') return p.status === 'REQUESTED' || p.status === 'ASSIGNED' || p.status === 'COLLECTOR_ON_THE_WAY' || p.status === 'COLLECTED';
    if (filter === 'COMPLETED') return p.status === 'VERIFIED' || p.status === 'CREDITS_AWARDED';
    if (filter === 'CANCELLED') return p.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Pickup Requests</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track real-time collection stages and reward verification status.
          </p>
        </div>
        <Link
          to="/citizen/request-pickup"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Pickup Request</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { key: 'ALL', label: 'All Requests' },
          { key: 'PENDING', label: 'Active & In-Transit' },
          { key: 'COMPLETED', label: 'Verified & Credited' },
          { key: 'CANCELLED', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              filter === tab.key
                ? 'bg-emerald-100 text-emerald-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pickup List / Cards */}
      {filteredPickups.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Recycle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-base">No pickup requests found</h3>
          <p className="text-xs text-slate-400 mt-1">Schedule a pickup to start earning EcoCredits today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPickups.map((pickup) => (
            <div
              key={pickup.id}
              onClick={() => setSelectedPickup(pickup)}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono font-bold text-slate-400">#{pickup.id}</span>
                  <StatusBadge status={pickup.status} />
                </div>

                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>{pickup.pickupDate} • {pickup.timeSlot}</span>
                </h4>

                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{pickup.address}, {pickup.city}</span>
                </p>

                <div className="mt-4 p-3 bg-slate-50 rounded-2xl flex justify-between text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Estimated</span>
                    <strong>{pickup.estimatedBottleCount} bottles</strong> (~{pickup.estimatedWeight} kg)
                  </div>
                  {pickup.actualBottleCount && (
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Actual Verified</span>
                      <strong className="text-emerald-700">{pickup.actualBottleCount} bottles</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400">
                  {pickup.collectorName ? `Worker: ${pickup.collectorName}` : 'Worker pending assignment'}
                </span>
                <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
                  Details <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pickup Detail Modal */}
      {selectedPickup && (
        <Modal
          isOpen={!!selectedPickup}
          onClose={() => setSelectedPickup(null)}
          title={`Pickup Request Details #${selectedPickup.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-slate-500">Current Status</span>
              <StatusBadge status={selectedPickup.status} />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="font-bold text-slate-700 block mb-2 uppercase tracking-wider text-[10px]">
                Progress Timeline
              </span>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span className="text-emerald-700 font-bold">1. Requested</span>
                <span>→</span>
                <span className={selectedPickup.status !== 'REQUESTED' ? 'text-emerald-700 font-bold' : ''}>2. Assigned</span>
                <span>→</span>
                <span className={selectedPickup.status === 'COLLECTOR_ON_THE_WAY' || selectedPickup.status === 'COLLECTED' || selectedPickup.status === 'VERIFIED' || selectedPickup.status === 'CREDITS_AWARDED' ? 'text-emerald-700 font-bold' : ''}>3. On Way</span>
                <span>→</span>
                <span className={selectedPickup.status === 'VERIFIED' || selectedPickup.status === 'CREDITS_AWARDED' ? 'text-emerald-700 font-bold' : ''}>4. Verified</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-semibold text-slate-800">{selectedPickup.pickupDate} ({selectedPickup.timeSlot})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Address:</span>
                <span className="font-semibold text-slate-800 text-right">{selectedPickup.address}, {selectedPickup.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Collector:</span>
                <span className="font-semibold text-slate-800">{selectedPickup.collectorName || 'Assigning soon...'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Count:</span>
                <span className="font-semibold text-slate-800">{selectedPickup.estimatedBottleCount} bottles ({selectedPickup.estimatedWeight} kg)</span>
              </div>
              {selectedPickup.actualBottleCount && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Actual Count:</span>
                  <span>{selectedPickup.actualBottleCount} bottles ({selectedPickup.actualWeight} kg)</span>
                </div>
              )}
              {selectedPickup.creditsAwarded && (
                <div className="flex justify-between text-emerald-700 font-bold text-sm bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                  <span>EcoCredits Awarded:</span>
                  <span>+{selectedPickup.creditsAwarded} Credits</span>
                </div>
              )}
              {selectedPickup.notes && (
                <div className="pt-2">
                  <span className="text-slate-500 block mb-1">Notes:</span>
                  <p className="p-2.5 bg-slate-50 rounded-xl text-slate-700">{selectedPickup.notes}</p>
                </div>
              )}
            </div>

            {(selectedPickup.status === 'REQUESTED' || selectedPickup.status === 'ASSIGNED') && (
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={() => handleCancel(selectedPickup.id)}
                  className="w-full py-2.5 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-rose-200"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Pickup Request</span>
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};