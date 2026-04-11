import StokvelOverview from "@/features/stokvel/components/stokvel-overview";
interface GroupDetailsPageProps {
	params: Promise<{ id: string }>;
}

export default async function GroupDetailsPage({ params }: GroupDetailsPageProps): Promise<React.ReactElement> {
	const { id } = await params;
	return <StokvelOverview id={id} />;
}