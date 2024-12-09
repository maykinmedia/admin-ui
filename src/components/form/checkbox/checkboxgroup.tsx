import clsx from "clsx";
import React, { useId } from "react";

import { ChoiceFieldProps } from "../choicefield";
import { Checkbox } from "./checkbox";

export type CheckboxGroupProps = ChoiceFieldProps<
  HTMLDivElement,
  HTMLInputElement
>;

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  form,
  id = "",
  label,
  name,
  options,
  variant,
  required,
  onChange,
  onClick,
}) => {
  const reactId = useId();
  const _id = id || reactId;

  return (
    <div className={clsx("mykn-checkboxgroup")} aria-label={label}>
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
          >
            {option.label}
          </Checkbox>
        );
      })}
    </div>
  );
};
