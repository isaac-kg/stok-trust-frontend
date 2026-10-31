"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Ticket } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmptyState from "@/components/components/EmptyState";

export function InvitesInbox(): React.ReactElement {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);

  function handleOpenInvite(e: React.FormEvent): void {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) {
      toast.error("Enter a valid invite code");
      return;
    }
    setIsLookingUp(true);
    router.push(`/join/${trimmed}`);
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Invites
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Invites sent to you, plus a place to enter a code if you have one.
        </p>
      </div>

      <Card className="mb-6 overflow-hidden border-slate-200/80 shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
              <Ticket className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-slate-900">
                Have an invite code?
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Paste the code from an admin to open the invite and join that
                stokvel.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleOpenInvite} className="space-y-4 px-5 py-5 sm:px-6">
          <div className="space-y-1.5">
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
          <Button type="submit" disabled={isLookingUp || !code.trim()}>
            {isLookingUp ? "Opening…" : "Open invite"}
          </Button>
        </form>
      </Card>

      <Card className="overflow-hidden border-slate-200/80 shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-slate-900">
            Pending invites
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Invites linked to your email will show here once the backend list
            endpoint is available.
          </p>
        </div>
        <div className="px-5 py-8 sm:px-6">
          <EmptyState
            icon={<Mail className="h-8 w-8 text-slate-400" />}
            title="No pending invites"
            description="If someone invited you, open their link or enter the code above. Invites only appear automatically after you have an account matching the invite email."
          />
        </div>
      </Card>
    </div>
  );
}
