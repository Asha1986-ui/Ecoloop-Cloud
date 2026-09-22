import React from 'react';
import { PickupStatus } from '../types';

export const StatusBadge: React.FC<{ status: PickupStatus }> = ({ status }) => {
  const styles: Record<PickupStatus, { label: string; bg: string; text: string; dot: string }> = {
    REQUESTED: { label: 'Requested', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', dot: 'bg-amber-500' },
    ASSIGNED: { label: 'Assigned', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', dot: 'bg-blue-500' },
    COLLECTOR_ON_THE_WAY: { label: 'On The Way', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800', dot: 'bg-purple-500' },
    COLLECTED: { label: 'Collected', bg: 'bg-cyan-50 border-cyan-200', text: 'text-cyan-800', dot: 'bg-cyan-500' },
    VERIFIED: { label: 'Verified', bg: 'bg-teal-50 border-teal-200', text: 'text-teal-800', dot: 'bg-teal-500' },
    CREDITS_AWARDED: { label: 'Credits Awarded 🎉', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', dot: 'bg-emerald-500' },
    CANCELLED: { label: 'Cancelled', bg: 'bg-rose-50 border-rose-200', text: 'text-rose-800', dot: 'bg-rose-500' },
  };

  const style = styles[status] || styles.REQUESTED;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
};

export default StatusBadge;
