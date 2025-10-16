import { Temporal } from "@js-temporal/polyfill";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { gettextFirst } from "../../../lib";
import { eventFactory } from "../eventFactory";
import { Input, InputProps } from "../input";
import { Label } from "../label";
import "./durationinput.scss";
import { TRANSLATIONS } from "./durationinput.translations";
import { DurationMode, formatByMode, parseByMode } from "./parsers";

export type DurationNoTime = Pick<
  Temporal.DurationLike,
  "years" | "months" | "days" | "weeks"
>;

export type DurationInputProps = {
  /** Which ISO flavor to use for parsing and formatting. Default "designator" */
  mode?: DurationMode;

  /** ISO 8601 duration value for the chosen mode. Empty or null renders zeros */
  value?: string;

  /* Render this if it's "duration" */
  type?: "duration";

  /** Gets called when the value is changed. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;

  /** Component title attribute */
  label?: string;

  /** The id, is set: passed to the first input. */
  id?: string;

  /** The name. */
  name?: string;

  /** The associated form's id. */
  form?: string;

  /** Whether a value is required. */
  required?: boolean;

  /** Disabled state. */
  disabled?: boolean;

  /* Additional props are passed to the input fields */
  inputProps?: InputProps;

  /** Optional label overrides for individual fields */
  labelOverrides?: Partial<Record<keyof DurationNoTime, string>>;

  /** Optional placeholder overrides for individual fields */
  placeholderOverrides?: Partial<Record<keyof DurationNoTime, string>>;
};

type Key = keyof DurationNoTime;

type FieldSpec = {
  key: Key;
  label: string;
  placeholder: string;
  section: string;
};

const digitsOnly = (s: string): string => s.replace(/[^\d]/g, "");
const toPosInt = (s: string): number =>
  s ? Math.max(0, Math.trunc(Number(s))) : 0;

/**
 * A segmented input for ISO 8601 **duration** values that emits a normalized ISO string.
 * Renders three small numeric fields (Y/M/D) in "designator" mode, or a single numeric field in "weeks" mode.
 *
 * TODO: Replace with native Temporal.Duration parsing and formatting once widely supported.
 * This component adheres to the ISO 8601-1 “Duration” specification.
 * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Duration
 * Spec proposal: https://tc39.es/proposal-temporal/docs/duration.html
 *
 * Supported ISO 8601 duration flavors (date-only; no time components):
 *
 * - **Designator** (`PnYnMnD`): uses explicit unit letters, e.g. `P3Y6M4D` or `P14D`.
 *   Weeks values (e.g. `P2W`) are internally converted to days (`P14D`).
 * - **Weeks** (`PnW`): week-only shorthand, e.g. `P2W`. Cannot be combined with Y/M/D units.
 */
export const DurationInput: React.FC<DurationInputProps> = ({
  id,
  name,
  form,
  required,
  disabled = false,
  label = "Duration",
  mode = "designator",
  value,
  onChange,
  inputProps,
  labelOverrides,
  placeholderOverrides,
  ...rest
}) => {
  const hiddenRef = useRef<HTMLInputElement>(null);

  const parts = useMemo(() => parseByMode(mode, value), [mode, value]);

  // keep hidden input normalized
  useEffect(() => {
    const normalized = formatByMode(mode, parts);
    if ((value ?? "") !== normalized) {
      dispatchChange(normalized);
    }
  }, [mode, parts]);

  const dispatchChange = useCallback(
    (iso: string) => {
      const input = hiddenRef.current;
      if (!input) return;
      input.value = iso;
      const event = eventFactory("change", iso, true, false, false);
      setTimeout(() => {
        input.dispatchEvent(event);
        onChange?.(event as unknown as React.ChangeEvent<HTMLInputElement>);
      }, 0);
    },
    [onChange],
  );

  const update = useCallback(
    (patch: Partial<DurationNoTime>) => {
      const next = { ...parts, ...patch };
      if (mode === "weeks") {
        next.years = 0;
        next.months = 0;
        next.days = 0;
      } else {
        next.weeks = 0;
      }
      dispatchChange(formatByMode(mode, next));
    },
    [parts, mode, dispatchChange],
  );

  const onField = (key: Key) => (e: React.ChangeEvent<HTMLInputElement>) =>
    update({ [key]: toPosInt(digitsOnly(e.target.value)) });

  const fields: FieldSpec[] =
    mode === "designator"
      ? [
          {
            key: "years",
            label: gettextFirst(
              labelOverrides?.years,
              TRANSLATIONS.LABEL_YEARS,
            ),
            placeholder: gettextFirst(
              placeholderOverrides?.years,
              TRANSLATIONS.PLACEHOLDER_YEARS,
            ),
            section: "YY",
          },
          {
            key: "months",
            label: gettextFirst(
              labelOverrides?.months,
              TRANSLATIONS.LABEL_MONTHS,
            ),
            placeholder: gettextFirst(
              placeholderOverrides?.months,
              TRANSLATIONS.PLACEHOLDER_MONTHS,
            ),
            section: "MM",
          },
          {
            key: "days",
            label: gettextFirst(labelOverrides?.days, TRANSLATIONS.LABEL_DAYS),
            placeholder: gettextFirst(
              placeholderOverrides?.days,
              TRANSLATIONS.PLACEHOLDER_DAYS,
            ),
            section: "DD",
          },
        ]
      : [
          {
            key: "weeks",
            label: gettextFirst(
              labelOverrides?.weeks,
              TRANSLATIONS.LABEL_WEEKS,
            ),
            placeholder: gettextFirst(
              placeholderOverrides?.weeks,
              TRANSLATIONS.PLACEHOLDER_WEEKS,
            ),
            section: "WW",
          },
        ];

  return (
    <div className="mykn-durationinput" title={label} {...rest}>
      <input
        ref={hiddenRef}
        className="mykn-durationinput__input"
        aria-hidden="true"
        type="text"
        readOnly
        required={required}
        disabled={disabled}
        id={id}
        name={name}
        form={form}
        value={typeof value === "string" ? value : ""}
      />

      <div className="mykn-durationinput__fields">
        {fields.map(({ key, label: fieldLabel, placeholder, section }) => {
          const inputId = `${id || name || "duration"}-${section}`;
          return (
            <div className="mykn-durationinput__field" key={String(key)}>
              <Label htmlFor={inputId}>{fieldLabel}</Label>
              <Input
                id={inputId}
                aria-label={placeholder}
                placeholder={placeholder}
                {...inputProps}
                form={form}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={String(parts[key] || "")}
                onChange={onField(key)}
                disabled={disabled}
                data-section={section}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
