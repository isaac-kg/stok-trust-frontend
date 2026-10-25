"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Search, UserPlus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Table, { type TableColumn } from "@/components/shared/Table";
import EmptyState from "@/components/components/EmptyState";
import Loader from "@/components/shared/loader";
import ErrorState from "@/components/shared/error-state";
import { useAppSelector } from "@/store/hooks";
import { useGetStokvelMembersQuery } from "../stokvel-api";
import type { StokvelMember } from "../model/types";
import MakeUserStokvelAdmin from "./make-user-admin-modal";
import InviteMemberModal from "./invite-member-modal";
import { cn } from "@/lib/utils";

function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.trim()?.[0] ?? "";
  const last = lastName?.trim()?.[0] ?? "";
  return `${first}${last}`.toUpperCase() || "M";
}

function RoleBadge({ role }: { role?: string }): React.ReactElement {
  const isAdmin = role === "administrator";
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        isAdmin
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-blue-200 bg-blue-50 text-blue-700",
      )}
    >
      {isAdmin ? "Administrator" : "Member"}
    </span>
  );
}

interface MemberCardProps {
  member: StokvelMember;
  isStokvelAdmin: boolean;
  onMakeAdmin: (args: { userId: string; memberName: string }) => void;
}

function MemberCard({
  member,
  isStokvelAdmin,
  onMakeAdmin,
}: MemberCardProps): React.ReactElement {
  const firstName = member.userDetails?.profile.firstName;
  const lastName = member.userDetails?.profile.lastName;
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();

  return (
    <Card className="border-slate-200/80 p-4 shadow-sm">
      <div className=" items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Avatar className="h-11 w-11 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-semibold text-white">
                {getInitials(firstName, lastName)}
              </AvatarFallback>
            </Avatar>
            <p className="font-medium text-slate-900">{fullName || "Member"}</p>
            <RoleBadge role={member.role} />
          </div>
          <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate max-w-[150px]">{member.userDetails?.profile.email ?? "—"}</span>
          </p>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
            <Phone className="h-3 w-3 shrink-0" />
            {member.userDetails?.profile.cellNumber ?? "—"}
          </p>
          {isStokvelAdmin && member.role !== "administrator" && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="mt-3 w-full"
              onClick={() =>
                onMakeAdmin({
                  userId: member.userId ?? "",
                  memberName: fullName,
                })
              }
            >
              Make admin
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function StokvelMembers({
  id,
}: {
  id: string;
}): React.ReactElement {
  const user = useAppSelector((state) => state.auth.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [page] = useState(1);
  const [size] = useState(10);
  const [memberName, setMemberName] = useState("");
  const [userId, setUserId] = useState("");
  const [openMakeUserAdminModal, setOpenMakeUserAdminModal] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

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

  if (isLoadingStokvelMembers) return <Loader message="Loading members…" />;
  if (errorStokvelMembers) {
    const message =
      "status" in errorStokvelMembers
        ? `Request failed (${errorStokvelMembers.status})`
        : (errorStokvelMembers.message ?? "Something went wrong");
    return <ErrorState message={message} />;
  }

  function handleOpenMakeUserAdmin({
    userId: nextUserId,
    memberName: nextMemberName,
  }: {
    userId: string;
    memberName: string;
  }): void {
    setUserId(nextUserId);
    setMemberName(nextMemberName);
    setOpenMakeUserAdminModal(true);
  }

  const { stokvel, members = [] } = data ?? { stokvel: undefined, members: [] };
  const isStokvelAdmin = (stokvel?.adminIds ?? []).includes(user?._id ?? "");
  const memberCount = members.length;

  const columns: TableColumn<StokvelMember>[] = [
    {
      key: "name",
      header: "Member",
      render: (_, member) => {
        const firstName = member.userDetails?.profile.firstName;
        const lastName = member.userDetails?.profile.lastName;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-semibold text-white">
                {getInitials(firstName, lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900">
                {firstName} {lastName}
              </p>
              <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                <Mail className="h-3 w-3 shrink-0" />
                {member.userDetails?.profile.email ?? "—"}
              </p>
              <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                <Phone className="h-3 w-3 shrink-0" />
                {member.userDetails?.profile.cellNumber ?? "—"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "role",
      header: "Role",
      render: (value) => <RoleBadge role={String(value ?? "member")} />,
    },
    ...(isStokvelAdmin
      ? [
          {
            key: "actions",
            header: "Actions",
            render: (_: unknown, member: StokvelMember) =>
              member.role !== "administrator" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleOpenMakeUserAdmin({
                      userId: member.userId ?? "",
                      memberName: `${member.userDetails?.profile.firstName ?? ""} ${member.userDetails?.profile.lastName ?? ""}`.trim(),
                    })
                  }
                >
                  Make admin
                </Button>
              ) : (
                <span className="text-xs text-slate-400">—</span>
              ),
          } satisfies TableColumn<StokvelMember>,
        ]
      : []),
  ];

  return (
    <div className="p-6">
      <MakeUserStokvelAdmin
        isOpen={openMakeUserAdminModal}
        stokvelId={id}
        memberName={memberName}
        userId={userId}
        setIsOpen={setOpenMakeUserAdminModal}
        refresh={refetch}
      />
      <InviteMemberModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        stokvelId={id}
        stokvelName={stokvel?.name ?? ""}
      />

      <div className="mb-6">
        <Button variant="ghost" size="sm" className="-ml-4 mb-4" asChild>
          <Link href={`/dashboard/stokvel/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Stokvel
          </Link>
        </Button>

        <Card className="overflow-hidden border-slate-200/80 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Members
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    <Users className="h-3 w-3" />
                    {memberCount}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {stokvel?.name
                    ? `People in ${stokvel.name}`
                    : "View and manage stokvel members"}
                </p>
              </div>
              {isStokvelAdmin && (
                <Button
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => setInviteOpen(true)}
                >
                  <UserPlus className="mr-1 h-4 w-4" />
                  Invite member
                </Button>
              )}
            </div>
          </div>

          <div className="px-5 py-4 sm:px-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search members…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </Card>
      </div>

      {members.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8 text-slate-400" />}
          title={searchTerm ? "No matching members" : "No members yet"}
          description={
            searchTerm
              ? "Try a different name, email, or phone number"
              : isStokvelAdmin
                ? "Use Invite member above to add people to this stokvel"
                : "Members will appear here once they join"
          }
        />
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {members.map((member) => (
              <MemberCard
                key={member._id ?? member.userId}
                member={member}
                isStokvelAdmin={isStokvelAdmin}
                onMakeAdmin={handleOpenMakeUserAdmin}
              />
            ))}
          </div>
          <div className="hidden md:block">
            <Table
              columns={columns}
              data={members}
              loading={isLoadingStokvelMembers}
              emptyMessage="No members found."
            />
          </div>
        </>
      )}
    </div>
  );
}
