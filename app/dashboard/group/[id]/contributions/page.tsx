import StokvelContributions from "@/features/stokvel/components/view-contributions";

interface GroupContributionsPageProps {
  params: Promise<{ id: string }>;
}

/** Legacy path — same UI as /dashboard/stokvel/[id]/contributions */
export default async function GroupContributionsPage({
  params,
}: GroupContributionsPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  return <StokvelContributions id={id} />;
}
