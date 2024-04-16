import React from "react";

import {
  Attribute,
  isBool,
  isNull,
  isNumber,
  isString,
  isUndefined,
} from "../../../lib/data/attributedata";
import { isLink } from "../../../lib/format/string";
import { Badge, BadgeProps } from "../../badge";
import { Bool, BoolProps } from "../../boolean";
import { A, AProps, P, PProps } from "../../typography";

export type ValueProps = React.HTMLAttributes<unknown> & {
  value: Attribute;
  href?: string;
  aProps?: AProps;
  boolProps?: Omit<BoolProps, "value">;
  badgeProps?: BadgeProps;
  pProps?: PProps;
};

/**
 * Generic wrapper rendering the appropriate component for `value` based on its type.
 */
export const Value: React.FC<ValueProps> = ({
  aProps,
  badgeProps,
  boolProps,
  pProps,
  href = "",
  value,
  ...props
}) => {
  if (isString(value)) {
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
    // BoolProps must be provided if value can be bool.
    return <Bool {...boolProps} value={value} {...props} />;
  }

  if (isNumber(value)) {
    return (
      <Badge {...badgeProps} {...props}>
        {value}
      </Badge>
    );
  }

  if (isNull(value) || isUndefined(value)) {
    return (
      <P {...pProps} {...props}>
        -
      </P>
    );
  }
};
