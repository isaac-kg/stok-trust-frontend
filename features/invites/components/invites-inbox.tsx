"use client";

import { useState } from "react";
import { Calendar, Eye, Mail, Users } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/components/EmptyState";
import Table, { type TableColumn } from "@/components/shared/Table";
import Loader from "@/components/shared/loader";
import ErrorState from "@/components/shared/error-state";
import {
  useGetMyInvitesQuery,
  useUpdateInviteMutation,
} from "@/features/stokvel/stokvel-api";
import type { MyInviteItem } from "../model/types";
import { InviteDetailModal } from "./invite-detail-modal";

function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function invitedByLabel(invite: MyInviteItem): string {
  if (invite.invitedBy) {
    return `${invite.invitedBy.firstName} ${invite.invitedBy.lastName}`;
  }
  return "—";
}

function InviteStatusBadge({
  status,
}: {
  status: MyInviteItem["status"];
}): React.ReactElement {
  const classes =
    status === "accepted"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "declined"
        ? "border-slate-200 bg-slate-100 text-slate-600"
        : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${classes}`}>
      {status}
    </span>
  );
}

interface InviteCardProps {
  invite: MyInviteItem;
  onView: (invite: MyInviteItem) => void;
}

function InviteCard({
  invite,
  onView,
}: InviteCardProps): React.ReactElement {
  return (
    <Card className="border-slate-200/80 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-900">
              {invite.stokvel?.name ?? "Stokvel unavailable"}
            </p>
            <InviteStatusBadge status={invite.status} />
          </div>
          {invite.stokvel?.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">
              {invite.stokvel.description}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-slate-500">
            Invited by {invitedByLabel(invite)}
          </p>
          <p className="mt-1 font-mono text-xs tracking-wide text-slate-500">
            {invite.inviteCode}
          </p>
          <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="h-3 w-3" />
            Sent {formatDate(invite.invitedAt)}
            {invite.expiresAt ? ` · Expires ${formatDate(invite.expiresAt)}` : ""}
          </p>
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="mt-3 w-full"
        onClick={() => onView(invite)}
      >
        <Eye className="h-3.5 w-3.5" />
        View
      </Button>
    </Card>
  );
}

export function InvitesInbox(): React.ReactElement {
  const {
    data,
    isLoading,
    isError,
  } = useGetMyInvitesQuery();
  const [updateInvite, { isLoading: isUpdating }] = useUpdateInviteMutation();
  const [selected, setSelected] = useState<MyInviteItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const invites = data?.data ?? [];

  function openDetail(invite: MyInviteItem): void {
    setSelected(invite);
    setDetailOpen(true);
  }

  async function handleInviteDecision(
    invite: MyInviteItem,
    newInviteStatus: "accepted" | "declined",
  ): Promise<void> {
    try {
      await updateInvite({
        code: invite.inviteCode,
        newInviteStatus,
      }).unwrap();
      toast.success(
        newInviteStatus === "accepted"
          ? `Accepted invite to ${invite.stokvel?.name ?? "stokvel"}`
          : `Declined invite to ${invite.stokvel?.name ?? "stokvel"}`,
      );
      setDetailOpen(false);
      setSelected(null);
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message ?? "Unable to update this invite. Please try again.");
    }
  }

  const columns: TableColumn<MyInviteItem>[] = [
    {
      key: "stokvel",
      header: "Stokvel",
      render: (_, row) => (
        <div className="max-w-[250px]">
          <p className="font-medium text-slate-900 line-clamp-1">
            {row.stokvel?.name ?? "Stokvel unavailable"}
          </p>
          {row.stokvel?.description ? (
            <p className="line-clamp-1 text-xs text-slate-500">
              {row.stokvel.description}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      key: "invitedBy",
      header: "Invited by",
      render: (_, row) => invitedByLabel(row),
    },
    {
      key: "inviteCode",
      header: "Code",
      render: (_, row) => (
        <span className="font-mono text-xs tracking-wide">{row.inviteCode}</span>
      ),
    },
    {
      key: "invitedAt",
      header: "Sent",
      render: (_, row) => formatDate(row.invitedAt),
    },
    {
      key: "expiresAt",
      header: "Expires",
      render: (_, row) => formatDate(row.expiresAt),
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => <InviteStatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => openDetail(row)}
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
      ),
    },
  ];

  if (isLoading) return <Loader message="Loading invites…" />;
  if (isError) return <ErrorState message="Unable to load your invites." />;

  return (
    <div className="p-6">
      <InviteDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        invite={selected}
        onAccept={(invite) => handleInviteDecision(invite, "accepted")}
        onDecline={(invite) => handleInviteDecision(invite, "declined")}
        isUpdating={isUpdating}
      />

      <div className="mb-6">
        <Card className="overflow-hidden border-slate-200/80 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Invites
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600">
                <Mail className="h-3 w-3" />
                {invites.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Review your stokvel invitations and their current status.
            </p>
          </div>

        </Card>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Users className="h-4 w-4 text-emerald-600" />
        <h2 className="text-sm font-semibold text-slate-900">Your invitations</h2>
      </div>

      {invites.length === 0 ? (
        <EmptyState
          icon={<Mail className="h-8 w-8 text-slate-400" />}
          title="No invites"
          description="There are no stokvel invitations associated with your account."
        />
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {invites.map((invite) => (
              <InviteCard
                key={invite._id}
                invite={invite}
                onView={openDetail}
              />
            ))}
          </div>
          <div className="hidden md:block">
            <Table columns={columns} data={invites} />
          </div>
        </>
      )}
    </div>
  );
}
