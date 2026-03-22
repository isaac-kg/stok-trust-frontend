import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConstitutionBuilder from "@/features/stokvel/Constitution";

interface ConstitutionBuilderPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConstitutionBuilderPage({
  params,
}: ConstitutionBuilderPageProps): Promise<React.ReactElement> {
  const { id } = await params;

  return (
    <div className="p-6">
      <Button variant="ghost" size="sm" className="-ml-2 mb-4" asChild>
        <Link href="/dashboard/group">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Stokvels
        </Link>
      </Button>

      <ConstitutionBuilder id={id} />
    </div>
  );
}
