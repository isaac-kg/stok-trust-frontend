import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, Shield, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Create your stokvel",
    body: "Set the name, contribution amount, and frequency. Invite only the people you trust.",
  },
  {
    number: "02",
    title: "Agree on the rules",
    body: "Write a clear constitution covering membership, contributions, payouts, and disputes.",
  },
  {
    number: "03",
    title: "Contribute and grow",
    body: "Members pay on schedule. Admins verify payments. Everyone sees where the money stands.",
  },
  {
    number: "04",
    title: "Payout with confidence",
    body: "When payout time comes, members receive what they are owed — recorded and transparent.",
  },
] as const;

export function LandingPage(): React.ReactElement {
  return (
    <div className="landing-root min-h-screen bg-[#f4f7f6] text-slate-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>

      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
              <Shield className="h-4 w-4" aria-hidden />
            </span>
            <span className="font-landing-display text-xl font-semibold tracking-tight text-white">
              StokTrust
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Account">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button
              size="sm"
              className="bg-white text-emerald-800 hover:bg-emerald-50"
              asChild
            >
              <Link href="/signup">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* Hero — brand first, full-bleed */}
        <section className="relative flex min-h-[100svh] items-end overflow-hidden">
          <Image
            src="/images/stoktrust-hero.jpg"
            alt=""
            fill
            priority
            className="object-cover landing-hero-image"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0b2f2a] via-[#0f3d36]/75 to-[#0f3d36]/35"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.25),transparent_55%)]"
            aria-hidden
          />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pb-20 md:pb-24">
            <p className="landing-fade-up font-landing-display text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
              StokTrust
            </p>
            <h1 className="landing-fade-up landing-delay-1 mt-4 max-w-xl text-xl font-medium leading-snug text-emerald-50 sm:text-2xl md:text-3xl">
              Run your stokvel with clear rules and shared trust.
            </h1>
            <p className="landing-fade-up landing-delay-2 mt-4 max-w-lg text-base leading-relaxed text-emerald-100/85 sm:text-lg">
              Create a group, invite members, track contributions, and manage
              payouts — all in one place built for South African stokvels.
            </p>
            <div className="landing-fade-up landing-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="bg-emerald-400 text-emerald-950 hover:bg-emerald-300"
                asChild
              >
                <Link href="/signup">
                  Start your stokvel
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/signin">I already have an account</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b border-slate-200/80 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              How it works
            </p>
            <h2 className="font-landing-display mt-3 max-w-xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              From first invite to payout day.
            </h2>
            <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {steps.map((step) => (
                <li key={step.number} className="relative">
                  <span className="font-landing-display text-4xl font-semibold text-emerald-200">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Who it's for */}
        <section className="bg-[#f4f7f6] py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Built for real groups
            </p>
            <h2 className="font-landing-display mt-3 max-w-xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Admins lead. Members participate.
            </h2>
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              <div className="border-l-2 border-emerald-500 pl-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Shield className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Administrators
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Create the stokvel, set the constitution, invite members, and
                  keep contributions verified. Stay in control without messy
                  WhatsApp threads and spreadsheets.
                </p>
              </div>
              <div className="border-l-2 border-teal-500 pl-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  <Users className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Members</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Accept an invite, see the rules before you join, contribute on
                  schedule, and track where you stand — with the same clarity as
                  everyone else in the group.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / constitution */}
        <section className="border-y border-slate-200/80 bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Trust first
              </p>
              <h2 className="font-landing-display mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Rules everyone can read before they join.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Every stokvel can publish a constitution covering membership,
                contributions, payouts, meetings, and disputes. Invitees review
                it before they accept — so expectations are clear from day one.
              </p>
            </div>
            <ul className="space-y-4" aria-label="What StokTrust helps you manage">
              {[
                {
                  icon: FileText,
                  label: "Shared constitution",
                  detail: "Purpose, membership, and amendment rules in one place.",
                },
                {
                  icon: Wallet,
                  label: "Contribution tracking",
                  detail: "See who has paid, what’s pending, and what’s due.",
                },
                {
                  icon: Users,
                  label: "Member invites",
                  detail: "Secure invite links and codes for people you choose.",
                },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <item.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{item.label}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="relative overflow-hidden bg-[#0f3d36] py-20 sm:py-24">
          <div
            className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl landing-blob"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
            <h2 className="font-landing-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Ready to run your stokvel properly?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-emerald-100/80">
              Create an account in minutes. Invite your members when you’re
              ready.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="bg-emerald-400 text-emerald-950 hover:bg-emerald-300"
                asChild
              >
                <Link href="/signup">
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/signin">Sign in</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Shield className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="font-landing-display font-semibold text-slate-900">
              StokTrust
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Trusted stokvels, clearer contributions.
          </p>
        </div>
      </footer>
    </div>
  );
}
