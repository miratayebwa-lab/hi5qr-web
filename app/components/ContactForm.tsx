"use client";

import { useState } from "react";

export default function ContactForm({ accent }: { accent: string }) {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("sent");
      }}
      className="rounded-3xl border border-white/10 bg-white/5 p-6"
    >
      <div className="text-sm font-semibold">Send a message</div>

      <label className="mt-4 block text-xs text-white/70">
        Name
        <input
          name="name"
          required
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
          placeholder="Your name"
        />
      </label>

      <label className="mt-4 block text-xs text-white/70">
        Email
        <input
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
          placeholder="you@example.com"
        />
      </label>

      <label className="mt-4 block text-xs text-white/70">
        Message
        <textarea
          name="message"
          required
          rows={4}
          className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
          placeholder="Tell us what you need..."
        />
      </label>

      <button
        type="submit"
        className="mt-5 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-black"
        style={{ background: accent }}
      >
        {status === "sent" ? "Sent ✓" : "Send message"}
      </button>

      {status === "sent" ? (
        <p className="mt-3 text-xs text-white/60">
          Thanks! We received your message. (We’ll wire this to email/backend next.)
        </p>
      ) : null}
    </form>
  );
}