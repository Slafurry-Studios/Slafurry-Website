import { IconMail, IconBriefcase } from "@tabler/icons-react";
import { ContactForm } from "@/components/contact/ContactForm";

// TODO (step 4): heading/intro dan email tarik dari SiteSettings
// (contactHeading/contactHeadingSerious, contactIntro/contactIntroSerious,
// contactEmail, businessEmail). Bukan translation key karena ini konten,
// bukan UI string.
const CONTACT_EMAIL = "hello@slafurrystudios.com";
const BUSINESS_EMAIL = "business@slafurrystudios.com";
const MOCK_INTRO =
  "Got a question, a business proposal, or just want to say the joke worked? Pick a channel below.";

export default async function ContactPage() {
  
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:px-10">
      <h1 className="font-display text-5xl tracking-wide">Contact Us</h1>
      <p className="mt-3 font-display text-lg text-neutral-600 dark:text-neutral-400">
        {MOCK_INTRO}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="pixel-border p-4 transition-all hover:scale-[1.02]"
        >
          <IconMail size={20} className="text-neutral-700 dark:text-neutral-300" />
          <p className="mt-2 font-display text-lg font-semibold">"Say Hello"</p>
          <p className="mt-0.5 font-display text-xs text-neutral-500 dark:text-neutral-400">
            "General questions, fan mail"
          </p>
        </a>
        <a
          href={`mailto:${BUSINESS_EMAIL}`}
          className="pixel-border p-4 transition-all hover:scale-[1.02]"
        >
          <IconBriefcase size={20} className="text-neutral-700 dark:text-neutral-300" />
          <p className="mt-2 font-display text-lg font-semibold">"Business Inquiries"</p>
          <p className="mt-0.5 font-display text-xs text-neutral-500 dark:text-neutral-400">
            "Partnerships, press, publishing"
          </p>
        </a>
      </div>

      <div className="mt-10 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <p className="mb-4 font-display text-lg text-neutral-500 dark:text-neutral-400">
          "Or send a message directly"
        </p>
        <ContactForm />
      </div>
    </div>
  );
}
