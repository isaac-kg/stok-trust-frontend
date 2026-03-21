import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, AlertCircle, Target, Loader2 } from 'lucide-react';
// import { base44 } from '@/api/base44Client';
// import { useMutation } from '@tanstack/react-query';
// import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface FinancialAdvisorProps {
	budgetData?: any;
	contributions?: any[];
	goals?: any[];
	memberships?: any[];
}

export default function FinancialAdvisor({
	budgetData,
	contributions = [],
	goals = [],
	memberships = []
}: FinancialAdvisorProps): React.ReactElement {
	const [advice, setAdvice] = useState(null);
	const hasData = false;


	//   const getAdviceMutation = useMutation({
	//     mutationFn: async () => {
	//       // Prepare financial context
	//       const totalContributions = contributions
	//         .filter(c => c.status === 'Paid_On_Time' || c.status === 'Paid_Late')
	//         .reduce((sum, c) => sum + (c.amountPaid || 0), 0);

	//       const missedPayments = contributions.filter(c => c.status === 'Missed').length;
	//       const latePayments = contributions.filter(c => c.status === 'Paid_Late').length;

	//       const activeGoals = goals.filter(g => g.status === 'Active');
	//       const totalGoalTarget = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
	//       const totalGoalProgress = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);

	//       const prompt = `You are a financial advisor specializing in helping South African stokvel members manage their finances.

	// FINANCIAL PROFILE:
	// - Monthly Income: R${budgetData.income || 0}
	// - Monthly Expenses: R${budgetData.totalExpenses || 0}
	// - Disposable Income: R${budgetData.disposableIncome || 0}
	// - Expense Ratio: ${budgetData.expenseRatio || 0}%

	// STOKVEL ACTIVITY:
	// - Active Stokvels: ${memberships.length}
	// - Total Contributions Made: R${totalContributions}
	// - Missed Payments: ${missedPayments}
	// - Late Payments: ${latePayments}
	// - Recommended Monthly Contribution: R${budgetData.safeContribution || 0}

	// GOALS:
	// - Active Goals: ${activeGoals.length}
	// - Total Goal Target: R${totalGoalTarget}
	// - Current Progress: R${totalGoalProgress}
	// - Progress: ${totalGoalTarget > 0 ? ((totalGoalProgress/totalGoalTarget)*100).toFixed(0) : 0}%

	// Please provide:
	// 1. An assessment of their current financial health (1-2 sentences)
	// 2. 3-4 specific, actionable recommendations to improve their financial situation
	// 3. Advice on whether they should increase, maintain, or reduce stokvel contributions
	// 4. Tips on achieving their financial goals faster

	// Keep it practical, empathetic, and culturally relevant to South African context. Use Rands (R) for currency. Be encouraging but honest.`;

	//       const result = await base44.integrations.Core.InvokeLLM({
	//         prompt,
	//         add_context_from_internet: false
	//       });

	//       return result;
	//     },
	//     onSuccess: (data) => {
	//       setAdvice(data);
	//     }
	//   });

	//   const hasData = budgetData?.income && parseFloat(budgetData.income) > 0;

	return (
		<Card className="p-6">
			<div className="flex items-center gap-2 mb-4">
				<Sparkles className="h-5 w-5 text-purple-600" />
				<div>
					<h3 className="font-semibold text-slate-900">AI Financial Advisor</h3>
					<p className="text-xs text-slate-500">Personalized insights for your finances</p>
				</div>
			</div>

			{!hasData ? (
				<div className="py-8 text-center">
					<AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
					<p className="text-sm text-slate-600 mb-2">
						Complete the budget calculator above to get personalized advice
					</p>
				</div>
			) : !advice ? (
				<div className="text-center py-8">
					<Button
						// onClick={() => getAdviceMutation.mutate()}
						// disabled={getAdviceMutation.isPending}
						className="bg-purple-600 hover:bg-purple-700"
					>
						{/* {getAdviceMutation.isPending ? ( */}
						{true ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Analyzing Your Finances...
							</>
						) : (
							<>
								<Sparkles className="h-4 w-4 mr-2" />
								Get Personalized Advice
							</>
						)}
					</Button>
				</div>
			) : (
				<div className="space-y-4">
					<div className="prose prose-sm prose-slate max-w-none">
						{/* <ReactMarkdown
							components={{
								h1: ({ children }) => <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">{children}</h3>,
								h2: ({ children }) => <h4 className="text-sm font-semibold text-slate-900 mt-3 mb-1">{children}</h4>,
								h3: ({ children }) => <h4 className="text-sm font-semibold text-slate-900 mt-3 mb-1">{children}</h4>,
								p: ({ children }) => <p className="text-sm text-slate-700 leading-relaxed mb-2">{children}</p>,
								ul: ({ children }) => <ul className="space-y-2 my-3">{children}</ul>,
								ol: ({ children }) => <ol className="space-y-2 my-3 list-decimal pl-4">{children}</ol>,
								li: ({ children }) => (
									<li className="text-sm text-slate-700 flex gap-2">
										<span className="text-emerald-600 font-bold">•</span>
										<span className="flex-1">{children}</span>
									</li>
								),
								strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
							}}
						>
							{advice}
						</ReactMarkdown> */}
					</div>

					<Button
						// onClick={() => getAdviceMutation.mutate()}
						variant="outline"
						size="sm"
						// disabled={getAdviceMutation.isPending}
						className="w-full"
					>
						{/* {getAdviceMutation.isPending ? ( */}
						{true ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Refreshing...
							</>
						) : (
							<>
								<Sparkles className="h-4 w-4 mr-2" />
								Refresh Advice
							</>
						)}
					</Button>
				</div>
			)}
		</Card>
	);
}