"use client";

import React, { useState } from 'react';
import {
  Phone,
  CreditCard,
  Camera,
  Check,
  AlertTriangle,
  Clock,
  Users,
  Award,
  Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import ReputationBadge, { getReputationLevel } from '@/components/shared/ReputableTab';
import StatCard from '@/components/shared/StatCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ProfileEditForm } from '@/features/profile/components/profile-edit-form';
import type { ProfileEditFormValues } from '@/features/profile/schemas/profile-edit.schema';
import { useUpdateUserMutation } from '@/features/users/users-api';
import { patchUserProfile, setAuth } from '@/features/auth/auth-slice';
import { toast } from 'sonner';

export default function ProfilePage(): React.ReactElement {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const [updateUser] = useUpdateUserMutation();

  const isLoading = false;
  const memberships: any[] = [];

  // const { data: user, isLoading } = useQuery({
  //   queryKey: ['currentUser'],
  //   queryFn: () => base44.auth.me(),
  // });

  // const { data: memberships = [] } = useQuery({
  //   queryKey: ['userMemberships', user?.id],
  //   queryFn: () => base44.entities.GroupMembership.filter({ 
  //     userEmail: user?.email,
  //     status: 'Active'
  //   }),
  //   enabled: !!user?.email,
  // });

  // const updateProfileMutation = useMutation({
  //   mutationFn: async (data) => {
  //     await base44.auth.updateMe(data);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['currentUser']);
  //     setIsEditing(false);
  //   },
  // });

  function getProfileEditInitialValues(): ProfileEditFormValues {
    return {
      phoneNumber: user?.profile?.cellNumber ?? '',
      nationalIdNumber: user?.profile?.idNumber ?? '',
    };
  }

  async function handleProfileSubmit(values: ProfileEditFormValues): Promise<void> {
    const userId = user?._id;
    if (!userId) {
      toast.error('Cannot update profile', {
        description: 'Your account is missing a user id. Please sign in again.',
      });
      return;
    }

    try {
      await updateUser({
        id: userId,
        body: {
          ...user,
          profile: {
            ...user?.profile,
            cellNumber: values.phoneNumber,
            idNumber: values.nationalIdNumber,
          },
        },
      }).unwrap();
      toast.success('Profile updated');
      dispatch(setAuth({
        accessToken: user?.accessToken,
        refreshToken: user?.refreshToken,
        user: {
          ...user,
          profile: {
              ...user?.profile,
              cellNumber: values.phoneNumber,
              idNumber: values.nationalIdNumber,
            },
          },
        }));
      setIsEditing(false);
    } catch {
      toast.error('Update failed', {
        description: 'Could not save your profile. Please try again.',
      });
    }
  }

  if (isLoading) {
    //TODO: Create a loading spinner component.
    return <Loader2 className="h-4 w-4 mr-2 animate-spin" />;
  }

  const userScore = {
    score: 50,
    level: 'New',
    goblalReputationScore: 50,
    goblalReputationLevel: 'New',
    totalOnTimePayments: 0,
    totalLatePayments: 0,
    totalMissedPayments: 0,
    totalPayments: 0,
    onTimeRate: 0,
    disputes: 0,
    reputationByGroup: [],
    totalDisputesInvolved: 0,
  }

  const globalScore = userScore?.goblalReputationScore || 50;
  const globalLevel = userScore?.goblalReputationLevel || getReputationLevel(globalScore);

  const totalPayments = (userScore?.totalOnTimePayments || 0) + (userScore?.totalLatePayments || 0) + (userScore?.totalMissedPayments || 0);
  const onTimeRate = totalPayments > 0
    ? Math.round((userScore?.totalOnTimePayments || 0) / totalPayments * 100)
    : 100;

  return (
    <div className="p-6">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account and view your reputation</p>
      </div>


      {/* Profile Card */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.profile?.profilePhotoUrl} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-2xl">
                {user?.profile?.firstName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 h-8 w-8 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-200 hover:bg-slate-50">
              <Camera className="h-4 w-4 text-slate-600" />
            </button>
          </div>

          <div className="w-full sm:flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{user?.profile?.firstName} {user?.profile?.lastName}</h2>
                <p className="text-sm text-slate-500">{user?.profile?.email}</p>
              </div>
              <ReputationBadge score={globalScore} level={globalLevel} size="lg" />
            </div>

            {!isEditing ? (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="h-4 w-4" />
                  {user?.profile?.cellNumber || 'No phone number'}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CreditCard className="h-4 w-4" />
                  {user?.profile?.idNumber ? '••••••••' + user?.profile?.idNumber?.slice(-4) : 'No ID number'}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="mt-3"
                >
                  Edit Profile
                </Button>
              </div>
            ) : (
              <ProfileEditForm
                initialValues={getProfileEditInitialValues()}
                onCancel={() => setIsEditing(false)}
                onSubmit={handleProfileSubmit}
              />
            )}
          </div>
        </div>
      </Card>

      {/* Reputation Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Award}
          label="Trust Score"
          value={Math.round(globalScore)}
          subValue="out of 100"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          icon={Users}
          label="Stokvels"
          value={memberships.length}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Check}
          label="On-Time Rate"
          value={onTimeRate}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          icon={AlertTriangle}
          label="Disputes"
          value={userScore?.totalDisputesInvolved || 0}
          iconBg={(userScore?.totalDisputesInvolved || 0) > 0 ? "bg-red-100" : "bg-slate-100"}
          iconColor={(userScore?.totalDisputesInvolved || 0) > 0 ? "text-red-600" : "text-slate-400"}
        />
      </div>

      {/* Payment History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment History</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-slate-700">On Time</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{userScore?.totalOnTimePayments || 0}</span>
            </div>
            <Progress
              value={totalPayments > 0 ? ((userScore?.totalOnTimePayments || 0) / totalPayments) * 100 : 0}
              className="h-2 bg-slate-100"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-sm font-medium text-slate-700">Late</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{userScore?.totalLatePayments || 0}</span>
            </div>
            <Progress
              value={totalPayments > 0 ? ((userScore?.totalLatePayments || 0) / totalPayments) * 100 : 0}
              className="h-2 bg-slate-100"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-slate-700">Missed</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{userScore?.totalMissedPayments || 0}</span>
            </div>
            <Progress
              value={totalPayments > 0 ? ((userScore?.totalMissedPayments || 0) / totalPayments) * 100 : 0}
              className="h-2 bg-slate-100"
            />
          </div>
        </div>
      </Card>

      {/* Reputation by Group */}
      {memberships.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Reputation by Stokvel</h3>
          <div className="space-y-4">
            {memberships.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                    {m.groupName?.[0] || 'S'}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{m.groupName}</p>
                    <p className="text-xs text-slate-500">{m.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Check className="h-3 w-3" /> {m.totalOnTimePayments || 0}
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <Clock className="h-3 w-3" /> {m.totalMissedPayments || 0}
                    </div>
                  </div>
                  <ReputationBadge
                    score={m.reputationInGroup}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}