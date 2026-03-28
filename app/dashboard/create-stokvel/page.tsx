"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateStokvelForm } from "@/features/stokvel/components/create-stokvel-form";

export default function CreateStokvelPage(): React.ReactElement {
  return (
    <div className="p-6">
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="-ml-2 mb-4" asChild>
          <Link href="/dashboard/group">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Stokvels
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">Create a stokvel</h1>
        <p className="text-sm text-slate-500 mt-1">
          Start a new savings group with trusted members
        </p>
      </div>
      <CreateStokvelForm />
    </div>
  );
}
