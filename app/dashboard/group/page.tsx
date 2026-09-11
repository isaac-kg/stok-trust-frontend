"use client";

import Link from "next/link";
import { Filter, MapPin, Plus, Search, Users } from "lucide-react";
import JoinBanner from "@/components/components/JoinBanner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import EmptyState from "@/components/components/EmptyState";
import { Card } from "@/components/ui/card";
import ReputationBadge from "@/components/shared/ReputableTab";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import { useFetchUserStokvelsQuery } from "@/features/stokvel/stokvel-api";
import { Stokvel } from "@/features/stokvel/model/types";
import { useAppSelector } from "@/store/hooks";
import Loader from "@/components/shared/loader";
import ErrorState from "@/components/shared/error-state";

export default function GroupPage(): React.ReactElement {

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
    const {
    data,
    isLoading: isLoadingStokvels,
    error: errorStokvels,
    isFetching,
    refetch
  } = useFetchUserStokvelsQuery(
    {
      searchTerm,
      roleFilter,
      page,
      size
    },
    {
      refetchOnMountOrArgChange: true,
      // pollingInterval: 120_000, // 2 minutes
      refetchOnFocus: true,
      refetchOnReconnect: true
    }
  );
  const user = useAppSelector((state) => state.auth.user);

  const { data: stokvels } = data || { data: [] };

  if (isLoadingStokvels) return <Loader message="Loading groups..." />;
  if (errorStokvels) {
    const message =
      'status' in errorStokvels
        ? `Request failed (${errorStokvels.status})`
        : errorStokvels.message ?? 'Something went wrong';
    return <ErrorState message={message} />;
  }


  //HANDLE ERROR AND LOADING
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Stokvels</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your stokvels and memberships
          </p>
        </div>
        <Button variant="default" asChild>
          <Link href="/dashboard/create-stokvel">
            <Plus className="h-4 w-4" />
            Create Stokvel
          </Link>
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search stokvels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Treasurer">Treasurer</SelectItem>
            <SelectItem value="Member">Member</SelectItem>
          </SelectContent>
        </Select>
      </div>


      {stokvels?.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8 text-slate-400" />}
          title={searchTerm || roleFilter !== 'all' ? "No matching stokvels" : "No stokvels yet"}
          description={searchTerm || roleFilter !== 'all'
            ? "Try adjusting your search or filters"
            : "Create your first stokvel or join an existing one to get started"}
          action={!searchTerm && roleFilter === 'all' ? () => window.location.href = '/dashboard/create-stokvel' : undefined}
          actionLabel="Create Stokvel"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {stokvels?.map((stokvel: Stokvel) => {
            return (
              <Link
                key={stokvel._id}
                href={`/dashboard/group/${stokvel._id}`}
              >
                <Card className="p-5 hover:shadow-md transition-all hover:border-emerald-200 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                      {stokvel.name?.[0]?.toUpperCase() || 'S'}
                    </div>
                    <StatusBadge status={stokvel.isActive ? 'active' : 'inactive'} />
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                    {stokvel.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span className="px-2 py-0.5 bg-slate-100 rounded-full">{stokvel.type || 'Savings'}</span>
                    <span>•</span>
                    <span>{stokvel?.adminIds?.includes(user?._id ?? "") ? 'Admin' : 'Member'}</span>
                  </div>

                  {stokvel.location && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                      <MapPin className="h-3 w-3" />
                      {stokvel.location}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <ReputationBadge
                      score={stokvel?.reputation ?? 0}
                      size="sm"
                    />
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Users className="h-3 w-3" />
                      {stokvel?.memberCount || 10}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
      <JoinBanner />
    </div>
  );
} 
