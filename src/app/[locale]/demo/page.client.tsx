"use client";

import { useSearchParams } from "next/navigation";
import { GuidedDemoTour } from "@/components/demo/GuidedDemoTour";
import { isTourPersona } from "@/lib/demo/tour";

export default function DemoPageClient() {
  const params = useSearchParams();
  const start = params.get("start") === "1" || params.get("tour") === "1";
  const go = params.get("go");

  return (
    <GuidedDemoTour
      autoStart={start}
      quickLaunch={go && isTourPersona(go) ? go : undefined}
    />
  );
}
