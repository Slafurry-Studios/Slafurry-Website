import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { ProjectCarousel } from "@/components/home/ProjectCarousel";
import { CommunityContact } from "@/components/home/CommunityContact";
import { NewsPreview } from "@/components/home/NewsPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ProjectCarousel />
      <CommunityContact />
      <NewsPreview />
    </>
  );
}
