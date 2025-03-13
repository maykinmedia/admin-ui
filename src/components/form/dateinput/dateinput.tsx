import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { date2DateString, gettextFirst, value2Date } from "../../../lib/";
import { eventFactory } from "../eventFactory";
import { Input, InputProps } from "../input";
import "./dateinput.scss";
import { TRANSLATIONS } from "./dateinput.translations";

export type DateInputProps = {
  /** The id, is set: passed to the first input. */
  id?: string;

  /** The associated form's id. */
  form?: string;

  /** The order of fields. */
  format?: "DDMMYYYY" | "YYYYMMDD";

  /** Whether a date or date range should be provided. */
  type?: "date";

  /** Props to pass to child inputs. */
  inputProps?: InputProps;

  /** DateInput label. */
  label?: string;

  /** Date input label. */
  labelDate?: string;
  /** Month input label. */
  labelMonth?: string;
  /** Year input label. */
  labelYear?: string;

  /** Date input placeholder. */
  placeholderDate?: string;
  /** Month input placeholder. */
  placeholderMonth?: string;
  /** Year input placeholder. */
  placeholderYear?: string;

  /** The name. */
  name?: string;

  /** Whether to apply padding. */
  pad?: boolean | "h" | "v";

  /** Whether a value is required. */
  required?: boolean;

  /** The size. */
  size?: "xl" | "s" | "xs" | "xxs";

  /** (Date) string. */
  value?: string;

  /** Gets called when the value is changed. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

/**
 * DateInput component, can be used to type a date using separated inputs.
 */
export const DateInput: React.FC<DateInputProps> = ({
  id,
  form,
  format = "DDMMYYYY",
  inputProps,
  label,
  labelDate,
  labelMonth,
  labelYear,
  placeholderDate,
  placeholderMonth,
  placeholderYear,
  pad,
  required,
  size,
  value = null,
  onChange,
  ...props
}) => {
  type SanitizedValues = { DD: string; MM: string; YY: string };
  const debounceRef = useRef<NodeJS.Timeout>(undefined);
  const fakeInputRef = useRef<HTMLInputElement>(null);
  const [isPristine, setIsPristine] = useState(true);
  const [sanitizedValuesState, setSanitizedValuesState] = useState<
    SanitizedValues | undefined
  >();
  const _labelDate = gettextFirst(labelDate, TRANSLATIONS.LABEL_DATE);
  const _placeholderDate = gettextFirst(
    placeholderDate,
    TRANSLATIONS.PLACEHOLDER_DATE,
  );

  const _labelMonth = gettextFirst(labelMonth, TRANSLATIONS.LABEL_MONTH);
  const _placeholderMonth = gettextFirst(
    placeholderMonth,
    TRANSLATIONS.PLACEHOLDER_MONTH,
  );
  const _labelYear = gettextFirst(labelYear, TRANSLATIONS.LABEL_YEAR);
  const _placeholderYear = gettextFirst(
    placeholderYear,
    TRANSLATIONS.PLACEHOLDER_YEAR,
  );

  /**
   * Dispatch change event.
   *
   * A custom "change" event with `detail` set to the `event.target.value` is
   * dispatched on `input.current`.
   *
   * This aims to improve compatibility with various approaches to dealing
   * with forms.
   * @param dateString
   */
  const dispatchEvent = useCallback(
    (dateString: string) => {
      const input = fakeInputRef.current as HTMLInputElement;
      input.value = dateString;

      // Construct custom event.
      const changeEvent = eventFactory(
        "change",
        dateString,
        true,
        false,
        false,
      );

      // Dispatch event and trigger callback.
      setTimeout(() => {
        input.dispatchEvent(changeEvent);
        onChange &&
          onChange(
            changeEvent as unknown as React.ChangeEvent<HTMLInputElement>,
          );
      }, 0);
    },
    [fakeInputRef, onChange],
  );

  // Update sanitizedValuesState.
  useEffect(() => {
    if (!value) {
      setSanitizedValuesState(undefined);
      return;
    }
    const date = value2Date(value);

    if (date) {
      const sanitizedValues = date2SanitizedValues(date);
      setSanitizedValuesState(sanitizedValues);
    }
  }, [value]);

  // Respect form reset.
  useEffect(() => {
    const input = fakeInputRef.current as HTMLInputElement;
    const form = input.form;
    if (!form) return;

    const clear = () => setSanitizedValuesState(undefined);
    form.addEventListener("reset", clear);
    return () => input.removeEventListener("reset", clear);
  }, [form, fakeInputRef]);

  /**
   * Returns `SanitizedValues` for the optionally given `Date`, if date is omitted, result contains empty values.
   */
  const date2SanitizedValues = useCallback((sanitizedValue: Date) => {
    return {
      DD: sanitizedValue.getDate().toString().padStart(2, "0"),
      MM: (sanitizedValue.getMonth() + 1).toString().padStart(2, "0"),
      YY: sanitizedValue.getFullYear().toString().padStart(2, "0"),
    };
  }, []);

  /**
   * Returns whether `date` is a valid date.
   * @param date
   */
  const isValidDate = useCallback((date: Date): boolean => {
    return !isNaN(date.getTime());
  }, []);

  /**
   * Returns `Date` for the given `sanitizedValues`, is resulting date is not a
   * valid date string: `undefined` is returned instead.
   */
  const sanitizedValues2Date = useCallback(
    ({ DD, MM, YY }: SanitizedValues) => {
      // No valid value.
      if (!DD || !MM || !YY) {
        return;
      }

      const date = parseInt(DD);
      const month = parseInt(MM);
      const monthZeroIndexed = month - 1;
      const year = parseInt(YY);

      const dateObject = new Date();
      dateObject.setDate(date);
      dateObject.setMonth(monthZeroIndexed);
      dateObject.setFullYear(year);

      if (!isValidDate(dateObject)) {
        return;
      }

      return dateObject;
    },
    [isValidDate],
  );

  /**
   * Focuses input section identified by `section`.
   * @param section
   */
  const focusSection = useCallback(
    (target: HTMLInputElement | null) => {
      const fn = () => {
        if (!target) {
          return;
        }
        target?.focus();
        target?.select();
      };

      clearTimeout(debounceRef?.current);
      debounceRef.current = setTimeout(fn, 30);
    },
    [debounceRef.current, fakeInputRef.current],
  );

  /**
   * Gets called when any of the section inputs is changed.
   */
  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      // Construct SanitizedValues.
      const { dataset, value } = event.target;
      const section = dataset.section as "DD" | "MM" | "YY";
      const newSanitizedValues = {
        ...(sanitizedValuesState || {
          DD: "",
          MM: "",
          YY: "",
        }),
      };

      // State update.
      newSanitizedValues[section] = value;
      const newSanitizedValuesState = {
        ...sanitizedValuesState,
        ...newSanitizedValues,
      };
      setSanitizedValuesState(newSanitizedValuesState);

      const date =
        newSanitizedValuesState &&
        sanitizedValues2Date(newSanitizedValuesState);

      if (date) {
        // Date is valid, dispatch `dateString`.
        const dateString = date2DateString(date);
        dispatchEvent(dateString);
        setIsPristine(false);
      } else {
        if (isPristine) {
          return;
        }
        // Date is invalid after previous valid value, dispatch "".
        dispatchEvent("");
      }
    },
    [sanitizedValuesState, isPristine, dispatchEvent],
  );

  /**
   * Gets called when a key is pressed when any of the section inputs has focus.
   * Validates the input
   * @param event
   */
  const onKeyDown = useCallback<React.KeyboardEventHandler<HTMLInputElement>>(
    (event) => {
      // Character key, prevent input.
      if (event.code.startsWith("Key")) {
        event.preventDefault();
      }

      const target = event.target as HTMLInputElement;
      const { dataset, selectionStart, selectionEnd, value } = target;
      const section = dataset.section as "DD" | "MM" | "YY";
      const currentValue =
        sanitizedValuesState?.[section] &&
        parseInt(sanitizedValuesState?.[section]).toString();
      const isSelected =
        value && selectionStart === 0 && selectionEnd === value.length;

      // No numeric value, keep native behaviour.
      if (!event.key.match(/^\d$/)) {
        return;
      }

      // Ignore year section or completed inputs.
      if (section === "YY" || currentValue?.length === 2) return;

      const newValue = parseInt(`${currentValue}${event.key}`);
      const limit = section === "DD" ? 31 : 12;

      if (newValue > limit && !isSelected) {
        event.preventDefault();
      }
    },
    [sanitizedValuesState],
  );

  /**
   * Gets called when a key is pressed when any of the section inputs has focus.
   * Focuses the next applicable section input.
   * @param event
   */
  const onKeyUp = useCallback<React.KeyboardEventHandler<HTMLInputElement>>(
    (event) => {
      // No numeric value and no backspace.
      if (!event.key.match(/^\d$/) && event.key !== "Backspace") {
        return;
      }
      const { dataset, value } = event.target as HTMLInputElement;
      const section = dataset.section as "DD" | "MM" | "YY";
      const isCompleted =
        section === "YY" ? value.length === 4 : value.length === 2;
      const isCleared = !value && event.key === "Backspace";

      const input = event.target as HTMLInputElement;
      if (isCompleted) {
        focusSection(input.nextElementSibling as HTMLInputElement | null);
      } else if (isCleared) {
        focusSection(input.previousElementSibling as HTMLInputElement | null);
      }
    },
    [focusSection],
  );

  // Format as array of sections, "YYYY" is replaced with "YY".
  const sanitizedFormat = useMemo(() => {
    return format.replace("YYYY", "YY").match(/([\w]{2})/g) as (
      | "DD"
      | "MM"
      | "YY"
    )[];
  }, [format]);

  // Base props for all section inputs.
  const baseProps = useMemo(() => {
    return {
      form,
      pattern: "[0-9]*",
      onChange: handleChange,
      onFocus: (e: React.FocusEvent<HTMLInputElement>) =>
        setTimeout(() => e.target.select()),
      onKeyDown: onKeyDown,
      onKeyUp: onKeyUp,
      size,
      type: "text",
      pad: pad,
      required,
    };
  }, [props]);

  // Input sections.
  const inputs = useMemo(() => {
    return sanitizedFormat.map((section, index) => {
      switch (section) {
        case "DD":
          return (
            <Input
              key={section}
              aria-label={_labelDate}
              id={index === 0 ? id : undefined}
              placeholder={_placeholderDate}
              {...baseProps}
              {...inputProps}
              data-section="DD"
              min="1"
              max="31"
              maxLength={2}
              value={sanitizedValuesState?.DD?.toString() || ""}
            ></Input>
          );

        case "MM":
          return (
            <Input
              key={section}
              aria-label={_labelMonth}
              placeholder={_placeholderMonth}
              {...baseProps}
              {...inputProps}
              data-section="MM"
              min="1"
              max="12"
              maxLength={2}
              value={sanitizedValuesState?.MM?.toString() || ""}
            ></Input>
          );

        case "YY":
          return (
            <Input
              key={section}
              aria-label={_labelYear}
              id={index === 0 ? id : undefined}
              placeholder={_placeholderYear}
              {...baseProps}
              {...inputProps}
              data-section="YY"
              max="9999"
              maxLength={4}
              value={sanitizedValuesState?.YY?.toString() || ""}
            ></Input>
          );

        default:
          throw new Error(`Invalid date format (${format})!`);
      }
    });
  }, [
    id,
    inputProps,
    labelDate,
    labelMonth,
    labelYear,
    sanitizedFormat,
    sanitizedValuesState,
    baseProps,
  ]);

  // Current date for value attribute.
  const date = useMemo(() => {
    return sanitizedValuesState && sanitizedValues2Date(sanitizedValuesState);
  }, [sanitizedValuesState]);

  // Value attribute.
  const dateString = useMemo(() => {
    return (date && date2DateString(date)) || "";
  }, [date]);

  return (
    <div
      className="mykn-dateinput"
      title={label}
      onChange={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.preventDefault();
      }}
    >
      <input
        ref={fakeInputRef}
        className="mykn-dateinput__input"
        aria-hidden={true}
        {...props}
        form={form}
        readOnly
        type="date"
        value={dateString}
      />
      {inputs}
    </div>
  );
};
