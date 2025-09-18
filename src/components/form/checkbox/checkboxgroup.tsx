import clsx from "clsx";
import React, { useId } from "react";

import { ChoiceFieldProps } from "../choicefield";
import { Checkbox } from "./checkbox";
import "./checkboxgroup.scss";

export type CheckboxGroupProps = ChoiceFieldProps<
  HTMLDivElement,
  HTMLInputElement
> & {
  /** Whether the items appear horizontally (h) or vertically (v), mobile devices always use vertical. */
  direction?: "h" | "v";
};

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  form,
  direction = "v",
  id = "",
  label,
  name,
  options,
  variant,
  required,
  onChange,
  onClick,
  disabled,
}) => {
  const reactId = useId();
  const _id = id || reactId;

  return (
    <div
      className={clsx(
        "mykn-checkboxgroup",
        `mykn-checkboxgroup--direction-${direction}`,
      )}
      aria-label={label}
    >
      {options.map((option, index) => {
        const checkboxId = `${_id}-choice-${index}`;

        return (
          <Checkbox
            key={option.value || option.label || index}
            checked={option.selected}
            defaultChecked={option.defaultChecked}
            form={form}
            id={checkboxId}
            name={name}
            required={required}
            value={option.value || option.label}
            variant={variant}
            onChange={onChange}
            onClick={onClick}
            disabled={disabled}
          >
            {option.label}
          </Checkbox>
        );
      })}
    </div>
  );
};
