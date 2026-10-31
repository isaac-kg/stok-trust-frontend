"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Eye, Mail, Ticket, Users } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmptyState from "@/components/components/EmptyState";
import Table, { type TableColumn } from "@/components/shared/Table";
import { useLazyGetInviteByCodeQuery } from "@/features/stokvel/stokvel-api";
import type { InviteDetailsResponse } from "@/features/stokvel/model/types";
import { MOCK_MY_INVITES } from "../model/mock-invites";
import type { MyInviteItem } from "../model/types";
import { InviteDetailModal } from "./invite-detail-modal";

function mapInviteDetailsToItem(data: InviteDetailsResponse): MyInviteItem {
  return {
    _id: `code_${data.inviteCode}`,
    inviteCode: data.inviteCode,
    status: data.inviteStatus,
    invitedAt: new Date().toISOString(),
    invitee: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    },
    stokvel: {
      _id: data.stokvel._id,
      name: data.stokvel.name,
      description: data.stokvel.description,
    },
    constitution: data.constitution
      ? {
          version: data.constitution.version,
          purpose: data.constitution.purpose,
          membershipRules: data.constitution.membershipRules,
          contributionRules: data.constitution.contributionRules,
          payoutRules: data.constitution.payoutRules,
        }
      : null,
  };
}

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

interface PendingInviteCardProps {
  invite: MyInviteItem;
  onView: (invite: MyInviteItem) => void;
}

function PendingInviteCard({
  invite,
  onView,
}: PendingInviteCardProps): React.ReactElement {
  return (
    <Card className="border-slate-200/80 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-900">{invite.stokvel.name}</p>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              Pending
            </span>
          </div>
          {invite.stokvel.description ? (
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
  const router = useRouter();
  const [fetchInviteByCode] = useLazyGetInviteByCodeQuery();
  const [code, setCode] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [pendingInvites, setPendingInvites] =
    useState<MyInviteItem[]>(MOCK_MY_INVITES);
  const [selected, setSelected] = useState<MyInviteItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  async function handleOpenInvite(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) {
      toast.error("Enter a valid invite code");
      return;
    }

    const fromList = pendingInvites.find(
      (invite) => invite.inviteCode.toUpperCase() === trimmed,
    );
    if (fromList) {
      openDetail(fromList);
      return;
    }

    setIsLookingUp(true);
    try {
      const data = await fetchInviteByCode(trimmed).unwrap();
      openDetail(mapInviteDetailsToItem(data));
    } catch {
      toast.error("Invite not found for that code");
    } finally {
      setIsLookingUp(false);
    }
  }

  function openDetail(invite: MyInviteItem): void {
    setSelected(invite);
    setDetailOpen(true);
  }

  function handleAccept(invite: MyInviteItem): void {
    setDetailOpen(false);
    // Real accept still goes through join flow (auth + constitution confirm).
    router.push(`/join/${invite.inviteCode}`);
  }

  function handleDecline(invite: MyInviteItem): void {
    // Mock: remove locally. Real: PUT /stokvels/:code/update-invite { newInviteStatus: "declined" }
    setPendingInvites((prev) => prev.filter((i) => i._id !== invite._id));
    setDetailOpen(false);
    setSelected(null);
    toast.success(`Declined invite to ${invite.stokvel.name}`);
  }

  const columns: TableColumn<MyInviteItem>[] = [
    {
      key: "stokvel",
      header: "Stokvel",
      render: (_, row) => (
        <div className="max-w-[250px]">
          <p className="font-medium text-slate-900 line-clamp-1">{row.stokvel.name}</p>
          {row.stokvel.description ? (
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
      render: () => (
        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
          Pending
        </span>
      ),
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

  return (
    <div className="p-6">
      <InviteDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        invite={selected}
        onAccept={handleAccept}
        onDecline={handleDecline}
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
                {pendingInvites.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Invites sent to you, plus a place to enter a code if you have one.
            </p>
            <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
              Mock data for UI review — wire to{" "}
              <code className="rounded bg-amber-100 px-1">
                GET /users/me/invites
              </code>
              {" · "}
              accept/decline via{" "}
              <code className="rounded bg-amber-100 px-1">
                PUT /stokvels/:code/update-invite
              </code>
            </p>
          </div>

          <div className="space-y-4 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Ticket className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-slate-900">
                  Have an invite code?
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Paste a code to open the join page if you do not see the invite
                  below.
                </p>
              </div>
            </div>
            <form
              onSubmit={handleOpenInvite}
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <div className="w-full space-y-1.5 sm:max-w-xs">
                <Label htmlFor="inviteCode">Invite code</Label>
                <Input
                  id="inviteCode"
                  name="inviteCode"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. 8E8C6691"
                  className="font-mono uppercase tracking-wider"
                  autoComplete="off"
                />
              </div>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isLookingUp || !code.trim()}
              >
                {isLookingUp ? "Opening…" : "Open invite"}
              </Button>
            </form>
          </div>
        </Card>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Users className="h-4 w-4 text-emerald-600" />
        <h2 className="text-sm font-semibold text-slate-900">Pending invites</h2>
      </div>

      {pendingInvites.length === 0 ? (
        <EmptyState
          icon={<Mail className="h-8 w-8 text-slate-400" />}
          title="No pending invites"
          description="If someone invited you, open their link or enter the code above."
        />
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {pendingInvites.map((invite) => (
              <PendingInviteCard
                key={invite._id}
                invite={invite}
                onView={openDetail}
              />
            ))}
          </div>
          <div className="hidden md:block">
            <Table columns={columns} data={pendingInvites} />
          </div>
        </>
      )}
    </div>
  );
}
