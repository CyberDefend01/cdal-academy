import type { Metadata } from "next";
import { Terminal } from "lucide-react";
import { requireStudent } from "@/lib/auth";
import { ComingSoon } from "../ui";

export const metadata: Metadata = { title: "Practical Labs" };

export default async function LabsPage() {
  await requireStudent();
  return (
    <ComingSoon
      icon={Terminal}
      title="Practical Labs / Cyber Range"
      description="Hands-on, isolated environments for practising attack and defence."
      items={["Guided labs for each course module", "Capture-the-flag challenges", "Lab completion tracking"]}
    />
  );
}
