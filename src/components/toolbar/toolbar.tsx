import { deprecated } from "@maykin-ui/client-common";
import clsx from "clsx";
import React from "react";

import { isFormControl } from "../../lib";
import { Accordion, AccordionProps } from "../accordion";
import { Button, ButtonLink, ButtonLinkProps, ButtonProps } from "../button";
import { Dropdown, DropdownProps } from "../dropdown";
import { FormControl, FormControlProps } from "../form";
import { A, AProps } from "../typography";
import "./toolbar.scss";

const toolbarItemComponentMap = {
  accordion: {} as AccordionProps,
  anchor: {} as AProps,
  button: {} as ButtonProps,
  buttonLink: {} as ButtonLinkProps,
  dropdown: {} as DropdownProps,
  formControl: {} as FormControlProps,
};

type ToolbarItemComponents = typeof toolbarItemComponentMap;
type ToolbarItemComponentType = keyof ToolbarItemComponents;

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

export type ToolbarItem = ToolbarItemComponent | "spacer" | React.ReactNode;

export type ToolbarProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLElement>
> & {
  /** Aligns the contents based on the current direction. */
  align?: "start" | "center" | "end" | "space-between";

  /** The position of `children` compared to `items`. */
  childrenPosition?: "before" | "after";

  /** Can be used to extend the className. */
  className?: string;

  /** Whether the toolbar shows items horizontally or vertically, mobile devices always use vertical. */
  direction?: "h" | "v" | "horizontal" | "vertical"; // TODO: deprecate horizontal and vertical

  /** Whether the direction is responsive. */
  directionResponsive?: boolean;

  /** When set to true, gap between items is removed. */
  compact?: boolean;

  /** Whether to stretch this component. */
  justify?: "h" | "v" | boolean;

  /** Whether to apply padding to the toolbar. */
  pad?: "v" | "h" | boolean;

  /** The size of the padding. */
  padSize?: "s" | "xs";

  /** When set to true, padding is applied to A components to match Button component's height. */
  padA?: boolean;

  /** Can be set to `fit-content` to apply auto sizing based on content width. */
  size?: "fit-content";

  /** When set tot true, toolbar will be positioned using display: sticky. */
  sticky?: false | "top" | "bottom";

  /** The variant (style) of the toolbar. */
  variant?: "normal" | "primary" | "accent" | "alt" | "transparent";

  /** The items shown inside the toolbar, alternatively, can opt to use children instead. */
  items?: ToolbarItem[];

  /**
   * Allows default props of items to be partially overridden based on the component type, this improves the styling
   * of certain components when rendered in a Toolbar.
   */
  overrideItemProps?: boolean;
};

/**
 * A flexible and customizable toolbar component for arranging and aligning
 * various interactive elements such as `A`, `Button`, `ButtonLink` and `Dropdown`.
 */
export function Toolbar({
  children,
  childrenPosition = "after",
  className,
  align = "start",
  compact = false,
  direction: _direction = "h",
  directionResponsive = true,
  justify = "h",
  pad = "v",
  padA = false,
  padSize = "s",
  size = undefined,
  sticky = false,
  variant = "normal",
  items = [],
  overrideItemProps = true,
  ...props
}: ToolbarProps) {
  // TODO: Deprecate "horizontal" and "vertical" (use "h" and "v" instead).
  const direction =
    _direction.toLowerCase() === "h"
      ? "horizontal"
      : _direction.toLowerCase() === "v"
        ? "vertical"
        : (_direction as "horizontal" | "vertical");

  type ToolbarItemProps = Exclude<ToolbarItemComponent, "componentType">;

  /**
   * Returns the React.FC and default props to apply to it for the item based on
   * its shape.
   * @param item
   */
  const getItemComponent = (
    item: ToolbarItem,
  ): [React.ComponentType, Partial<ToolbarItemProps>] => {
    if (item === "spacer") {
      return [ToolbarSpacer, {}];
    }

    if (React.isValidElement(item)) {
      return [() => item, {}];
    }

    let type: ToolbarItemComponentType | undefined;
    if (isToolbarItemComponent(item)) type = item.componentType;

    if (!type) {
      // From version 4.0, items should have a componentType property.
      // For backward compatibility reasons, we still allow the 'old' way of identifying
      // the component type.

      if (isA(item)) type = "anchor";
      else if (isButton(item)) type = "button";
      else if (isButtonLink(item)) type = "buttonLink";
      else if (isDropdown(item)) type = "dropdown";
      else if (isFormControl(item)) type = "formControl";

      let deprecatedAlternative =
        "mykn.components.toolbar: items should have a componentType property";
      if (type !== undefined) {
        deprecatedAlternative += `, add componentType='${type}' to your item`;
      }

      deprecated(
        true,
        "items.componentType=undefined",
        deprecatedAlternative,
        "4.0",
      );
    }

    if (type) {
      switch (type) {
        case "accordion": {
          const itemProps: Partial<ToolbarItemComponents[typeof type]> =
            overrideItemProps
              ? {
                  size: direction === "horizontal" ? "xs" : undefined,
                  variant: "transparent",
                }
              : {};
          return [Accordion, itemProps];
        }

        case "anchor": {
          const itemProps: Partial<ToolbarItemComponents[typeof type]> =
            overrideItemProps
              ? {
                  size: direction === "horizontal" ? "xs" : undefined,
                }
              : {};
          return [A, itemProps];
        }

        case "button": {
          const itemProps: Partial<ToolbarItemComponents[typeof type]> =
            overrideItemProps
              ? {
                  size: direction === "horizontal" ? "xs" : undefined,
                  variant: "transparent",
                }
              : {};
          return [Button, itemProps];
        }

        case "buttonLink": {
          const itemProps: Partial<ToolbarItemComponents[typeof type]> =
            overrideItemProps
              ? {
                  size: direction === "horizontal" ? "xs" : undefined,
                  variant: "transparent",
                }
              : {};
          return [ButtonLink, itemProps];
        }

        case "dropdown": {
          const itemProps: Partial<ToolbarItemComponents[typeof type]> =
            overrideItemProps
              ? {
                  size: direction === "horizontal" ? "xs" : undefined,
                  variant: "transparent",
                }
              : {};
          return [Dropdown as React.FC, itemProps];
        }

        case "formControl": {
          const itemProps: Partial<ToolbarItemComponents[typeof type]> =
            overrideItemProps
              ? {
                  size: direction === "horizontal" ? "xs" : undefined,
                  variant: "transparent",
                }
              : {};
          return [FormControl, itemProps];
        }
      }
    }

    throw new Error("Unknown toolbar item type!");
  };

  const toolbarItemComponentTypes = Object.keys(
    toolbarItemComponentMap,
  ) as ToolbarItemComponentType[];

  /**
   * Checks if the item is a ToolbarItemComponent with a valid componentType property.
   * @param item
   */
  const isToolbarItemComponent = (
    item: unknown,
  ): item is ToolbarItemComponent =>
    item != null &&
    typeof item === "object" &&
    "componentType" in item &&
    toolbarItemComponentTypes.includes(
      item.componentType as ToolbarItemComponentType,
    );

  /**
   * @deprecated REMOVE in 4.0 - items should have a componentType property,
   * and be automatically picked up by isToolbarItemComponent.
   * @param item
   */
  const isA = (item: unknown): item is AProps =>
    Object.hasOwn(Object(item), "textDecoration");

  /**
   * @deprecated REMOVE in 4.0 - items should have a componentType property,
   * and be automatically picked up by isToolbarItemComponent.
   * @param item
   */
  const isButton = (item: unknown): item is ButtonProps =>
    !Object.hasOwn(Object(item), "href") &&
    Object.hasOwn(Object(item), "children"); // Does button always have children?

  /**
   * @deprecated REMOVE in 4.0 - items should have a componentType property,
   * and be automatically picked up by isToolbarItemComponent.
   * @param item
   */
  const isButtonLink = (item: unknown): item is ButtonLinkProps =>
    Object.hasOwn(Object(item), "href");

  /**
   * @deprecated REMOVE in 4.0 - items should have a componentType property,
   * and be automatically picked up by isToolbarItemComponent.
   * @param item
   */
  const isDropdown = (item: unknown): item is DropdownProps =>
    Object.hasOwn(Object(item), "items"); // Mandatory on Dropdown if passed to toolbar items.

  /**
   * Renders an item (in items).
   * @param item
   * @param index
   */
  const renderItem = (item: ToolbarItem, index: number) => {
    const props = React.isValidElement(item)
      ? {}
      : (item as Exclude<ToolbarItem, React.ReactNode>);
    const [Component, defaultProps] = getItemComponent(item);
    return (
      <Component
        key={index}
        {...defaultProps}
        {...(props as object)}
      ></Component>
    );
  };

  return (
    <nav
      className={clsx(
        "mykn-toolbar",
        `mykn-toolbar--align-${align}`,
        `mykn-toolbar--direction-${direction}`,
        `mykn-toolbar--variant-${variant}`,
        {
          "mykn-toolbar--compact": compact,
          "mykn-toolbar--direction-responsive": directionResponsive,
          "mykn-toolbar--justify-h": justify === "h",
          "mykn-toolbar--justify-v": justify === "v",
          "mykn-toolbar--pad-h": pad === true || pad === "h",
          "mykn-toolbar--pad-v": pad === true || pad === "v",
          "mykn-toolbar--pad-a": padA,
          [`mykn-toolbar--pad-size-${padSize}`]: padSize,
          [`mykn-toolbar--size-${size}`]: size,
          [`mykn-toolbar--sticky-${sticky}`]: sticky,
        },
        className,
      )}
      role="toolbar"
      {...props}
    >
      {childrenPosition === "before" && children}
      {items.filter((v) => v).map(renderItem)}
      {childrenPosition === "after" && children}
    </nav>
  );
}

/**
 * Toolbar "spacer" separates items in a toolbar.
 */
export const ToolbarSpacer = () => <div className="mykn-toolbar__spacer"></div>;
