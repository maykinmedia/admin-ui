import {
  forceArray,
  serializeFormElement,
  ucFirst,
} from "@maykin-ui/client-common";
import clsx from "clsx";
import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { ConfigContext } from "../../../contexts";
import {
  DEFAULT_VALIDATION_ERROR_REQUIRED,
  FieldErrors,
  FormField,
  FormValidator,
  SerializedFormData,
  Validator,
  errors2errorsArray,
  getErrorFromErrors,
  getValueFromFormData,
  gettextFirst,
  stringifyContext,
  useIntl,
  validateForm,
  validateRequired,
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

  // TODO: Migrate to h/v.
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
  errors?: FieldErrors | Record<string, string>;

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
  validate?: FormValidator;

  /** Whether to run validation on every change. */
  validateOnChange?: boolean;

  /** If set, use this custom set of `Validator`s. */
  validators?: Validator[];

  /** Gets passed to `fields` if they don't specify their own handler. */
  onChange?: React.ChangeEventHandler;

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
  fields,
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
  validate = validateForm,
  validateOnChange = false,
  validators = [validateRequired],
  values,
  ...props
}: FormProps<T>) => {
  const intl = useIntl();
  const formRef = useRef<HTMLFormElement>(null);

  const { debug: contextDebug } = useContext(ConfigContext);
  const _debug = debug || contextDebug;
  const _nonFieldErrors = forceArray(nonFieldErrors);

  const [valuesState, setValuesState] = useState<T>(initialValues);

  const [errorsState, setErrorsState] = useState<
    FieldErrors<FormField[], typeof validators>
  >({});
  const [forceShowErrorsState, setForceShowErrorsState] =
    useState(!validateOnChange);

  useEffect(() => {
    values && setValuesState(values);
  }, [values]);

  useEffect(() => {
    setErrorsState(errors2errorsArray(errors));
  }, [fields, errors]);

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
   * Defaults event handler for form submission.
   * @param event
   */
  const handleChange: FormProps["onChange"] = (event) => {
    if (validateOnChange && validate && formRef.current) {
      const validateData = serializeFormElement<T>(formRef.current, {
        trimCheckboxArray: false,
      });
      const errors = validate(validateData, fields || [], validators);
      setErrorsState(errors || {});
    }

    if (onChange) {
      onChange(event);
      return;
    }

    if (formRef.current && !onChange) {
      const data = serializeFormElement<T>(formRef.current, {
        typed: useTypedResults,
      });
      setValuesState(data);
    }
  };

  /**
   * Defaults event handler for form submission.
   * @param event
   */
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    if (validate) {
      const validateData = serializeFormElement<T>(form, {
        trimCheckboxArray: false,
      });

      const errors = validate(validateData, fields || [], validators);
      setErrorsState(errors || {});
      setForceShowErrorsState(true);

      if (errors && Object.keys(errors).length) {
        return;
      }
    }

    const outputDate = serializeFormElement<T>(form, {
      typed: useTypedResults,
    });

    if (onSubmit) {
      onSubmit(event, outputDate);
      return;
    }
    setValuesState(outputDate);
  };

  /**
   * Gets called when the form is reset.
   * NOTE: This may differ from a native reset as this clears the state
   * instead of resetting to the true initial state.
   *
   * This is due to React
   * updating the attributes used to specify the initial state.
   */
  const handleReset: React.FormEventHandler<HTMLFormElement> = () => {
    formRef.current
      ?.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >("input, select, textarea")
      .forEach((input) => {
        input.value = "";

        if (input instanceof HTMLInputElement) {
          input.checked = false;
        }
      });

    setValuesState({} as T);
    setErrorsState({});
  };

  return (
    <form
      ref={formRef}
      className={clsx("mykn-form", `mykn-form--direction-${direction}`)}
      onSubmit={handleSubmit}
      onReset={handleReset}
      {...props}
    >
      {Boolean(_nonFieldErrors?.length) && (
        <div className="mykn-form__non-field-errors">
          {_nonFieldErrors?.map((error: string) => (
            <ErrorMessage key={error}>{error}</ErrorMessage>
          ))}
        </div>
      )}

      {showRequiredExplanation && <P>{_requiredExplanation}</P>}

      {Boolean(fields?.length) && (
        <div className={fieldsetClassName}>
          {fields?.map((field, index) => {
            const label = field.label ?? field.name;

            const value =
              (field.value as string) ||
              getValueFromFormData<T>(fields || [], valuesState, field);

            // TODO: CLEAN UP
            const _labelValidationErrorRequired = intl.formatMessage(
              labelValidationErrorRequired === undefined
                ? TRANSLATIONS.LABEL_VALIDATION_ERROR_REQUIRED
                : {
                    id: new String() as string,
                    defaultMessage: labelValidationErrorRequired,
                  },
              stringifyContext({ ...field, label, value }),
            );

            const errors =
              getErrorFromErrors(fields || [], errorsState, field)?.map(
                (error) => {
                  return error === DEFAULT_VALIDATION_ERROR_REQUIRED
                    ? _labelValidationErrorRequired
                    : error;
                },
              ) ?? [];
            const message = errors.join(", ");

            return (
              <FormControl
                key={field.id || index}
                direction={direction[0] as "h" | "v"}
                error={message}
                forceShowError={forceShowErrorsState}
                justify={justify}
                showRequiredIndicator={showRequiredIndicator}
                requiredIndicator={requiredIndicator}
                labelRequired={labelRequired}
                value={value}
                onChange={handleChange}
                {...field}
              ></FormControl>
            );
          })}
        </div>
      )}

      {children && <div className={fieldsetClassName}>{children}</div>}
      {_debug && (
        <pre role="log">
          {JSON.stringify({ valuesState, errorsState }, null, 2)}
        </pre>
      )}

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
