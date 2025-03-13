import clsx from "clsx";
import React, { FormEvent, useContext, useEffect, useState } from "react";

import { ConfigContext } from "../../../contexts";
import {
  DEFAULT_VALIDATION_ERROR_REQUIRED,
  FormField,
  SerializedFormData,
  Validator,
  forceArray,
  getErrorFromErrors,
  getValueFromFormData,
  gettextFirst,
  serializeForm,
  stringifyContext,
  ucFirst,
  useIntl,
  validateForm,
} from "../../../lib";
import { ButtonProps } from "../../button";
import { Toolbar, ToolbarItem, ToolbarProps } from "../../toolbar";
import { P } from "../../typography";
import { ErrorMessage } from "../errormessage";
import { FormControl } from "../formcontrol";
import "./form.scss";
import { TRANSLATIONS } from "./translations";

export type FormProps<T extends SerializedFormData = SerializedFormData> = Omit<
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
  initialValues?: T;

  /** The form values, always applied. */
  values?: T;

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

  /** Whether to show a required indicator (*) when a field is required. */
  showRequiredIndicator?: boolean;

  /** The required indicator (*). */
  requiredIndicator?: string;

  /** The required explanation text. */
  requiredExplanation?: string;

  /** The required (accessible) label. */
  labelRequired?: string;

  /** Whether to show a text describing the meaning of * when one or more fields are required. */
  showRequiredExplanation?: boolean;

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
    values: T,
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
  onSubmit?: (event: FormEvent<HTMLFormElement>, data: T) => void;
};

/**
 * Form Component
 *
 * A reusable form component with built-in validation, state management, and
 * dynamic rendering of fields.
 *
 * Fields may contain a `FormField[]`, in which ase the exact type of each item
 * will be automatically resolved and used to render the correct fom widget.
 *
 * @typeParam T - The shape of the serialized form data.
 */
export const Form = <T extends SerializedFormData = SerializedFormData>({
  buttonProps,
  children,
  debug = false,
  direction = "vertical",
  errors,
  fields = [],
  fieldsetClassName = "mykn-form__fieldset",
  justify,
  initialValues = {} as T,
  secondaryActions = [],
  labelSubmit,
  labelValidationErrorRequired,
  nonFieldErrors,
  onChange,
  onSubmit,
  showActions = true,
  showRequiredIndicator = true,
  requiredIndicator,
  labelRequired,
  showRequiredExplanation = true,
  requiredExplanation,
  toolbarProps,
  useTypedResults = false,
  validate = validateForm<T>,
  validateOnChange = false,
  validators,
  values,
  ...props
}: FormProps<T>) => {
  const intl = useIntl();

  const { debug: contextDebug } = useContext(ConfigContext);
  const _debug = debug || contextDebug;
  const _nonFieldErrors = forceArray(nonFieldErrors);

  const [valuesState, setValuesState] = useState<T>(initialValues);
  const [errorsState, setErrorsState] = useState(errors || {});

  useEffect(() => {
    values && setValuesState(values);
  }, [values]);

  useEffect(() => {
    errors && setErrorsState(errors);
  }, [errors]);

  const _requiredIndicator = gettextFirst(
    requiredIndicator,
    TRANSLATIONS.REQUIRED_INDICATOR,
  );

  const _requiredExplanation = gettextFirst(
    requiredExplanation,
    TRANSLATIONS.REQUIRED_EXPLANATION,
    {
      requiredIndicator: _requiredIndicator,
    },
  );

  const _labelSubmit = gettextFirst(labelSubmit, TRANSLATIONS.LABEL_SUBMIT);

  /**
   * Revalidate on state change.
   */
  useEffect(() => {
    if (validateOnChange && validate) {
      const errors = validate(valuesState, fields, validators);
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
      const data = serializeForm<keyof T & string>(form, useTypedResults) as T;
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
      const errors = validate(valuesState, fields, validators);
      setErrorsState(errors || {});

      if (errors && Object.keys(errors).length) {
        return;
      }
    }

    const form = event.target as HTMLFormElement;
    const data = serializeForm<keyof T & string>(form, useTypedResults) as T;

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
    setValuesState({} as T);
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

      {showRequiredExplanation && <P>{_requiredExplanation}</P>}

      {Boolean(fields?.length) && (
        <div className={fieldsetClassName}>
          {fields.map((field, index) => {
            const label = field.label ?? field.name;

            const value =
              (field.value as string) ||
              getValueFromFormData<T>(fields, valuesState, field);

            const _labelValidationErrorRequired = intl.formatMessage(
              labelValidationErrorRequired === undefined
                ? TRANSLATIONS.LABEL_VALIDATION_ERROR_REQUIRED
                : {
                    id: new String() as string,
                    defaultMessage: labelValidationErrorRequired,
                  },
              stringifyContext({ ...field, label, value }),
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
                showRequiredIndicator={showRequiredIndicator}
                requiredIndicator={requiredIndicator}
                labelRequired={labelRequired}
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
              minWidth: true,
              type: "submit",
              variant: "primary",
              ...buttonProps,
            },
          ]}
          overrideItemProps={false}
          pad={false}
          {...toolbarProps}
        />
      )}
    </form>
  );
};
