import type { Metadata } from "next";
import { Users } from "lucide-react";
import { requireStudent } from "@/lib/auth";
import { ComingSoon } from "../ui";

export const metadata: Metadata = { title: "Community" };

export default async function CommunityPage() {
  await requireStudent();
  return (
    <ComingSoon
      icon={Users}
      title="Community"
      description="Connect with your cohort, mentors and alumni."
      items={["Cohort announcements", "Mentorship sessions", "Alumni and career opportunities"]}
    />
  );
}
