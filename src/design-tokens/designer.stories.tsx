import type { Meta, StoryObj } from "@storybook/react-vite";
import Color from "color";
import * as React from "react";
import { useState } from "react";

import { FIXTURE_PRODUCTS } from "../../.storybook/fixtures/products";
import {
  Badge,
  Body,
  Column,
  Form,
  Grid,
  Outline,
  Tab,
  Tabs,
  Toolbar,
} from "../components";
import PurpleRain from "../design-tokens/tokens/themes/purple-rain.json";
import { FormField, isPrimitive } from "../lib";
import { ListTemplate } from "../templates";

const meta: Meta<typeof ThemeDesigner> = {
  title: "Manual/Theme Designer",
  component: ThemeDesigner,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ThemeDesignerStory: Story = {
  name: "ThemeDesigner",
  args: {},
};

type ThemeDesignerFormType = Record<string, string>;

/**
 * The theme designer, allows generating theme code.
 */
function ThemeDesigner() {
  /**
   * Finds design tokens in `object` recursively.
   *
   * @param object - Object containing design tokens.
   * @param [path=""] - Internal: the path iterating on.
   * @param resultSet - Internal: the results.
   */
  const findRecursiveDesignTokens = (
    object: Record<string | number | symbol, unknown>,
    path: string = "",
    resultSet: Record<string, string> = {},
  ) => {
    const value = getByDotSeparatedPath(object, path);

    // This is not a proper design token as it does not contain a "value".
    // Return current `resultSet`.
    if (isPrimitive(value) || value === undefined) {
      return resultSet;
    }

    // This is a design token, return updated `resultSet`.
    if (Object.hasOwn(value, "value")) {
      const tokenPath = path.replaceAll(".", "-");
      const token = `--${tokenPath}`;
      const _value = (value as { value: string }).value;

      try {
        const color = Color(_value);
        resultSet[token] = color.hex();
      } catch (error) {
        resultSet[token] = _value;
      }
      return resultSet;
    }

    // This is a branch node, recurse further.
    for (const key of Object.keys(value)) {
      const newPath = path ? `${path}.${key}` : key;
      resultSet = findRecursiveDesignTokens(object, newPath, resultSet);
    }

    return resultSet;
  };

  const referenceValues = findRecursiveDesignTokens(PurpleRain, "theme");
  const [values, setValues] = useState<ThemeDesignerFormType>(referenceValues);

  const fields = Object.entries(referenceValues).map(([key]) => ({
    // direction: "h",
    justify: "stretch",
    name: key,
    label: key,
    value: Color(values[key]).hex(),
    type: "color",
  }));

  /**
   * Converts an object containing CSS properties and values into a serialized CSS string.
   *
   * @param {ThemeDesignerFormType} data - An object where keys represent CSS properties and values represent corresponding CSS values.
   * @return {string} A string representing the serialized CSS, with each property-value pair joined by a colon and space, and each pair separated by a newline character.
   */
  const serializeCSS = (data: ThemeDesignerFormType) =>
    Object.entries(data)
      .map((entry) => entry.join(": "))
      .join(";\n");

  /**
   * Serializes a ThemeDesignerFormType object into a nested JSON structure.
   *
   * @param {ThemeDesignerFormType} data - The input data object, where keys represent hierarchical paths separated by "--" or "-".
   * @return {Object} A nested JSON object reflecting the hierarchical structure implied by the input keys.
   */
  const serializeJSON = (data: ThemeDesignerFormType) => {
    type JSON = { [key: string | symbol]: string | JSON };
    const placeholder = Symbol();
    const result: JSON = {};

    for (const key in data) {
      const parts = key.replace("--", "").split("-");
      let current: JSON = result;

      parts.forEach((part, i) => {
        const isLast = i === parts.length - 1;

        if (isLast) {
          // Leaf node
          if (typeof current[part] === "object" && current[part] !== null) {
            (current[part] as JSON)[placeholder] = data[key];
          } else {
            current[part] = data[key];
          }
        } else {
          // Branch node
          if (typeof current[part] === "string") {
            // convert leaf node into object with default
            current[part] = { [placeholder]: current[part] };
          }

          current[part] ??= {};
          current = current[part] as JSON;
        }
      });
    }
    return result;
  };

  return (
    <>
      <style>
        :root &#123;
        {serializeCSS(values)}
        &#&#125;;
      </style>

      <Tabs>
        <Tab label="Designer">
          <Body>
            <Grid>
              <Column span={4}>
                <ThemeDesignerForm
                  title="Theme Designer"
                  fields={fields}
                  onValuesChange={setValues}
                />
              </Column>
              <Column span={8}>
                <Toolbar sticky="top">
                  <ThemeDesignerPreview />
                </Toolbar>
              </Column>
            </Grid>
          </Body>
        </Tab>

        <Tab label="CSS">
          <Body>
            <pre>{serializeCSS(values)}</pre>
          </Body>
        </Tab>
        <Tab label="JSON">
          <Body>
            <pre>{JSON.stringify(serializeJSON(values), null, 2)}</pre>
          </Body>
        </Tab>
      </Tabs>
    </>
  );
}

/**
 * The color picker form.
 * @param title
 * @param fields
 * @param onValuesChange
 */
function ThemeDesignerForm<T extends FormField & { name: string }>({
  title,
  fields,
  onValuesChange,
}: {
  title: string;
  fields: T[];
  onValuesChange: (values: ThemeDesignerFormType) => void;
}) {
  /**
   * Retrieves the contrast version of a given field, if applicable.
   *
   * @param {T} field - The field object being evaluated to determine its contrast equivalent.
   *                     The object must include a `name` property.
   * @returns {T|void} - Returns the contrast field object if found, or `void` if no match exists
   *                     or the field itself is a contrast field.
   */
  const getContrastField = (field: T): T | void => {
    const name = field.name;
    const states = ["default", "hover", "pressed", "active"];

    // This is the contrast field, cannot reverse into one of multiple state fields.
    if (field.name.includes("contrast")) {
      return;
    }

    // This is a state field, find the contrast field.
    const matchedState = states.find((state) => name.match(state));
    if (matchedState) {
      const contrastFieldName = name.replace(matchedState, "contrast");
      return fields.find((field) => field.name === contrastFieldName);
    }

    // This isa foreground field, find the background field.
    if (name.match("foreground")) {
      const contrastFieldName = name.replace(/foreground.*/, "background");
      return fields.find((field) => field.name === contrastFieldName);
    }
  };

  /**
   * Validates the input data from the Theme Designer form and checks for contrast ratio compliance.
   *
   * This function updates the state with the provided data, filters out entries related to contrast,
   * and iterates over the remaining entries to perform validation checks. If a contrast field exists
   * for a given field and the contrast ratio between the field's value and the contrast field's value
   * is below the threshold, an error message is added to the validation result for that field.
   *
   * @param {ThemeDesignerFormType} data - The form data object containing field names and values.
   * @returns {Object} An object representing validation errors, where each key is a field name and
   *                   its value is an array of error messages for the respective field.
   */
  const validate = (data: ThemeDesignerFormType) => {
    onValuesChange(data);
    const entries = Object.entries(data);
    const stateEntries = entries.filter(([k]) => !k.match("contrast"));

    return stateEntries.reduce((acc, [fieldName, value]) => {
      const field = fields.find((field) => field.name === fieldName);
      const contrastFieldName = field && getContrastField(field)?.name;
      const contrastValue = contrastFieldName && data[contrastFieldName];

      if (contrastValue && contrastRatio(value, contrastValue) < 4) {
        return {
          ...acc,
          [fieldName]: [`Contrast to low compared to ${contrastFieldName}!`],
        };
      }
      return acc;
    }, {});
  };

  /**
   * Calculates the (WCAG) contrast using the `color` library.
   * @param a - The first color.
   * @param b - The second color.
   */
  const contrastRatio = (a: string, b: string) => {
    const colorA = Color(a);
    const colorB = Color(b);
    return colorA.contrast(colorB);
  };

  return (
    <Form<ThemeDesignerFormType>
      title={title}
      fields={fields}
      showActions={false}
      showRequiredIndicator={false}
      showRequiredExplanation={false}
      // @ts-expect-error - fixme: Form and validate could use improvements.
      validate={validate}
      validateOnChange={true}
    />
  );
}

/**
 * Preview component.
 */
const ThemeDesignerPreview = () => (
  <ListTemplate
    breadcrumbItems={[
      { label: "Home", href: "/" },
      { label: "Templates", href: "#" },
      { label: "List template", href: "#" },
    ]}
    dataGridProps={{ objectList: FIXTURE_PRODUCTS }}
    primaryNavigationItems={[
      { children: <Outline.HomeIcon />, title: "Home" },
      "spacer",
      { children: <Outline.CogIcon />, title: "Instellingen" },
      { children: <Outline.ArrowRightOnRectangleIcon />, title: "Uitloggen" },
    ]}
    secondaryNavigationItems={[
      <Badge key="badge">In bewerking</Badge>,
      "spacer",
      {
        children: (
          <>
            <Outline.CloudArrowUpIcon />
            Tussentijds Opslaan
          </>
        ),
        pad: "h",
        variant: "transparent",
        wrap: false,
      },
      {
        children: (
          <>
            <Outline.CheckIcon />
            Opslaan en afsluiten
          </>
        ),
        pad: "h",
        variant: "primary",
        wrap: false,
      },
    ]}
    sidebarItems={[
      {
        active: true,
        align: "space-between",
        children: (
          <>
            Lorem ipsum<Badge variant="success">Verwerkt</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
      {
        align: "space-between",
        children: (
          <>
            Dolor<Badge variant="warning">In behandeling</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
      {
        align: "space-between",
        children: (
          <>
            Sit<Badge variant="danger">Actie vereist</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
      {
        align: "space-between",
        children: (
          <>
            Amet<Badge variant="warning">In behandeling</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
    ]}
  />
);

//
// TODO: These may be candidates for client common.
//

/**
 * Recursive type to infer the type at a dot-separated path
 */
type DotPathValue<T, P extends string> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? DotPathValue<T[Key], Rest>
    : Key extends `${number}`
      ? T extends Array<infer U>
        ? DotPathValue<U, Rest>
        : unknown
      : unknown
  : P extends keyof T
    ? T[P]
    : P extends `${number}`
      ? T extends Array<infer U>
        ? U
        : unknown
      : unknown;

/**
 * Get a nested value from an object using a dot-separated path.
 * Works for objects and arrays.
 */
function getByDotSeparatedPath<
  T extends Record<string, unknown> | unknown[],
  P extends string,
>(object: T, path: P): DotPathValue<T, P> | undefined {
  const parts = path.split(".");
  let obj: unknown = object;

  for (const part of parts) {
    if (obj === null || obj === undefined) return undefined;

    if (Array.isArray(obj)) {
      const index = Number(part);
      if (!Number.isInteger(index) || index < 0 || index >= obj.length) {
        return undefined;
      }
      obj = obj[index];
    } else if (typeof obj === "object") {
      if (!(part in obj)) return undefined;
      obj = (obj as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return obj as DotPathValue<T, P> | undefined;
}
