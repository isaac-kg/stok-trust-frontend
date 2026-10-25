import { Button } from "../ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  /** Path for the CTA link. Omit to hide the button. */
  action?: string;
  actionLabel?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
}: EmptyStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        {icon}
      </div>
      <h3 className="mb-1 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mb-4 max-w-sm text-sm text-slate-500">{description}</p>
      {action && actionLabel ? (
        <Button asChild>
          <Link href={action}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
