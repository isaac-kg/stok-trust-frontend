import React from 'react';
import { Shield, Star, Award, Trophy, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const levelConfig = {
  New: { icon: Shield, color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' },
  Building: { icon: Star, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  Trusted: { icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  Excellent: { icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  Elite: { icon: Crown, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' }
};

export function getReputationLevel(score: number): string | undefined {
  if (score >= 90) return 'Elite';
  if (score >= 75) return 'Excellent';
  if (score >= 60) return 'Trusted';
  if (score >= 40) return 'Building';
  return 'New';
}

interface ReputationBadgeProps {
  score: number;
  level: string | undefined;
  size: 'sm' | 'md' | 'lg';
  showScore: boolean;
}

export default function ReputationBadge({ score, level, size = 'md', showScore = true }: ReputationBadgeProps): React.ReactElement {
  const computedLevel = level || getReputationLevel(score || 50);
  const config = levelConfig[computedLevel as keyof typeof levelConfig] || levelConfig.New;
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2'
  };
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className={cn(
      'inline-flex items-center rounded-full border font-medium',
      config.bg, config.border, config.color,
      sizeClasses[size as keyof typeof sizeClasses]
    )}>
      <Icon className={iconSizes[size as keyof typeof iconSizes]} />
      <span>{computedLevel}</span>
      {showScore && score !== undefined && (
        <span className="opacity-75">({Math.round(score)})</span>
      )}
    </div>
  );
}