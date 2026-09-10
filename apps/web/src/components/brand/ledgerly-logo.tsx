import { cn } from "@/lib/utils";

/** Ledgerly brand mark — ledger spine + descending spend bars + savings check. */
export function LedgerlyMark({
  className,
  title = "Ledgerly",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role="img"
      aria-label={title}
    >
      <rect width="32" height="32" rx="9" fill="#16a34a" />
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="8"
        stroke="white"
        strokeOpacity="0.14"
      />
      {/* Ledger spine */}
      <path
        d="M8 7.5v17"
        stroke="white"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      {/* Ledger ruled lines */}
      <path
        d="M11 10.5h5.5M11 14h4M11 17.5h5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />
      {/* Descending spend bars */}
      <rect x="18" y="10" width="3.4" height="12.5" rx="1" fill="white" />
      <rect
        x="22.2"
        y="13.5"
        width="3.4"
        height="9"
        rx="1"
        fill="white"
        fillOpacity="0.85"
      />
      <rect
        x="26.4"
        y="17"
        width="3.4"
        height="5.5"
        rx="1"
        fill="white"
        fillOpacity="0.7"
      />
      {/* Savings check */}
      <path
        d="M18.5 22.8l1.7 1.7 3.5-3.6"
        stroke="#bbf7d0"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Full brand lockup (mark + wordmark). */
export function LedgerlyLogo({
  className,
  markClassName,
  wordmarkClassName,
  showWordmark = true,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LedgerlyMark className={cn("size-7", markClassName)} />
      {showWordmark && (
        <span
          className={cn(
            "font-semibold text-[15px] tracking-tight text-gray-900",
            wordmarkClassName
          )}
        >
          Ledgerly
        </span>
      )}
    </span>
  );
}
