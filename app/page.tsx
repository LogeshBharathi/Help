import { EligibilityEntryCard } from "@/components/home/EligibilityEntryCard";
import { ExamCategoryGrid } from "@/components/home/ExamCategoryGrid";
import { HeroSection } from "@/components/home/HeroSection";
import { PlatformBrief } from "@/components/home/PlatformBrief";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <HeroSection />
      <EligibilityEntryCard />
      <PlatformBrief />
      <ExamCategoryGrid />
    </div>
  );
}
