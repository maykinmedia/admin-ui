import clsx from "clsx";
import React, {
  ChangeEventHandler,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";

import { ConfigContext } from "../../../contexts";
import { Attribute, AttributeData } from "../../../lib/data/attributedata";
import { FormField } from "../../../lib/form/typeguards";
import { getValueFromFormData, serializeForm } from "../../../lib/form/utils";
import { getErrorFromErrors } from "../../../lib/form/validation";
import { forceArray } from "../../../lib/format/array";
import { ucFirst } from "../../../lib/format/string";
import { useIntl } from "../../../lib/i18n/useIntl";
import { Button } from "../../button";
import { Toolbar, ToolbarItem } from "../../toolbar";
import { ErrorMessage } from "../errormessage";
import { FormControl } from "../formcontrol";
import { InputProps } from "../input";
import { SelectProps } from "../select";
import "./form.scss";

export type FormProps = React.ComponentProps<"form"> & {
  /** If set, show `valuesState`. */
  debug?: boolean;

  /** The direction in which to render the form. */
  direction?: "vertical" | "horizontal";

  /** The initial form values, only applies on initial render. */
  initialValues?: AttributeData<Attribute | Attribute[]>;

  /** The form values, always applied. */
  values?: AttributeData<Attribute | Attribute[]>;

  /** Error messages, applied to automatically rendered field. */
  errors?: Record<keyof FormProps["fields"], string>;

  /** Error messages, not applicable to a specific field. */
  nonFieldErrors?: string | string[];

  /** An array of props for the applicable FormField, fields get rendered automatically. */
  fields?: Array<FormField>;

  /** An array of toolbar items to be shown next to the primary action. */
  secondaryActions?: ToolbarItem[];

  /** Whether to show the form actions. */
  showActions?: boolean;

  /** The submit form label. */
  labelSubmit?: string;

  /**
   * (Built-in serialization only), whether the convert results to type inferred from input type (e.g. checkbox value
   * will be boolean).
   */
  useTypedResults?: boolean;

  /** A validation function. */
  validate?: (
    values: AttributeData,
    fields: FormProps["fields"],
  ) => FormProps["errors"] | void;

  /** Whether to run validation on every change. */
  validateOnChange?: boolean;

  /** Gets passed to `fields` if they don't specify their own handler. */
  onChange?: InputProps["onChange"] | SelectProps["onChange"];

  /** Gets called when the form is submitted, setting this overrides default implementation. */
  onSubmit?: (event: FormEvent<HTMLFormElement>, data: AttributeData) => void;
};

/**
 * Generic form component, capable of auto rendering `fields` based on their shape.
 * @param children
 * @param debug
 * @param direction
 * @param errors
 * @param fields
 * @param initialValues
 * @param secondaryActions
 * @param labelSubmit
 * @param nonFieldErrors
 * @param onChange
 * @param onSubmit
 * @param showActions
 * @param useTypedResults
 * @param validate
 * @param validateOnChange
 * @param values
 * @param props
 * @constructor
 */
export const Form: React.FC<FormProps> = ({
  children,
  debug = false,
  direction = "vertical",
  errors,
  fields = [],
  initialValues = {},
  secondaryActions = [],
  labelSubmit = "",
  nonFieldErrors,
  onChange,
  onSubmit,
  showActions = true,
  useTypedResults = false,
  validate,
  validateOnChange = false,
  values,
  ...props
}) => {
  const { debug: contextDebug } = useContext(ConfigContext);
  const _debug = debug || contextDebug;
  const _nonFieldErrors = forceArray(nonFieldErrors);

  const [valuesState, setValuesState] = useState(initialValues);
  useEffect(() => values && setValuesState(values), [values]);
  const [errorsState, setErrorsState] = useState(errors || {});
  useEffect(() => errors && setErrorsState(errors), [errors]);

  const intl = useIntl();

  const _labelSubmit = labelSubmit
    ? labelSubmit
    : intl.formatMessage({
        id: "mykn.components.Form.labelSubmit",
        description: "mykn.components.Form: The submit form label",
        defaultMessage: "verzenden",
      });

  /**
   * Revalidate on state change.
   */
  useEffect(() => {
    if (validateOnChange && validate) {
      const errors = validate(valuesState as AttributeData, fields);
      setErrorsState(errors || {});
    }
  }, [valuesState]);

  /**
   * Defaults event handler for form submission.
   * @param event
   */
  const defaultOnChange: FormProps["onChange"] = (event: React.FormEvent) => {
    if (onChange) {
      onChange(event as FormEvent<HTMLFormElement>);
      return;
    }

    const form = (event.target as HTMLInputElement).form;

    if (form && !onChange) {
      const data = serializeForm(form, useTypedResults) as AttributeData;
      setValuesState(data);
    }
  };

  /**
   * Defaults event handler for form submission.
   * @param event
   */
  const defaultOnSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (validate) {
      const errors = validate(valuesState as AttributeData, fields);
      setErrorsState(errors || {});

      if (errors && Object.keys(errors).length) {
        return;
      }
    }

    const form = event.target as HTMLFormElement;
    const data = serializeForm(form, useTypedResults) as AttributeData;

    if (onSubmit) {
      onSubmit(event, data);
      return;
    }

    setValuesState(data);
  };

  return (
    <form
      className={clsx("mykn-form", `mykn-form--direction-${direction}`)}
      onSubmit={defaultOnSubmit}
      {...props}
    >
      {_nonFieldErrors?.length && (
        <div className="mykn-form__non-field-errors">
          {_nonFieldErrors?.map((error) => (
            <ErrorMessage key={error}>{error}</ErrorMessage>
          ))}
        </div>
      )}

      {Boolean(fields?.length) && (
        <div className="mykn-form__fieldset">
          {fields.map((field, index) => {
            const value =
              (field.value as string) ||
              getValueFromFormData(fields, valuesState, field);

            const error = getErrorFromErrors(fields, errorsState, field);
            const change = defaultOnChange;

            return (
              <FormControl
                key={field.id || index}
                direction={direction}
                error={error}
                value={value}
                onChange={change as ChangeEventHandler}
                {...field}
              ></FormControl>
            );
          })}
        </div>
      )}

      {children && <div className="mykn-form__fieldset">{children}</div>}

      {_debug && <pre role="log">{JSON.stringify(valuesState)}</pre>}

      {showActions && (
        <Toolbar
          align={secondaryActions.length ? "space-between" : "end"}
          variant={"transparent"}
          items={secondaryActions}
        >
          <Button
            type="submit"
            disabled={!errorsState || !!Object.keys(errorsState).length}
          >
            {ucFirst(_labelSubmit)}
          </Button>
        </Toolbar>
      )}
    </form>
  );
};
