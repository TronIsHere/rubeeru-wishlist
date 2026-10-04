import Image from "next/image";
import { FOUNDER } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { XIcon } from "./x-icon";

export function FounderPhoto({ size, className }: { size: number; className?: string }) {
  return (
    <Image
      src={FOUNDER.photo}
      alt={`عکس ${FOUNDER.name}`}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover ring-2 ring-white/20", className)}
      style={{ width: size, height: size }}
    />
  );
}

/** «photo · name · @handle» chip linking to the X profile. */
export function FounderChip({ className }: { className?: string }) {
  return (
    <a
      href={FOUNDER.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex h-12 items-center gap-3 rounded-full border border-white/[0.1] bg-white/[0.06] ps-1.5 pe-4 text-sm backdrop-blur-md transition-colors duration-200 hover:bg-white/[0.12]",
        className,
      )}
    >
      <FounderPhoto size={36} />
      <span className="font-semibold text-white/90">{FOUNDER.name}</span>
      <span dir="ltr" className="font-latin text-white/55">
        @{FOUNDER.handle}
      </span>
      <XIcon className="size-3.5 text-white/60 transition-colors group-hover:text-white" />
    </a>
  );
}
