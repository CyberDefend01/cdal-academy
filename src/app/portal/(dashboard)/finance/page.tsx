import type { Metadata } from "next";
import { Wallet } from "lucide-react";
import { requireStudent } from "@/lib/auth";
import { ComingSoon } from "../ui";

export const metadata: Metadata = { title: "Finance & Funding" };

export default async function FinancePage() {
  await requireStudent();
  return (
    <ComingSoon
      icon={Wallet}
      title="Finance & Funding"
      description="Tuition, payments, scholarships and sponsorships."
      items={["Fee statements and payment history", "Payment receipts", "Scholarship and sponsorship status"]}
    />
  );
}
