"use client";

import { useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import { FileText, Upload, Wallet } from "lucide-react";
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
  recordContributionSchema,
  type RecordContributionFormValues,
} from "../schemas/record-contribution.schema";

export interface RecordContributionSubmitValues {
  amount: number;
  periodLabel: string;
  paymentDate: string;
  reference?: string;
  receiptFile?: File | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultAmount?: number;
  onSubmit: (values: RecordContributionSubmitValues) => void | Promise<void>;
}

function currentPeriodLabel(): string {
  return new Date().toLocaleDateString("en-ZA", {
    month: "long",
    year: "numeric",
  });
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function RecordContributionModal({
  open,
  onOpenChange,
  defaultAmount,
  onSubmit,
}: Props): React.ReactElement {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const initialValues: RecordContributionFormValues = {
    amount:
      defaultAmount != null ? String(defaultAmount) : "",
    periodLabel: currentPeriodLabel(),
    paymentDate: todayIsoDate(),
    reference: "",
  };

  function handleClose(next: boolean): void {
    onOpenChange(next);
    if (!next) {
      setReceiptFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 px-6 pb-5 pt-6">
          <DialogHeader className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl tracking-tight text-slate-900">
                Record contribution
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-slate-500">
                Submit your payment details and optional receipt. An admin will
                verify it.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={recordContributionSchema}
          validateOnBlur={true}
          validateOnChange={false}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const amount = Number(String(values.amount).replace(/,/g, ""));
            await onSubmit({
              amount,
              periodLabel: values.periodLabel.trim(),
              paymentDate: values.paymentDate,
              reference: values.reference?.trim() || undefined,
              receiptFile,
            });
            resetForm();
            setReceiptFile(null);
            setSubmitting(false);
            handleClose(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4 px-6 py-5">
              <div className="space-y-1.5">
                <Label htmlFor="amount">Amount (R)</Label>
                <Field
                  as={Input}
                  id="amount"
                  name="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="500"
                />
                {errors.amount && touched.amount && (
                  <p className="text-sm text-destructive">{errors.amount}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="periodLabel">Period</Label>
                <Field
                  as={Input}
                  id="periodLabel"
                  name="periodLabel"
                  placeholder="October 2026"
                />
                {errors.periodLabel && touched.periodLabel && (
                  <p className="text-sm text-destructive">{errors.periodLabel}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="paymentDate">Date paid</Label>
                <Field
                  as={Input}
                  id="paymentDate"
                  name="paymentDate"
                  type="date"
                />
                {errors.paymentDate && touched.paymentDate && (
                  <p className="text-sm text-destructive">{errors.paymentDate}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reference">Payment reference (optional)</Label>
                <Field
                  as={Input}
                  id="reference"
                  name="reference"
                  placeholder="EFT-1234"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Receipt (optional)</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    setReceiptFile(e.target.files?.[0] ?? null);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {receiptFile ? (
                    <>
                      <FileText className="h-4 w-4 text-emerald-600" />
                      <span className="truncate">{receiptFile.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload proof of payment
                    </>
                  )}
                </Button>
              </div>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => handleClose(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting…" : "Submit contribution"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
