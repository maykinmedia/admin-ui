import clsx from "clsx";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useIntl } from "../../../lib";
import { eventFactory } from "../eventFactory";
import { Input, InputProps } from "../input";
import "./dateinput.scss";
import { TRANSLATIONS } from "./dateinput.translations";

export type DateInputProps = {
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

  /** The size. */
  size?: "xl" | "s" | "xs" | "xxs";

  /** Can be a `Date` `[Date, Date]` or a (date) `string` or a (time) `number`. */
  value?: Date | string | number;

  /** Gets called when the value is changed. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

/**
 * DateInput component, can be used to type a date using separated inputs.
 */
export const DateInput: React.FC<DateInputProps> = ({
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
  size,
  value = null,
  onChange,
  ...props
}) => {
  type SanitizedValues = { DD: string; MM: string; YY: string };
  const fakeInputRef = useRef<HTMLInputElement>(null);
  const [isPristine, setIsPristine] = useState(true);
  const [sanitizedValuesState, setSanitizedValuesState] = useState<
    SanitizedValues | undefined
  >();
  const intl = useIntl();

  // Update sanitizedValuesState.
  useEffect(() => {
    if (!value) {
      return;
    }
    const date = value2Date(value);

    if (date) {
      const sanitizedValues = date2SanitizedValues(date);
      setSanitizedValuesState(sanitizedValues);
    }
  }, [value]);

  /**
   * Converts `value` prop to `Date` or `undefined`.
   */
  const value2Date = useCallback((value: Date | string | number) => {
    if (!value) return undefined;

    if (value instanceof Date && !isNaN(value.getTime())) {
      return value;
    }

    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }, []);

  /**
   * Returns `SanitizedValues` for the optionally given `Date`, if date is omitted, result contains empty values.
   */
  const date2SanitizedValues = useCallback((sanitizedValue: Date) => {
    return {
      DD: sanitizedValue.getDate().toString(),
      MM: (sanitizedValue.getMonth() + 1).toString(),
      YY: sanitizedValue.getFullYear().toString(),
    };
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
    [],
  );

  /**
   * Returns date `string` for the given `Date`.
   */
  const date2DateString = useCallback((dateObject: Date) => {
    const date = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();

    const DD = date.toString().padStart(2, "0");
    const MM = month.toString().padStart(2, "0");
    const YY = year.toString().padStart(4, "0");

    return `${YY}-${MM}-${DD}`;
  }, []);

  /**
   * Returns whether `date` is a valid date.
   * @param date
   */
  const isValidDate = useCallback((date: Date): boolean => {
    return !isNaN(date.getTime());
  }, []);

  /**
   * Gets called when any of the section inputs is changed.
   */
  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (event) => {
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
      setSanitizedValuesState((state) => ({
        ...state,
        ...newSanitizedValues,
      }));

      // Event handling.
      const date = sanitizedValues2Date(newSanitizedValues);

      if (date) {
        // Date is valid, dispatch `dateString`.
        const dateString = date2DateString(date);
        dispatchEvent(dateString);
        setIsPristine(false);
      } else if (!isPristine) {
        // Date is invalid after previous valid value, dispatch "".
        dispatchEvent("");
        setIsPristine(false);
      }
    },
    [fakeInputRef, isPristine, sanitizedValuesState],
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
      const currentValue = sanitizedValuesState?.[section].toString();
      const isSelected =
        value && selectionStart === 0 && selectionEnd === value.length;

      // No numeric value and no key, keep native behaviour.
      if (!event.key.match(/^\d$/)) {
        if (event.key === "Backspace" && isSelected) {
          // Keep focus.
          setTimeout(() => target.focus(), 40);
          return;
        }
        return;
      }

      // Ignore year section or completed inputs.
      if (section === "YY" || currentValue?.length === 2) return;

      const newValue = parseInt(`${currentValue}${event.key}`);
      const limit = section === "DD" ? 31 : 12;

      if (newValue > limit) {
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
      const isCompleted = section !== "YY" && value.length === 2;
      const isCleared = value.length === 0 && event.key === "Backspace";

      switch (section) {
        case "DD":
          if (isCompleted) {
            focusSection("MM");
          }
          break;

        case "MM":
          if (isCleared) {
            focusSection("DD");
          }
          if (isCompleted) {
            focusSection("YY");
          }
          break;

        case "YY":
          if (isCleared) {
            focusSection("MM");
          }
          break;
      }
    },
    [],
  );

  /**
   * Focuses input section identified by `section`.
   * @param section
   */
  const focusSection = useCallback(
    (section: "DD" | "MM" | "YY") => {
      const input = fakeInputRef.current;
      if (!input) return;

      const parent = input.parentElement;
      parent
        ?.querySelector<HTMLInputElement>(`[data-section="${section}"]`)
        ?.focus();
    },
    [fakeInputRef],
  );

  /**
   * Dispatch change event.
   *
   * A custom "change" event with `detail` set to the `event.target.value` is
   * dispatched on `input.current`.
   *
   * This aims to improve compatibility with various approaches to dealing
   * with forms.
   * @param value
   */
  const dispatchEvent = useCallback(
    (value: string) => {
      const input = fakeInputRef.current as HTMLInputElement;
      input.value = value;

      // Construct custom event.
      const changeEvent = eventFactory("change", value, true, false, false);

      // Dispatch event and trigger callback.
      input.dispatchEvent(changeEvent);
      onChange &&
        onChange(changeEvent as unknown as React.ChangeEvent<HTMLInputElement>);
    },
    [fakeInputRef],
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
      onFocus: (e: React.FocusEvent<HTMLInputElement>) => e.target.select(),
      onKeyDown: onKeyDown,
      onKeyUp: onKeyUp,
      size,
      type: "text",
      pad: pad,
    };
  }, [props]);

  // Input sections.
  const inputs = useMemo(() => {
    return sanitizedFormat.map((section) => {
      switch (section) {
        case "DD":
          return (
            <Input
              key={section}
              aria-label={
                labelDate || intl.formatMessage(TRANSLATIONS.LABEL_DATE, {})
              }
              placeholder={
                placeholderDate ||
                intl.formatMessage(TRANSLATIONS.PLACEHOLDER_DATE, {})
              }
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
              aria-label={
                labelMonth || intl.formatMessage(TRANSLATIONS.LABEL_MONTH, {})
              }
              placeholder={
                placeholderMonth ||
                intl.formatMessage(TRANSLATIONS.PLACEHOLDER_MONTH, {})
              }
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
              aria-label={
                labelYear || intl.formatMessage(TRANSLATIONS.LABEL_YEAR, {})
              }
              placeholder={
                placeholderYear ||
                intl.formatMessage(TRANSLATIONS.PLACEHOLDER_YEAR, {})
              }
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
    <div className={clsx("mykn-dateinput")} aria-label={label}>
      <input ref={fakeInputRef} {...props} type="hidden" value={dateString} />
      {inputs}
    </div>
  );
};
