// app/page.tsx
import type { Metadata } from "next";

import ContactForm from "./components/ContactForm";

export const metadata: Metadata = {
  title: "HI5 — Share Instantly with QR Codes",
  description:
    "No typing. No talking. Just scan. Create Contact QRs or Content/File QRs in seconds — for personal sharing or business use.",
};

const BRAND = {
  bg: "#0c1a2b",
  accent: "#ed9402",
};

export default function Page() {
  const playStoreUrl = "#"; // TODO: replace with your Google Play link later
  const supportEmail = "support@hi5qr.com";
  const supportPhone = "+256791364362";

  return (
    <main style={{ background: BRAND.bg }} className="min-h-screen text-white">
      {/* Top nav */}
      <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center font-semibold"
              aria-label="HI5"
            >
              HI5
            </div>
            <span className="text-sm text-white/80 hidden sm:block">
              Tap. Scan. Unlock.
            </span>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3">
            <a
              href="#how"
              className="text-sm text-white/70 hover:text-white transition hidden sm:inline"
            >
              How it works
            </a>
            <a
              href="#business"
              className="text-sm text-white/70 hover:text-white transition hidden sm:inline"
            >
              For business
            </a>
            <a
              href="#privacy"
              className="text-sm text-white/70 hover:text-white transition hidden sm:inline"
            >
              Privacy
            </a>
            <a
              href="#contact"
              className="text-sm text-white/70 hover:text-white transition hidden sm:inline"
            >
              Contact
            </a>

            <a
              href={playStoreUrl}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              Get on Google Play
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        {/* soft glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(800px 400px at 50% 0%, rgba(237,148,2,0.16), transparent 60%), radial-gradient(700px 400px at 20% 20%, rgba(255,255,255,0.06), transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-10 sm:pt-24 sm:pb-16">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: BRAND.accent }}
              />
              Built for business — simple for everyone.
            </p>

            <h1 className="mt-5 text-4xl sm:text-6xl font-semibold tracking-tight">
              Share Instantly with{" "}
              <span style={{ color: BRAND.accent }}>QR Codes</span>.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/75 leading-relaxed">
              No typing. No talking. Just scan. Create contact QRs or content/file
              QRs in seconds — for personal sharing or business use.
            </p>

            {/* Primary CTA kept for later (link placeholder) */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={playStoreUrl}
                className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-black"
                style={{ background: BRAND.accent }}
              >
                Download on Google Play
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <MiniStat title="Mode 1" value="Contact QR" />
              <MiniStat title="Mode 2" value="Content / File QR" />
              <MiniStat title="B2B" value="Scan analytics" />
            </div>
          </div>

          <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <FeatureCard
              eyebrow="Mode 1"
              title="Contact QR"
              body="Turn your contact details into a scannable QR. People scan and save instantly."
              bullets={[
                "Share name, phone, email, socials",
                "No manual saving",
                "Perfect for events and networking",
              ]}
            />
            <FeatureCard
              eyebrow="Mode 2"
              title="Content / File QR"
              body="Create QRs for text or files. Upload PDFs, images, audio, or documents and share via a viewer link."
              bullets={[
                "Fast uploads and instant QR generation",
                "Great for brochures, notes, and campaigns",
                "Track engagement with scan analytics",
              ]}
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <SectionTitle
          title="How HI5 works"
          subtitle="A clean three-step flow — designed to feel instant."
        />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StepCard
            step="01"
            title="Create a QR"
            body="Choose Contact QR or Content/File QR, then generate instantly."
          />
          <StepCard
            step="02"
            title="Share it anywhere"
            body="Show it on screen, print it, or share it digitally."
          />
          <StepCard
            step="03"
            title="Scan to unlock"
            body="Anyone scans and gets the info immediately — no typing required."
          />
        </div>
      </section>

      {/* For everyone + business */}
      <section
        id="business"
        className="mx-auto max-w-6xl px-5 py-14 sm:py-20"
      >
        <SectionTitle
          title="Built for people and teams"
          subtitle="Personal sharing — plus business-grade visibility."
        />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel
            title="For Individuals"
            items={[
              "Share contact details instantly",
              "Create text QRs for notes and memories",
              "Share files without messaging apps",
              "No account required to scan",
            ]}
          />
          <Panel
            title="For Businesses & Teams"
            items={[
              "Create QR campaigns for events and marketing",
              "Track scans and engagement",
              "See device and country insights",
              "Monitor downloads and performance",
            ]}
            highlight
          />
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/75 leading-relaxed">
            HI5 analytics are designed to be privacy-conscious. Scan records can
            include time, device type, country, referrer, and a privacy-preserving{" "}
            <span className="text-white/90 font-medium">IP hash</span> — not raw IP.
          </p>
        </div>
      </section>

      {/* Privacy & Security */}
      <section id="privacy" className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <SectionTitle
          title="Privacy & security"
          subtitle="Built to share fast — without oversharing."
        />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <InfoCard
            title="Contacts stay on device"
            body="Mode 1 contacts remain on your phone unless you explicitly choose to share them via QR."
          />
          <InfoCard
            title="Secure file sharing"
            body="Files open through a viewer link, with stored metadata such as type, name, size, and storage path."
          />
          <InfoCard
            title="Analytics with care"
            body="Scan insights may include device type, country, referrer, user agent, and an IP hash (not raw IP)."
          />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href="/privacy"
            className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold border border-white/12 bg-white/5 hover:bg-white/10 transition"
          >
            View Privacy Policy
          </a>
          <a
            href="/terms"
            className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold border border-white/12 bg-white/5 hover:bg-white/10 transition"
          >
            View Terms
          </a>
        </div>
      </section>

      {/* Screenshots (placeholders only, since you don't have them yet) */}
      <section id="screens" className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <SectionTitle
          title="Screenshots"
          subtitle="Add real screenshots when ready."
        />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ShotPlaceholder label="Home" />
          <ShotPlaceholder label="Create QR" />
          <ShotPlaceholder label="Scan" />
          <ShotPlaceholder label="About" />
        </div>
      </section>

      {/* FAQ (simple) */}
      <section id="faq" className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <SectionTitle title="FAQ" subtitle="Quick answers." />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FaqItem
            q="Do I need an account?"
            a="No account is required to scan QRs. Business analytics may require business setup."
          />
          <FaqItem
            q="Can businesses track scans?"
            a="Yes. Scan analytics can include scan count, device type, country, referrer, and privacy-preserving IP hashing."
          />
          <FaqItem
            q="Are uploaded files public?"
            a="Files are accessed through their viewer link. Metadata may be stored to support viewing and analytics."
          />
          <FaqItem
            q="Does HI5 store my contacts?"
            a="Mode 1 contacts are saved on your device. They are not uploaded unless you explicitly share them via QR."
          />
        </div>
      </section>

      {/* Contact (important) */}
      <section id="contact" className="mx-auto max-w-6xl px-5 pb-16 sm:pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Contact
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Need help, partnerships, or business onboarding? Reach us anytime.
            </p>

            <div className="mt-5 space-y-2 text-sm text-white/80">
              <div>
                Email:{" "}
                <a
                  className="underline hover:text-white"
                  href={`mailto:${supportEmail}`}
                >
                  {supportEmail}
                </a>
              </div>
              <div>
                Phone:{" "}
                <a
                  className="underline hover:text-white"
                  href={`tel:${supportPhone.replace("+", "")}`}
                >
                  {supportPhone}
                </a>
              </div>
              <div className="text-xs text-white/55">Kampala, Uganda</div>
            </div>
          </div>

          <div className="w-full lg:max-w-md">
            <ContactForm accent={BRAND.accent} />
            <p className="mt-3 text-xs text-white/55">
              This form can be wired to email or a backend endpoint later.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
          <div className="text-sm text-white/70">
            <div className="font-medium text-white/85">HI5</div>
            <div className="mt-1">
              Support:{" "}
              <a
                className="underline hover:text-white"
                href={`mailto:${supportEmail}`}
              >
                {supportEmail}
              </a>{" "}
              •{" "}
              <a
                className="underline hover:text-white"
                href={`tel:${supportPhone.replace("+", "")}`}
              >
                {supportPhone}
              </a>
            </div>
            <div className="mt-1 text-xs text-white/55">
              © {new Date().getFullYear()} HI5 — Made in Uganda
            </div>
            <div className="mt-2 text-xs text-white/55">
              Designed by MiraUg Digital Tech Co. LTD — Kampala, Uganda
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <a
              href="/privacy"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/75 hover:text-white hover:bg-white/10 transition"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/75 hover:text-white hover:bg-white/10 transition"
            >
              Terms
            </a>
            <a
              href="#faq"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/75 hover:text-white hover:bg-white/10 transition"
            >
              FAQ
            </a>
            <a
              href="#contact"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/75 hover:text-white hover:bg-white/10 transition"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-white/55">{title}</div>
      <div className="mt-1 text-sm font-semibold text-white/90">{value}</div>
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
        {title}
      </h2>
      <p className="mt-2 text-sm sm:text-base text-white/70 leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

function FeatureCard({
  eyebrow,
  title,
  body,
  bullets,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <div className="text-xs text-white/55">{eyebrow}</div>
      <div className="mt-2 text-xl font-semibold">{title}</div>
      <p className="mt-2 text-sm text-white/70 leading-relaxed">{body}</p>
      <ul className="mt-4 space-y-2">
        {bullets.map((b) => (
          <li key={b} className="text-sm text-white/75 flex gap-2">
            <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/40" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepCard({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="text-xs text-white/55">{step}</div>
      <div className="mt-2 text-lg font-semibold">{title}</div>
      <p className="mt-2 text-sm text-white/70 leading-relaxed">{body}</p>
    </div>
  );
}

function Panel({
  title,
  items,
  highlight = false,
}: {
  title: string;
  items: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-3xl border p-6 sm:p-8"
      style={{
        borderColor: highlight
          ? "rgba(237,148,2,0.35)"
          : "rgba(255,255,255,0.10)",
        background: highlight
          ? "rgba(237,148,2,0.06)"
          : "rgba(255,255,255,0.05)",
      }}
    >
      <div className="text-lg font-semibold">{title}</div>
      <ul className="mt-4 space-y-2">
        {items.map((it) => (
          <li key={it} className="text-sm text-white/75 flex gap-2">
            <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/40" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="text-lg font-semibold">{title}</div>
      <p className="mt-2 text-sm text-white/70 leading-relaxed">{body}</p>
    </div>
  );
}

function ShotPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="aspect-[9/19] w-full rounded-2xl border border-white/10 bg-black/20 flex items-center justify-center">
        <div className="text-xs text-white/60">{label} screenshot</div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <summary className="cursor-pointer list-none">
        <div className="text-base font-semibold">{q}</div>
      </summary>
      <p className="mt-3 text-sm text-white/70 leading-relaxed">{a}</p>
    </details>
  );
}