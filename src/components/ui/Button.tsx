import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "light";
type Size = "md" | "lg" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,color,box-shadow,transform] duration-200 ease-out select-none disabled:cursor-not-allowed disabled:opacity-60 motion-safe:active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white shadow-[0_1px_0_rgba(255,255,255,0.08)_inset] hover:bg-primary-hover",
  secondary:
    "border border-line bg-card text-heading hover:border-accent-light hover:bg-surface",
  ghost: "text-heading hover:bg-surface",
  light: "bg-bg text-heading hover:bg-white",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-12 px-6 text-base",
};

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export type ButtonLikeProps = (AnchorProps | ButtonProps) & {
  variant?: Variant;
  size?: Size;
};

export function Button(props: ButtonLikeProps) {
  const { variant = "primary", size = "md", className, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchor } = rest as AnchorProps;
    return <a href={href} className={classes} {...anchor} />;
  }
  const button = rest as ButtonProps;
  return <button type="button" className={classes} {...button} />;
}
