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

// Lookup slug -> komponen Tabler. Tambahin di sini kalau nanti butuh
// platform baru (misal Twitch, Bluesky, dst — tinggal cek dulu tersedia
// di @tabler/icons-react, hampir semua brand populer ada).
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
