import { HomeCta } from "@/components/home/home-cta";
import { HomeComponentWall } from "@/components/home/home-component-wall";
import { HomeHero } from "@/components/home/home-hero";
import { getAllComponents } from "@/lib/registry";

export default function Home() {
  const componentCount = getAllComponents().length;

  return (
    <div className="bg-background">
      <HomeHero componentCount={componentCount} />
      <HomeComponentWall />
      <HomeCta />
    </div>
  );
}
