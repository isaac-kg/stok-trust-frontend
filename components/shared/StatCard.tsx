import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
        
//covert this to make use of typescript and follow the rules of the project.
interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  subValue?: string;
  trend?: number;
  trendUp?: boolean;
  className?: string;
  iconBg?: string;
  iconColor?: string;
}

export default function StatCard({ icon: Icon, label, value, subValue, trend, trendUp, className, iconBg = 'bg-slate-100', iconColor = 'text-slate-600' }: StatCardProps): React.ReactElement {
    return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {subValue && (
            <p className="text-xs text-slate-500 mt-0.5">{subValue}</p>
          )}
          {trend !== undefined && (
            <p className={cn(
              'text-xs font-medium mt-1',
              trendUp ? 'text-emerald-600' : 'text-red-600'
            )}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', iconBg)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        )}
      </div>
    </Card>
  );
}