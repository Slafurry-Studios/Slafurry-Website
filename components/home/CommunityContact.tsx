import { useTranslations } from "next-intl";
import { IconMail, IconCurrencyDollar } from "@tabler/icons-react";
import { PillButton } from "@/components/ui/PillButton";
import { BrandIcon } from "@/components/icons/BrandIcon";
import { mockCommunityLinks } from "@/lib/mock/home";

export function CommunityContact() {
  const t = useTranslations("home");
  const tContact = useTranslations("contact");

  return (
    <section className="flex min-h-screen items-center border-t border-neutral-200 px-6 py-16 dark:border-neutral-800 md:px-10">
      <div className="mx-auto grid max-w-4xl gap-12 sm:grid-cols-2">
        <div>
          <h2 className="font-heading text-3xl tracking-wide">{t("joinCommunity")}</h2>
          <div className="mt-5 flex flex-col items-start gap-3">
            {mockCommunityLinks.map((link) => (
              <PillButton
                key={link.platform}
                href={link.url}
                icon={<BrandIcon slug={link.platform} className="h-4 w-4" />}
              >
                {link.label}
              </PillButton>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-heading text-3xl tracking-wide">{t("contactUs")}</h2>
          <div className="mt-5 flex flex-col items-start gap-3">
            <PillButton href="/contact" icon={<IconMail size={16} />}>
              {tContact("sayHello")}
            </PillButton>
            <PillButton href="/contact" icon={<IconCurrencyDollar size={16} />}>
              {tContact("businessInquiries")}
            </PillButton>
          </div>
        </div>
      </div>
    </section>
  );
}
