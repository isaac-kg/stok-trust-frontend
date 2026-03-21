import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Calculator, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BudgetCalculatorProps {
	compact?: boolean;
	onCalculate?: (data: any) => void;
}
export default function BudgetCalculator({ compact = false, onCalculate }: BudgetCalculatorProps): React.ReactElement {
	const [income, setIncome] = useState('');
	const [expenses, setExpenses] = useState({
		rent: '',
		utilities: '',
		food: '',
		transport: '',
		debt: '',
		other: ''
	});
	const [calculated, setCalculated] = useState(false);

	const handleCalculate = () => {
		if (income && parseFloat(income) > 0) {
			setCalculated(true);
			if (onCalculate) {
				onCalculate({
					income,
					totalExpenses,
					disposableIncome,
					safeContribution,
					maxSafeContribution,
					expenseRatio
				});
			}
		}
	};

	const clearCalculator = () => {
		setCalculated(false);
		setIncome('');
		setExpenses({
			rent: '',
			utilities: '',
			food: '',
			transport: '',
			debt: '',
			other: '',
		});
		if (onCalculate) {
			onCalculate(null);
		}
	};

	const totalExpenses = Object.values(expenses).reduce(
		(sum, val) => sum + (parseFloat(val) || 0),
		0
	);
	const disposableIncome = income && parseFloat(income) > 0 ? parseFloat(income) - totalExpenses : 0;
	const safeContribution = Math.max(0, disposableIncome * 0.3); // 30% of disposable income
	const emergencyFund = disposableIncome * 0.2; // 20% for emergency fund
	const maxSafeContribution = Math.max(0, disposableIncome * 0.5); // Maximum 50%

	const expenseRatio = income && parseFloat(income) > 0 ? (totalExpenses / parseFloat(income)) * 100 : 0;
	const isHealthy = expenseRatio < 70;

	if (compact) {
		return (
			<Card className="p-4">
				<div className="flex items-center gap-2 mb-4">
					<Calculator className="h-5 w-5 text-emerald-600" />
					<h3 className="font-semibold text-slate-900">Budget Calculator</h3>
				</div>

				<div className="space-y-3">
					<div>
						<Label className="text-xs">Take-home Income (R)</Label>
						<Input
							type="number"
							placeholder="0"
							value={income}
							onChange={(e) => setIncome(e.target.value)}
							className="mt-1"
						/>
					</div>

					{calculated && income && parseFloat(income) > 0 && (
						<div className="pt-3 border-t space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-slate-600">Safe Contribution</span>
								<span className="font-semibold text-emerald-600">
									R{safeContribution.toFixed(0)}
								</span>
							</div>
							<div className="flex justify-between text-xs text-slate-500">
								<span>Maximum Safe</span>
								<span>R{maxSafeContribution.toFixed(0)}</span>
							</div>
						</div>
					)}

					<Button
						onClick={handleCalculate}
						size="sm"
						className="w-full bg-emerald-600 hover:bg-emerald-700"
					>
						Calculate
					</Button>
				</div>
			</Card>
		);
	}

	return (
		<Card className="p-6">
			<div className="flex items-center gap-2 mb-6">
				<Calculator className="h-6 w-6 text-emerald-600" />
				<div>
					<h3 className="font-semibold text-lg text-slate-900">Budget Calculator</h3>
					<p className="text-sm text-slate-500">Calculate safe contribution amounts</p>
				</div>
			</div>

			<div className="space-y-6">
				{/* Income Input */}
				<div>
					<Label className="text-sm font-medium">Monthly Take-home Income (R)</Label>
					<Input
						type="number"
						placeholder="e.g., 15000"
						value={income}
						onChange={(e) => setIncome(e.target.value)}
						className="mt-1 text-lg"
					/>
				</div>

				{/* Expenses */}
				<div>
					<Label className="text-sm font-medium mb-2 block">Monthly Expenses (R)</Label>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<Label className="text-xs text-slate-500">Rent/Bond</Label>
							<Input
								type="number"
								placeholder="0"
								value={expenses.rent}
								onChange={(e) => setExpenses({ ...expenses, rent: e.target.value })}
								className="mt-1"
							/>
						</div>
						<div>
							<Label className="text-xs text-slate-500">Utilities</Label>
							<Input
								type="number"
								placeholder="0"
								value={expenses.utilities}
								onChange={(e) => setExpenses({ ...expenses, utilities: e.target.value })}
								className="mt-1"
							/>
						</div>
						<div>
							<Label className="text-xs text-slate-500">Food/Groceries</Label>
							<Input
								type="number"
								placeholder="0"
								value={expenses.food}
								onChange={(e) => setExpenses({ ...expenses, food: e.target.value })}
								className="mt-1"
							/>
						</div>
						<div>
							<Label className="text-xs text-slate-500">Transport</Label>
							<Input
								type="number"
								placeholder="0"
								value={expenses.transport}
								onChange={(e) => setExpenses({ ...expenses, transport: e.target.value })}
								className="mt-1"
							/>
						</div>
						<div>
							<Label className="text-xs text-slate-500">Debt Payments</Label>
							<Input
								type="number"
								placeholder="0"
								value={expenses.debt}
								onChange={(e) => setExpenses({ ...expenses, debt: e.target.value })}
								className="mt-1"
							/>
						</div>
						<div>
							<Label className="text-xs text-slate-500">Other</Label>
							<Input
								type="number"
								placeholder="0"
								value={expenses.other}
								onChange={(e) => setExpenses({ ...expenses, other: e.target.value })}
								className="mt-1"
							/>
						</div>
					</div>
				</div>

				<Button
					onClick={handleCalculate}
					className="w-full bg-emerald-600 hover:bg-emerald-700"
					disabled={!income || parseFloat(income) <= 0}
				>
					<Calculator className="h-4 w-4 mr-2" />
					Calculate Safe Contribution
				</Button>

				{/* Results */}
				{calculated && income && parseFloat(income) > 0 && (
					<div className="pt-0 space-y-4">
						<div className="flex justify-end">	
							<Button
								onClick={clearCalculator}
								variant="destructive"
								size="sm"
							>
								Clear Calculator
							</Button>
						</div>
						<div className={cn(
							"flex items-center gap-2 p-3 rounded-lg",
							isHealthy ? "bg-emerald-50" : "bg-amber-50"
						)}>
							{isHealthy ? (
								<CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
							) : (
								<AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
							)}
							<p className="text-sm text-slate-700">
								{isHealthy
									? "Your expense ratio is healthy"
									: "Your expenses are high - be cautious with contributions"}
							</p>
						</div>

						<div className="space-y-3">
							<div>
								<div className="flex justify-between mb-1">
									<span className="text-sm text-slate-600">Total Expenses</span>
									<span className="text-sm font-semibold text-slate-900">
										R{totalExpenses.toFixed(0)}
									</span>
								</div>
								<Progress value={expenseRatio} className="h-2" />
								<p className="text-xs text-slate-500 mt-1">
									{expenseRatio.toFixed(0)}% of income
								</p>
							</div>

							<div className="pt-3 space-y-3">
								<div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
									<span className="text-sm text-slate-700">Disposable Income</span>
									<span className="text-lg font-bold text-slate-900">
										R{disposableIncome.toFixed(0)}
									</span>
								</div>

								<div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
									<div>
										<p className="text-sm font-medium text-emerald-900">Recommended Contribution</p>
										<p className="text-xs text-emerald-700">30% of disposable income</p>
									</div>
									<span className="text-2xl font-bold text-emerald-600">
										R{safeContribution.toFixed(0)}
									</span>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div className="p-3 bg-blue-50 rounded-lg">
										<p className="text-xs text-blue-700 mb-1">Emergency Fund</p>
										<p className="text-sm font-semibold text-blue-900">
											R{emergencyFund.toFixed(0)}
										</p>
									</div>
									<div className="p-3 bg-amber-50 rounded-lg">
										<p className="text-xs text-amber-700 mb-1">Maximum Safe</p>
										<p className="text-sm font-semibold text-amber-900">
											R{maxSafeContribution.toFixed(0)}
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="p-3 bg-blue-50 rounded-lg">
							<p className="text-xs text-blue-900 font-medium mb-1">💡 Financial Tip</p>
							<p className="text-xs text-blue-800">
								Keep at least 20% of your disposable income for emergencies.
								Don't commit more than 50% to stokvel contributions to maintain financial flexibility.
							</p>
						</div>
					</div>
				)}
			</div>
		</Card>
	);
}