import StokvelMembers from "@/features/stokvel/components/view-members";

interface GroupMembersProps {
	params: Promise<{ id: string }>;
}

export default async function GroupMembersPage({ params }: GroupMembersProps): Promise<React.ReactElement> {
  const { id } = await params;
  return <StokvelMembers id={id} />;
}