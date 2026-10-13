import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

interface Props {
  eyebrow: string;
  /** Plain string, or a lead/emphasis pair where the emphasis is set in the editorial serif. */
  headline: string | { lead: string; emphasis: string };
  body?: string;
  align?: "left" | "center";
  tone?: "default" | "light";
  as?: "h2" | "h3";
  className?: string;
  size?: "lg" | "md";
}

export function SectionHeading({
  eyebrow,
  headline,
  body,
  align = "left",
  tone = "default",
  as: Tag = "h2",
  className,
  size = "lg",
}: Props) {
  const light = tone === "light";
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <Tag
        className={cn(
          "text-balance font-semibold tracking-[-0.02em]",
          size === "lg"
            ? "text-[2rem] leading-[1.1] sm:text-[2.5rem] lg:text-[3rem]"
            : "text-[1.75rem] leading-[1.15] sm:text-[2rem]",
          light ? "text-bg" : "text-heading",
        )}
      >
        {typeof headline === "string" ? (
          headline
        ) : (
          <>
            {headline.lead}{" "}
            <span className="serif-emphasis">{headline.emphasis}</span>
          </>
        )}
      </Tag>
      {body ? (
        <p
          className={cn(
            "max-w-2xl text-pretty text-[1.0625rem] leading-relaxed sm:text-lg",
            light ? "text-accent-light" : "text-body",
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}
