// Form definitions for the four impact sections, shared by the client forms
// and the server-side validation in actions.ts.

export const METRIC_KINDS = ["testing", "revenue", "users", "jobs"] as const;
export type MetricKind = (typeof METRIC_KINDS)[number];

export const TEST_TYPES = ["Pilot training", "Product demo", "Lab platform", "Course content", "Other"] as const;
export const CURRENCIES = ["NGN", "USD", "GHS", "KES", "ZAR"] as const;
export const PAYMENT_STATUSES = ["pending", "confirmed", "refunded", "failed"] as const;
export const JOB_RECORD_TYPES = ["alumni_placement", "staff_contract", "partner_contract"] as const;

export const jobTypeLabel: Record<(typeof JOB_RECORD_TYPES)[number], string> = {
  alumni_placement: "Alumni placement",
  staff_contract: "Staff contract",
  partner_contract: "Partner contract",
};

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "date" | "url" | "textarea" | "select" | "checkbox";
  required?: boolean;
  options?: readonly string[];
  optionLabels?: Record<string, string>;
  step?: string;
};

export const FORM_FIELDS: Record<MetricKind, FieldDef[]> = {
  testing: [
    { name: "tester_name", label: "Tester / customer name", type: "text", required: true },
    { name: "organization", label: "Organization", type: "text" },
    { name: "test_type", label: "Test type", type: "select", options: TEST_TYPES, required: true },
    { name: "test_date", label: "Test date", type: "date", required: true },
    { name: "rating", label: "Rating (1-5)", type: "select", options: ["1", "2", "3", "4", "5"] },
    { name: "feedback", label: "Feedback", type: "textarea" },
    { name: "testimonial", label: "Testimonial quote", type: "textarea" },
    { name: "is_public_testimonial", label: "Show testimonial on the public website", type: "checkbox" },
  ],
  revenue: [
    { name: "customer_name", label: "Customer name", type: "text", required: true },
    { name: "customer_email", label: "Customer email", type: "email" },
    { name: "description", label: "Description", type: "text", required: true },
    { name: "amount", label: "Amount", type: "number", step: "0.01", required: true },
    { name: "currency", label: "Currency", type: "select", options: CURRENCIES, required: true },
    { name: "payment_status", label: "Payment status", type: "select", options: PAYMENT_STATUSES, required: true },
    { name: "payment_reference", label: "Payment reference", type: "text" },
    { name: "paid_at", label: "Payment date", type: "date" },
  ],
  users: [
    { name: "period_start", label: "Period start", type: "date", required: true },
    { name: "period_end", label: "Period end", type: "date", required: true },
    { name: "active_users", label: "Active users", type: "number", required: true },
    { name: "new_enrollments", label: "New enrollments", type: "number" },
    { name: "completion_rate", label: "Completion rate (%)", type: "number", step: "0.01" },
    { name: "report_url", label: "Analytics report / screenshot link (https)", type: "url" },
    { name: "notes", label: "Notes", type: "textarea" },
  ],
  jobs: [
    { name: "record_type", label: "Record type", type: "select", options: JOB_RECORD_TYPES, optionLabels: jobTypeLabel, required: true },
    { name: "person_name", label: "Person name", type: "text", required: true },
    { name: "organization", label: "Organization", type: "text", required: true },
    { name: "role_title", label: "Role / position", type: "text", required: true },
    { name: "start_date", label: "Start date", type: "date" },
    { name: "contract_url", label: "Contract / offer letter link (https)", type: "url" },
    { name: "notes", label: "Notes", type: "textarea" },
  ],
};
