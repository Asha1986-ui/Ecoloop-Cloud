import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  Coins, 
  Recycle, 
  ShieldCheck, 
  UserX, 
  UserCheck, 
  RefreshCw,
  Mail,
  Phone
} from 'lucide-react';
import { adminService } from '../../services';
import { Citizen } from '../../types';

export const CitizenManagementPage: React.FC = () => {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchCitizens = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCitizens();
      setCitizens(data);
    } catch (err) {
      console.error('Failed to load citizens', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens();
  }, []);

  const handleToggleStatus = async (id: number) => {
    try {
      setActionLoadingId(id);
      await adminService.toggleUserStatus(id);
      await fetchCitizens();
    } catch (err) {
      console.error('Failed to toggle status', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = citizens.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citizen Residents Directory</h1>
          <p className="text-sm text-gray-500">
            Monitor registered recycling households, track earned EcoCredits, and manage account authorization.
          </p>
        </div>
        <button
          onClick={fetchCitizens}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by resident name, email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium">
          Showing {filtered.length} of {citizens.length} registered
        </span>
      </div>

      {/* Citizens Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No Citizens Found</h3>
            <p className="text-sm text-gray-500 mt-1">Try refining your search keyword.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                  <th className="py-4 px-6">Citizen</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6 text-center">Pickups</th>
                  <th className="py-4 px-6 text-right">Bottles</th>
                  <th className="py-4 px-6 text-right">EcoCredits</th>
                  <th className="py-4 px-6 text-center">Account Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filtered.map((citizen) => (
                  <tr key={citizen.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                          {citizen.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{citizen.name}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {citizen.email}
                          </div>
                          {citizen.phone && (
                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" /> {citizen.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <span className="flex items-center gap-1 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {citizen.city || 'Bangalore'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-medium text-gray-800">
                      {citizen.totalPickups || 0}
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-gray-900">
                      {(citizen.bottlesRecycled || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-emerald-600">
                      {(citizen.ecoCredits || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        citizen.active 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {citizen.active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(citizen.id)}
                        disabled={actionLoadingId === citizen.id}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          citizen.active
                            ? 'bg-red-50 hover:bg-red-100 text-red-700'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {citizen.active ? (
                          <>
                            <UserX className="w-3.5 h-3.5" /> Suspend
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
    </div>
  );
};
export default CitizenManagementPage;
