import React, { useId } from "react";

import { FormField, isInput, isSelect } from "../../../lib/form/typeguards";
import { ErrorMessage } from "../errormessage";
import { Input } from "../input";
import { Label } from "../label";
import { Select } from "../select";
import "./formcontrol.scss";

export type FormControlProps = FormField & { error?: string };

/**
 * Renders the correct form widget (based on its props shape) along with its
 * label and `error` message.
 * @param error
 * @param props
 * @constructor
 */
export const FormControl: React.FC<FormControlProps> = ({
  error = "",
  ...props
}) => {
  const id = useId();
  const _id = props.id || id;
  const idError = `${id}_error`;

  return (
    <div className="mykn-form-control">
      {props.label && <Label htmlFor={_id}>{props.label}</Label>}
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
  if (isSelect(props)) {
    return <Select {...props} />;
  }

  if (isInput(props)) {
    return <Input {...props} />;
  }
};
