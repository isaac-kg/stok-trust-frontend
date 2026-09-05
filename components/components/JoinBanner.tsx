import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

const JoinBanner = () => {
	return (
		<Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 mt-20">
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
				<div>
					<h3 className="font-semibold text-slate-900">Looking to join an existing stokvel?</h3>
					<p className="text-sm text-slate-600 mt-1">
						Browse available groups or enter an invite code
					</p>
				</div>

				<Button variant="outline" asChild >
					<Link href="/dashboard/join-stokvel">
						Join a Stokvels
						<ChevronRight className="h-4 w-4 ml-1" />
					</Link>
				</Button>
				
			</div>
		</Card>
	);
};

export default JoinBanner;