import clsx from "clsx";
import React, { FormEvent, useContext, useEffect, useState } from "react";

import { ConfigContext } from "../../../contexts";
import { Attribute, AttributeData } from "../../../lib/data/attributedata";
import { FormField } from "../../../lib/form/typeguards";
import { getValueFromFormData, serializeForm } from "../../../lib/form/utils";
import {
  DEFAULT_VALIDATION_ERROR_REQUIRED,
  Validator,
  getErrorFromErrors,
  validateForm,
} from "../../../lib/form/validation";
import { forceArray } from "../../../lib/format/array";
import { ucFirst } from "../../../lib/format/string";
import { useIntl } from "../../../lib/i18n/useIntl";
import { ButtonProps } from "../../button";
import { Toolbar, ToolbarItem, ToolbarProps } from "../../toolbar";
import { ErrorMessage } from "../errormessage";
import { FormControl } from "../formcontrol";
import "./form.scss";

export type FormProps = Omit<
  React.ComponentProps<"form">,
  "onChange" | "onSubmit"
> & {
  /** Props to pass to the (submit) button. */
  buttonProps?: ButtonProps;

  /** If set, show `valuesState`. */
  debug?: boolean;

  /** The direction in which to render the form. */
  direction?: "vertical" | "horizontal";

  /** Justification type. */
  justify?: "baseline" | "stretch";

  /** The classname to use for the fieldset. */
  fieldsetClassName?: string;

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

  /** Props to pass to Toolbar. */
  toolbarProps?: Partial<ToolbarProps>;

  /** The submit form label. */
  labelSubmit?: string;

  /** The validation error label */
  labelValidationErrorRequired?: string;

  /**
   * (Built-in serialization only), whether the convert results to type inferred from input type (e.g. checkbox value
   * will be boolean).
   */
  useTypedResults?: boolean;

  /** A validation function. */
  validate?: (
    values: AttributeData,
    fields: FormField[],
    validators?: Validator[],
  ) => FormProps["errors"] | void;

  /** Whether to run validation on every change. */
  validateOnChange?: boolean;

  /** If set, use this custom set of `Validator`s. */
  validators?: Validator[];

  /** Gets passed to `fields` if they don't specify their own handler. */
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;

  /** Gets called when the form is submitted, setting this overrides default implementation. */
  onSubmit?: (event: FormEvent<HTMLFormElement>, data: AttributeData) => void;
};

/**
 * Generic form component, capable of auto rendering `fields` based on their shape.
 */
export const Form: React.FC<FormProps> = ({
  buttonProps,
  children,
  debug = false,
  direction = "vertical",
  errors,
  fields = [],
  fieldsetClassName = "mykn-form__fieldset",
  justify,
  initialValues = {},
  secondaryActions = [],
  labelSubmit = "",
  labelValidationErrorRequired = "",
  nonFieldErrors,
  onChange,
  onSubmit,
  showActions = true,
  toolbarProps,
  useTypedResults = false,
  validate = validateForm,
  validateOnChange = false,
  validators,
  values,
  ...props
}) => {
  const { debug: contextDebug } = useContext(ConfigContext);
  const _debug = debug || contextDebug;
  const _nonFieldErrors = forceArray(nonFieldErrors);

  const [valuesState, setValuesState] = useState(initialValues);
  const [errorsState, setErrorsState] = useState(errors || {});

  useEffect(() => {
    values && setValuesState(values);
  }, [values]);

  useEffect(() => {
    errors && setErrorsState(errors);
  }, [errors]);

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
      const errors = validate(valuesState as AttributeData, fields, validators);
      setErrorsState(errors || {});
    }
  }, [valuesState]);

  /**
   * Defaults event handler for form submission.
   * @param event
   */
  const defaultOnChange: FormProps["onChange"] = (event) => {
    if (onChange) {
      onChange(event);
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
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (validate) {
      const errors = validate(valuesState as AttributeData, fields, validators);
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

  /**
   * Gets called when the form is reset.
   */
  const handleReset: React.FormEventHandler<HTMLFormElement> = () => {
    setValuesState({});
    setErrorsState({});
  };

  return (
    <form
      className={clsx("mykn-form", `mykn-form--direction-${direction}`)}
      onSubmit={handleSubmit}
      onReset={handleReset}
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
        <div className={fieldsetClassName}>
          {fields.map((field, index) => {
            const label = field.label ?? field.name;

            const value =
              (field.value as string) ||
              getValueFromFormData(fields, valuesState, field);

            const _labelValidationErrorRequired = labelValidationErrorRequired
              ? labelValidationErrorRequired
              : intl.formatMessage(
                  {
                    id: "mykn.components.Form.labelValidationErrorRequired",
                    description:
                      'mykn.components.Form: The "required" validation error',
                    defaultMessage: "Veld {label} is verplicht",
                  },
                  { ...field, label, value },
                );

            const error = getErrorFromErrors(fields, errorsState, field);
            const message =
              error === DEFAULT_VALIDATION_ERROR_REQUIRED
                ? _labelValidationErrorRequired
                : error;

            return (
              <FormControl
                key={field.id || index}
                direction={direction}
                error={message}
                forceShowError={!validateOnChange}
                justify={justify}
                value={value}
                onChange={defaultOnChange}
                {...field}
              ></FormControl>
            );
          })}
        </div>
      )}

      {children && <div className={fieldsetClassName}>{children}</div>}

      {_debug && <pre role="log">{JSON.stringify(valuesState)}</pre>}

      {showActions && (
        <Toolbar
          align={secondaryActions.length ? "space-between" : "end"}
          variant={"transparent"}
          items={[
            ...secondaryActions,
            {
              children: ucFirst(_labelSubmit),
              disabled:
                validateOnChange && Boolean(Object.keys(errorsState).length),
              type: "submit",
              ...buttonProps,
            },
          ]}
          overrideItemProps={false}
          {...toolbarProps}
        />
      )}
    </form>
  );
};
