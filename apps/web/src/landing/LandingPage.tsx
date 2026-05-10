import { useState } from "react";

interface LandingPageProps {
  onLaunchApp: () => void;
}

export function LandingPage({ onLaunchApp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <Nav onLaunchApp={onLaunchApp} />
      <Hero onLaunchApp={onLaunchApp} />
      <Problem />
      <HowItWorks />
      <Protocols />
      <BuiltInPublic />
      <Waitlist />
      <Footer />
    </div>
  );
}

// ─── Nav ────────────────────────────────────────────────────────────────────

function Nav({ onLaunchApp }: { onLaunchApp: () => void }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight">Meridian</span>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-400">
          <a
            href="https://github.com/collinsezedike/meridian"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            GitHub
          </a>
          <a
            href="https://stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            Stellar
          </a>
        </nav>
        <button
          onClick={onLaunchApp}
          className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 active:scale-95 px-4 py-2 rounded-lg transition"
        >
          Launch App →
        </button>
      </div>
    </header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero({ onLaunchApp }: { onLaunchApp: () => void }) {
  function scrollToWaitlist() {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="pt-36 pb-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-6">
          Stellar · USDC · Yield
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6">
          Your stablecoins should{" "}
          <span className="text-green-400">outpace inflation.</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Meridian routes your USDC and EURC into the highest-yielding vaults on
          Stellar — automatically. Built for West Africa. Open to the world.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={scrollToWaitlist}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 font-medium transition"
          >
            Join the Waitlist
          </button>
          <button
            onClick={onLaunchApp}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-medium transition"
          >
            Explore the App →
          </button>
        </div>
        <p className="mt-10 text-xs text-gray-600">
          Built on Stellar · Powered by Blend Capital & DeFindex · Part of the Drips Wave Program
        </p>
      </div>
    </section>
  );
}

// ─── Problem ─────────────────────────────────────────────────────────────────

function Problem() {
  return (
    <section className="py-24 px-6 bg-gray-900/40">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">
          The problem
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-16 max-w-xl">
          The numbers are brutal.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          <StatBlock
            figure="33%"
            color="text-red-400"
            body="Nigeria's peak inflation rate in 2024 — silently destroying the purchasing power of every naira saved."
          />
          <StatBlock
            figure="<8%"
            color="text-yellow-400"
            body="The average savings account APY across West Africa. Against double-digit inflation, that's a guaranteed loss."
          />
          <StatBlock
            figure="$0"
            color="text-gray-500"
            body="What most DeFi earns after Ethereum gas fees consume your returns. High-yield protocols weren't built for small savers."
          />
        </div>
        <p className="text-gray-300 max-w-2xl leading-relaxed">
          Dollar-denominated savings are out of reach for most people in West Africa.
          Traditional DeFi is too expensive and too complex. Meridian is built differently —
          on Stellar, where fees cost fractions of a cent and transactions settle in five seconds.
        </p>
      </div>
    </section>
  );
}

function StatBlock({
  figure,
  color,
  body,
}: {
  figure: string;
  color: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
      <p className={`text-5xl font-bold mb-4 ${color}`}>{figure}</p>
      <p className="text-sm text-gray-400 leading-relaxed">{body}</p>
    </div>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    number: "01",
    title: "Connect your wallet",
    body: "Use Freighter, the Stellar browser extension. No email, no KYC, no bank account required.",
  },
  {
    number: "02",
    title: "Deposit stablecoins",
    body: "Deposit USDC or EURC — any amount. Meridian accepts both major Stellar stablecoins.",
  },
  {
    number: "03",
    title: "Earn optimized yield",
    body: "Meridian automatically routes your deposit to the highest-yielding vault across Blend Capital and DeFindex.",
  },
];

function HowItWorks() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">
          How it works
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-16 max-w-xl">
          One deposit. Optimized yield.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {STEPS.map((step) => (
            <div key={step.number}>
              <p className="text-5xl font-bold text-gray-800 mb-5">{step.number}</p>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Protocols ───────────────────────────────────────────────────────────────

const TAG_COLORS: Record<string, string> = {
  blue: "bg-blue-900/50 text-blue-300 border-blue-700/50",
  violet: "bg-violet-900/50 text-violet-300 border-violet-700/50",
  green: "bg-green-900/50 text-green-300 border-green-700/50",
};

function Protocols() {
  return (
    <section className="py-24 px-6 bg-gray-900/40">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">
          Infrastructure
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Built on protocols tested in production.
        </h2>
        <p className="text-gray-400 mb-16 max-w-xl leading-relaxed">
          Meridian doesn't reinvent the wheel. It aggregates yield from two of the most
          credible protocols on Stellar, with Stellar itself as the settlement layer.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ProtocolCard
            name="Blend Capital"
            tag="Lending"
            tagColor="blue"
            description="The leading lending and borrowing protocol on Stellar. Open-source, audited, and actively maintained."
            href="https://blend.capital"
          />
          <ProtocolCard
            name="DeFindex"
            tag="Yield Strategies"
            tagColor="violet"
            description="Automated yield vaults built on Stellar smart contracts. Composable, capital-efficient, and designed for sustainability."
            href="https://defindex.io"
          />
          <ProtocolCard
            name="Stellar"
            tag="Settlement Layer"
            tagColor="green"
            description="5-second finality. Sub-cent transaction fees. A Layer 1 network designed from the ground up for global financial access."
            href="https://stellar.org"
          />
        </div>
      </div>
    </section>
  );
}

function ProtocolCard({
  name,
  tag,
  tagColor,
  description,
  href,
}: {
  name: string;
  tag: string;
  tagColor: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl border border-gray-800 bg-gray-900 p-6 hover:border-gray-700 transition group"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="font-semibold text-white">{name}</p>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${TAG_COLORS[tagColor]}`}
        >
          {tag}
        </span>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed mb-4">{description}</p>
      <p className="text-xs text-gray-600 group-hover:text-gray-400 transition">
        Learn more →
      </p>
    </a>
  );
}

// ─── Built in Public ─────────────────────────────────────────────────────────

function BuiltInPublic() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">
            Open source
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Built in public,
            <br />
            for the community.
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Meridian is part of the{" "}
            <a
              href="https://drips.network"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-2 hover:text-green-400 transition"
            >
              Drips Stellar Wave Program
            </a>{" "}
            — a grant initiative accelerating open-source development on Stellar.
            Every line of code, every design decision, and every issue is public.
          </p>
          <p className="text-gray-400 leading-relaxed">
            If you're a developer interested in Stellar, DeFi, or financial infrastructure
            for emerging markets, there's a place for you here. Issues are tagged by skill
            area — pick one up.
          </p>
        </div>

        <div className="space-y-3">
          <PublicLink
            href="https://github.com/collinsezedike/meridian"
            icon={<GitHubIcon />}
            title="collinsezedike/meridian"
            subtitle="View source on GitHub"
          />
          <PublicLink
            href="https://github.com/collinsezedike/meridian/issues"
            icon={<IssueIcon />}
            title="Open Issues"
            subtitle="Pick up an issue and contribute"
          />
          <div className="flex items-center gap-4 rounded-xl border border-indigo-900/40 bg-indigo-950/20 px-5 py-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-900/50 flex items-center justify-center">
              <SparkleIcon />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Drips Stellar Wave Program</p>
              <p className="text-xs text-indigo-400">Wave Program submission · 2025</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicLink({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 px-5 py-4 hover:border-gray-700 transition group"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <span className="ml-auto text-gray-600 group-hover:text-gray-400 transition text-sm">→</span>
    </a>
  );
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────

function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <section id="waitlist" className="py-24 px-6 bg-gray-900/40">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">
          Early access
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Be among the first.</h2>
        <p className="text-gray-400 leading-relaxed mb-10">
          We're onboarding early users from West Africa first — then expanding across the
          continent. Drop your email and we'll reach out when your spot is ready.
        </p>

        {submitted ? (
          <div className="rounded-2xl border border-green-800 bg-green-900/20 px-6 py-8">
            <p className="text-green-400 font-semibold mb-1">You're on the list.</p>
            <p className="text-sm text-gray-400">
              We'll be in touch when early access opens.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-sm font-medium transition whitespace-nowrap"
            >
              Reserve my spot
            </button>
          </form>
        )}

        <p className="mt-4 text-xs text-gray-600">
          No spam. No selling your data. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">Meridian</span>
          <span>·</span>
          <span>Built on Stellar</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/collinsezedike/meridian"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            GitHub
          </a>
          <a
            href="https://github.com/collinsezedike/meridian/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            Issues
          </a>
          <a
            href="https://stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            Stellar
          </a>
        </div>
        <span>© 2025 Meridian</span>
      </div>
    </footer>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IssueIcon() {
  return (
    <svg
      className="w-4 h-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      className="w-4 h-4 text-indigo-400"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
      />
    </svg>
  );
}
