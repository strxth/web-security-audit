'use client';

import { useEffect, useRef } from 'react';
import {
  securityResources,
  categoryColors,
  type SecurityResource,
} from '@/data/securityResources';

// External link icon component
function ExternalLinkIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

// Category badge component
function CategoryBadge({
  category,
}: {
  category: SecurityResource['category'];
}) {
  const colors = categoryColors[category];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {category}
    </span>
  );
}

// Resource card component
function ResourceCard({
  resource,
  index,
}: {
  resource: SecurityResource;
  index: number;
}) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="animate-on-scroll group relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:shadow-slate-900/40"
      aria-label={`${resource.title} - opens in new tab`}
      style={{ transitionDelay: `${index * 55}ms` }}
    >
      {/* Subtle top accent line that appears on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header with title and badge */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-900 transition-colors duration-200 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
          {resource.title}
        </h3>
        <CategoryBadge category={resource.category} />
      </div>

      {/* Description */}
      <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {resource.description}
      </p>

      {/* Footer with link indicator */}
      <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-blue-400">
        <span>Visit Resource</span>
        <ExternalLinkIcon className="h-4 w-4" />
      </div>
    </a>
  );
}

// Section header component
function SectionHeader() {
  return (
    <div className="animate-heading mb-10 text-center">
      <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
        Web Security Resources
      </h2>
      <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
        Curated learning materials and tools to help developers understand and
        implement web security best practices.
      </p>
    </div>
  );
}

export default function WebSecurityResources() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Once visible, stop observing for performance
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const el = sectionRef.current;
    if (!el) return;

    const targets = el.querySelectorAll('.animate-on-scroll, .animate-heading');
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full px-4 pb-20 pt-4 sm:px-6 lg:px-8"
      aria-labelledby="security-resources-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader />

        {/* Resources grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {securityResources.map((resource, i) => (
            <ResourceCard key={resource.id} resource={resource} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-500">
          All resources open in a new tab and are provided by trusted security
          organizations.
        </p>
      </div>
    </section>
  );
}
