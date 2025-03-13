import clsx from "clsx";
import React from "react";

import { createMessageDescriptor, ucFirst, useIntl } from "../../lib";
import { Outline } from "../icon";
import { P, PProps } from "../typography";
import "./bool.scss";
import { TRANSLATIONS } from "./translations";

export type BoolProps = {
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
  labelTrue = "",
  labelFalse = "",
  pProps,
  ...props
}) => {
  const intl = useIntl();

  const _labelTrue = intl.formatMessage(
    createMessageDescriptor(labelTrue, TRANSLATIONS.LABEL_TRUE),
  );
  const _labelFalse = intl.formatMessage(
    createMessageDescriptor(labelFalse, TRANSLATIONS.LABEL_FALSE),
  );

  if (!decorate) {
    const label = ucFirst(value ? _labelTrue : _labelFalse);
    return (
      <P aria-label={label} {...pProps}>
        {explicit || value ? label : ""}
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
      {value && <Outline.CheckIcon />}
      {!value && <Outline.XMarkIcon />}
    </span>
  );
};
