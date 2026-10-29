import Image from "next/image";

// Cyber Defend Academy emblem. Decorative (alt="") by default, since it is
// normally shown next to the academy name.
export function Logo({ size = 32, alt = "", className = "" }: { size?: number; alt?: string; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt={alt}
      width={size}
      height={size}
      loading="eager"
      className={`shrink-0 drop-shadow-[0_0_6px_rgba(37,99,235,0.45)] ${className}`}
    />
  );
}
