import { PrismaClient, AchievementTrigger, LinkSection } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // --- SiteSettings singleton (id selalu 1) ---
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      tagline: "The joke went too far. Now we are going professional.",
      taglineSerious: "Independent game development studio.",
      aboutText:
        "Slafurry Studios is a collective independent game developer based on Earth, Milky Way. We are a group of developers, artists, and creators brought together by our love for games. We started making games because it seemed like a fun thing to do. Somewhere along the way, the joke went too far. Now we are going professional. Still from Earth, though.",
      aboutTextSerious:
        "Slafurry Studios is an independent game development studio, founded by a collective of developers, artists, and creators focused on narrative and experimental game design.",
      contactHeading: "Get in touch",
      contactHeadingSerious: "Contact us",
      contactIntro:
        "Got a question, a business proposal, or just want to say the joke worked? Pick a channel below.",
      contactIntroSerious:
        "For inquiries, please use the appropriate channel below.",
      foundedAt: new Date(), // TODO: ganti ke tanggal pendirian studio yang sebenarnya
      contactEmail: "hello@slafurrystudios.com", // TODO: ganti ke email asli
      businessEmail: "business@slafurrystudios.com", // TODO: ganti ke email asli
      defaultOgImage: "/og/default-banner.png", // TODO: upload banner 1200x630 asli
    },
  });

  // --- Starter achievements ---
  await prisma.achievement.upsert({
    where: { key: "welcome" },
    update: {},
    create: {
      key: "welcome",
      title: "Welcome to Slafurry!",
      description: "Welcome to our website! Hope you like it here!",
      triggerType: AchievementTrigger.PAGE_VISIT,
      triggerConfig: { path: "/" },
      category: "Exploration",
      order: 0,
    },
  });

  await prisma.achievement.upsert({
    where: { key: "cheating" },
    update: {},
    create: {
      key: "cheating",
      title: "Cheating!",
      description: "This achievement can't be completed through conventional ways.",
      triggerType: AchievementTrigger.CHEAT_DETECTED,
      triggerConfig: {},
      isSecret: true,
      category: "Secret",
      order: 999,
    },
  });

  // --- Starter game (biar Hero "Upcoming Project" & Project Carousel ada isinya) ---
  await prisma.game.upsert({
    where: { slug: "an-unfinished-game" },
    update: {},
    create: {
      slug: "an-unfinished-game",
      title: "An Unfinished Game",
      coverImage: "/placeholder/an-unfinished-game.png", // TODO: ganti asset asli
      coverImageAlt: "Cover art for An Unfinished Game",
      shortDesc:
        "2D Narrative Horror Platformer about a Game Developer trapped in his unfinished game.",
      longDesc:
        "2D Narrative Horror Platformer about a Game Developer trapped in his unfinished game.",
      status: "UPCOMING",
      featured: true,
      order: 0,
    },
  });

  await prisma.game.upsert({
    where: { slug: "pandoras-snake" },
    update: {},
    create: {
      slug: "pandoras-snake",
      title: "Pandora's Snake",
      coverImage: "/placeholder/pandoras-snake.png", // TODO: ganti asset asli
      coverImageAlt: "Cover art for Pandora's Snake",
      shortDesc:
        "A snake cursed by a crazy witch grows infinitely, destroy entire planets, livestream apocalypse across the multiverse.",
      longDesc:
        "A snake cursed by a crazy witch grows infinitely, destroy entire planets, livestream apocalypse across the multiverse.",
      status: "RELEASED",
      featured: false,
      order: 1,
    },
  });

  // --- Starter post (biar News Preview section ada isinya) ---
  await prisma.post.upsert({
    where: { slug: "welcome-to-slafurry-studios" },
    update: {},
    create: {
      slug: "welcome-to-slafurry-studios",
      title: "Welcome to the new Slafurry Studios website",
      coverImage: "/placeholder/welcome-post.png", // TODO: ganti asset asli
      coverImageAlt: "Welcome banner",
      excerpt:
        "We rebuilt the whole site from scratch. Here's what's new, and what's still held together with tape.",
      content:
        "<p>We rebuilt the whole site from scratch. Here's what's new, and what's still held together with tape.</p>",
      category: "NEWS",
      tags: ["announcement"],
      authorName: "Slafurry Studios",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  // --- Starter social links (placeholder URL, ganti di admin panel nanti) ---
  const socialLinks = [
    { platform: "itch", label: "Itch.io", url: "https://itch.io", section: LinkSection.COMMUNITY, order: 0 },
    { platform: "discord", label: "Discord Server", url: "https://discord.gg", section: LinkSection.COMMUNITY, order: 1 },
    { platform: "steam", label: "Steam Community", url: "https://steamcommunity.com", section: LinkSection.COMMUNITY, order: 2 },
    { platform: "mail", label: "Say Hello", url: "mailto:hello@slafurrystudios.com", section: LinkSection.CONTACT, order: 0 },
    { platform: "mail", label: "Business Inquiries", url: "mailto:business@slafurrystudios.com", section: LinkSection.CONTACT, order: 1 },
    { platform: "mail", label: "Email", url: "mailto:hello@slafurrystudios.com", section: LinkSection.FOOTER, order: 0 },
    { platform: "youtube", label: "YouTube", url: "https://youtube.com", section: LinkSection.FOOTER, order: 1 },
    { platform: "instagram", label: "Instagram", url: "https://instagram.com", section: LinkSection.FOOTER, order: 2 },
    { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com", section: LinkSection.FOOTER, order: 3 },
    { platform: "tiktok", label: "TikTok", url: "https://tiktok.com", section: LinkSection.FOOTER, order: 4 },
  ];

  for (const link of socialLinks) {
    const existing = await prisma.socialLink.findFirst({
      where: { platform: link.platform, section: link.section, label: link.label },
    });
    if (!existing) {
      await prisma.socialLink.create({ data: link });
    }
  }

  console.log("Seed selesai ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
