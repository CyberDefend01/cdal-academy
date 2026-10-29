"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, CircleAlert, Copy, KeyRound, X } from "lucide-react";
import { acceptApplication, rejectApplication, type AcceptResult } from "../actions";

type Credentials = Extract<AcceptResult, { ok: true }>;

export function ReviewActions({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmReject, setConfirmReject] = useState(false);
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  function accept() {
    setError(null);
    startTransition(async () => {
      const result = await acceptApplication(applicationId);
      if (result.ok) setCredentials(result);
      else setError(result.error);
    });
  }

  function reject() {
    setError(null);
    startTransition(async () => {
      const result = await rejectApplication(applicationId);
      if (result.ok) router.refresh();
      else setError(result.error);
    });
  }

  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-navy-900 p-6">
      <h2 className="font-semibold text-white">Admission decision</h2>
      {error && (
        <p role="alert" className="mt-3 flex items-center gap-2 text-sm text-rose-300">
          <CircleAlert className="h-4 w-4" aria-hidden /> {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={accept}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-emerald-400 disabled:opacity-60"
        >
          <Check className="h-4 w-4" aria-hidden /> Accept / Offer admission
        </button>

        {confirmReject ? (
          <span className="flex items-center gap-2 text-sm text-slate-300">
            Reject this applicant?
            <button
              onClick={reject}
              disabled={pending}
              className="rounded-lg bg-rose-500 px-3 py-2 font-semibold text-white hover:bg-rose-400 disabled:opacity-60"
            >
              Yes, reject
            </button>
            <button onClick={() => setConfirmReject(false)} className="px-2 py-2 text-slate-400 hover:text-white">
              Cancel
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirmReject(true)}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-lg border border-rose-500/40 px-4 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/10 disabled:opacity-60"
          >
            <X className="h-4 w-4" aria-hidden /> Reject
          </button>
        )}
      </div>
      {pending && <p className="mt-3 text-sm text-slate-400">Working...</p>}

      {credentials && (
        <CredentialsModal
          credentials={credentials}
          onClose={() => {
            setCredentials(null);
            router.refresh();
          }}
        />
      )}
    </section>
  );
}

function CredentialsModal({ credentials, onClose }: { credentials: Credentials; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const loginUrl = `${window.location.origin}/login`;
  const message = credentials.temporaryPassword
    ? `Congratulations ${credentials.fullName}! You have been admitted to Cyber Defend Academy.\n\nLog in at: ${loginUrl}\nEmail: ${credentials.email}\nTemporary password: ${credentials.temporaryPassword}\n\nYou will be asked to set a new password when you first log in.`
    : `Congratulations ${credentials.fullName}! You have been admitted to Cyber Defend Academy.\n\nLog in at: ${loginUrl} with your existing account (${credentials.email}).`;

  async function copy() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="credentials-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-2xl">
        <KeyRound className="h-8 w-8 text-emerald-400" aria-hidden />
        <h2 id="credentials-title" className="mt-3 text-xl font-semibold text-white">
          Admission offered
        </h2>

        {credentials.temporaryPassword ? (
          <>
            <p className="mt-2 text-sm text-slate-400">
              Share these login details with the student securely. The password is shown{" "}
              <strong className="text-amber-300">only once</strong> and is not stored anywhere.
            </p>
            <dl className="mt-4 space-y-3 rounded-lg bg-navy-950 p-4 font-mono text-sm">
              <div>
                <dt className="text-xs text-slate-500">Login URL</dt>
                <dd className="text-slate-200">{loginUrl}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Email</dt>
                <dd className="text-slate-200">{credentials.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Temporary password</dt>
                <dd className="select-all text-lg text-emerald-300">{credentials.temporaryPassword}</dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-400">
            {credentials.email} already has an account, so no new password was created. They can
            log in with their existing password and will see the new course in their portal.
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5"
          >
            <Copy className="h-4 w-4" aria-hidden /> {copied ? "Copied" : "Copy message"}
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
