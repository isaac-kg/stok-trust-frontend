"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  CheckCircle2,
  Copy,
  Link as LinkIcon,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { useCreateStokvelInviteMutation } from "@/features/stokvel/stokvel-api";
import type { StokvelInviteResponse } from "@/features/stokvel/model/types";

const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stokvelId: string;
  stokvelName: string;
}

export default function InviteMemberModal({
  open,
  onOpenChange,
  stokvelId,
  stokvelName,
}: Props): React.ReactElement {
  const [createInvite, { isLoading }] = useCreateStokvelInviteMutation();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cellNumber: "",
  });
  const [createdInvite, setCreatedInvite] =
    useState<StokvelInviteResponse | null>(null);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const inviteLink = createdInvite
    ? `${window.location.origin}/join/${createdInvite.inviteCode}`
    : "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    try {
      const invite = await createInvite({ stokvelId, ...form }).unwrap();
      setCreatedInvite(invite);
      toast.success(`Invite sent to ${invite.email}`);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message ?? "Failed to create invite");
    }
  }

  async function handleCopy(
    text: string,
    kind: "code" | "link",
  ): Promise<void> {
    await copyToClipboard(text);
    setCopied(kind);
    toast.success(kind === "code" ? "Code copied" : "Invite link copied");
    setTimeout(() => setCopied(null), 2000);
  }

  function handleClose(next: boolean): void {
    onOpenChange(next);
    if (!next) {
      setTimeout(() => {
        setCreatedInvite(null);
        setForm({ firstName: "", lastName: "", email: "", cellNumber: "" });
        setCopied(null);
      }, 300);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!createdInvite ? (
          <>
            <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/60 px-6 pb-5 pt-6">
              <DialogHeader className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl tracking-tight text-slate-900">
                    Invite a member
                  </DialogTitle>
                  <DialogDescription className="mt-1.5 text-slate-500">
                    They&apos;ll get a link and code to join{" "}
                    <span className="font-medium text-slate-700">
                      {stokvelName}
                    </span>
                    .
                  </DialogDescription>
                </div>
              </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Thabo"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Mokoena"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="thabo@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cellNumber">Cell number</Label>
                <Input
                  id="cellNumber"
                  name="cellNumber"
                  type="tel"
                  required
                  value={form.cellNumber}
                  onChange={handleChange}
                  placeholder="+27 82 123 4567"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => handleClose(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending…" : "Send invite"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/60 px-6 pb-5 pt-6">
              <DialogHeader className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl tracking-tight text-slate-900">
                    Invite ready
                  </DialogTitle>
                  <DialogDescription className="mt-1.5 text-slate-500">
                    Share this with{" "}
                    <span className="font-medium text-slate-700">
                      {createdInvite.firstName}
                    </span>{" "}
                    so they can join.
                  </DialogDescription>
                </div>
              </DialogHeader>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="space-y-1.5">
                <Label>Invite code</Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={createdInvite.inviteCode}
                    className="bg-slate-50 text-center font-mono text-lg font-bold tracking-[0.3em]"
                    onFocus={(e) => e.target.select()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() =>
                      handleCopy(createdInvite.inviteCode, "code")
                    }
                    aria-label="Copy invite code"
                  >
                    {copied === "code" ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Invite link</Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={inviteLink}
                    className="bg-slate-50 text-xs"
                    onFocus={(e) => e.target.select()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => handleCopy(inviteLink, "link")}
                    aria-label="Copy invite link"
                  >
                    {copied === "link" ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <LinkIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full sm:w-auto"
                  onClick={() => setCreatedInvite(null)}
                >
                  Invite another
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => handleClose(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
