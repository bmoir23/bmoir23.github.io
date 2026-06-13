import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ShinyButtonBaseProps = {
  children: ReactNode;
  className?: string;
};

type ShinyButtonAsLink = ShinyButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ShinyButtonAsButton = ShinyButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ShinyButtonProps = ShinyButtonAsLink | ShinyButtonAsButton;

export function ShinyButton({
  children,
  className = "",
  ...props
}: ShinyButtonProps) {
  const classes = ["shiny-cta", className].filter(Boolean).join(" ");

  if ("href" in props && props.href) {
    const { href, ...anchorProps } = props;
    return (
      <a href={href} className={classes} {...anchorProps}>
        <span>{children}</span>
      </a>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      <span>{children}</span>
    </button>
  );
}

export default ShinyButton;
