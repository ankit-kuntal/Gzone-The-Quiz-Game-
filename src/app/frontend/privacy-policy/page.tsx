"use client";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-6 md:px-16 py-20 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ffb347]/10 blur-[120px] rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#ffb347] to-[#ffcc80] bg-clip-text text-transparent">
            Privacy Policy
          </h1>

          <p className="text-gray-500 text-sm mt-3">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <p className="text-gray-300 mt-6 leading-relaxed max-w-2xl">
            Welcome to <span className="text-[#ffb347] font-semibold">GZone</span>.
            We respect your privacy and are committed to protecting your data.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, i) => (
            <div
              key={i}
              className="group relative bg-white/[0.04] border border-white/10 rounded-2xl p-6 md:p-7 transition-all duration-300 hover:border-[#ffb347]/40 hover:bg-white/[0.06]"
            >
              {/* subtle hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-[#ffb347]/10 via-transparent to-[#ffb347]/10" />

              <h2 className="text-lg md:text-xl font-semibold text-[#ffb347] mb-3 relative z-10">
                {section.title}
              </h2>

              <div className="text-gray-300 leading-relaxed text-[15px] relative z-10">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 border-t border-white/10 pt-6">
          
          <Link
            href="/"
            className="hover:text-[#ffb347] transition-all duration-300"
          >
            ← Back to Home
          </Link>

          <a
            href="mailto:support@gzone.app"
            className="hover:text-[#ffb347] transition-all duration-300"
          >
            support@gzone.app
          </a>

        </div>

      </div>
    </div>
  );
}

const sections = [
  {
    title: "1. Information We Collect",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li><b>Account:</b> Username, email, encrypted password</li>
        <li><b>Game Activity:</b> Scores, badges, rankings</li>
        <li><b>Device:</b> IP, browser, device info</li>
        <li><b>Usage:</b> Pages, clicks, time spent</li>
      </ul>
    ),
  },
  {
    title: "2. How We Use Your Data",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Improve gameplay experience</li>
        <li>Manage accounts</li>
        <li>Personalized quizzes</li>
        <li>Security & fraud detection</li>
        <li>Notifications & updates</li>
      </ul>
    ),
  },
  {
    title: "3. Cookies & Tracking",
    content: (
      <p>
        We use cookies to enhance performance, remember preferences,
        and analyze traffic. Third-party services may also use cookies.
      </p>
    ),
  },
  {
    title: "4. Data Protection",
    content: (
      <p>
        We use encryption, secure authentication, and protected databases.
        However, no system is 100% secure.
      </p>
    ),
  },
  {
    title: "5. Third-Party Services",
    content: (
      <p>
        We may use analytics, ads, hosting, and auth providers.
      </p>
    ),
  },
  {
    title: "6. Children's Privacy",
    content: (
      <p>
        Not intended for users under 13. We do not knowingly collect data from children.
      </p>
    ),
  },
  {
    title: "7. Your Rights",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Access your data</li>
        <li>Edit or delete info</li>
        <li>Withdraw consent</li>
      </ul>
    ),
  },
  {
    title: "8. Updates",
    content: (
      <p>
        We may update this policy. Changes will be reflected by the updated date.
      </p>
    ),
  },
  {
    title: "9. Contact",
    content: (
      <p>
        Contact us at{" "}
        <a href="mailto:support@gzone.app" className="text-[#ffb347] hover:underline">
          support@gzone.app
        </a>
      </p>
    ),
  },
];