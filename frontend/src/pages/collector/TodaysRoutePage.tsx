import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle, 
  Truck, 
  Compass, 
  Milestone, 
  Layers, 
  RefreshCw 
} from 'lucide-react';
import { collectorService } from '../../services';
import { PickupRoute, PickupRequest } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';
import PickupVerificationModal from './PickupVerificationModal';

export const TodaysRoutePage: React.FC = () => {
  const [routeStops, setRouteStops] = useState<PickupRoute[]>([]);
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedForVerify, setSelectedForVerify] = useState<PickupRequest | null>(null);

  const fetchRoute = async () => {
    try {
      setLoading(true);
      const [routeData, pickupsData] = await Promise.all([
        collectorService.getTodayRoute(),
        collectorService.getAssignedPickups()
      ]);
      setRouteStops(routeData);
      setPickups(pickupsData);
    } catch (err) {
      console.error('Failed to load route', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, []);

  const totalDistance = routeStops.reduce((acc, s) => acc + (s.estimatedDistanceKm || 0), 0);
  const totalTravelTime = routeStops.reduce((acc, s) => acc + (s.estimatedTravelTimeMinutes || 0), 0);
  const totalBottles = routeStops.reduce((acc, s) => acc + (s.estimatedBottles || 0), 0);

  const handleStartTrip = async (pickupId: number) => {
    try {
      await collectorService.updateStatus(pickupId, 'COLLECTOR_ON_THE_WAY');
      fetchRoute();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Route Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <Compass className="w-3.5 h-3.5" />
              AI-Sequenced Waypoints
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Optimized Collection Route
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base">
              Algorithmic itinerary prioritizing spatial density, scheduled citizen time windows, and minimal municipal carbon transit.
            </p>
          </div>

          <button
            onClick={fetchRoute}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Recalculate Waypoints
          </button>
        </div>
      </div>

      {/* Route Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Milestone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Scheduled Stops</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900">{routeStops.length}</span>
              <span className="text-xs text-gray-500 font-medium">stops today</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Estimated Circuit</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900">{totalDistance.toFixed(1)}</span>
              <span className="text-xs text-gray-500 font-medium">km travel</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Est. Transit Time</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900">{totalTravelTime}</span>
              <span className="text-xs text-gray-500 font-medium">minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Waypoint Itinerary List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Stop-by-Stop Navigation</h2>
            <p className="text-sm text-gray-500">Ordered by route optimization algorithm.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            {totalBottles} Estimated Bottles on Route
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : routeStops.length === 0 ? (
          <div className="p-12 text-center">
            <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No Itinerary Stops Found</h3>
            <p className="text-sm text-gray-500 mt-1">
              There are no pending collection stops assigned for today's itinerary.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
            {routeStops.map((stop, index) => {
              const matchingPickup = pickups.find(p => p.id === stop.pickupId);
              const isCompleted = stop.status === 'VERIFIED' || stop.status === 'CREDITS_AWARDED' || stop.status === 'COLLECTED';
              const isOnTheWay = stop.status === 'COLLECTOR_ON_THE_WAY';

              return (
                <div key={stop.stopNumber} className="relative group">
                  {/* Step Circle Pin */}
                  <div 
                    className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 transition-all ${
                      isCompleted 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                        : isOnTheWay 
                        ? 'bg-amber-500 border-amber-500 text-white animate-pulse shadow-md' 
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : stop.stopNumber}
                  </div>

                  {/* Stop Card */}
                  <div className={`p-5 rounded-2xl border transition-all ${
                    isOnTheWay 
                      ? 'bg-amber-50/40 border-amber-300 shadow-md' 
                      : isCompleted 
                      ? 'bg-gray-50/60 border-gray-200 opacity-80' 
                      : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800">
                            Stop #{stop.stopNumber}
                          </span>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            stop.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {stop.priority} Priority
                          </span>
                          <StatusBadge status={stop.status} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mt-1">{stop.citizenName}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                          {stop.address}, {stop.city}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            Slot: {stop.timeSlot}
                          </span>
                          <span>
                            Distance: <strong>~{stop.estimatedDistanceKm.toFixed(1)} km</strong>
                          </span>
                          <span>
                            Est. Travel: <strong>~{stop.estimatedTravelTimeMinutes} mins</strong>
                          </span>
                          <span>
                            Volume: <strong className="text-emerald-700">{stop.estimatedBottles || 10} Bottles</strong>
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        {stop.citizenPhone && (
                          <a
                            href={`tel:${stop.citizenPhone}`}
                            className="p-2.5 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-gray-200 transition-colors"
                            title="Call Citizen"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(`${stop.address}, ${stop.city}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl border border-blue-200 transition-colors"
                          title="Navigate"
                        >
                          <Navigation className="w-4 h-4" />
                        </a>

                        {stop.status === 'ASSIGNED' && (
                          <button
                            onClick={() => handleStartTrip(stop.pickupId)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                          >
                            Start Trip
                          </button>
                        )}
                        {stop.status === 'COLLECTOR_ON_THE_WAY' && (
                          <button
                            onClick={() => {
                              if (matchingPickup) setSelectedForVerify(matchingPickup);
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                          >
                            Audit & Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Verification Modal */}
      <PickupVerificationModal
        pickup={selectedForVerify}
        isOpen={!!selectedForVerify}
        onClose={() => setSelectedForVerify(null)}
        onSuccess={fetchRoute}
      />
    </div>
  );
};
export default TodaysRoutePage;
