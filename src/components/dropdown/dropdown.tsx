import {
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  Side,
  arrow,
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
import React, { useCallback, useEffect, useRef, useState } from "react";

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

  /** The items shown inside the dropdown. */
  items?: ToolbarProps["items"];

  /** Whether to render the dropdown content as Toolbar. */
  toolbar: boolean;

  /** Any additional props to pass to the toolbar. */
  toolbarProps?: Omit<ToolbarProps, "items">;
  // toolbarProps?: unknown;
};

type TOOLBAR_MODULE_STUB = {
  Toolbar: React.FC<ToolbarProps>;
  ToolbarProps: ToolbarProps;
  ToolbarSpacer: () => unknown;
};

/**
 * Dropdown component, behaves much like a button except it's label should be
 * passed using the `label` prop. `Children` should be a `Toolbar` component containing
 * the individual items.
 * @param children
 * @param className
 * @param hover
 * @param label
 * @param open
 * @param placement
 * @param props
 * @constructor
 */
export const Dropdown: React.FC<DropdownProps> = ({
  children,
  className,
  activateOnHover = false,
  label,
  open = false,
  placement = "bottom",
  items,
  toolbar = true,
  toolbarProps,
  ...props
}) => {
  const arrowRef = useRef(null);

  // FIXME: Experimental approach for avoiding circular dependency.
  const [toolbarModuleState, setToolbarModuleState] =
    useState<TOOLBAR_MODULE_STUB | null>(null);

  useEffect(() => {
    if (!toolbarModuleState) {
      import("../toolbar/toolbar").then((toolbarModule) =>
        setToolbarModuleState(toolbarModule as TOOLBAR_MODULE_STUB),
      );
    }
  }, [toolbar]);

  const [isOpen, setIsOpen] = useState(false);

  /**
   * Sync isOpen with open prop.
   */
  useEffect(() => setIsOpen(open), [open]);

  /**
   * Initialize Floating UI.
   */
  const { refs, floatingStyles, middlewareData, context } = useFloating({
    middleware: [
      offset(6),
      flip(),
      arrow({ element: arrowRef }),
      shift({ padding: 0 }),
    ],
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

  const isToolbarModuleLoaded = (
    toolbarModuleState: TOOLBAR_MODULE_STUB | null,
  ): toolbarModuleState is TOOLBAR_MODULE_STUB => Boolean(toolbarModuleState);

  /**
   * Renders the dropdown content.
   */
  const renderContent = useCallback(() => {
    if (toolbar && isToolbarModuleLoaded(toolbarModuleState)) {
      return (
        <toolbarModuleState.Toolbar
          align="start"
          direction="vertical"
          items={items}
          {...toolbarProps}
        >
          {children}
        </toolbarModuleState.Toolbar>
      );
    }
    return children;
  }, [toolbar, toolbarModuleState, items, toolbarProps, children]);

  return (
    <div
      className={clsx(
        "mykn-dropdown",
        { "mykn-dropdown--open": isOpen },
        className,
      )}
    >
      <Button ref={refs.setReference} {...getReferenceProps()} {...props}>
        {label}
      </Button>
      <FloatingArrow
        ref={arrowRef}
        className="mykn-dropdown__arrow"
        context={context}
        fill="none"
        stroke="var(--page-color-primary)"
        strokeWidth={0.1}
        style={{
          [context.placement]:
            context.placement === "top"
              ? 1
              : -1 * (middlewareData.offset?.y ?? 0) + -3 + "px",
        }}
      />
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              className={clsx(
                "mykn-dropdown__dropdown",
                className && className.trim() + "__dropdown",
              )}
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              {renderContent()}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
};
