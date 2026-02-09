import React from "react";

import type { AccordionProps } from "../accordion";
import type { ButtonLinkProps, ButtonProps } from "../button";
import type { DropdownProps } from "../dropdown";
import type { FormControlProps } from "../form";
import type { AProps } from "../typography";

/**
 * Mapping of toolbar item component types to their properties.
 */
const toolbarItemPropertiesMap = {
  accordion: {} as AccordionProps,
  anchor: {} as AProps,
  button: {} as ButtonProps,
  buttonLink: {} as ButtonLinkProps,
  dropdown: {} as DropdownProps,
  formControl: {} as FormControlProps,
};

export type ToolbarItemComponents = typeof toolbarItemPropertiesMap;
export type ToolbarItemComponentType = keyof ToolbarItemComponents;

export const toolbarItemComponentTypes = Object.keys(
  toolbarItemPropertiesMap,
) as ToolbarItemComponentType[];

/**
 * Type safe toolbar item components.
 *
 * Using the `componentType` property, TypeScript understands which properties are
 * available on the various components. This increases type safety and makes the toolbar
 * easier to use for developers.
 */
export type ToolbarItemComponent = {
  [K in ToolbarItemComponentType]: ToolbarItemComponents[K] & {
    /**
     * The type of the item, used to identify the component to render.
     *
     * @deprecated Optional for backwards compatibility. Will become required in 4.0.
     */
    componentType?: K;
  };
}[ToolbarItemComponentType];

/**
 * All types of items that can be used in a toolbar.
 */
export type ToolbarItem = ToolbarItemComponent | "spacer" | React.ReactNode;
