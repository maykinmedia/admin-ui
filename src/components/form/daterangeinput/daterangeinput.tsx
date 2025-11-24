import { invariant } from "@maykin-ui/client-common";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { date2DateString, gettextFirst, value2Date } from "../../../lib";
import { Outline } from "../../icon/icon";
import { DateInput, DateInputProps } from "../dateinput";
import { eventFactory } from "../eventFactory";
import "./daterangeinput.scss";
import { TRANSLATIONS } from "./daterangeinput.translations";

export type DateRangeInputProps = Omit<DateInputProps, "type" | "value"> & {
  /** Component to use as icon. */
  icon?: React.ReactNode;

  /** Whether a date or date range should be provided. */
  type?: "daterange";

  /** (Date range) string. */
  value?: string;

  /** The start date (accessible) label */
  labelStartDate?: string;

  /** The end date (accessible) label */
  labelEndDate?: string;
};

/**
 * DateRangeInput component, can be used to type a daterange using separated inputs.
 */
export const DateRangeInput: React.FC<DateRangeInputProps> = ({
  form,
  icon = <Outline.CodeBracketSquareIcon />,
  labelStartDate,
  labelEndDate,
  name,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type,
  value = null,
  onChange,
  ...props
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const fakeInputRef = useRef<HTMLInputElement>(null);
  const [valuesState, setValuesState] = useState<string[]>();

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

  // Intercept the child events on DOM level using listener.
  useEffect(() => {
    const fn: EventListener = (e) => {
      const target = e.target as HTMLElement;
      if (!target.className.includes("mykn-daterangeinput")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    nodeRef.current?.addEventListener("change", fn);
    return () => nodeRef.current?.removeEventListener("change", fn);
  }, [nodeRef.current]);

  // Update valueState.
  useEffect(() => {
    const values = typeof value === "string" ? value.split("/") : value;

    const dates = values
      ?.map(value2Date)
      .filter((v): v is Date => Boolean(v))
      .map((date) => date2DateString(date));

    if (!dates?.length || (dates?.length && dates?.length < 2)) {
      setValuesState(undefined);
      return;
    }

    setValuesState(dates);
  }, [value]);

  /**
   * Normalizes value state, making sure that end date is later than startDate.
   * @param valuesState
   */
  const normalizeValuesState = useCallback((values?: string[]) => {
    if (!values?.some((v) => v)) {
      return;
    }

    const [startDate, endDate] = values
      .map(value2Date)
      .filter((v): v is Date => Boolean(v));

    if (startDate > endDate) {
      return [date2DateString(endDate), date2DateString(startDate)];
    }
    return values;
  }, []);

  /**
   * Gets called when any of the dates is changed.
   * @param event
   * @param index The index of the date input (0: start, 1: end).
   */
  const handleChange = useCallback(() => {
    // Get the raw date values.
    const node = nodeRef.current;
    const hiddenDates = node?.querySelectorAll<HTMLInputElement>(
      '[type="date"]:not([name])',
    );
    invariant(hiddenDates, "Unable to identify date fields!");
    invariant(hiddenDates.length == 2, "hiddenDates.length must be 2!");

    // Parse/validate the dates.
    const arrStrDates = [...hiddenDates].map((input) => input.value);
    const arrStrDatesChecked = normalizeValuesState(arrStrDates)
      ?.map(value2Date)
      .filter((v): v is Date => Boolean(v))
      .map((date) => date2DateString(date));

    // Format the output string.
    const strDates =
      arrStrDatesChecked && arrStrDatesChecked.length === 2
        ? arrStrDatesChecked.join("/")
        : "";

    // Dispatch event.
    dispatchEvent(strDates);
  }, []);

  return (
    <div ref={nodeRef} className="mykn-daterangeinput">
      <input
        ref={fakeInputRef}
        className="mykn-daterangeinput__input"
        aria-hidden={true}
        form={form}
        readOnly
        type="text"
        data-mykn-type="daterange"
        name={name}
        value={valuesState?.join("/") || ""}
        onChange={() => []}
      />
      <DateInput
        {...props}
        label={gettextFirst(labelStartDate, TRANSLATIONS.LABEL_START_DATE)}
        value={valuesState?.[0]}
        onChange={handleChange}
      />
      {icon}
      <DateInput
        {...props}
        label={gettextFirst(labelEndDate, TRANSLATIONS.LABEL_END_DATE)}
        value={valuesState?.[1]}
        onChange={handleChange}
      />
    </div>
  );
};
