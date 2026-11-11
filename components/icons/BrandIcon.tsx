import {
  IconBrandDiscord,
  IconBrandSteam,
  IconBrandItch,
  IconBrandYoutube,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconMail,
  IconLink,
  type Icon,
} from "@tabler/icons-react";

// Lookup slug -> Tabler component. Add here if you later need
// a new platform (e.g. Twitch, Bluesky, etc. — just check availability
// in @tabler/icons-react, most popular brands are there).
const ICONS: Record<string, Icon> = {
  discord: IconBrandDiscord,
  steam: IconBrandSteam,
  itch: IconBrandItch,
  youtube: IconBrandYoutube,
  instagram: IconBrandInstagram,
  linkedin: IconBrandLinkedin,
  tiktok: IconBrandTiktok,
  mail: IconMail,
};

export function BrandIcon({
  slug,
  className,
  size = 18,
}: {
  slug: string;
  className?: string;
  size?: number;
}) {
  const IconComponent = ICONS[slug] ?? IconLink;
  return <IconComponent size={size} stroke={1.75} className={className} />;
}
