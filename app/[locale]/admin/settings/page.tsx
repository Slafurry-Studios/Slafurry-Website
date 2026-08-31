import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const [settingsRaw, links] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.socialLink.findMany({
      orderBy: [{ section: "asc" }, { order: "asc" }],
    }),
  ]);

  // Ensure singleton exists
  const settings = settingsRaw ?? {
    tagline: "",
    taglineSerious: "",
    aboutText: "",
    aboutTextSerious: "",
    contactHeading: "Get in touch",
    contactHeadingSerious: "Contact us",
    contactIntro: "",
    contactIntroSerious: "",
    foundedAt: new Date(),
    contactEmail: "",
    businessEmail: "",
    defaultOgImage: "",
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <h1 className="font-heading text-3xl tracking-tight">Settings</h1>

      <SettingsForm
        initialSettings={{
          tagline: settings.tagline,
          taglineSerious: settings.taglineSerious,
          aboutText: settings.aboutText,
          aboutTextSerious: settings.aboutTextSerious,
          contactHeading: settings.contactHeading,
          contactHeadingSerious: settings.contactHeadingSerious,
          contactIntro: settings.contactIntro,
          contactIntroSerious: settings.contactIntroSerious,
          foundedAt: settings.foundedAt.toISOString().split("T")[0],
          contactEmail: settings.contactEmail,
          businessEmail: settings.businessEmail,
          defaultOgImage: settings.defaultOgImage,
        }}
        initialLinks={links.map((l) => ({
          id: l.id,
          platform: l.platform,
          label: l.label,
          url: l.url,
          section: l.section,
          order: l.order,
        }))}
      />
    </div>
  );
}
