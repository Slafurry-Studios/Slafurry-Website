import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const TEST_STRING = "Create Testing 19/09/2026";

  // 1. Game
  await prisma.game.upsert({
    where: { slug: "create-testing-game" },
    update: {},
    create: {
      slug: "create-testing-game",
      title: TEST_STRING,
      coverImage: "/mascot-default.png",
      coverImageAlt: "Testing Alt",
      shortDesc: TEST_STRING,
      longDesc: TEST_STRING,
      status: "IN_DEVELOPMENT",
    },
  });

  // 2. Post (Devlog)
  await prisma.post.upsert({
    where: { slug: "create-testing-devlog" },
    update: {},
    create: {
      slug: "create-testing-devlog",
      title: `${TEST_STRING} (Devlog)`,
      coverImage: "/mascot-default.png",
      coverImageAlt: "Testing Alt",
      excerpt: TEST_STRING,
      content: `<p>${TEST_STRING}</p>`,
      category: "DEVLOG",
      status: "PUBLISHED",
    },
  });

  // 3. Post (News)
  await prisma.post.upsert({
    where: { slug: "create-testing-news" },
    update: {},
    create: {
      slug: "create-testing-news",
      title: `${TEST_STRING} (News)`,
      coverImage: "/mascot-default.png",
      coverImageAlt: "Testing Alt",
      excerpt: TEST_STRING,
      content: `<p>${TEST_STRING}</p>`,
      category: "NEWS",
      status: "PUBLISHED",
    },
  });

  // 4. Achievement
  await prisma.achievement.upsert({
    where: { key: "CREATE_TESTING" },
    update: {},
    create: {
      key: "CREATE_TESTING",
      title: TEST_STRING,
      description: TEST_STRING,
      triggerType: "EVENT",
      triggerConfig: {},
    },
  });

  // 5. MontageVideo
  await prisma.montageVideo.create({
    data: {
      label: TEST_STRING,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  });

  // 6. PressRelease
  await prisma.pressRelease.create({
    data: {
      title: TEST_STRING,
      outlet: "Test Outlet",
      url: "https://example.com",
    },
  });

  // 7. PressKitAsset
  await prisma.pressKitAsset.create({
    data: {
      label: TEST_STRING,
      type: "LOGO",
      fileUrl: "https://example.com/logo.png",
    },
  });

  // 8. ContactMessage
  await prisma.contactMessage.create({
    data: {
      name: "Tester",
      email: "test@example.com",
      message: TEST_STRING,
    },
  });

  // 9. Comment (for Game)
  await prisma.comment.create({
    data: {
      authorName: "Test Commenter",
      authorEmail: "comment@example.com",
      content: TEST_STRING,
      status: "APPROVED",
      targetType: "GAME",
      game: { connect: { slug: "create-testing-game" } },
    },
  });

  // 10. Comment (for Post)
  await prisma.comment.create({
    data: {
      authorName: "Test Commenter",
      authorEmail: "comment@example.com",
      content: TEST_STRING,
      status: "PENDING",
      targetType: "POST",
      post: { connect: { slug: "create-testing-devlog" } },
    },
  });

  console.log("✅ Seed test data successfully created!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
