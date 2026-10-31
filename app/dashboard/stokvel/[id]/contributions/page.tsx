import StokvelContributions from "@/features/stokvel/components/view-contributions";

interface StokvelContributionsPageProps {
  params: Promise<{ id: string }>;
}

export default async function StokvelContributionsPage({
  params,
}: StokvelContributionsPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  return <StokvelContributions id={id} />;
}
