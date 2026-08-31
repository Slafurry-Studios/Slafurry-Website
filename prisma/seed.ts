import { PrismaClient, AchievementTrigger, LinkSection, PostCategory, GameStatus } from "@prisma/client";

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
        "Slafurry Studios is an indie game development collective creating narrative-driven and experimental games. We blend humor with heart, crafting experiences that linger long after the credits roll.",
      aboutTextSerious:
        "Slafurry Studios is an independent game development studio founded in 2023. We specialize in narrative and experimental game design, focusing on player-driven stories and meaningful interactivity.",
      contactHeading: "Get in touch",
      contactHeadingSerious: "Contact us",
      contactIntro:
        "Got a question, a business proposal, or just want to say the joke worked? Pick a channel below.",
      contactIntroSerious:
        "For inquiries, please use the appropriate channel below.",
      foundedAt: new Date("2023-06-15"),
      contactEmail: "hello@slafurrystudios.com",
      businessEmail: "business@slafurrystudios.com",
      defaultOgImage: "/og/default-banner.png",
    },
  });

  // --- Achievements ---
  const achievements = [
    {
      key: "welcome",
      title: "Welcome to Slafurry!",
      description: "Welcome to our website! Hope you like it here!",
      triggerType: AchievementTrigger.PAGE_VISIT,
      triggerConfig: { path: "/" },
      category: "Exploration",
      order: 0,
    },
    {
      key: "cheating",
      title: "Cheating!",
      description: "This achievement can't be completed through conventional ways.",
      triggerType: AchievementTrigger.CHEAT_DETECTED,
      triggerConfig: {},
      isSecret: true,
      category: "Secret",
      order: 999,
    },
    {
      key: "flag_code_1",
      title: "Flag Hunter",
      description: "Find and redeem a hidden flag code.",
      triggerType: AchievementTrigger.FLAG_CODE,
      triggerConfig: {},
      flagHash: "d69819f2523f6f081845590e45c1959a49307a8f51fbd7cbe4beeda1383853f1",
      isSecret: true,
      category: "Secret",
      order: 998,
    },
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { key: a.key },
      update: {},
      create: a,
    });
  }

  // --- Games ---
  const games = [
    {
      slug: "pandoras-snake",
      title: "Pandora's Snake",
      coverImage: "/placeholder/pandoras-snake.png",
      coverImageAlt: "Cover art for Pandora's Snake",
      shortDesc: "A snake cursed by a crazy witch grows infinitely, destroy entire planets, livestream apocalypse across the multiverse.",
      longDesc: "Pandora's Snake is a cosmic horror comedy where you play as a snake that keeps growing. Eat planets, crash into satellites, and stream the entire apocalypse to an audience that can't look away. Built on a physics system that was rewritten three times.",
      status: GameStatus.RELEASED,
      featured: false,
      order: 1,
    },
    {
      slug: "an-unfinished-game",
      title: "An Unfinished Game",
      coverImage: "/placeholder/an-unfinished-game.png",
      coverImageAlt: "Cover art for An Unfinished Game",
      shortDesc: "A 2D narrative horror platformer about a game developer trapped in his own unfinished game.",
      longDesc: "You are a game developer who wakes up inside the game you never finished. The levels are half-built, the enemies have no AI, and the exit leads back to the title screen. Figure out how to escape before the codebase collapses.",
      status: GameStatus.UPCOMING,
      featured: true,
      order: 0,
    },
    {
      slug: "project-clawmark",
      title: "Project Clawmark",
      coverImage: "/placeholder/project-clawmark.png",
      coverImageAlt: "Cover art for Project Clawmark",
      shortDesc: "Something's cooking. Details coming soon, probably.",
      longDesc: "Details coming soon.",
      status: GameStatus.IN_DEVELOPMENT,
      order: 2,
    },
    {
      slug: "backlog-simulator",
      title: "Backlog Simulator",
      coverImage: "/placeholder/backlog-simulator.png",
      coverImageAlt: "Cover art for Backlog Simulator",
      shortDesc: "A meta game about never finishing the games you buy.",
      longDesc: "Buy games. Never play them. Feel guilty. Buy more games. This is the game about that.",
      status: GameStatus.IN_DEVELOPMENT,
      order: 3,
    },
    {
      slug: "haunted-hotbar",
      title: "Haunted Hotbar",
      coverImage: "/placeholder/haunted-hotbar.png",
      coverImageAlt: "Cover art for Haunted Hotbar",
      shortDesc: "Your inventory is cursed and it's slowly taking over.",
      longDesc: "Your hotbar items have minds of their own. They swap places, disappear, and occasionally attack you. Survive the dungeon while your own inventory tries to kill you.",
      status: GameStatus.RELEASED,
      order: 4,
    },
    {
      slug: "the-last-refactor",
      title: "The Last Refactor",
      coverImage: "/placeholder/the-last-refactor.png",
      coverImageAlt: "Cover art for The Last Refactor",
      shortDesc: "Survive the codebase. Ship before the deadline eats you.",
      longDesc: "A survival horror game set inside a legacy codebase. Fix bugs, refactor functions, and try not to get eaten by the deprecated modules that are still somehow running in production.",
      status: GameStatus.RELEASED,
      order: 5,
    },
  ];

  for (const game of games) {
    const existing = await prisma.game.findUnique({ where: { slug: game.slug } });
    if (!existing) {
      await prisma.game.create({ data: game });
    }
  }

  // --- PlayLinks for released games ---
  const playLinksData = [
    { gameSlug: "pandoras-snake", links: [
      { label: "Steam", url: "https://store.steampowered.com/app/1245670/Pandoras_Snake" },
      { label: "Itch.io", url: "https://slafurry.itch.io/pandoras-snake" },
    ]},
    { gameSlug: "haunted-hotbar", links: [
      { label: "Itch.io", url: "https://slafurry.itch.io/haunted-hotbar" },
    ]},
  ];

  for (const { gameSlug, links } of playLinksData) {
    const game = await prisma.game.findUnique({ where: { slug: gameSlug } });
    if (!game) continue;
    const existing = await prisma.playLink.findFirst({ where: { gameId: game.id } });
    if (!existing) {
      await prisma.playLink.createMany({
        data: links.map((l) => ({ ...l, gameId: game.id })),
      });
    }
  }

  // --- Posts (Devlog + News) ---
  const posts = [
    {
      slug: "devlog-1",
      title: "Rebuilding the snake physics from scratch (again)",
      coverImage: "/placeholder/devlog-1.png",
      coverImageAlt: "The old collision system, moments before we deleted it.",
      excerpt: "We rewrote the collision system for the third time this month. This time it's actually fine. Probably. Here's what changed and why the old one kept eating planets it shouldn't.",
      content: `<p>We rewrote the collision system for the third time this month. This time it's actually fine. Probably.</p>
<p>The old system worked by checking every segment of the snake against every planet in the scene, every frame. That was fine when the snake was short. It stopped being fine around segment four hundred, which is exactly when the snake is supposed to start eating entire solar systems.</p>
<p>The new approach uses a spatial grid so we only check collisions against nearby objects. Performance is way up, and as a bonus, the snake no longer occasionally eats itself, which was a bug nobody asked for but everybody enjoyed watching.</p>
<p>Next up: figuring out why the livestream overlay renders upside down exactly 12% of the time. We have theories. None of them are good.</p>`,
      category: PostCategory.DEVLOG,
      tags: ["update"],
      authorName: "Slafurry Studios",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-03-01"),
    },
    {
      slug: "devlog-2",
      title: "Why the horror platformer took a detour into comedy",
      coverImage: "/placeholder/devlog-2.png",
      coverImageAlt: "Early concept art. We are not artists. It shows.",
      excerpt: "An unfinished game about being trapped in an unfinished game got a little too real during development. Some notes on tone, scope, and knowing when a joke is load-bearing.",
      content: `<p>An unfinished game about being trapped in an unfinished game got a little too real during development.</p>
<p>We started this project wanting to make something genuinely unsettling. Somewhere around month three, the game-within-the-game concept started bleeding into how we actually felt about the project, and the writing followed that honestly instead of fighting it.</p>
<p>The result is still horror, but it's horror with a sense of humor about its own circumstances — which, honestly, tracks with everything else we make.</p>`,
      category: PostCategory.DEVLOG,
      tags: ["feature"],
      authorName: "Slafurry Studios",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-02-18"),
    },
    {
      slug: "devlog-3",
      title: "Postmortem: what broke during the last playtest",
      coverImage: "/placeholder/devlog-3.png",
      coverImageAlt: "A screenshot from the playtest. We promise it's not supposed to look like that.",
      excerpt: "Short version: everything. Long version: a list of every bug we found during the closed playtest, sorted by how much it made us question our life choices.",
      content: `<p>Short version: everything. Long version: a list of every bug we found during the closed playtest, sorted by how much it made us question our life choices.</p>
<p>The build crashed on launch for about a third of testers, which in hindsight tracks with us testing exclusively on one developer's five-year-old laptop.</p>
<p>We've fixed the crash, the audio desync, and the bug where the save file silently renamed itself. We have not yet fixed why the cat NPC occasionally becomes sentient and starts pathing toward the exit. That one might just stay.</p>`,
      category: PostCategory.DEVLOG,
      tags: ["update"],
      authorName: "Slafurry Studios",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-01-30"),
    },
    {
      slug: "news-1",
      title: "Pandora's Snake is officially out",
      coverImage: "/placeholder/news-1.png",
      coverImageAlt: "Launch day. Somehow nothing caught on fire.",
      excerpt: "After way too long in development, Pandora's Snake is live. Thanks to everyone who wishlisted, playtested, and put up with our devlogs about collision physics.",
      content: `<p>After way too long in development, Pandora's Snake is live.</p>
<p>Thanks to everyone who wishlisted, playtested, and put up with roughly forty devlogs about collision physics. We mean that. This game exists because people kept showing up for it.</p>
<p>Grab it on Steam or itch.io. If you find a bug, tell us — if you find the bug where the snake eats itself, we already know, we just think it's funny now.</p>`,
      category: PostCategory.NEWS,
      tags: ["announcement"],
      authorName: "Slafurry Studios",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-03-02"),
    },
    {
      slug: "news-2",
      title: "We're going to a small local game expo next month",
      coverImage: "/placeholder/news-2.png",
      coverImageAlt: "Last year's booth. This year we're getting a bigger table.",
      excerpt: "Come say hi if you're around. We'll have a playable demo, some stickers, and probably a lot of opinions about game jams.",
      content: `<p>Come say hi if you're around. We'll have a playable demo, some stickers, and probably a lot of opinions about game jams.</p>
<p>This is our first time exhibiting outside of a jam, so if the booth looks slightly held together with tape, that's because it is.</p>`,
      category: PostCategory.NEWS,
      tags: ["announcement"],
      authorName: "Slafurry Studios",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-02-10"),
    },
    {
      slug: "news-3",
      title: "A quick note on the achievement system on this site",
      coverImage: "/placeholder/news-3.png",
      coverImageAlt: "A very accurate diagram of how the achievement system works.",
      excerpt: "Yes, some of them are hidden. Yes, one of them is unfair on purpose. No, we're not telling you which one.",
      content: `<p>Yes, some of them are hidden. Yes, one of them is unfair on purpose. No, we're not telling you which one.</p>
<p>A few of the achievements on this site don't have normal unlock conditions. We're not going to explain how, because that would defeat the point. Good luck.</p>`,
      category: PostCategory.NEWS,
      tags: ["feature"],
      authorName: "Slafurry Studios",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-01-05"),
    },
    {
      slug: "welcome-to-slafurry-studios",
      title: "Welcome to the new Slafurry Studios website",
      coverImage: "/placeholder/welcome-post.png",
      coverImageAlt: "Welcome banner",
      excerpt: "We rebuilt the whole site from scratch. Here's what's new, and what's still held together with tape.",
      content: `<p>We rebuilt the whole site from scratch. Here's what's new, and what's still held together with tape.</p>`,
      category: PostCategory.NEWS,
      tags: ["announcement"],
      authorName: "Slafurry Studios",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-03-15"),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  // --- Montage Videos ---
  const montageVideos = [
    { label: "Directive", videoUrl: "https://mcaqgxrqzwsjyrwgrnmq.supabase.co/storage/v1/object/public/montage-videos/Directive.mp4", order: 0 },
    { label: "Omni Gear Protocol", videoUrl: "https://mcaqgxrqzwsjyrwgrnmq.supabase.co/storage/v1/object/public/montage-videos/OmniGearProtocol.mp4", order: 1 },
    { label: "Pandora's Snake", videoUrl: "https://mcaqgxrqzwsjyrwgrnmq.supabase.co/storage/v1/object/public/montage-videos/PandorasSnake.mp4", order: 2 },
    { label: "Solar Siege", videoUrl: "https://mcaqgxrqzwsjyrwgrnmq.supabase.co/storage/v1/object/public/montage-videos/SolarSiege.mp4", order: 3 },
    { label: "The Puppet Pioneer", videoUrl: "https://mcaqgxrqzwsjyrwgrnmq.supabase.co/storage/v1/object/public/montage-videos/ThePuppetPioneer.mp4", order: 4 },
  ];

  for (const v of montageVideos) {
    const existing = await prisma.montageVideo.findFirst({ where: { label: v.label } });
    if (!existing) {
      await prisma.montageVideo.create({ data: v });
    }
  }

  // --- Social Links ---
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

  // --- Press Releases ---
  const pressReleases = [
    { outlet: "IGN", title: "Pandora's Snake is a cosmic horror comedy about a cursed snake", url: "https://ign.com", publishedAt: new Date("2026-03-02") },
    { outlet: "IGN", title: "5 indie games to watch this quarter", url: "https://ign.com", publishedAt: new Date("2026-02-14") },
    { outlet: "Gamejolt", title: "Slafurry Studios announces An Unfinished Game", url: "https://gamejolt.com", publishedAt: new Date("2026-01-20") },
    { outlet: "Gamejolt", title: "Interview: the team behind Pandora's Snake", url: "https://gamejolt.com", publishedAt: new Date("2025-12-05") },
  ];

  for (const release of pressReleases) {
    const existing = await prisma.pressRelease.findFirst({ where: { title: release.title } });
    if (!existing) {
      await prisma.pressRelease.create({ data: release });
    }
  }

  // --- Press Kit Assets ---
  const pressKitAssets = [
    { label: "Slafurry Studios", type: "LOGO" as const, fileUrl: "/press/slafurry-logo.png" },
    { label: "Slafurry Studios", type: "BANNER" as const, fileUrl: "/press/slafurry-banner.png" },
    { label: "An Unfinished Game", type: "LOGO" as const, fileUrl: "/press/unfinished-game-logo.png" },
    { label: "An Unfinished Game", type: "BANNER" as const, fileUrl: "/press/unfinished-game-banner.png" },
    { label: "An Unfinished Game", type: "CHARACTER" as const, fileUrl: "/press/unfinished-game-character.png" },
    { label: "Pandora's Snake", type: "LOGO" as const, fileUrl: "/press/pandoras-snake-logo.png" },
    { label: "Pandora's Snake", type: "BANNER" as const, fileUrl: "/press/pandoras-snake-banner.png" },
    { label: "Pandora's Snake", type: "CHARACTER" as const, fileUrl: "/press/pandoras-snake-character.png" },
  ];

  for (const asset of pressKitAssets) {
    const existing = await prisma.pressKitAsset.findFirst({ where: { label: asset.label, type: asset.type } });
    if (!existing) {
      await prisma.pressKitAsset.create({ data: asset });
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
