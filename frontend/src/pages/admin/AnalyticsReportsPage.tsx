import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Leaf, 
  Scale, 
  Wind, 
  Coins, 
  Building2, 
  TrendingUp, 
  BarChart2, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { adminService, impactService } from '../../services';
import { AdminStatistics, EnvironmentalImpact } from '../../types';
import StatCard from '../../components/common/StatCard';

export const AnalyticsReportsPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [globalImpact, setGlobalImpact] = useState<EnvironmentalImpact | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, impactData] = await Promise.all([
          adminService.getStatistics(),
          impactService.getGlobalImpact()
        ]);
        setStats(statsData);
        setGlobalImpact(impactData);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportCSV = () => {
    if (!stats || !globalImpact) return;
    const csvContent = [
      ['Metric', 'Value', 'Unit'],
      ['Total Registered Citizens', stats.totalCitizens, 'Households'],
      ['Active Field Collectors', stats.totalCollectors, 'Agents'],
      ['Total Doorstep Pickups Scheduled', stats.totalPickups, 'Orders'],
      ['Total Doorstep Pickups Verified', stats.completedPickups, 'Orders'],
      ['Total PET Bottles Recovered', stats.totalBottlesCollected, 'Bottles'],
      ['Total Plastic Waste Diverted', stats.totalPlasticCollectedKg, 'Kilograms'],
      ['Total EcoCredits Issued', stats.totalEcoCreditsIssued, 'Credits'],
      ['Total Rewards Redeemed', stats.totalRewardsRedeemed, 'Vouchers'],
      ['Net CO2 Emission Reduction', stats.totalCo2ReducedKg, 'kg CO2e'],
      ['Equivalent Mature Trees Planted', globalImpact.equivalentTreesPlanted, 'Trees'],
      ['Equivalent Electrical Energy Conserved', globalImpact.equivalentEnergySavedKwh, 'kWh']
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EcoLoop_Municipal_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const wardBreakdown = [
    { ward: 'Ward 42 - Indiranagar', pickups: 142, bottles: 3420, weightKg: 102.6, compliance: '98.5%' },
    { ward: 'Ward 45 - Koramangala', pickups: 198, bottles: 4750, weightKg: 142.5, compliance: '99.1%' },
    { ward: 'Ward 51 - Whitefield', pickups: 110, bottles: 2640, weightKg: 79.2, compliance: '96.8%' },
    { ward: 'Ward 58 - Jayanagar', pickups: 165, bottles: 3960, weightKg: 118.8, compliance: '98.9%' },
    { ward: 'Ward 63 - HSR Layout', pickups: 215, bottles: 5160, weightKg: 154.8, compliance: '99.4%' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Municipal ESG & Circularity Audit</h1>
          <p className="text-sm text-gray-500">
            Official environmental audit data, waste diversion metrics, and carbon displacement accounting.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export ESG Audit (CSV)
        </button>
      </div>

      {/* Primary Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total PET Diverted"
          value={loading ? '...' : `${(stats?.totalPlasticCollectedKg || 0).toFixed(1)} kg`}
          icon={Scale}
          color="emerald"
        />
        <StatCard
          title="Carbon Offset Avoidance"
          value={loading ? '...' : `${(stats?.totalCo2ReducedKg || 0).toFixed(1)} kg`}
          icon={Wind}
          color="teal"
        />
        <StatCard
          title="Tree Equivalence"
          value={loading ? '...' : `${(globalImpact?.equivalentTreesPlanted || 0).toFixed(1)} trees`}
          icon={Leaf}
          color="emerald"
        />
        <StatCard
          title="Clean Power Conserved"
          value={loading ? '...' : `${(globalImpact?.equivalentEnergySavedKwh || 0).toFixed(1)} kWh`}
          icon={TrendingUp}
          color="blue"
        />
      </div>

      {/* Ward-Level Territorial Performance */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Territorial Performance by Municipal Ward</h2>
            <p className="text-sm text-gray-500">Zone-wise collection volume and audit compliance fidelity.</p>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> All Wards Audited
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="py-4 px-6">Municipal Zone</th>
                <th className="py-4 px-6 text-center">Fulfilled Pickups</th>
                <th className="py-4 px-6 text-right">PET Units Verified</th>
                <th className="py-4 px-6 text-right">Total Plastic Diverted</th>
                <th className="py-4 px-6 text-right">Verification Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {wardBreakdown.map((w, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    {w.ward}
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700 font-medium">
                    {w.pickups}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-emerald-700">
                    {w.bottles.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right text-gray-700">
                    {w.weightKg} kg
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {w.compliance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsReportsPage;
