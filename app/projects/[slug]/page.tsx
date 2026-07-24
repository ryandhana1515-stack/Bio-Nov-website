import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProject, projects } from "@/data/projects";
import Monogram from "@/components/ui/Monogram";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    creator: { "@type": "Person", name: "Ryan Dhana" },
  };

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="fixed inset-x-0 top-4 z-50 flex items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Ryan Dhana — home">
          <Monogram />
          <span className="hidden text-[11px] font-medium tracking-[0.28em] sm:inline">
            RYAN DHANA
          </span>
        </Link>
        <Link
          href="/#projects"
          className="nav-pill flex !h-11 items-center gap-2 px-5 text-[11px] tracking-[0.16em]"
        >
          <ArrowLeft size={13} strokeWidth={1.5} />
          ALL PROJECTS
        </Link>
      </header>

      <article className="mx-auto max-w-[1100px] px-6 pb-28 pt-36 md:px-10">
        <p className="micro mb-6 flex flex-wrap items-center gap-x-4">
          <span className="text-[var(--ember)]">{project.index}</span>
          <span>{project.category.toUpperCase()}</span>
          <span aria-hidden="true">·</span>
          <span>{project.year.toUpperCase()}</span>
          <span aria-hidden="true">·</span>
          <span>{project.status.toUpperCase()}</span>
        </p>
        <h1 className="display text-[clamp(44px,7vw,100px)]">{project.title}</h1>
        <p className="body-editorial mt-6 text-[16px]">{project.description}</p>

        <div
          className="relative mt-14 aspect-[16/9] overflow-hidden rounded-3xl border border-[var(--line)]"
          style={{ background: `linear-gradient(150deg, ${project.accent}18, transparent 65%)` }}
        >
          <Image
            src={project.poster}
            alt={`${project.title} — visual`}
            fill
            priority
            sizes="(min-width: 1100px) 1100px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-[220px_1fr]">
          <aside className="space-y-6">
            <div>
              <p className="micro mb-1.5">ROLE</p>
              <p className="text-[13px] text-[var(--ink-soft)]">{project.role}</p>
            </div>
            <div>
              <p className="micro mb-1.5">CATEGORY</p>
              <p className="text-[13px] text-[var(--ink-soft)]">{project.category}</p>
            </div>
            <div>
              <p className="micro mb-1.5">YEAR</p>
              <p className="text-[13px] text-[var(--ink-soft)]">{project.year}</p>
            </div>
          </aside>
          <div className="space-y-6">
            {project.detail.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="body-editorial max-w-none text-[15px]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <footer className="mt-24 border-t border-[var(--line-soft)] pt-10">
          <p className="micro mb-3">NEXT PROJECT</p>
          <Link
            href={`/projects/${next.slug}`}
            className="display inline-block text-[clamp(28px,4vw,52px)] text-[var(--ink)] transition-colors hover:text-[var(--ink-soft)]"
          >
            {next.title} →
          </Link>
        </footer>
      </article>
    </main>
  );
}
