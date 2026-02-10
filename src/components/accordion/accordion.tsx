import clsx from "clsx";
import React, { useCallback, useEffect, useId } from "react";

import { Button, ButtonProps } from "../button";
import { Outline } from "../icon";
import { Toolbar, ToolbarItem, ToolbarProps } from "../toolbar";
import "./accordion.scss";

export type AccordionProps = ButtonProps & {
  items?: ToolbarItem[];

  /** Whether the accordion should be open. */
  open?: boolean;

  /** Gets called when the accordion is opened. */
  onOpen?: () => void;

  /** Gets called when the accordion is closed. */
  onClose?: () => void;

  /**
   * When set to true, the gap between the accordion button and toolbar,
   * and the gap between the toolbar items, is removed.
   */
  compact?: boolean;

  /** Toolbar props. */
  toolbarProps?: ToolbarProps;
};

export const Accordion: React.FC<AccordionProps> = ({
  items,
  open = false,
  onOpen,
  onClose,
  children,
  compact = false,
  toolbarProps,
  ...buttonProps
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const id = useId();
  const accordionTriggerId = `${id}-accordion-trigger`;
  const accordionItemsId = `${id}-accordion-items`;

  /**
   * Sync isOpen with open prop.
   */
  useEffect(() => setIsOpen(open), [open]);

  /**
   * Gets called when the accordion trigger is clicked.
   */
  const handleOpenChange = useCallback(
    (newOpenState: boolean) => {
      setIsOpen(newOpenState);

      if (newOpenState) {
        onOpen?.();
      } else {
        onClose?.();
      }
    },
    [onOpen, onClose],
  );

  return (
    <div
      className={clsx("mykn-accordion", { "mykn-accordion--compact": compact })}
    >
      <Button
        {...buttonProps}
        id={accordionTriggerId}
        aria-expanded={isOpen}
        aria-controls={accordionItemsId}
        justify
        onClick={() => handleOpenChange(!isOpen)}
      >
        {children}
        <span className="mykn-accordion__trigger-icon" aria-hidden="true">
          {isOpen ? <Outline.ChevronUpIcon /> : <Outline.ChevronDownIcon />}
        </span>
      </Button>

      <div
        id={accordionItemsId}
        role="region"
        aria-labelledby={accordionTriggerId}
        aria-hidden={!isOpen}
        hidden={!isOpen}
      >
        <Toolbar
          className="mykn-accordion__items"
          direction="v"
          compact={compact}
          pad={false}
          align="start"
          items={items}
          {...toolbarProps}
        />
      </div>
    </div>
  );
};
