"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useMakeUserStokvelAdminMutation } from "../stokvel-api";

interface Props {
  isOpen: boolean;
  stokvelId: string;
  memberName: string;
  userId: string;
  setIsOpen: (value: boolean) => void;
  refresh: () => void;
}

export default function MakeUserStokvelAdmin({
  isOpen,
  stokvelId,
  memberName,
  userId,
  setIsOpen,
  refresh,
}: Props): React.ReactElement {
  const [makeUserStokvelAdmin, { isLoading }] =
    useMakeUserStokvelAdminMutation();

  function handleOpenChange(open: boolean): void {
    setIsOpen(open);
  }

  async function handleSubmit(): Promise<void> {
    try {
      await makeUserStokvelAdmin({ stokvelId, userId }).unwrap();
      refresh();
      toast.success(`${memberName} is now an admin`);
      setIsOpen(false);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message ?? `Failed to make ${memberName} an admin`);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/60 px-6 pb-5 pt-6">
          <DialogHeader className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl tracking-tight text-slate-900">
                Make admin?
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-slate-500">
                <span className="font-medium text-slate-700">{memberName}</span>{" "}
                will be able to invite members and manage this stokvel.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <div className="flex flex-col-reverse gap-2 px-6 py-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Updating…" : "Make admin"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
