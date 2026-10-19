import { IconMail, IconCurrencyDollar } from "@tabler/icons-react";
import type { SocialLink } from "@prisma/client";
import { PillButton } from "@/components/ui/PillButton";
import { BrandIcon } from "@/components/icons/BrandIcon";

// Background PNG per tombol (handdrawn outline, hitam di atas transparan).
// Tulisan literal — Tailwind gak bisa scan string template dinamis.
// Hover: scale up aja, gak ada fill gelap.
const HOVER_SCALE = " transition-all! hover:scale-105 hover:bg-transparent! hover:text-neutral-900!";
const BTN_IMAGE_CLASSES: Record<string, string> = {
  itch: "border-0! rounded-none! bg-[url(/itch_btn.png)] bg-[length:100%_100%] bg-no-repeat" + HOVER_SCALE,
  discord:
    "border-0! rounded-none! bg-[url(/discord_btn.png)] bg-[length:100%_100%] bg-no-repeat" +
    HOVER_SCALE,
  steam:
    "border-0! rounded-none! bg-[url(/steam_btn.png)] bg-[length:100%_100%] bg-no-repeat" +
    HOVER_SCALE,
  email:
    "border-0! rounded-none! bg-[url(/email_btn.png)] bg-[length:100%_100%] bg-no-repeat" +
    HOVER_SCALE,
  business:
    "border-0! rounded-none! bg-[url(/business_btn.png)] bg-[length:100%_100%] bg-no-repeat" +
    HOVER_SCALE,
};

export function CommunityContact({
  communityLinks,
}: {
  communityLinks: SocialLink[];
}) {


  return (
    <section className="flex items-center px-6 py-16 md:px-10">
      <div className="mx-auto grid w-full max-w-7xl items-start gap-16 sm:grid-cols-2">
        <div>
          <h2 className="font-heading text-7xl tracking-wide">Join Our Community</h2>
          <div className="mt-14 flex flex-col items-start gap-8">
            {communityLinks.length === 0 ? (
              <p className="font-body text-xl text-neutral-400">
                Coming soon.
              </p>
            ) : (
              communityLinks.map((link) => (
                <PillButton
                  key={link.id}
                  href={link.url}
                  icon={<BrandIcon slug={link.platform} className="h-6 w-6" />}
                  className={BTN_IMAGE_CLASSES[link.platform] ?? ""}
                >
                  {link.label}
                </PillButton>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="font-heading text-7xl tracking-wide">Contact Us</h2>
          <div className="mt-14 flex flex-col items-start gap-8">
            <PillButton
              href="/contact"
              icon={<IconMail size={32} />}
              className={BTN_IMAGE_CLASSES.email}
            >
              Say Hello
            </PillButton>
            <PillButton
              href="/contact"
              icon={<IconCurrencyDollar size={32} />}
              className={BTN_IMAGE_CLASSES.business}
            >
              Business Inquiries
            </PillButton>
          </div>
        </div>
      </div>
    </section>
  );
}
