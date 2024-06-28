import clsx from "clsx";
import React, { useEffect, useId, useState } from "react";

import { ChoiceFieldProps } from "../choicefield";
import { Radio } from "./radio";

export type RadioGroupProps = ChoiceFieldProps<
  HTMLDivElement,
  HTMLInputElement
>;
export const RadioGroup: React.FC<RadioGroupProps> = ({
  id = "",
  name,
  options,
  variant,
  onChange,
}) => {
  const reactId = useId();
  const _id = id || reactId;
  const [selectedValue, setSelectedValue] = useState<
    string | number | undefined
  >(options.find((option) => option.selected)?.value);

  useEffect(() => {
    const initialSelected = options.find((option) => option.selected)?.value;
    if (initialSelected !== undefined) {
      setSelectedValue(initialSelected);
    }
  }, [options]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    onChange?.(event);
  };

  return (
    <div className={clsx("mykn-radiogroup")}>
      {options.map((option, index) => {
        const radioId = `${_id}-choice-${index}`;
        const optionValue = option.value || option.label;

        return (
          <Radio
            id={radioId}
            key={optionValue || index}
            name={name}
            value={optionValue}
            variant={variant}
            checked={selectedValue === optionValue}
            onChange={handleChange}
          >
            {option.label}
          </Radio>
        );
      })}
    </div>
  );
};
