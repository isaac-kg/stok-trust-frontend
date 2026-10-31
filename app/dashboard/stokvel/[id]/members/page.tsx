import StokvelMembers from "@/features/stokvel/components/view-members";

interface StokvelMembersPageProps {
  params: Promise<{ id: string }>;
}

export default async function StokvelMembersPage({
  params,
}: StokvelMembersPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  return <StokvelMembers id={id} />;
}
