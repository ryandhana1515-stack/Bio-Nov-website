"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

/**
 * Validated contact form. No backend is wired yet on purpose — submissions
 * are held client-side and the owner connects a form handler before launch
 * (see README). Nothing secret is exposed here.
 */
export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const values = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };
    const next: Errors = {};
    if (values.name.length < 2) next.name = "Please share your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) next.email = "That email doesn’t look right.";
    if (values.subject.length < 3) next.subject = "A short subject helps.";
    if (values.message.length < 10) next.message = "Tell me a little more (10+ characters).";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Connect an approved form handler / server action here before launch.
    setSent(true);
  };

  if (sent) {
    return (
      <p className="body-editorial rounded-2xl border border-[var(--line)] p-6" role="status">
        Thank you — your message is ready. This form will deliver once a form endpoint is connected
        (see the README for the one-line setup).
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-2">
      <div className="grid gap-x-6 md:grid-cols-2">
        <label className="block">
          <span className="micro">NAME</span>
          <input
            className="field"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "err-name" : undefined}
          />
          {errors.name && (
            <span id="err-name" className="micro text-[#c0552a]">
              {errors.name}
            </span>
          )}
        </label>
        <label className="block">
          <span className="micro">EMAIL</span>
          <input
            className="field"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "err-email" : undefined}
          />
          {errors.email && (
            <span id="err-email" className="micro text-[#c0552a]">
              {errors.email}
            </span>
          )}
        </label>
      </div>
      <label className="block">
        <span className="micro">SUBJECT</span>
        <input
          className="field"
          name="subject"
          placeholder="What’s this about?"
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "err-subject" : undefined}
        />
        {errors.subject && (
          <span id="err-subject" className="micro text-[#c0552a]">
            {errors.subject}
          </span>
        )}
      </label>
      <label className="block">
        <span className="micro">MESSAGE</span>
        <textarea
          className="field min-h-[110px] resize-y"
          name="message"
          placeholder="An idea, a collaboration, a question…"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "err-message" : undefined}
        />
        {errors.message && (
          <span id="err-message" className="micro text-[#c0552a]">
            {errors.message}
          </span>
        )}
      </label>
      <button
        type="submit"
        className="group mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--ink)] px-6 py-3 text-[11px] tracking-[0.2em] text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
      >
        SEND MESSAGE
        <ArrowUpRight size={13} strokeWidth={1.5} />
      </button>
    </form>
  );
}
