"use client";

export default function PaymentPage(): React.ReactElement {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Payment</h1>
        <p className="text-sm text-slate-500 mt-1">
          View and manage your payments 
        </p>
      </div>
      <div className="text-center py-12 text-muted-foreground">
        <p>No payments yet</p>
      </div>
    </div>
  );
}
