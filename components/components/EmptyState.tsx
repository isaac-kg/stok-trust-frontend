import { Button } from "../ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: () => string;
  actionLabel: string;
}
const EmptyState = ({ icon, title, description, action, actionLabel }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      <Button asChild>
        <Link href={typeof action === 'string' ? action : '/dashboard/create-stokvel'}>{actionLabel}</Link>
      </Button>
    </div>
  );
};

export default EmptyState;