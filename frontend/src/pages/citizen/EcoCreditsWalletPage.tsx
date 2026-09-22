import React, { useEffect, useState } from 'react';
import { walletService } from '../../services';
import { Wallet, Transaction } from '../../types';
import { Coins, ArrowUpRight, ArrowDownLeft, Sparkles, Filter } from 'lucide-react';

export const EcoCreditsWalletPage: React.FC = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'EARNED' | 'REDEEMED'>('ALL');

  useEffect(() => {
    walletService.getWallet().then(setWallet).catch(() => {});
    walletService.getTransactions().then(setTransactions).catch(() => {});
  }, []);

  const filtered = transactions.filter((t) => {
    if (filter === 'EARNED') return t.type === 'EARNED_PICKUP' || t.amount > 0;
    if (filter === 'REDEEMED') return t.type === 'REDEEMED_REWARD' || t.amount < 0;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">EcoCredits Wallet</h1>
        <p className="text-sm text-slate-500 mt-1">
          Your digital recycling rewards balance and full transactional ledger.
        </p>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-700 to-teal-800 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold flex items-center gap-1.5 mb-1">
              <Coins className="w-4 h-4 text-amber-300" /> Current Available Balance
            </span>
            <div className="text-4xl font-black mt-2">{wallet?.balance ?? 0}</div>
            <p className="text-xs text-emerald-100/80 mt-2">
              Ready for reward redemption (1 EcoCredit ≈ ₹1 municipal subsidy value)
            </p>
          </div>
          <Coins className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-32 h-32 text-white/10 pointer-events-none" />
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Earned All-Time</span>
            <div className="text-3xl font-bold text-emerald-600 mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-6 h-6 text-emerald-500" />
              <span>+{wallet?.totalEarned ?? 0}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">From verified plastic collections</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Redeemed</span>
            <div className="text-3xl font-bold text-slate-700 mt-2 flex items-center gap-1">
              <ArrowDownLeft className="w-6 h-6 text-slate-400" />
              <span>{wallet?.totalRedeemed ?? 0}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Used for passes, coupons & bills</p>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Transaction Ledger</h2>
            <p className="text-xs text-slate-400 mt-0.5">Chronological record of earned and redeemed EcoCredits</p>
          </div>

          <div className="flex gap-2">
            {(['ALL', 'EARNED', 'REDEEMED'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  filter === f ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No transactions found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-3 font-semibold">Transaction ID</th>
                  <th className="pb-3 font-semibold">Description</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-mono text-slate-400">#TX-{t.id}</td>
                    <td className="py-3 font-semibold text-slate-800">{t.description}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.amount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">{new Date(t.createdAt).toLocaleString()}</td>
                    <td className={`py-3 text-right font-bold text-sm ${t.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.amount > 0 ? `+${t.amount}` : t.amount} Credits
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