import StokvelOverview from "@/features/stokvel/components/stokvel-overview";

interface StokvelDetailsPageProps {
	params: Promise<{ id: string }>;
}

export default async function StokvelDetailsPage({ params }: StokvelDetailsPageProps): Promise<React.ReactElement> {
	const { id } = await params;
	return <StokvelOverview id={id} />;
}
