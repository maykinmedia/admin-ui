import clsx from "clsx";
import React, { useId, useState } from "react";

import {
  FormField,
  isCheckbox,
  isCheckboxGroup,
  isChoiceField,
  isDateInput,
  isDatePicker,
  isDateRangeInput,
  isInput,
  isRadio,
  isRadioGroup,
} from "../../../lib/form/typeguards";
import { Checkbox } from "../checkbox";
import { ChoiceField } from "../choicefield";
import { DateInput } from "../dateinput";
import { DatePicker } from "../datepicker";
import { DateRangeInput } from "../daterangeinput";
import { ErrorMessage } from "../errormessage";
import { Input, InputProps } from "../input";
import { Label } from "../label";
import { Radio } from "../radio";
import "./formcontrol.scss";

export type FormControlProps = FormField & {
  /** The direction in which to render the form. */
  direction?: "vertical" | "horizontal";

  /** Justification type. */
  justify?: "baseline" | "stretch";

  /** An error message to show. */
  error?: string;

  /** Whether to forcefully show the error (if set), this skips the dirty check. */
  forceShowError?: boolean;
};

/**
 * Renders the correct form widget (based on its props shape) along with its
 * label and `error` message.
 * @param direction
 * @param justify
 * @param error
 * @param forceShowError
 * @param props
 * @constructor
 */
export const FormControl: React.FC<FormControlProps> = ({
  direction = "vertical",
  justify = "baseline",
  error = "",
  forceShowError,
  ...props
}) => {
  const [isDirty, setIsDirty] = useState(false);
  const id = useId();
  const _id = props.id || id;
  // Keep in sync with CheckboxGroup, possibly add constant?
  const htmlFor =
    isCheckboxGroup(props) || isRadioGroup(props) ? `${_id}-choice-0` : _id;
  const idError = `${id}_error`;

  return (
    <div
      className={clsx(
        "mykn-form-control",
        `mykn-form-control--direction-${direction}`,
        `mykn-form-control--justify-${justify}`,
      )}
    >
      {props.label && <Label htmlFor={htmlFor}>{props.label}</Label>}
      <FormWidget
        id={_id}
        aria-invalid={!!error}
        aria-describedby={error ? idError : undefined}
        {...props}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>,
        ) => {
          setIsDirty(true);
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

  if (isInput(props)) {
    return <Input {...(props as InputProps)} />;
  }
};
