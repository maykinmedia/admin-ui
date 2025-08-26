import { ucFirst } from "@maykin-ui/client-common";
import clsx from "clsx";
import React from "react";

import { gettextFirst } from "../../lib";
import { Outline } from "../icon";
import { P, PProps } from "../typography";
import "./bool.scss";
import { TRANSLATIONS } from "./translations";

export type BoolProps = React.ComponentProps<"span"> & {
  /** The value. */
  value: boolean;

  /** Whether to use a "decorative" component instead of `<P>` if applicable. */
  decorate?: boolean;

  /** Show an icon, even if value is false. */
  explicit?: boolean;

  /** The accessible label when value is truthy. */
  labelTrue?: string;

  /** The accessible label when value is falsy. */
  labelFalse?: string;

  pProps?: PProps;

  /** Whether to omit HTML and give raw output. */
  raw?: boolean;
};

/**
 * Bool component,
 *
 * If `decorate` is `true: shows a checkmark if `value` is `true`. If `value` is `false` the icon is hidden, unless
 *  `explicit` is `true`.
 *
 * If `decorate` is `false: shows a human-readable representation of `value`.
 */
export const Bool: React.FC<BoolProps> = ({
  decorate = true,
  explicit = false,
  value,
  labelTrue,
  labelFalse,
  pProps,
  raw,
  ...props
}) => {
  const _labelTrue = gettextFirst(labelTrue, TRANSLATIONS.LABEL_TRUE);
  const _labelFalse = gettextFirst(labelFalse, TRANSLATIONS.LABEL_FALSE);
  const label = ucFirst(value ? _labelTrue : _labelFalse);
  const rawValue = explicit || value ? label : "";

  if (raw) return rawValue;

  if (!decorate) {
    return (
      <P aria-label={label} {...pProps}>
        {rawValue}
      </P>
    );
  }

  return (
    <span
      className={clsx("mykn-bool", `mykn-bool--value-${value}`, {
        "mykn-bool--explicit": explicit,
      })}
      {...props}
      title={ucFirst(value ? _labelTrue : _labelFalse)}
      aria-label={ucFirst(value ? _labelTrue : _labelFalse)}
    >
      {value && <Outline.CheckCircleIcon />}
      {!value && <Outline.XCircleIcon />}
    </span>
  );
};
