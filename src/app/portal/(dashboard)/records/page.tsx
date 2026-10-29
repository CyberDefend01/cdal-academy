import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { requireStudent } from "@/lib/auth";
import { ComingSoon } from "../ui";

export const metadata: Metadata = { title: "Academic Records" };

export default async function RecordsPage() {
  await requireStudent();
  return (
    <ComingSoon
      icon={FileText}
      title="Academic Records"
      description="Your grades, assessments and certificates."
      items={["Assessment and exam results", "Attendance records", "Downloadable certificates"]}
    />
  );
}
