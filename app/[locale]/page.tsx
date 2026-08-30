import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { ProjectCarousel } from "@/components/home/ProjectCarousel";
import { CommunityContact } from "@/components/home/CommunityContact";
import { NewsPreview } from "@/components/home/NewsPreview";
import {
  getFeaturedGame,
  getCarouselGames,
  getCommunityLinks,
  getLatestNewsPosts,
  getSiteSettings,
} from "@/lib/queries/home";

export default async function Home() {
  // Semua query jalan paralel (bukan await berurutan) — page load-nya
  // secepat query yang paling lambat, bukan total semuanya dijumlah.
  const [featuredGame, carouselGames, communityLinks, newsPosts, settings] =
    await Promise.all([
      getFeaturedGame(),
      getCarouselGames(),
      getCommunityLinks(),
      getLatestNewsPosts(),
      getSiteSettings(),
    ]);

  return (
    <>
      <Hero upcomingGame={featuredGame} settings={settings} />
      <AboutSection settings={settings} />
      <ProjectCarousel projects={carouselGames} />
      <CommunityContact communityLinks={communityLinks} />
      <NewsPreview posts={newsPosts} />
    </>
  );
}
