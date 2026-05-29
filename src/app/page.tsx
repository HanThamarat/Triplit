"use client";

import { useRouter } from "next/navigation";
import LandingView from "./components/LandingView";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen transition-all duration-300">
      <LandingView onLaunchApp={() => router.push("/dashboard")} />
    </div>
  );
}
