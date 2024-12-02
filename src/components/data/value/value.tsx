import React from "react";

import {
  isBool,
  isLink,
  isNull,
  isNumber,
  isString,
  isUndefined,
} from "../../../lib";
import { Badge, BadgeProps } from "../../badge";
import { Bool, BoolProps } from "../../boolean";
import { A, AProps, P, PProps } from "../../typography";

export type ValueProps = React.HTMLAttributes<unknown> & {
  /** Value to render. */
  value: unknown;

  /** Whether to use a "decorative" component instead of `<P>` if applicable. */
  decorate?: boolean;

  /** Is set, renders an `<A>` with `href` set. */
  href?: string;

  aProps?: AProps;
  boolProps?: Omit<BoolProps, "value">;
  badgeProps?: BadgeProps;
  pProps?: PProps;
};

/**
 * Generic wrapper rendering the appropriate component for `value` based on its type.
 * Type can be:
 *
 *  - A primitive, rendered using appropriate subcomponent (see props).
 *  - A React.ReactNode: rendered directly.
 *  - Any other complex type is ignored.
 */
export const Value: React.FC<ValueProps> = ({
  aProps,
  badgeProps,
  boolProps,
  decorate = false,
  pProps,
  href = "",
  value,
  ...props
}) => {
  if (React.isValidElement(value)) {
    return value;
  }

  if (isNull(value) || isUndefined(value)) {
    return (
      <P {...pProps} {...props}>
        -
      </P>
    );
  }

  if (isString(value) || (isNumber(value) && !decorate)) {
    const string = String(value);

    if (href || isLink(string)) {
      return (
        <P {...pProps} {...props}>
          <A {...aProps} href={href || string}>
            {string || href}
          </A>
        </P>
      );
    }

    return (
      <P {...pProps} {...props}>
        {string || "-"}
      </P>
    );
  }

  if (isBool(value)) {
    return (
      <Bool
        pProps={pProps}
        {...boolProps}
        decorate={decorate}
        value={value}
        {...props}
      />
    );
  }

  if (isNumber(value)) {
    return (
      <Badge {...badgeProps} {...props}>
        {value}
      </Badge>
    );
  }

  console.warn("Refusing to render complex value:", value);
};
