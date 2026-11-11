import { IconMail, IconCurrencyDollar } from "@tabler/icons-react";
import type { SocialLink } from "@prisma/client";
import { PillButton } from "@/components/ui/PillButton";
import { BrandIcon } from "@/components/icons/BrandIcon";

// Background PNG per button (handdrawn outline, black on transparent).
// Literal text — Tailwind can't scan dynamic template strings.
// Hover: scale up only, no dark fill.
const BTN_IMAGE_CLASSES: Record<string, string> = {
  itch: "pixel-btn",
  discord: "pixel-btn",
  steam: "pixel-btn",
  email: "pixel-btn",
  business: "pixel-btn",
};

export function CommunityContact({
  communityLinks,
}: {
  communityLinks: SocialLink[];
}) {
  const contactItems = [
    {
      href: "/contact",
      icon: <IconMail size={32} />,
      label: "Say Hello",
      className: BTN_IMAGE_CLASSES.email,
    },
    {
      href: "/contact",
      icon: <IconCurrencyDollar size={32} />,
      label: "Business Inquiries",
      className: BTN_IMAGE_CLASSES.business,
    },
  ];

  const maxRows = Math.max(communityLinks.length, contactItems.length);

  return (
    <section className="flex items-center px-6 py-16 md:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mt-14 grid w-full gap-16 sm:grid-cols-2">
          <div className="flex flex-col items-start gap-8">
            <h2 className="font-display text-4xl tracking-wide sm:text-5xl lg:text-6xl">
              Join Our Community
            </h2>
            {communityLinks.map((link) => (
              <PillButton
                key={link.id}
                href={link.url}
                size="sm"
                icon={<BrandIcon slug={link.platform} className="h-6 w-6" />}
                className={BTN_IMAGE_CLASSES[link.platform] ?? ""}
              >
                {link.label}
              </PillButton>
            ))}
          </div>

          <div className="flex flex-col items-start gap-8">
            <h2 className="font-display text-4xl tracking-wide sm:text-5xl lg:text-6xl">
              Contact Us
            </h2>
            {contactItems.map((item, i) => (
              <PillButton
                key={i}
                href={item.href}
                size="sm"
                icon={item.icon}
                className={item.className}
              >
                {item.label}
              </PillButton>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
