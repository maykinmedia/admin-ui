import clsx from "clsx";
import { formatISO } from "date-fns";
import { nl } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import ReactDatePicker, {
  DatePickerProps as ReactDatePickerProps,
} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { formatMessage, useIntl } from "../../../lib";
import { eventFactory } from "../eventFactory";
import "./datepicker.scss";

export type DatePickerDate = Date | null;
export type DatePickerDateRange = (Date | null)[];
export type DatePickerValue = DatePickerDate | DatePickerDateRange;

export type DatePickerProps = Omit<
  ReactDatePickerProps,
  "onChange" | "value"
> & {
  /** The associated form's id. */
  form?: string;

  /** Whether a date or date range should be provided. */
  type?: "datepicker" | "daterangepicker";

  /** DatePicker label. */
  label?: string;

  /** Whether to apply padding. */
  pad?: boolean | "h" | "v";

  /** Placeholder. */
  placeholder?: string;

  /** Can be a `Date` `[Date, Date]` or a (date) `string` or a (time) `number`. */
  value?: DatePickerValue | string | number | null;

  labelNextYear?: string;
  labelPreviousYear?: string;
  labelNextMonth?: string;
  labelPreviousMonth?: string;
  labelClose?: string;
  labelChooseDayPrefix?: string;
  labelDisabledDayPrefix?: string;
  labelMonthPrefix?: string;
  labelWeekPrefix?: string;
  labelTimeInput?: string;
  labelWeek?: string;

  /** Gets called when the value is changed. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

/**
 * DatePicker component, can be used to enter a date or a date range.
 *
 * Known issues:
 *  - Setting date range by typing into input currently does not not work. Possibly
 *    due to lack of support from React-Datepicker.
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  form,
  type = "daterange",
  locale = nl,
  name,
  placeholderText,
  placeholder = placeholderText,
  value = null,
  required,
  labelNextYear,
  labelPreviousYear,
  labelNextMonth,
  labelPreviousMonth,
  labelClose,
  labelChooseDayPrefix,
  labelDisabledDayPrefix,
  labelMonthPrefix,
  labelWeekPrefix,
  labelTimeInput,
  labelWeek,
  pad = true,
  onChange,
  ...props
}) => {
  const intl = useIntl();
  const fakeInputRef = React.useRef<HTMLInputElement>(null);
  const [valueState, setValueState] = useState<DatePickerValue>(null);
  useEffect(() => {
    setValueState(value2DatePickerValue(value));
  }, [value]);

  const date = Array.isArray(valueState) ? valueState[0] : valueState;
  const dateRange = Array.isArray(valueState) ? valueState : [null, null];

  /**
   * Converts value prop to `valueState`.
   * Takes:
   * @param value The input value, can be:
   *  - A date `string` "2023-09-15"
   *  - A date range `string` "2023-09-14/2023-09-15"
   *  - A `Date` object.
   *  - A `[Date, Date]` tuple
   *  @return A value suitable to use internally in `valueState`.
   */
  const value2DatePickerValue = (
    value: DatePickerValue | string | number,
  ): DatePickerValue => {
    // Emtpy string -> null;
    if (value === "") {
      return null;
    }

    // Number (time)
    if (typeof value === "number") {
      return new Date(value);
    }

    // Date/null (array)
    if (value === null || value instanceof Date || Array.isArray(value)) {
      return value;
    }

    const dateString = String(value);

    return dateString.match("/")
      ? (dateString
          .split("/")
          .map((str) => new Date(str)) as DatePickerDateRange)
      : new Date(dateString);
  };

  /**
   * Returns the given value as ISO date(range) format.
   * @example "2023-09-15" or "2023-09-14/2023-09-15"
   * @param value
   */
  const value2string = (value: DatePickerValue): string => {
    // Date range
    if (Array.isArray(value)) {
      return value.map(value2string).join("/");
    }

    // Null value
    if (!value) {
      return "";
    }

    // Date
    return formatISO(value, { representation: "date" });
  };

  /**
   * Gets called when the date is changed.
   * @param newValue
   */
  const handleChange = (newValue: DatePickerValue) => {
    setValueState(newValue);
    dispatchEvent(newValue);
  };

  /**
   * Dispatch change event.
   *
   * - Dispatch (change) event on fake input for onChange callbacks higher up the (DOM) tree.
   * - Dispatch (change) event on visual DOM input for addEventListener compatibility.
   * - Call onChange for normal React flow.
   *
   * Dispatching change event
   * ===
   *
   * A custom "change" event created with `detail` set to the ISO date format.
   * The event is dispatched on both `fakeInputRef.current` as the visual input.
   *
   * `fakeInputRef.current` has its value set to the native ISO date format for
   * compatibility.
   *
   * Tha native value setter is called directly in order to facilitate proper
   * event bubbling. Relying on such behaviour should be considered a bad practice
   * and using React `onChange` props should be preferred.
   *
   *
   * Call onChange for normal React flow.
   * ===
   *
   * The same event is then used as value for the onChange React prop, after dispatching
   * the even has its target set.
   *
   * This aims to improve compatibility with various approaches of dealing
   * with forms.
   * @param value
   */
  const dispatchEvent = (value: DatePickerValue) => {
    const newValue = Array.isArray(value) && !value[1] ? null : value;
    const fakeInput = fakeInputRef.current as HTMLInputElement;
    // Code smell...
    const visualInput = fakeInput.nextElementSibling?.querySelector("input");
    const formattedValue = value2string(newValue);

    const changeEvent = eventFactory(
      "change",
      formattedValue,
      true,
      false,
      false,
    );

    /*
      Code smell...

      Call the native value setter on our input ref, this should™ have React respond
      to with appropriate`onChange` calls higher up the tree.

      This aims to provide compatibility with DOM event bubbling (intercepting onChange
      higher up the tree).
     */
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;
    nativeInputValueSetter?.call(fakeInput, formattedValue);

    // Dispatch (change) event on visual DOM input for addEventListener compatibility.
    visualInput?.dispatchEvent(changeEvent);

    // Dispatch (change) event on fake input for onChange callbacks higher up the (DOM) tree.
    fakeInput.dispatchEvent(changeEvent);

    // Call onChange for normal React flow (after dispatch calls so target is set).
    onChange?.(changeEvent as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  // intl context
  const context = { name: name || "", value: value2string(valueState) };

  const _labelNextYear = labelNextYear
    ? formatMessage(labelNextYear, context)
    : intl.formatMessage(
        {
          id: "mykn.components.DatePicker.labelNextYear",
          description:
            "mykn.components.DatePicker: The datepicker next year label",
          defaultMessage: "Volgend jaar",
        },
        context,
      );

  const _labelPreviousYear = labelPreviousYear
    ? formatMessage(labelPreviousYear, context)
    : intl.formatMessage(
        {
          id: "mykn.components.DatePicker.labelPreviousYear",
          description:
            "mykn.components.DatePicker: The datepicker previous year label",
          defaultMessage: "Vorig jaar",
        },
        context,
      );

  const _labelNextMonth = labelNextMonth
    ? formatMessage(labelNextMonth, context)
    : intl.formatMessage(
        {
          id: "mykn.components.DatePicker.labelNextMonth",
          description:
            "mykn.components.DatePicker: The datepicker next month label",
          defaultMessage: "Volgende maand",
        },
        context,
      );

  const _labelPreviousMonth = labelPreviousMonth
    ? formatMessage(labelPreviousMonth, context)
    : intl.formatMessage(
        {
          id: "mykn.components.DatePicker.labelPreviousMonth",
          description:
            "mykn.components.DatePicker: The datepicker previous month label",
          defaultMessage: "Vorige maand",
        },
        context,
      );

  const _labelClose = labelClose
    ? formatMessage(labelClose, context)
    : intl.formatMessage(
        {
          id: "mykn.components.DatePicker.labelClose",
          description: "mykn.components.DatePicker: The datepicker close label",
          defaultMessage: "Sluiten",
        },
        context,
      );

  const _labelChooseDayPrefix = labelChooseDayPrefix
    ? formatMessage(labelChooseDayPrefix, context)
    : intl.formatMessage(
        {
          id: "mykn.components.DatePicker.labelChooseDayPrefix",
          description: "mykn.components.DatePicker: The choose day prefix",
          defaultMessage: "Kies dag",
        },
        context,
      );

  const _labelDisabledDayPrefix = labelDisabledDayPrefix
    ? formatMessage(labelDisabledDayPrefix, context)
    : intl.formatMessage(
        {
          id: "mykn.components.DatePicker.labelDisabledDayPrefix",
          description: "mykn.components.DatePicker: The disabled day prefix",
          defaultMessage: "Uitgeschakelde dag",
        },
        context,
      );

  const _labelMonthPrefix = labelMonthPrefix
    ? formatMessage(labelMonthPrefix, context)
    : intl.formatMessage(
        {
          id: "mykn.components.DatePicker.labelMonthPrefix",
          description: "mykn.components.DatePicker: The month prefix",
          defaultMessage: "maand ",
        },
        context,
      );

  const _labelWeekPrefix = labelWeekPrefix
    ? formatMessage(labelWeekPrefix, context)
    : intl.formatMessage(
        {
          id: "mykn.components.DatePicker.labelWeekPrefix",
          description: "mykn.components.DatePicker: The week prefix",
          defaultMessage: "week ",
        },
        context,
      );

  const _labelTimeInput = labelTimeInput
    ? formatMessage(labelTimeInput, context)
    : intl.formatMessage(
        {
          id: "mykn.components.DatePicker.labelTimeInput",
          description: "mykn.components.DatePicker: The time input label",
          defaultMessage: "Kies tijd: ",
        },
        context,
      );

  const _labelWeek = labelWeek
    ? formatMessage(labelWeek, context)
    : intl.formatMessage(
        {
          id: "mykn.components.DatePicker.labelWeek",
          description: "mykn.components.DatePicker: The week label",
          defaultMessage: "Week",
        },
        context,
      );

  return (
    <>
      <input
        ref={fakeInputRef}
        name={name}
        hidden
        defaultValue={value2string(valueState)}
        form={form}
        data-mykn-type={type === "daterangepicker" ? "daterange" : "date"}
      />
      {/* @ts-expect-error - https://github.com/Hacker0x01/react-datepicker/issues/5391. */}
      <ReactDatePicker
        className={clsx("mykn-datepicker", "mykn-input", {
          "mykn-input--pad-h": pad === true || pad === "h",
          "mykn-input--pad-v": pad === true || pad === "v",
        })}
        isClearable={!required}
        locale={locale}
        placeholderText={placeholder}
        selected={date}
        selectsRange={type === "daterangepicker" || undefined}
        startDate={dateRange[0]}
        endDate={dateRange[1]}
        showYearDropdown
        nextYearAriaLabel={_labelNextYear}
        nextYearButtonLabel={_labelNextYear}
        previousYearAriaLabel={_labelPreviousYear}
        previousYearButtonLabel={_labelPreviousYear}
        nextMonthAriaLabel={_labelNextMonth}
        nextMonthButtonLabel={_labelNextMonth}
        previousMonthAriaLabel={_labelPreviousMonth}
        previousMonthButtonLabel={_labelPreviousMonth}
        ariaLabelClose={_labelClose}
        chooseDayAriaLabelPrefix={_labelChooseDayPrefix}
        disabledDayAriaLabelPrefix={_labelDisabledDayPrefix}
        monthAriaLabelPrefix={_labelMonthPrefix}
        weekAriaLabelPrefix={_labelWeekPrefix}
        timeInputLabel={_labelTimeInput}
        weekLabel={_labelWeek}
        onChange={handleChange}
        {...props}
      />
    </>
  );
};
