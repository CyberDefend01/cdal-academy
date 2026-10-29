"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Line = { cmd?: string; out?: string; tone?: "ok" | "warn" | "info" | "muted" };

// Illustrative only. 203.0.113.0/24 is reserved for documentation.
const LINES: Line[] = [
  { cmd: "wazuh-alerts --tail 1" },
  { out: "[ALERT] 5 failed SSH logins from 203.0.113.24 (rule 5710)", tone: "warn" },
  { cmd: "signalsoc triage --alert 4021" },
  { out: "[AI]   Likely brute-force attempt: 5 failures in 60s", tone: "info" },
  { out: "[NEXT] Check IP reputation, review auth.log for success", tone: "muted" },
  { out: "[OK]   Report ready for analyst review", tone: "ok" },
];

const toneClass = { ok: "text-emerald-400", warn: "text-amber-300", info: "text-brand-300", muted: "text-slate-400" };

export function TypingTerminal() {
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    // Finished: pause, then replay.
    if (line >= LINES.length) {
      const t = setTimeout(() => {
        setLine(0);
        setChars(0);
      }, 5000);
      return () => clearTimeout(t);
    }
    const current = LINES[line];
    // Commands are typed character by character; output appears at once.
    if (current.cmd && chars < current.cmd.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 45 + Math.random() * 50);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLine((l) => l + 1);
      setChars(0);
    }, current.cmd ? 400 : 650);
    return () => clearTimeout(t);
  }, [line, chars, reduced]);

  // Reduced motion: show the finished terminal straight away.
  const shownLine = reduced ? LINES.length : line;

  const prompt = <span className="text-glow">analyst@cda</span>;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-900/80 shadow-2xl shadow-brand-500/10 backdrop-blur">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-rose-400/70" />
        <span className="h-3 w-3 rounded-full bg-amber-400/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
        <span className="ml-3 font-mono text-xs text-slate-500">signalsoc - illustrative</span>
      </div>
      <pre className="min-h-[15rem] overflow-hidden p-5 font-mono text-[13px] leading-7 whitespace-pre-wrap text-slate-300">
        {LINES.slice(0, shownLine + 1).map((l, i) => {
          const done = i < shownLine;
          if (l.cmd) {
            return (
              <div key={i}>
                {prompt}:~$ {done ? l.cmd : l.cmd.slice(0, chars)}
                {!done && <span className="animate-blink">▋</span>}
              </div>
            );
          }
          return done || i === shownLine ? (
            <div key={i} className={toneClass[l.tone ?? "muted"]}>
              {l.out}
            </div>
          ) : null;
        })}
        {shownLine >= LINES.length && (
          <div>
            {prompt}:~$ <span className="animate-blink">▋</span>
          </div>
        )}
      </pre>
    </div>
  );
}
