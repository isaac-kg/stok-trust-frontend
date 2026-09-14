"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import Table, { TableColumn } from "@/components/shared/Table";
import { StokvelMember } from "../model/types";
import { useAppSelector } from "@/store/hooks";
import { useGetStokvelMembersQuery } from "../stokvel-api";

import Link from "next/link";
import MakeUserStokvelAdmin from "./make-user-admin-modal";
import Loader from "@/components/shared/loader";
import ErrorState from "@/components/shared/error-state";
import EmptyState from "@/components/components/EmptyState";

export default function StokvelMembers({
  id,
}: {
  id: string;
}): React.ReactElement {
  const user = useAppSelector((state) => state.auth.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [memberName, setMemberName] = useState("");
  const [userId, setUserId] = useState("");
  const [openMakeUserAdminMOdal, setOpenMakeUserAdminMOdal] = useState(false);

  const {
    data,
    isLoading: isLoadingStokvelMembers,
    error: errorStokvelMembers,
    refetch,
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

  const handleOpenMakeUserAdmin = ({
    userId,
    memberName,
  }: {
    userId: string;
    memberName: string;
  }) => {
    setUserId(userId);
    setMemberName(memberName);
    setOpenMakeUserAdminMOdal(true);
  };

  const { stokvel, members } = data || { data: { stokvel: {}, members: [] } };

  const columns: TableColumn<StokvelMember>[] = [
    {
      key: "name",
      header: "Member",
      render: (_, member: StokvelMember) => (
        <div>
          <p className="font-medium text-slate-900">
            {member.userDetails?.profile.firstName}{" "}
            {member.userDetails?.profile.lastName}
          </p>
          <p className="text-xs text-slate-500">
            {member.userDetails?.profile.email}
          </p>
          <p className="text-xs text-slate-500">
            {member.userDetails?.profile.cellNumber}
          </p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (value) => (
        <span className="capitalize">{String(value).toLowerCase()}</span>
      ),
    },
    ...((stokvel?.adminIds || []).includes(user?._id ?? "")
      ? [
          {
            key: "actions",
            header: "Actions",
            render: (_, member: StokvelMember) => (
              <div className="flex gap-2">
                {member.role !== "administrator" ? (
                  <Button
                    type="button"
                    onClick={() =>
                      handleOpenMakeUserAdmin({
                        userId: member.userId ?? "",
                        memberName: `${member.userDetails?.profile.firstName} ${member.userDetails?.profile.lastName}`,
                      })
                    }
                    variant="default"
                    size="sm"
                  >
                    Make Admin
                  </Button>
                ) : (
                  <Button type="button" variant="destructive" size="sm">
                    Remove Admin
                  </Button>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="p-6">
      <MakeUserStokvelAdmin
        isOpen={openMakeUserAdminMOdal}
        stokvelId={id}
        memberName={memberName}
        userId={userId}
        setIsOpen={setOpenMakeUserAdminMOdal}
        refresh={refetch}
      />
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {stokvel?.name} Members
          </h1>
          <p className="text-sm text-slate-500 mt-1">View & Manage Members</p>
        </div>

        <div className="mb-8">
          <Button variant="ghost" size="sm" className="-ml-4 mb-4" asChild>
            <Link href={`/dashboard/group/${id}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Stokvel
            </Link>
          </Button>
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
