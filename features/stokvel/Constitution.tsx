'use client';
import React, { useState } from 'react';
import { 
  FileText, 
  ArrowRight,
  ArrowLeft,
  Check,
  Users,
  Wallet,
  Calendar,
  AlertTriangle,
  Scale,
  Edit
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const steps = [
  { id: 1, title: 'Purpose', icon: FileText, field: 'groupPurpose' },
  { id: 2, title: 'Membership', icon: Users, field: 'membershipRules' },
  { id: 3, title: 'Contributions', icon: Wallet, field: 'contributionRules' },
  { id: 4, title: 'Payouts', icon: Wallet, field: 'payoutRules' },
  { id: 5, title: 'Meetings', icon: Calendar, field: 'meetingRules' },
  { id: 6, title: 'Disputes', icon: AlertTriangle, field: 'disputeRules' },
  { id: 7, title: 'Amendments', icon: Edit, field: 'amendmentRules' },
];

const defaultTemplates = {
  groupPurpose: `The purpose of this stokvel is to:
- Pool financial resources among members
- Provide rotating payouts to members
- Build a culture of saving and financial discipline
- Support members in times of need`,

  membershipRules: `Membership Rules:
1. New members must be nominated by an existing member
2. All new members require majority approval by existing members
3. Members must maintain good standing (no missed payments)
4. Suspended members may appeal after 3 months
5. Members may leave with 30 days written notice`,

  contributionRules: `Contribution Rules:
1. Contributions are due on the 1st of each month
2. Late payments (after 5 days) incur a 10% penalty
3. Members who miss 2 consecutive payments will be suspended
4. All payments must include proof of payment
5. The Treasurer must verify all payments within 48 hours`,

  payoutRules: `Payout Rules:
1. Payouts rotate among members in order of joining
2. Payout amounts equal total contributions for the period
3. All payouts require majority vote approval
4. Payouts are processed within 5 business days of approval
5. Emergency payouts may be requested with 75% approval`,

  meetingRules: `Meeting Rules:
1. Monthly meetings are held on the last Saturday of each month
2. A quorum of 50% of members is required for decisions
3. Meeting minutes must be recorded and shared within 48 hours
4. Decisions require simple majority unless otherwise specified
5. Members may attend virtually if unable to attend in person`,

  disputeRules: `Dispute Resolution:
1. Disputes must be submitted in writing to the Admin
2. The Admin will review and respond within 7 days
3. If unresolved, disputes go to a member vote
4. Decisions of the group are final
5. Persistent disputes may result in membership review`,

  amendmentRules: `Constitution Amendments:
1. Any member may propose amendments
2. Amendments require 75% member approval
3. A 14-day notice period applies to all amendment votes
4. Amendments take effect immediately upon approval
5. Core rules (contributions, payouts) require 90% approval`,
};

export default function ConstitutionBuilder({ id }: { id: string }) {
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('groupId');

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    groupPurpose: defaultTemplates.groupPurpose,
    membershipRules: defaultTemplates.membershipRules,
    contributionRules: defaultTemplates.contributionRules,
    payoutRules: defaultTemplates.payoutRules,
    meetingRules: defaultTemplates.meetingRules,
    disputeRules: defaultTemplates.disputeRules,
    amendmentRules: defaultTemplates.amendmentRules,
  });


  const currentStepData = steps[currentStep - 1];
  const progress = (currentStep / steps.length) * 100;

  

  return (
    <div className="p-6">
        {/* <Button variant="ghost" size="sm" className="-ml-2 mb-4" asChild> <Link href="/dashboard/group">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Stokvels
          </Link></Button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Create the rules for your stokvel</h1>
          <p className="text-sm text-slate-500 mt-1">
            Define the rules for your stokvel
          </p>
        </div> */}

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
          <span>Step {currentStep} of {steps.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={cn(
                'flex flex-col items-center gap-1 px-2 min-w-[60px] transition-colors',
                isCurrent ? 'text-emerald-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'
              )}
            >
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors',
                isCurrent ? 'border-emerald-600 bg-emerald-50' :
                isCompleted ? 'border-emerald-600 bg-emerald-600 text-white' :
                'border-slate-300 bg-white'
              )}>
                {isCompleted ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span className="text-xs font-medium hidden sm:block">{step.title}</span>
            </button>
          );
        })}
      </div>

      {/* Current Step Content */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <currentStepData.icon className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{currentStepData.title}</h2>
            <p className="text-sm text-slate-500">Define the rules for this section</p>
          </div>
        </div>

        <div>
          <Label>Rules & Guidelines</Label>
          <Textarea
            value={formData[currentStepData.field as keyof typeof formData] as string}
            onChange={(e) => setFormData({...formData, [currentStepData.field as keyof typeof formData]: e.target.value})}
            className="mt-2 min-h-[200px] font-mono text-sm"
            placeholder="Enter rules..."
          />
          <p className="text-xs text-slate-500 mt-2">
            You can edit the template or write your own rules
          </p>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        )}
        
        {currentStep < steps.length ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            Save & Submit for Approval
            <Check className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}