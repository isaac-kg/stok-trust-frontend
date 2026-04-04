import Link from "next/link";
import { 
  Users, 
  Wallet, 
  Vote, 
  FileText, 
  Calendar, 
  AlertTriangle,
  Settings,
  ChevronRight,
  MapPin,
  Clock,
  Plus,
	ArrowLeft
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import React from "react";
import { Card } from "@/components/ui/card";
import ReputationBadge from "@/components/shared/ReputableTab";
import StatusBadge from "@/components/shared/StatusBadge";
import StatCard from "@/components/shared/StatCard";
interface GroupDetailsPageProps {
	params: Promise<{ id: string }>;
}
const HARDCODED_GROUP_DETAILS =
{
	id: 1,
	name: "Soweto Sisters Savings",
	description: "A savings group for sisters in Soweto",
	members: 10,
	location: "Soweto, Johannesburg",
	reputation: 100,
	status: "active",
	type: "Savings",
	role: "Admin",
	createdAt: new Date(),
	updatedAt: new Date(),
};


export default async function GroupDetailsPage({ params }: GroupDetailsPageProps): Promise<React.ReactElement> {
	const { id } = await params;
	const groupDetails = HARDCODED_GROUP_DETAILS;

	return (
		<div className="p-6">
			<div className="mb-8">
				<Button variant="ghost" size="sm" className="-ml-4 mb-4" asChild>
					<Link href="/dashboard/group">
						<ArrowLeft className="h-4 w-4" />
						Back to Groups
					</Link>
				</Button>
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-2xl font-bold text-slate-900">{groupDetails.name}</h1>
						<p className="text-sm text-slate-500 mt-1">
							{groupDetails.description}
						</p>
					</div>
					<Button variant="outline" size="sm" className="-ml-4 mb-4" asChild>
						<Link href="/dashboard/group">
							<Settings className="h-4 w-4" />
							Settings
						</Link>
					</Button>
				</div>

			</div>

			<Card className="p-6 mb-8 flex justify-between items-center">
				<div className="flex items-center gap-2">
					<div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
						{groupDetails.name?.[0] || 'S'}
					</div>
					<StatusBadge status={groupDetails.status} />
				</div>
				<ReputationBadge score={100} level={"Trusted"} size="lg" />

			</Card>


			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<Link href="/dashboard/group/members">
					<StatCard
						icon={Users}
						label="Members"
						value={10}
						iconBg="bg-blue-100"
						iconColor="text-blue-600"
					/>
				</Link>
				<Link href="/dashboard/group/payments">
					<StatCard
						icon={Wallet}
						label="Contributions"
						subValue="View & Manage"
						value={10}
						iconBg="bg-emerald-100"
						iconColor="text-emerald-600"
					/>
				</Link>
				<Link href="/dashboard/group/votes">
					<StatCard
						icon={Wallet}
						label="Payouts"
						subValue="View & Manage"
						value={10}
						iconBg="bg-amber-100"
						iconColor="text-amber-600"
					/>
				</Link>
				<Link href="/dashboard/group/documents">
					<StatCard
						icon={Vote}
						label="Votes"
						subValue="View & Manage"
						value={10}
						iconBg="bg-purple-100"
						iconColor="text-purple-600"
					/>
				</Link>
				<Link href="/dashboard/group/meetings">
					<StatCard
						icon={FileText}
						label="Reports"
						subValue="View & Manage"
						value={10}
						iconBg="bg-indigo-100"
						iconColor="text-indigo-600"
					/>
				</Link>				
				<Link href="/dashboard/group/meetings">
					<StatCard
						icon={Wallet}
						label="Banking"
						subValue="View & Manage"
						value={10}
						iconBg="bg-teal-100"
						iconColor="text-teal-600"
					/>
				</Link>				
			</div>

		</div>
	);
}