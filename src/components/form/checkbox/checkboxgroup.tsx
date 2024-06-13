import clsx from "clsx";
import React, { useId } from "react";

import { ChoiceFieldProps } from "../choicefield";
import { Checkbox } from "./checkbox";

export type CheckboxGroupProps = ChoiceFieldProps<
  HTMLDivElement,
  HTMLInputElement
>;

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  id = "",
  name,
  options,
  variant,
  onChange,
}) => {
  const reactId = useId();
  const _id = id || reactId;

  return (
    <div className={clsx("mykn-checkboxgroup")}>
      {options.map((option, index) => {
        const checkboxId = `${_id}-choice-${index}`;

        return (
          <Checkbox
            checked={option.selected}
            defaultChecked={option.defaultChecked}
            id={checkboxId}
            key={option.value || option.label || index}
            name={name}
            value={option.value || option.label}
            variant={variant}
            onChange={onChange}
          >
            {option.label}
          </Checkbox>
        );
      })}
    </div>
  );
};
