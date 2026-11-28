import { cn } from "@/lib/utils";
import { InkUnderline } from "@/components/animations/Reveal";

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
          "mb-3 inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.14em] uppercase",
          isDark ? "text-[#36B9D8]" : "text-[#078FCB]"
        )}
      >
        <span
          className={cn(
            "h-0.5 w-5",
            isDark ? "bg-[#F7941D]" : "bg-[#F7941D]"
          )}
          aria-hidden="true"
        />
        <span>{eyebrow}</span>
      </div>

      <h2
        className={cn(
          "font-display text-3xl font-extrabold tracking-[-0.025em] sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]",
          isDark ? "text-white" : "text-[#153B60]"
        )}
      >
        {accentWord && parts.length === 2 ? (
          <>
            {parts[0]}
            <span
              className={cn(
                "relative inline-block",
                isDark ? "text-[#36B9D8]" : "text-[#078FCB]"
              )}
            >
              {accentWord}
              <InkUnderline />
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
            "mt-4 text-base leading-relaxed",
            isDark ? "text-slate-200" : "text-[#202B36]/85"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
