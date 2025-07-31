import { isLink, serializeInputElement } from "@maykin-ui/client-common";
import React, {
  ChangeEventHandler,
  ComponentProps,
  FocusEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  TypedField,
  getFormFieldTypeByFieldType,
  gettextFirst,
  isBool,
  isNull,
  isNumber,
  isString,
  isUndefined,
} from "../../../lib";
import { Badge, BadgeProps } from "../../badge";
import { Bool, BoolProps } from "../../boolean";
import { Button, ButtonProps } from "../../button";
import { FormControl, FormControlProps } from "../../form";
import { A, AProps, P, PProps } from "../../typography";
import { TRANSLATIONS } from "./translations";

export type ValueProps<T extends object = object> = Omit<
  React.ComponentProps<"a" | "p" | "span">,
  "onBlur" | "onChange" | "onClick" | "value"
> & {
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

  onClick?: MouseEventHandler;

  /** @private indicates that the <Value /> is used internally. */
  nested?: boolean;
} & ValueEditableUnion<T>;

export type ValueEditableUnion<T extends object = object> = (
  | {
      /** Whether the value should be editable (requires field). */
      editable: true;

      /** The form field to show when editing. */
      field: TypedField<T>;
    }
  | {
      /** Whether the value should be editable (requires field). */
      editable?: false;

      /** The form field to show when editing. */
      field?: TypedField<T>;
    }
) & {
  formControlProps?: Partial<FormControlProps>;
  buttonProps?: Partial<ButtonProps>;

  /** Whether the value is currently being edited. */
  editing?: boolean;

  labelEdit?: string;

  /** Gets called when the input is blurred. */
  onBlur?: React.FocusEventHandler;
  /** Gets called when the value changes. */
  onChange?: React.ChangeEventHandler;

  /** Gets called when the edit button is clicked. */
  onEdit?: React.MouseEventHandler;
};

/**
 * Generic wrapper rendering the appropriate component for `value` based on its type.
 * Type can be:
 *
 *  - A primitive, rendered using appropriate subcomponent (see props).
 *  - A React.ReactNode: rendered directly.
 *  - Any other complex type is ignored.
 */
export const Value = <T extends object = object>(rawProps: ValueProps<T>) => {
  const {
    aProps,
    badgeProps,
    boolProps,
    buttonProps,
    formControlProps,
    pProps,
    decorate = false,
    editable,
    editing,
    field,
    href = "",
    labelEdit,
    nested = false,
    value: valueProp,
    onBlur, // Only supported when rendering `<A>`.
    onClick, // Only supported when rendering `<A>`.
    onChange,
    onEdit,
    ...props
  } = rawProps;
  const _labelEdit = gettextFirst(labelEdit, TRANSLATIONS.LABEL_EDIT, {
    ...field,
    label: field?.name || "",
  });

  const [editingState, setEditingState] = useState<boolean>();
  useEffect(() => {
    setEditingState(editable && editing);
  }, [editing]);

  const [valueState, setValueStateState] = useState<unknown>();
  useEffect(() => {
    setValueStateState(valueProp);
  }, [valueProp]);

  /**
   * Gets called when the value changes.
   */
  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const serializedValue = serializeInputElement(e.target, { typed: true });
      setValueStateState(serializedValue);
      onChange?.(e);
    },
    [valueProp, onChange],
  );

  /**
   * Gets called when the value representation is clicked.
   */
  const handleClick: MouseEventHandler = useCallback<MouseEventHandler>(
    (e) => {
      setEditingState(editable && true);
      onEdit?.(e);
      onClick?.(e);
    },
    [editable, editingState, onEdit],
  );

  const handleBlur = useCallback<FocusEventHandler>(
    (e) => {
      setEditingState(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  if (editable && !editingState) {
    return (
      <Button
        {...buttonProps}
        aria-label={_labelEdit}
        align="start"
        pad={false}
        variant="transparent"
        wrap={true}
        onClick={handleClick}
      >
        <Value
          {...rawProps}
          boolProps={{ explicit: true }}
          editable={false}
          nested={true}
          value={valueState}
        />
      </Button>
    );
  }

  // Returns <FormControl> when editing
  if (editable && editingState) {
    const type = getFormFieldTypeByFieldType(field.type);
    return (
      <FormControl
        autoFocus
        aria-label={_labelEdit}
        name={field!.name.toString()}
        // @ts-expect-error - Runtime check included
        options={field.options}
        pad="h"
        type={type}
        {...formControlProps}
        checked={field!.type === "boolean" ? Boolean(valueState) : undefined}
        value={(valueState || "").toString()}
        onChange={handleChange}
        onBlur={handleBlur}
        {...formControlProps}
      />
    );
  }

  if (React.isValidElement(valueState)) {
    return valueState;
  }

  if (isNull(valueState) || isUndefined(valueState) || field?.type === "null") {
    return nested ? (
      "-"
    ) : (
      <P {...pProps} {...(props as ComponentProps<"p">)}>
        -
      </P>
    );
  }

  if (
    isString(valueState) ||
    (isNumber(valueState) && !decorate) ||
    field?.type === "string" ||
    (field?.type === "number" && !decorate)
  ) {
    const string = String(valueState);

    if (!nested && (href || (isLink(string) && !editingState))) {
      return (
        <P {...pProps} {...(props as ComponentProps<"p">)}>
          <A
            {...aProps}
            href={href || string}
            onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
          >
            {string || href}
          </A>
        </P>
      );
    }

    return nested ? (
      string || "-"
    ) : (
      <P {...(props as ComponentProps<"p">)} {...pProps}>
        {string || "-"}
      </P>
    );
  }

  if (isBool(valueState) || field?.type === "boolean") {
    return (
      <Bool
        pProps={{ ...pProps }}
        {...boolProps}
        decorate={decorate}
        raw={nested && !decorate}
        value={valueState as boolean}
        {...props}
      />
    );
  }

  if (isNumber(valueState) || field?.type === "number") {
    return (
      <Badge {...badgeProps} {...props}>
        {valueState as number}
      </Badge>
    );
  }

  console.warn("Refusing to render complex value:", valueState);
};
