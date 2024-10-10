import React, { useCallback, useEffect, useRef, useState } from "react";

import { date2DateString, useIntl, value2Date } from "../../../lib";
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
  const queuedValueState = useRef<string[]>();
  const intl = useIntl();

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
      .map(date2DateString);

    if (!dates?.length || (dates?.length && dates?.length < 2)) {
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
   * Gets called when the start date is changed.
   * @param event
   */
  const handleStartChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    handleChange(event, 0);
  };

  /**
   * Gets called when the end date is changed.
   * @param event
   */
  const handleEndChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    handleChange(event, 1);
  };

  /**
   * Gets called when any of the dates is changed.
   * @param event
   * @param index The index of the date input (0: start, 1: end).
   */
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      event?.preventDefault();
      event?.stopPropagation();

      const flippedIndex = index ? 0 : 1;
      const _values = queuedValueState.current || [];
      const value = event.target.value;

      const newValues = new Array(2);
      newValues[index] = value;
      newValues[flippedIndex] = _values[flippedIndex] || value;
      queuedValueState.current = newValues;
    },
    [queuedValueState.current],
  );

  /**
   * Gets called when a blur event is received.
   * @param event
   * @param index The index of the date input (0: start, 1: end).
   */
  const handleBlur = useCallback<React.FocusEventHandler<HTMLInputElement>>(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const { currentTarget, relatedTarget } = e;
      if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
        const newValuesState = normalizeValuesState(queuedValueState.current);
        setValuesState(newValuesState);
        const newValue = newValuesState?.join("/") || "";
        dispatchEvent(newValue);
      }
    },
    [document.activeElement, valuesState, normalizeValuesState],
  );
  return (
    <div ref={nodeRef} className="mykn-daterangeinput" onBlur={handleBlur}>
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
        label={
          labelStartDate ||
          intl.formatMessage(TRANSLATIONS.LABEL_START_DATE, {})
        }
        value={valuesState?.[0]}
        onChange={handleStartChange}
      />
      {icon}
      <DateInput
        {...props}
        label={
          labelEndDate || intl.formatMessage(TRANSLATIONS.LABEL_END_DATE, {})
        }
        value={valuesState?.[1]}
        onChange={handleEndChange}
      />
    </div>
  );
};
