import React, { useId } from "react";

import { Button, ButtonProps } from "../button";
import { Outline } from "../icon";
import { Toolbar, ToolbarItem } from "../toolbar";
import "./accordion.scss";

export type AccordionProps = ButtonProps & {
  items?: ToolbarItem[];
};

export const Accordion: React.FC<AccordionProps> = ({
  items,
  children,
  ...buttonProps
}) => {
  const { active } = buttonProps || {};
  const [open, setOpen] = React.useState(active);

  const id = useId();
  const accordionTriggerId = `${id}-accordion-trigger`;
  const accordionItemsId = `${id}-accordion-items`;

  return (
    <div
      className="mykn-accordion"
      aria-expanded={open}
      id={accordionTriggerId}
      aria-controls={accordionItemsId}
    >
      <Button {...buttonProps} justify onClick={() => setOpen(!open)}>
        {children}
        <span className="mykn-accordion__trigger-icon" aria-hidden="true">
          {open ? <Outline.ChevronUpIcon /> : <Outline.ChevronDownIcon />}
        </span>
      </Button>

      <div
        id={accordionItemsId}
        role="region"
        aria-labelledby={accordionTriggerId}
        aria-hidden={!open}
        hidden={!open}
      >
        <Toolbar
          className="mykn-accordion__items"
          direction="v"
          compact
          pad={false}
          align="start"
          items={items}
        />
      </div>
    </div>
  );
};
