"use client";

import { useRef, useState } from "react";
import { FileText, Upload, Wallet } from "lucide-react";
import { toast } from "sonner";
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
import type { Stokvel } from "@/features/stokvel/model/types";
import { useCreateMonthlyContributionMutation } from "../payments-api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stokvels: Stokvel[];
  fixedStokvelId?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function PaymentProofModal({
  open,
  onOpenChange,
  stokvels,
  fixedStokvelId,
}: Props): React.ReactElement {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stokvelId, setStokvelId] = useState(
    fixedStokvelId ?? stokvels.find((stokvel) => stokvel._id)?._id ?? "",
  );
  const [month, setMonth] = useState(currentMonth());
  const [proof, setProof] = useState<File | null>(null);
  const [createContribution, { isLoading }] =
    useCreateMonthlyContributionMutation();

  const selectedStokvel = stokvels.find(
    (stokvel) => stokvel._id === stokvelId,
  );
  const amount = selectedStokvel?.monthlyContribution ?? 0;

  function handleOpenChange(next: boolean): void {
    if (!next) {
      setStokvelId(
        fixedStokvelId ?? stokvels.find((stokvel) => stokvel._id)?._id ?? "",
      );
      setMonth(currentMonth());
      setProof(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    onOpenChange(next);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (!selectedStokvel?._id || !month || amount <= 0 || !proof) {
      toast.error("Choose a stokvel, contribution month, and PDF proof.");
      return;
    }

    try {
      await createContribution({
        stokvelId: selectedStokvel._id,
        month,
        amount,
        proof,
      }).unwrap();
      toast.success("Payment proof submitted for verification.");
      handleOpenChange(false);
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Could not submit payment proof. Please try again.";
      toast.error(message);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Choose a PDF file.");
      event.target.value = "";
      setProof(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("The PDF must be 10 MB or smaller.");
      event.target.value = "";
      setProof(null);
      return;
    }
    setProof(file);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 px-6 pb-5 pt-6">
          <DialogHeader className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl tracking-tight text-slate-900">
                Submit payment proof
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-slate-500">
                {fixedStokvelId
                  ? "Upload your payment receipt as a PDF for this stokvel."
                  : "Select a stokvel and month, then upload your payment receipt as a PDF for admin verification."}
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <form className="space-y-4 px-6 py-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="payment-stokvel">Stokvel</Label>
            {fixedStokvelId ? (
              <Input
                id="payment-stokvel"
                value={selectedStokvel?.name ?? ""}
                readOnly
              />
            ) : (
              <select
                id="payment-stokvel"
                value={stokvelId}
                onChange={(event) => setStokvelId(event.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="" disabled>
                  Select a stokvel
                </option>
                {stokvels.map((stokvel) => (
                  <option key={stokvel._id} value={stokvel._id}>
                    {stokvel.name}
                  </option>
                ))}
              </select>
            )}
            {stokvels.length === 0 && (
              <p className="text-sm text-slate-500">
                Join a stokvel before submitting a contribution.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payment-month">Contribution month</Label>
            <Input
              id="payment-month"
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payment-amount">Contribution amount</Label>
            <Input
              id="payment-amount"
              value={amount > 0 ? `R${amount.toLocaleString("en-ZA")}` : ""}
              placeholder="Select a stokvel"
              readOnly
            />
            <p className="text-xs text-slate-500">
              Amount is set by the selected stokvel.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payment-proof">PDF proof of payment</Label>
            <input
              ref={fileInputRef}
              id="payment-proof"
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full min-w-0 justify-start overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              {proof ? (
                <>
                  <FileText className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="min-w-0 flex-1 truncate" title={proof.name}>
                    {proof.name.length > 20
                      ? `${proof.name.slice(0, 20)}...`
                      : proof.name}
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Choose PDF (max 10 MB)
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isLoading || stokvels.length === 0 || amount <= 0 || !proof}
            >
              {isLoading ? "Submitting…" : "Submit proof"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
