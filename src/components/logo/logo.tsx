import clsx from "clsx";
import React from "react";

import { createMessageDescriptor, useIntl } from "../../lib";
import "./logo.scss";
import { TRANSLATIONS } from "./translations";

export type LogoProps = {
  /** Whether to show the logo with a single letter ("M") instead of the full brand name ("MAYKIN"). */
  abbreviated?: boolean;

  /** If set, provide a link. */
  href?: string;

  /** The aria-label to set on the SVG element. */
  label?: string;

  /** An aria-label describing the link action. */
  hrefLabel?: string;

  /** Logo variant. */
  variant?: "normal" | "contrast";

  /** Gets passed as props. */
  [index: string]: unknown;
};

/**
 * The Maykin logo.
 * @param children
 * @param props
 * @constructor
 */
export const Logo: React.FC<LogoProps> = ({
  abbreviated = false,
  label,
  href,
  hrefLabel,
  variant = "normal",
  ...props
}) => {
  const intl = useIntl();
  const Tag = href ? "a" : "span";
  const viewBoxWidth = abbreviated ? 47 : 122;
  const context = {
    href: href || "",
  };

  const _label = intl.formatMessage(
    createMessageDescriptor(label, TRANSLATIONS.LABEL),
    context,
  );

  const _hrefLabel = intl.formatMessage(
    createMessageDescriptor(hrefLabel, TRANSLATIONS.LABEL_HREF),
    context,
  );

  return (
    <Tag
      className={clsx("mykn-logo", {
        [`mykn-logo--variant-${variant}`]: variant,
        "mykn-logo--abbreviated": abbreviated,
      })}
      href={href}
      aria-label={href && _hrefLabel}
      {...props}
    >
      <svg
        className="mykn-logo__image"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewBoxWidth} 26.41`}
        aria-label={_label}
      >
        <path
          className="mykn-logo__handle mykn-logo__handle--left"
          fill="#00bfcb"
          d="M6.32,26.41a4.27,4.27,0,0,1-2.26-.53,3.82,3.82,0,0,1-1.33-1.35,4.91,4.91,0,0,1-.63-1.78,12.47,12.47,0,0,1-.16-1.89V17.8a6.7,6.7,0,0,0-.1-1.2,3.56,3.56,0,0,0-.3-1A1.87,1.87,0,0,0,1,14.92a1.15,1.15,0,0,0-.74-.26H0V11.8H.29A1.14,1.14,0,0,0,1,11.55a1.91,1.91,0,0,0,.51-.69,3.56,3.56,0,0,0,.3-1,6.62,6.62,0,0,0,.1-1.2V5.54A12.54,12.54,0,0,1,2.1,3.67a5,5,0,0,1,.63-1.8A3.79,3.79,0,0,1,4.06.53,4.27,4.27,0,0,1,6.32,0H7.8V2.51H6.57a1.74,1.74,0,0,0-1.05.3,2,2,0,0,0-.63.78,2.92,2.92,0,0,0-.3,1,9.39,9.39,0,0,0-.07,1.19V8.94a9.89,9.89,0,0,1-.28,2.38A3.58,3.58,0,0,1,3,13.23a3.71,3.71,0,0,1,1.27,1.95,9.62,9.62,0,0,1,.28,2.34v3.06a9.23,9.23,0,0,0,.07,1.18,3,3,0,0,0,.3,1.06,2.06,2.06,0,0,0,.63.77,1.68,1.68,0,0,0,1.05.3H7.8v2.52Z"
        />
        <g transform={abbreviated ? "translate(-75)" : undefined}>
          <path
            className="mykn-logo__handle mykn-logo__handle--right"
            fill="#00bfcb"
            d="M114,23.89h1.23a1.76,1.76,0,0,0,1.07-.3,1.89,1.89,0,0,0,.63-.77,3.44,3.44,0,0,0,.29-1.06,9.23,9.23,0,0,0,.07-1.18V17.52a10.16,10.16,0,0,1,.26-2.34,3.62,3.62,0,0,1,1.28-1.95,3.49,3.49,0,0,1-1.28-1.91,10.46,10.46,0,0,1-.26-2.38V5.83a9.39,9.39,0,0,0-.07-1.19,3.38,3.38,0,0,0-.29-1,1.85,1.85,0,0,0-.63-.78,1.83,1.83,0,0,0-1.07-.3H114V0h1.49a4.29,4.29,0,0,1,2.26.53,3.87,3.87,0,0,1,1.33,1.34,5.35,5.35,0,0,1,.63,1.8,12.47,12.47,0,0,1,.15,1.87V8.66a7.67,7.67,0,0,0,.1,1.2,4.37,4.37,0,0,0,.3,1,2.06,2.06,0,0,0,.52.69,1.12,1.12,0,0,0,.74.25h.29v2.86h-.29a1.13,1.13,0,0,0-.74.26,2,2,0,0,0-.52.68,4.37,4.37,0,0,0-.3,1,7.77,7.77,0,0,0-.1,1.2v3.06a12.43,12.43,0,0,1-.15,1.89,5.32,5.32,0,0,1-.63,1.78,3.9,3.9,0,0,1-1.33,1.35,4.29,4.29,0,0,1-2.26.53H114Z"
          />
        </g>
        <path
          className="mykn-logo__text mykn-logo__text--m"
          fill="var(--page-color-logo, #341a90)"
          d="M23.56,13.81l4.88-9.55h3.37V21.78h-3.4V10.92L24.6,18.64H22.44L18.68,11V21.78H15.31V4.26h3.32Z"
        />
        <path
          className="mykn-logo__text mykn-logo__text--a"
          fill="var(--page-color-logo, #341a90)"
          d="M34.45,21.78,40.54,4.26H44L50,21.78H46.26l-1.07-3.32H39.33l-1.07,3.32Zm5.82-6.32h4l-2-6.17Z"
        />
        <path
          className="mykn-logo__text mykn-logo__text--y"
          fill="var(--page-color-logo, #341a90)"
          d="M53.9,4.26,57,10.79l3.15-6.53h4.09L58.8,14.62v7.16H55.25V14.62L49.79,4.26Z"
        />
        <path
          className="mykn-logo__text mykn-logo__text--k"
          fill="var(--page-color-logo, #341a90)"
          d="M77.28,21.78l-4.47-7.39-2.08,2.75v4.64H67.18V4.26h3.55v7.57l5.54-7.57h4.21l-5.35,7.09,6.4,10.43Z"
        />
        <path
          className="mykn-logo__text mykn-logo__text--i"
          fill="var(--page-color-logo, #341a90)"
          d="M88.38,21.78H84.82V4.26h3.56Z"
        />
        <path
          className="mykn-logo__text mykn-logo__text--n"
          fill="var(--page-color-logo, #341a90)"
          d="M106.28,4.26V21.78h-3L96.48,10.94V21.78H93.1V4.26H96l6.86,11v-11Z"
        />
      </svg>
    </Tag>
  );
};
