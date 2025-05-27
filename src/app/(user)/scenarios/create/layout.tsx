"use client";
import { FormProvider } from "@/scenarios/contexts/ScenarioFormContext";

export default function CreateScenarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormProvider>{children}</FormProvider>;
}
