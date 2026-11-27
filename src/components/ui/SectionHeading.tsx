import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  accentWord?: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  accentWord,
  description,
  align = "left",
  theme = "light",
  className,
}: SectionHeadingProps) {
  const isDark = theme === "dark";
  const parts =
    accentWord && title.includes(accentWord)
      ? title.split(accentWord)
      : [title, ""];

  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <div
        className={cn(
          "mb-3.5 inline-flex items-center gap-2.5 font-mono text-[11px] font-semibold tracking-[0.18em] uppercase",
          isDark ? "text-[#39C9E9]" : "text-[#079BD3]"
        )}
      >
        <span
          className={cn(
            "h-[2px] w-5",
            isDark ? "bg-[#39C9E9]" : "bg-[#079BD3]"
          )}
          aria-hidden="true"
        />
        <span>{eyebrow}</span>
      </div>

      <h2
        className={cn(
          "font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-[2.85rem] lg:leading-[1.08]",
          isDark ? "text-[#F1F5F9]" : "text-[#111827]"
        )}
      >
        {accentWord && parts.length === 2 ? (
          <>
            {parts[0]}
            <span className={isDark ? "text-[#39C9E9]" : "text-[#079BD3]"}>
              {accentWord}
            </span>
            {parts[1]}
          </>
        ) : (
          title
        )}
      </h2>

      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-[17px]",
            isDark ? "text-slate-300" : "text-slate-600"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
