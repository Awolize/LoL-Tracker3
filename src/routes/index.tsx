import { createFileRoute } from "@tanstack/react-router";
import { MainText } from "@/components/header/MainText";
import { SubText } from "@/components/header/SubText";
import Search from "@/components/header/Search";

export const Route = createFileRoute("/")({ component: Home });

export function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[url('/background-1.webp')] bg-center bg-cover">
      <div className="flex w-full animate-pulse2 flex-col items-center justify-center gap-4 bg-black py-16">
        <div>
          <MainText />
          <SubText />
        </div>

        <Search />
      </div>
    </main>
  );
}
