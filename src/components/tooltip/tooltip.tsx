import {
  FloatingArrow,
  Placement,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";
import clsx from "clsx";
import React, { ReactNode, useRef, useState } from "react";

import { P } from "../typography";
import "./tooltip.scss";

type TooltipProps = React.PropsWithChildren<{
  /* The content to display in the tooltip */
  content?: ReactNode;

  /* The placement of the tooltip */
  placement?: Placement;

  /* The size of the tooltip, defaults to md */
  size?: "sm" | "md" | "lg";

  /* Option to keep the tooltip open when hovering over it */
  keepOpenOnHover?: boolean;
}>;

export const Tooltip = ({
  content,
  children,
  placement,
  size = "md",
  keepOpenOnHover = false,
}: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const {
    refs: { setReference, setFloating },
    floatingStyles,
    context,
  } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    middleware: [
      offset(12),
      flip(),
      shift(),
      arrow({
        element: arrowRef,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const { styles: transitionStyles } = useTransitionStyles(context, {
    initial: {
      opacity: 0,
      transform: "scale(0.8)",
    },
  });

  // Handle mouse events only on the trigger element
  const handleTriggerMouseEnter = () => {
    setIsOpen(true);
  };

  const handleTriggerMouseLeave = () => {
    if (!keepOpenOnHover) {
      setIsOpen(false);
    }
  };

  // Handle mouse events on the tooltip content
  const handleTooltipMouseEnter = () => {
    if (keepOpenOnHover) {
      setIsOpen(true);
    }
  };

  const handleTooltipMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement, {
        ...getReferenceProps(),
        ref: setReference,
        onMouseEnter: handleTriggerMouseEnter,
        onMouseLeave: handleTriggerMouseLeave,
      })}
      <div
        ref={setFloating}
        style={{ ...floatingStyles, zIndex: 1 }}
        {...getFloatingProps({
          className: clsx("mykn-tooltip", {
            "mykn-tooltip--open": isOpen,
          }),
          onMouseEnter: handleTooltipMouseEnter,
          onMouseLeave: handleTooltipMouseLeave,
        })}
      >
        <div
          style={transitionStyles}
          className={clsx("mykn-tooltip__content", {
            "mykn-tooltip__content--sm": size === "sm",
            "mykn-tooltip__content--md": size === "md",
            "mykn-tooltip__content--lg": size === "lg",
          })}
        >
          <FloatingArrow
            ref={arrowRef}
            context={context}
            className="mykn-tooltip__arrow"
          />
          {React.isValidElement(content) ? content : <P size="xs">{content}</P>}
        </div>
      </div>
    </>
  );
};
