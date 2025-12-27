import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-4">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-xs text-slate-500 mb-2">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight className="h-3 w-3" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-slate-700">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-900">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between gap-4">
        <div>
          {title && <h1 className="text-lg font-semibold text-slate-900">{title}</h1>}
          {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
