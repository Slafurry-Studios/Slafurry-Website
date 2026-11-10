import { IconMail, IconCurrencyDollar } from "@tabler/icons-react";
import type { SocialLink } from "@prisma/client";
import { PillButton } from "@/components/ui/PillButton";
import { BrandIcon } from "@/components/icons/BrandIcon";

// Background PNG per tombol (handdrawn outline, hitam di atas transparan).
// Tulisan literal — Tailwind gak bisa scan string template dinamis.
// Hover: scale up aja, gak ada fill gelap.
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
        <div className="grid w-full gap-16 sm:grid-cols-2">
          <h2 className="font-display text-4xl tracking-wide sm:text-5xl lg:text-6xl">
            Join Our Community
          </h2>
          <h2 className="font-display text-4xl tracking-wide sm:text-5xl lg:text-6xl">
            Contact Us
          </h2>
        </div>

        <div className="mt-14 grid w-full grid-cols-1 gap-8 sm:grid-cols-2">
          {Array.from({ length: maxRows }).map((_, i) => {
            const comm = communityLinks[i];
            const cont = contactItems[i];
            return (
              <div key={i} className="contents">
                <div className="flex flex-col items-start">
                  {comm ? (
                    <PillButton
                      href={comm.url}
                      icon={<BrandIcon slug={comm.platform} className="h-6 w-6" />}
                      className={BTN_IMAGE_CLASSES[comm.platform] ?? ""}
                    >
                      {comm.label}
                    </PillButton>
                  ) : (
                    <div />
                  )}
                </div>
                <div className="flex flex-col items-start">
                  {cont ? (
                    <PillButton
                      href={cont.href}
                      icon={cont.icon}
                      className={cont.className}
                    >
                      {cont.label}
                    </PillButton>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
