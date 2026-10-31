import { redirect } from "next/navigation";

export default function PaymentPageRedirect(): never {
  redirect("/dashboard/payments");
}
