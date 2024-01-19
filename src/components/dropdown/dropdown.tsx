import {
  FloatingFocusManager,
  Side,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import clsx from "clsx";
import React, { useEffect, useState } from "react";

import { Button, ButtonProps } from "../button";
import { ToolbarProps } from "../toolbar";
import "./dropdown.scss";

export type DropdownProps = ButtonProps & {
  /** Button content. */
  label: React.ReactNode;

  /** If true, the dropdown is opened when hovered. */
  activateOnHover?: boolean;

  /** Preferred placement position. */
  placement?: Side;

  /** Whether the dropdown should be open. */
  open?: boolean;

  /** `Children` should be a `Toolbar` component containing the individual items. */
  children: React.ReactElement<ToolbarProps>;
};

/**
 * Dropdown component, behaves much like a button except it's label should be
 * passed using the `label` prop. `Children` should be a `Toolbar` component containing
 * the individual items.
 * @param children
 * @param hover
 * @param label
 * @param open
 * @param placement
 * @param props
 * @constructor
 */
export const Dropdown: React.FC<DropdownProps> = ({
  children,
  activateOnHover = false,
  label,
  open = false,
  placement = "bottom",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Sync isOpen with open prop.
   */
  useEffect(() => setIsOpen(open), [open]);

  /**
   * Initialize Floating UI.
   */
  const { refs, floatingStyles, context } = useFloating({
    middleware: [offset(6), flip(), shift({ padding: 20 })],
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: placement,
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
  });

  const focus = useFocus(context, {
    enabled: activateOnHover,
  });
  const hover = useHover(context, {
    enabled: activateOnHover,
    handleClose: safePolygon(),
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    focus,
    hover,
    dismiss,
    role,
  ]);

  return (
    <div className={clsx("mykn-dropdown", { "mykn-dropdown--open": isOpen })}>
      <Button ref={refs.setReference} {...getReferenceProps()} {...props}>
        {label}
      </Button>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className="mykn-dropdown__dropdown"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {children}
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
};