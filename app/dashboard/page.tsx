"use client";

import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import StatCard from '@/components/shared/StatCard';
import {
  Users,
  Wallet,
  TrendingUp,
  Vote,
} from 'lucide-react';
import ReputationBadge, { getReputationLevel } from '@/components/shared/ReputableTab';
import FinancialAdvisor from '@/components/components/FinencialAdvisor';
import BudgetCalculator from '@/components/components/BudgetCalculator';
import { useGetMyCredScoreQuery } from '@/features/cred-score/cred-score-api';


export default function DashboardPage(): React.ReactElement {
  const [budgetData, setBudgetData] = useState<any>(null);
  const user = useAppSelector((state) => state.auth.user);
  const {
    data: scoreRecord,
    isLoading,
    isUninitialized,
    isError: isScoreError,
  } = useGetMyCredScoreQuery(undefined, {
    skip: !user?._id,
    refetchOnMountOrArgChange: true,
  });
  const isScoreLoading = isLoading || isUninitialized;
  const stats = {
    myStokvels: 0,
    pendingPayments: 0,
    openVotes: 0,
  }
  const trustScore = scoreRecord?.credScore;

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 lg:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.profile?.firstName} {user?.profile?.lastName}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your stokvels and track your contributions
          </p>
        </div>
        {trustScore !== undefined ? (
          <ReputationBadge score={trustScore} level={getReputationLevel(trustScore)} size="lg" showScore={true} />
        ) : (
          <p className="text-sm text-slate-500">
            {isScoreLoading ? "Loading trust score…" : "Trust score unavailable"}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={Users}
          label="My Stokvels"
          value={stats.myStokvels}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Trust Score"
          value={trustScore === undefined ? (isScoreLoading ? "Loading…" : "—") : Math.round(trustScore)}
          subValue={isScoreError ? "Unable to load" : "out of 100"}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Wallet}
          label="Pending Payments"
          value={stats.pendingPayments}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
        <StatCard
          icon={Vote}
          label="Open Votes"
          value={stats.openVotes}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

       {/* Budget & Financial Advisor */}
       <div className="grid lg:grid-cols-2 gap-6">
        <BudgetCalculator onCalculate={setBudgetData} />
        <FinancialAdvisor 
          budgetData={budgetData}
          contributions={[]}
          goals={[]}
          memberships={[]}
        />
      </div>
    </div>
  );
}
