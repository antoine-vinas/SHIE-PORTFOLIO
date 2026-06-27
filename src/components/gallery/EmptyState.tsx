interface EmptyStateProps {
  categoryLabel: string;
}

export function EmptyState({ categoryLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-hairline/30 bg-surface/50 px-8 py-16 text-center">
      <div className="mb-4 text-4xl opacity-40" aria-hidden="true">
        ✦
      </div>
      <h3 className="font-sans text-xl font-bold text-heading mb-2">
        No projects yet
      </h3>
      <p className="max-w-md text-body/80 font-medium">
        {categoryLabel} projects will appear here once they&apos;re added.
        Check back soon for new work.
      </p>
    </div>
  );
}
