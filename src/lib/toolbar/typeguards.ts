import {
  AProps,
  ButtonLinkProps,
  ButtonProps,
  DropdownProps,
} from "../../components";

// TODO: Improve
export const isA = (item: unknown): item is AProps =>
  Object.hasOwn(Object(item), "textDecoration");

export const isButton = (item: unknown): item is ButtonProps =>
  !Object.hasOwn(Object(item), "href") &&
  Object.hasOwn(Object(item), "children"); // Does button always have children?

export const isButtonLink = (item: unknown): item is ButtonLinkProps =>
  Object.hasOwn(Object(item), "href");

export const isDropdown = (item: unknown): item is DropdownProps =>
  Object.hasOwn(Object(item), "items"); // Mandatory on Dropdown if passed to toolbar items.
