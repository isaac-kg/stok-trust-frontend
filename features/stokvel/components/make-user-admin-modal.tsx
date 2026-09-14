"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
}: Props) {
  const [makeUserStokvelAdmin, { isLoading }] =
    useMakeUserStokvelAdminMutation();
  const handleClose = () => setIsOpen(false);

  const handleSubmit = async () => {
    try {
      await makeUserStokvelAdmin({ stokvelId, userId }).unwrap();
      refresh();
      toast.success(`Successfully made ${memberName} an admin`);
    } catch (err: any) {
      toast.error(
        err?.data?.message ?? `Failed to make ${memberName} an admin`,
      );
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <div>
          <span>
            Are you sure you want to make <strong>{memberName}</strong> an admin
            of the stokvel?
          </span>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? "Updating…" : "Make Admin"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
