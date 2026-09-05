import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles = {
  // Contribution statuses
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Paid_On_Time: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Paid_Late: 'bg-orange-100 text-orange-800 border-orange-200',
  Missed: 'bg-red-100 text-red-800 border-red-200',
  
  // Payout statuses
  Pending_Approval: 'bg-blue-100 text-blue-800 border-blue-200',
  Approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
  Paid: 'bg-purple-100 text-purple-800 border-purple-200',
  
  // Membership statuses
  Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Suspended: 'bg-red-100 text-red-800 border-red-200',
  Left: 'bg-slate-100 text-slate-800 border-slate-200',
  
  // Vote statuses
  Open: 'bg-blue-100 text-blue-800 border-blue-200',
  Closed: 'bg-slate-100 text-slate-800 border-slate-200',
  
  // Dispute statuses
  'In Review': 'bg-amber-100 text-amber-800 border-amber-200',
  Resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  
  // Constitution statuses
  Draft: 'bg-slate-100 text-slate-800 border-slate-200',
  'Under Review': 'bg-amber-100 text-amber-800 border-amber-200',
  
  // Meeting statuses
  Scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200'
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const displayStatus = status?.replace(/_/g, ' ') || 'Unknown';
  const style = statusStyles[status as keyof typeof statusStyles] || 'bg-slate-100 text-slate-800 border-slate-200';
  
  return (
    <Badge variant="outline" className={cn('font-medium border', style, className)}>
      {displayStatus}
    </Badge>
  );
};

export default StatusBadge;