"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";

import { useGetStokvelMembersQuery } from "../stokvel-api";
import Loader from "@/components/shared/loader";
import EmptyState from "@/components/components/EmptyState";
import ErrorState from "@/components/shared/error-state";
import Table, { TableColumn } from "@/components/shared/Table";
import { StokvelMember } from "../model/types";

export default function StokvelMembers({
  id,
}: {
  id: string;
}): React.ReactElement {
  console.log("id =>", id);
  // ✅ ALL hooks first, before any early returns

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const {
    data,
    isLoading: isLoadingStokvelMembers,
    error: errorStokvelMembers,
  } = useGetStokvelMembersQuery({
    searchTerm,
    stokvelId: id ?? "",
    page,
    size,
  });

  if (isLoadingStokvelMembers) return <Loader message="Loading members..." />;
  if (errorStokvelMembers) {
    const message =
      "status" in errorStokvelMembers
        ? `Request failed (${errorStokvelMembers.status})`
        : (errorStokvelMembers.message ?? "Something went wrong");
    return <ErrorState message={message} />;
  }

  const { stokvel, members } = data || { data: { stokvel: {}, members: [] } };
  const columns: TableColumn<StokvelMember>[] = [
  {
    key: 'name',
    header: 'Member',
    render: (_, member) => (
      <div>
        <p className="font-medium text-slate-900">{member.userDetails?.profile.firstName} {member.userDetails?.profile.lastName}</p>
        <p className="text-xs text-slate-500">{member.userDetails?.profile.email}</p>
      </div>
    ),
  },
  {
    key: 'role',
    header: 'Role',
    render: (value) => (
      <span className="capitalize">
        {String(value).toLowerCase()}
      </span>
    ),
  },
];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {stokvel?.name} Members
          </h1>
          <p className="text-sm text-slate-500 mt-1">View & Manage Members</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {members?.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8 text-slate-400" />}
          title={searchTerm ? "No matching members" : "No members yet"}
          description={
            searchTerm
              ? "Try adjusting your search or filters"
              : "Create your first stokvel or join an existing one to get started"
          }
          action={
            !searchTerm
              ? () => (window.location.href = "/dashboard/create-stokvel")
              : undefined
          }
          actionLabel="Create Stokvel"
        />
      ) : (
        <div>
          <Table
                columns={columns}
                data={members ?? []}
                loading={isLoadingStokvelMembers}
              />
        </div>
      )}
    </div>
  );
}
