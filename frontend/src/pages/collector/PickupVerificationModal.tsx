import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Scale, Coins, Camera, FileText } from 'lucide-react';
import { PickupRequest } from '../../types';
import { collectorService } from '../../services';
import Modal from '../../components/common/Modal';

interface PickupVerificationModalProps {
  pickup: PickupRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PickupVerificationModal: React.FC<PickupVerificationModalProps> = ({
  pickup,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [actualBottleCount, setActualBottleCount] = useState<number>(pickup?.estimatedBottleCount || 10);
  const [actualWeight, setActualWeight] = useState<number>(pickup?.estimatedWeight || 0.25);
  const [notes, setNotes] = useState<string>('');
  const [verificationImage, setVerificationImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-calculate expected EcoCredits (5 credits per bottle verified)
  const calculatedCredits = (actualBottleCount || 0) * 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup) return;

    if (actualBottleCount <= 0) {
      setErrorMsg('Please enter a valid verified bottle count greater than 0.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      await collectorService.verifyPickup(pickup.id, {
        actualBottleCount: Number(actualBottleCount),
        actualWeight: Number(actualWeight),
        notes: notes.trim() || undefined,
        verificationImage: verificationImage.trim() || undefined
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!pickup) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Audited Pickup Verification">
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Citizen & Request Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-1.5 text-xs text-gray-600">
          <div className="flex justify-between font-semibold text-gray-900 text-sm">
            <span>Citizen: {pickup.citizenName}</span>
            <span className="text-emerald-700">Pickup #{pickup.id}</span>
          </div>
          <p className="text-gray-500">Address: {pickup.address}, {pickup.city}</p>
          <div className="pt-2 flex justify-between border-t border-gray-200 text-gray-700">
            <span>Reported Estimate: <strong>{pickup.estimatedBottleCount || 'N/A'} bottles</strong></span>
            <span>Est. Weight: <strong>{pickup.estimatedWeight || 'N/A'} kg</strong></span>
          </div>
        </div>

        {/* Audit Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-600" />
              Verified Bottle Count *
            </label>
            <input
              type="number"
              min="1"
              max="5000"
              required
              value={actualBottleCount}
              onChange={(e) => {
                const count = Math.max(0, parseInt(e.target.value) || 0);
                setActualBottleCount(count);
                // Also auto-estimate weight ~0.025kg per bottle if left default
                setActualWeight(Number((count * 0.025).toFixed(2)));
              }}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-600" />
              Verified Weight (kg) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.05"
              required
              value={actualWeight}
              onChange={(e) => setActualWeight(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Credit Reward Simulation */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-900">
            <Coins className="w-5 h-5 text-amber-500" />
            <div>
              <span className="text-xs text-emerald-700 block font-medium">Auto-Award Calculation</span>
              <span className="text-sm font-bold">{actualBottleCount} bottles × 5 EcoCredits</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-700">+{calculatedCredits}</span>
            <span className="text-xs text-emerald-600 block">EcoCredits</span>
          </div>
        </div>

        {/* Audit Notes */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-gray-400" />
            Verification Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. All PET grade 1 clean bottles, labels intact"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            {loading ? 'Submitting...' : 'Confirm & Award Credits'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default PickupVerificationModal;
