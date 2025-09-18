import clsx from "clsx";
import React, { useEffect, useId, useState } from "react";

import { ChoiceFieldProps } from "../choicefield";
import { Radio } from "./radio";
import "./radiogroup.scss";

export type RadioGroupProps = ChoiceFieldProps<
  HTMLDivElement,
  HTMLInputElement
> & {
  /** Whether the items appear horizontally (h) or vertically (v), mobile devices always use vertical. */
  direction?: "h" | "v";
};
export const RadioGroup: React.FC<RadioGroupProps> = ({
  id = "",
  direction = "v",
  label,
  name,
  options,
  required,
  variant,
  onChange,
  onClick,
  disabled,
  value,
}) => {
  const reactId = useId();
  const _id = id || reactId;
  const [selectedValueState, setSelectedValueState] = useState<
    string | number | null | undefined
  >(value);

  // Update value from options.
  useEffect(() => {
    const initialSelected = options.find((option) => option.selected)?.value;
    if (initialSelected !== undefined) {
      setSelectedValueState(initialSelected);
    }
  }, [options]);

  // Update value.
  useEffect(() => {
    setSelectedValueState(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValueState(event.target.value);
    onChange?.(event);
  };

  return (
    <div
      className={clsx(
        "mykn-radiogroup",
        `mykn-radiogroup--direction-${direction}`,
      )}
      aria-label={label}
      id={_id}
    >
      {options.map((option, index) => {
        const radioId = `${_id}-choice-${index}`;
        const optionValue = option.value || option.label;
        return (
          <Radio
            id={radioId}
            key={optionValue || index}
            checked={selectedValueState === optionValue}
            name={name}
            required={required}
            value={optionValue}
            variant={variant}
            onChange={handleChange}
            onClick={onClick}
            disabled={disabled}
          >
            {option.label}
          </Radio>
        );
      })}
    </div>
  );
};
