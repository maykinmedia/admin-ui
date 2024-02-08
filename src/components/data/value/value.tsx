import React from "react";

import {
  Attribute,
  isBool,
  isNull,
  isNumber,
} from "../../../lib/data/attributedata";
import { isLink } from "../../../lib/format/string";
import { Badge, BadgeProps } from "../../badge";
import { Bool, BoolProps } from "../../boolean";
import { A, AProps, P, PProps } from "../../typography";

export type ValueProps = {
  aProps?: AProps;
  badgeProps?: BadgeProps;
  pProps?: PProps;
} & BoolPropsRequiredIfValueBool;

type BoolPropsRequiredIfValueBool = BoolValueProps | NotBoolValueProps;

// `value` can possibly be `boolean`, mandatory `boolProps`.
type BoolValueProps = {
  value: Attribute;
  boolProps: Omit<BoolProps, "value">;
};

// `value` can not be `boolean`, optional `boolProps`.
type NotBoolValueProps = {
  value: Exclude<Attribute, boolean>;
  boolProps?: Omit<BoolProps, "value">;
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
    return <Bool {...(boolProps as BoolProps)} value={value} />;
  }

  if (isNumber(value)) {
    return <Badge {...badgeProps}>{value}</Badge>;
  }

  if (isNull(value)) {
    return "-";
  }

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

  return <P>{string}</P>;
};
