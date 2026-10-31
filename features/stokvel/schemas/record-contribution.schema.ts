import * as Yup from "yup";

export const recordContributionSchema = Yup.object({
  amount: Yup.string()
    .required("Amount is required")
    .test("amount", "Enter a valid positive amount", (val) => {
      if (val === undefined || val === "") return false;
      const n = Number(String(val).replace(/,/g, ""));
      return !Number.isNaN(n) && n > 0;
    }),
  periodLabel: Yup.string().trim().required("Period is required"),
  paymentDate: Yup.string().required("Payment date is required"),
  reference: Yup.string().trim().default(""),
});

export type RecordContributionFormValues = Yup.InferType<
  typeof recordContributionSchema
>;
