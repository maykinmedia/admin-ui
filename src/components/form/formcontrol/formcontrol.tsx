import clsx from "clsx";
import React, { useId } from "react";

import {
  FormField,
  isCheckbox,
  isCheckboxGroup,
  isChoiceField,
  isInput,
} from "../../../lib/form/typeguards";
import { Checkbox } from "../checkbox";
import { ChoiceField } from "../choicefield";
import { ErrorMessage } from "../errormessage";
import { Input, InputProps } from "../input";
import { Label } from "../label";
import "./formcontrol.scss";

export type FormControlProps = FormField & {
  /** The direction in which to render the form. */
  direction?: "vertical" | "horizontal";

  /** An error message to show. */
  error?: string;
};

/**
 * Renders the correct form widget (based on its props shape) along with its
 * label and `error` message.
 * @param direction
 * @param error
 * @param props
 * @constructor
 */
export const FormControl: React.FC<FormControlProps> = ({
  direction = "vertical",
  error = "",
  ...props
}) => {
  const id = useId();
  const _id = props.id || id;
  // Keep in sync with CheckboxGroup, possibly add constant?
  const htmlFor = isCheckboxGroup(props) ? `${_id}-choice-0` : _id;
  const idError = `${id}_error`;

  return (
    <div
      className={clsx(
        "mykn-form-control",
        `mykn-form-control--direction-${direction}`,
      )}
    >
      {props.label && <Label htmlFor={htmlFor}>{props.label}</Label>}
      <FormWidget
        id={_id}
        aria-invalid={!!error}
        aria-describedby={error ? idError : undefined}
        {...props}
      />
      {error && <ErrorMessage id={idError}>{error}</ErrorMessage>}
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

  if (isChoiceField(props)) {
    return <ChoiceField {...props} />;
  }

  if (isInput(props)) {
    return <Input {...(props as InputProps)} />;
  }
};
