import { Temporal } from "@js-temporal/polyfill";
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
  useIntl,
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

  /** An error message to show. */
  error?: string;

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
    error,
    formControlProps,
    pProps,
    decorate = false,
    editing,
    field,
    editable = field?.editable,
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

  const [editingState, setEditingState] = useState<boolean>(
    Boolean(editable && editing),
  );
  useEffect(() => {
    setEditingState(Boolean(editable && editing));
  }, [editable, editing]);

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
      setEditingState(Boolean(editable && true));
      onEdit?.(e);
      onClick?.(e);
    },
    [editable, editingState, onEdit],
  );

  const handleBlur = useCallback<FocusEventHandler>(
    (e) => {
      if (typeof editing === "undefined") setEditingState(false);
      onBlur?.(e);
    },
    [editing, onBlur],
  );

  const intl = useIntl();

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
    // @ts-expect-error - Fields is set here.
    const type = getFormFieldTypeByFieldType(field.type);
    return (
      <FormControl
        autoFocus={typeof editing === "undefined"}
        aria-label={_labelEdit}
        error={error}
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

  /**
   * Checks if a value is a valid ISO 8601 duration string.
   * @param value
   */
  function isIsoDuration(value: unknown): boolean {
    if (typeof value !== "string") return false;
    try {
      Temporal.Duration.from(value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Renders a duration using Temporal.Duration if the value is a valid ISO 8601 duration string, whilst decorate is true.
   */
  if (decorate && (field?.type === "duration" || isIsoDuration(valueState))) {
    const duration = Temporal.Duration.from(valueState);

    return (
      <P {...(props as ComponentProps<"p">)} {...pProps}>
        {duration.toLocaleString(intl.locale, {
          style: "narrow",
        })}
      </P>
    );
  }

  /**
   * Renders primitive string or number values as text or links.
   *
   * Conditions:
   * - If the value is a string, or a number without `decorate` mode, or the field type is "string" / "number".
   * - Converts the value to a string and renders it as:
   *
   * Notes:
   * - Returns "-" if the string is empty.
   * - When nested, only returns the plain string instead of wrapping it in a paragraph.
   */
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

  /**
   * Renders boolean values using a `<Bool>` component.
   *
   * Conditions:
   * - If the value is a boolean or the field type is explicitly "boolean".
   * - Supports decoration via the `decorate` flag.
   */
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

  /**
   * Renders numeric values as a stylized badge.
   *
   * Conditions:
   * - If the value is a number or the field type is explicitly "number".
   * - Always wraps the value in a `<Badge>` component for visual emphasis.
   *
   * Notes:
   * - This block only runs when `decorate` is true, since undecorated numbers
   *   are handled by the earlier string/number condition.
   */
  if (isNumber(valueState) || field?.type === "number") {
    return (
      <Badge {...badgeProps} {...props}>
        {valueState as number}
      </Badge>
    );
  }

  console.warn("Refusing to render complex value:", valueState);
};
