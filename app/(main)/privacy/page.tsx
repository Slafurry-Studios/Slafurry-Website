import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries/home";
import { CookieSettingsButton } from "@/components/analytics/CookieSettingsButton";

export const metadata: Metadata = {
  title: "Privacy - Slafurry Studios",
  description: "What this website collects, why, and how to change your choices.",
};

// ISR so the contact email follows SiteSettings without a rebuild.
export const revalidate = 60;

const FALLBACK_CONTACT_EMAIL = "hello@slafurrystudios.com";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl tracking-wide">{title}</h2>
      <div className="space-y-3 leading-relaxed text-neutral-700">{children}</div>
    </section>
  );
}

// Keep this page in sync with what the code actually does: analytics
// (app/api/analytics/track), comments (lib/actions/comment.ts), contact form
// (lib/actions/contact.ts), embeds (lib/youtube.ts) and captcha (Turnstile).
export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const contactEmail = settings?.contactEmail || FALLBACK_CONTACT_EMAIL;

  return (
    <article className="mx-auto max-w-3xl space-y-10 px-6 py-16 md:px-10">
      <header className="space-y-3">
        <h1 className="font-display text-5xl tracking-wide">Privacy</h1>
        <p className="text-neutral-600">
          The short version: we collect as little as we can, we don&apos;t sell anything, and the
          visit counter only runs if you say yes. Last updated 26 November 2026.
        </p>
      </header>

      <Section title="Visit counting (only if you accept)">
        <p>
          If you click &ldquo;Sure&rdquo; on the banner, each page you open on this site is counted
          once. For each visit we store:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>the page path, for example <code>/games</code></li>
          <li>
            the name of the website that sent you here, for example <code>google.com</code>. We
            never store the full link, so search terms are not kept.
          </li>
          <li>your device type: phone, tablet or desktop</li>
          <li>your country, as reported by our host</li>
        </ul>
        <p>
          We don&apos;t store your IP address, and these counts aren&apos;t linked to you or to any
          account. Visit records are deleted automatically after 13 months. If you click &ldquo;No thanks&rdquo;, or your browser sends a Global Privacy
          Control signal, nothing is counted.
        </p>
        <p>
          Your choice is saved in a cookie called <code>analytics_consent</code> for 180 days. You
          can change it at any time: <CookieSettingsButton className="font-medium text-neutral-900" />.
        </p>
      </Section>

      <Section title="Comments">
        <p>
          When you post a comment we store your name, email address, the comment itself and a
          one-way hash of your IP address. The hash is used only to limit spam and can&apos;t be
          turned back into your address. Your email is never shown publicly. Comments are reviewed
          before they appear.
        </p>
      </Section>

      <Section title="Contact form">
        <p>
          Messages sent through the contact form are stored with your name and email so we can
          reply, and a copy is emailed to us through our email provider, Resend.
        </p>
      </Section>

      <Section title="Other services this site uses">
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Cloudflare Turnstile</strong> checks that comment and contact form submissions
            come from a person. It loads only on pages with those forms.
          </li>
          <li>
            <strong>YouTube</strong> trailers on game pages use YouTube&apos;s privacy-enhanced
            mode. YouTube may set its own cookies once you play a video.
          </li>
          <li>
            <strong>Vercel</strong> hosts the site and <strong>Supabase</strong> hosts our database
            and images.
          </li>
        </ul>
      </Section>

      <Section title="Things stored in your browser">
        <p>
          Apart from <code>analytics_consent</code>, the site keeps a small display preference in
          your browser&apos;s local storage. It never leaves your device.
        </p>
      </Section>

      <Section title="Questions or removal requests">
        <p>
          Email{" "}
          <a href={`mailto:${contactEmail}`} className="font-medium underline underline-offset-2">
            {contactEmail}
          </a>{" "}
          and we&apos;ll help, including deleting a comment or message you sent us.
        </p>
      </Section>
    </article>
  );
}
