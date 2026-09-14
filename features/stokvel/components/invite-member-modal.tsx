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
import { Check, Copy, Link as LinkIcon, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useCreateStokvelInviteMutation } from "@/features/stokvel/stokvel-api";
import type { StokvelInviteResponse } from "@/features/stokvel/model/types";

const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for older browsers / non-HTTPS
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const invite = await createInvite({ stokvelId, ...form }).unwrap();
      setCreatedInvite(invite);
      toast.success(`Invite sent to ${invite.email}`);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to create invite");
    }
  };

  const handleCopy = async (text: string, kind: "code" | "link") => {
    await copyToClipboard(text);
    setCopied(kind);
    toast.success(kind === "code" ? "Code copied" : "Invite link copied");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClose = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      // reset for next time
      setTimeout(() => {
        setCreatedInvite(null);
        setForm({ firstName: "", lastName: "", email: "", cellNumber: "" });
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!createdInvite ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-emerald-600" />
                Invite a member
              </DialogTitle>
              <DialogDescription>
                They&apos;ll get an email with a link and code to join{" "}
                <strong>{stokvelName}</strong>.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
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

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleClose(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending…" : "Send invite"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          /* ---- Success state: the copyable code field ---- */
          <>
            <DialogHeader>
              <DialogTitle>Invite sent 🎉</DialogTitle>
              <DialogDescription>
                Share the code or link with {createdInvite.firstName} directly:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {/* Invite code field */}
              <div className="space-y-1.5">
                <Label>Invite code</Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={createdInvite.inviteCode}
                    className="font-mono text-center text-lg tracking-[0.3em] font-bold"
                    onFocus={(e) => e.target.select()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
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

              {/* Invite link field */}
              <div className="space-y-1.5">
                <Label>Invite link</Label>
                <div className="flex items-center gap-2">
                  <Input readOnly value={inviteLink} className="text-xs" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
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

              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCreatedInvite(null)}
                >
                  Invite another
                </Button>
                <Button onClick={() => handleClose(false)}>Done</Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}