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

export type ValueProps = {
  value: Attribute;
  aProps?: AProps;
  boolProps?: Omit<BoolProps, "value">;
  badgeProps?: BadgeProps;
  pProps?: PProps;
};

/**
 * Generic wrapper rendering the appropriate component for `value` based on its
 * type.
 * @param aProps
 * @param badgeProps
 * @param boolProps
 * @param pProps
 * @param value
 * @constructor
 */
export const Value: React.FC<ValueProps> = ({
  aProps,
  badgeProps,
  boolProps,
  pProps,
  value,
}) => {
  if (isBool(value)) {
    // BoolProps must be provided if value can be bool.
    return <Bool {...boolProps} value={value} />;
  }

  if (isNumber(value)) {
    return <Badge {...badgeProps}>{value}</Badge>;
  }

  if (isNull(value) || isUndefined(value)) {
    return <P {...pProps}>-</P>;
  }

  if (isString(value)) {
    const string = String(value);

    if (isLink(string)) {
      return (
        <P {...pProps}>
          <A {...aProps} href={string}>
            {string}
          </A>
        </P>
      );
    }

    return <P>{string || "-"}</P>;
  }
};
