"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  ArrowRight,
  Wallet,
  ShoppingCart,
  TrendingUp,
  Heart,
  MoreHorizontal,
  MapPin,
  Globe,
  Navigation
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const groupTypes = [
  { value: 'Savings', label: 'Savings', icon: Wallet, description: 'Pool money for future goals', color: 'emerald' },
  { value: 'Grocery', label: 'Grocery', icon: ShoppingCart, description: 'Bulk buying power', color: 'blue' },
  { value: 'Investment', label: 'Investment', icon: TrendingUp, description: 'Grow wealth together', color: 'purple' },
  { value: 'Burial', label: 'Burial', icon: Heart, description: 'Support in difficult times', color: 'rose' },
  { value: 'Other', label: 'Other', icon: MoreHorizontal, description: 'Custom purpose', color: 'slate' },
];


export default function CreateStokvelPage(): React.ReactElement {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    scope: 'Local',
    province: '',
    city: '',
    locationDescription: '',
    defaultContributionAmount: '',
    contributionFrequency: 'Monthly',
    isNasasaRegistered: false,
    nasasaRegistrationNumber: '',
  });




  const isValid = formData.name && formData.type && formData.defaultContributionAmount;

  return (
    <div className="p-6">
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="-ml-2 mb-4" asChild>
          <Link href="/dashboard/group">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Stokvels
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">Create a stokvel</h1>
        <p className="text-sm text-slate-500 mt-1">
          Start a new savings group with trusted members
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Group Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Stokvel Name</Label>
              <Input
                id="name"
                placeholder="e.g., Soweto Sisters Savings"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* stokvel type */}
            <div>
              <Label htmlFor="type">Stokvel Type</Label>
              <div className="relative mt-1">
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select stokvel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell members what this stokvel is about..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Stokvel Scope</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, scope: 'Local' })}
                  className={`
                      flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                      ${formData.scope === 'Local'}
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-300'
                    `}
                >
                  <Navigation className="h-6 w-6 text-emerald-600" />
                  <div className="text-center">
                    <p className="font-medium text-sm">Local</p>
                    <p className="text-xs text-slate-500">Specific region/city</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, scope: 'National' })}
                  className={`
                      flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                      ${formData.scope === "National"}
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-300'
                    `}
                >
                  <Globe className="h-6 w-6 text-blue-600" />
                  <div className="text-center">
                    <p className="font-medium text-sm">National</p>
                    <p className="text-xs text-slate-500">Across South Africa</p>
                  </div>
                </button>
              </div>
            </div>

            {formData.scope === 'Local' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="province">Province/Region</Label>
                  <Select
                    value={formData.province}
                    onValueChange={(v) => setFormData({ ...formData, province: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                      <SelectItem value="Free State">Free State</SelectItem>
                      <SelectItem value="Gauteng">Gauteng</SelectItem>
                      <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                      <SelectItem value="Limpopo">Limpopo</SelectItem>
                      <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                      <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                      <SelectItem value="North West">North West</SelectItem>
                      <SelectItem value="Western Cape">Western Cape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">City/Town</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="city"
                      placeholder="e.g., Johannesburg, Soweto"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="location">Additional Location Details (Optional)</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="location"
                  placeholder="e.g., Meeting at Community Hall"
                  value={formData.locationDescription}
                  onChange={(e) => setFormData({ ...formData, locationDescription: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </Card >

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Contribution Settings</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Default Contribution Amount (Rands) *</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="500"
                  value={formData.defaultContributionAmount}
                  onChange={(e) => setFormData({ ...formData, defaultContributionAmount: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="frequency">Contribution Frequency</Label>
              <Select
                value={formData.contributionFrequency}
                onValueChange={(v) => setFormData({ ...formData, contributionFrequency: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">NASASA Registration</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Registered with NASASA?</p>
              <p className="text-sm text-slate-500">National Stokvel Association of South Africa</p>
            </div>
            <Switch
              checked={formData.isNasasaRegistered}
              onCheckedChange={(checked) => setFormData({ ...formData, isNasasaRegistered: checked })}
            />
          </div>

          {formData.isNasasaRegistered && (
            <div className="mt-4">
              <Label htmlFor="nasasa">NASASA Registration Number</Label>
              <Input
                id="nasasa"
                placeholder="Enter registration number"
                value={formData.nasasaRegistrationNumber}
                onChange={(e) => setFormData({ ...formData, nasasaRegistrationNumber: e.target.value })}
                className="mt-1"
              />
            </div>
          )}
        </Card>

        <div className="flex gap-3 justify-end">
          <Button
            type="submit"
            variant="default"

          >
            Create & Set Up Constitution
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </form >
    </div >
  );
}
