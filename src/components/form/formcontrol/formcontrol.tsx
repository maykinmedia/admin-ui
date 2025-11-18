import { deprecated } from "@maykin-ui/client-common";
import clsx from "clsx";
import React, { useId, useState } from "react";

import {
  FormField,
  gettextFirst,
  isCheckbox,
  isCheckboxGroup,
  isChoiceField,
  isDateInput,
  isDatePicker,
  isDateRangeInput,
  isDurationInput,
  isInput,
  isRadio,
  isRadioGroup,
  isTextarea,
} from "../../../lib";
import { Checkbox } from "../checkbox";
import { ChoiceField } from "../choicefield";
import { DateInput } from "../dateinput";
import { DatePicker } from "../datepicker";
import { DateRangeInput } from "../daterangeinput";
import { DurationInput } from "../durationinput";
import { ErrorMessage } from "../errormessage";
import { TRANSLATIONS } from "../form/translations";
import { Input, InputProps } from "../input";
import { Label } from "../label";
import { Radio } from "../radio";
import { Textarea } from "../textarea";
import "./formcontrol.scss";

// FIXME: Clashes in types, add generic for FormField?
export type FormControlProps = FormField & {
  /** The direction in which to render the form. */
  direction?: "v" | "h" | "vertical" | "horizontal"; // TODO: deprecate horizontal and vertical

  /** Justification type. */
  justify?: "baseline" | "stretch";

  /** An error message to show. */
  error?: string;

  /** Whether to forcefully show the error (if set), this skips the dirty check. */
  forceShowError?: boolean;

  /** Whether to show a required indicator (*) when a field is required. */
  showRequiredIndicator?: boolean;

  /** The required indicator (*). */
  requiredIndicator?: string;

  /** The required (accessible) label. */
  labelRequired?: string;
};

/**
 * Renders the correct form widget (based on its props shape) along with its
 * label and `error` message.
 * @param direction
 * @param justify
 * @param error
 * @param forceShowError
 * @param showRequiredLabel
 * @param requiredIndicator
 * @param labelRequired
 * @param props
 * @constructor
 */
export const FormControl: React.FC<FormControlProps> = ({
  direction = "v",
  justify = "baseline",
  error = "",
  forceShowError,
  showRequiredIndicator = true,
  requiredIndicator,
  labelRequired,
  ...props
}) => {
  deprecated(
    direction === "horizontal",
    'direction="horizontal"',
    `mykn.components.FormControl: direction="horizontal" is deprecated, use direction="h" instead`,
  );

  deprecated(
    direction === "vertical",
    'direction="vertical"',
    `mykn.components.FormControl: direction="vertical" is deprecated, use direction="v" instead`,
  );

  const [isDirty, setIsDirty] = useState(false);
  const id = useId();
  const _id = props.id || id;
  // Keep in sync with CheckboxGroup, possibly add constant?
  const htmlFor =
    isCheckboxGroup(props) || isRadioGroup(props) ? `${_id}-choice-0` : _id;
  const idError = `${id}_error`;

  const _requiredIndicator = gettextFirst(
    requiredIndicator,
    TRANSLATIONS.REQUIRED_INDICATOR,
  );

  const _labelRequired = gettextFirst(
    labelRequired,
    TRANSLATIONS.LABEL_REQUIRED,
    { label: props.label },
  );

  const _props =
    isCheckboxGroup(props) || isRadioGroup(props)
      ? { ...props, direction: direction[0] }
      : props;
  return (
    <div
      className={clsx(
        "mykn-form-control",
        `mykn-form-control--justify-${justify}`,
        {
          [`mykn-form-control--direction-${direction[0]}`]: direction,
          "mykn-form-control--error": error,
        },
      )}
    >
      {props.label && (
        <Label htmlFor={htmlFor}>
          {props.label}
          {props.required && showRequiredIndicator && (
            <abbr
              className="mykn-form-control__required-inidicator"
              title={_labelRequired}
            >
              {_requiredIndicator}
            </abbr>
          )}
        </Label>
      )}

      <FormWidget
        id={_id}
        aria-invalid={!!error}
        aria-describedby={error ? idError : undefined}
        {..._props}
        onChange={(e: React.ChangeEvent) => {
          setIsDirty(true);
          // @ts-expect-error - EventTarget type not resolved.
          props.onChange?.(e);
        }}
      />

      {(isDirty || forceShowError) && error && (
        <ErrorMessage id={idError}>{error}</ErrorMessage>
      )}
    </div>
  );
};

/**
 * Renders the correct component for props based on its shape.
 * @param props
 * @constructor
 * @private
 */
export const FormWidget: React.FC<FormField> = ({ ...props }) => {
  if (isCheckbox(props)) {
    return <Checkbox {...props} />;
  }

  if (isRadio(props)) {
    return <Radio {...props} />;
  }

  if (isDateInput(props)) {
    return <DateInput {...props} />;
  }

  if (isDateRangeInput(props)) {
    return <DateRangeInput {...props} />;
  }

  if (isDatePicker(props)) {
    return <DatePicker {...props} />;
  }

  if (isChoiceField(props)) {
    return <ChoiceField {...props} />;
  }

  if (isTextarea(props)) {
    return <Textarea {...props} />;
  }

  if (isDurationInput(props)) {
    return <DurationInput {...props} />;
  }

  if (isInput(props)) {
    return <Input {...(props as InputProps)} />;
  }
};
