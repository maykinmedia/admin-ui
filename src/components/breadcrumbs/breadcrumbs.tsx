import clsx from "clsx";
import React from "react";

import { Outline } from "../icon";
import { A } from "../typography";
import { Li } from "../typography/li";
import { Ol } from "../typography/ol";
import "./breadcrumbs.scss";

export type BreadcrumbItem = {
  /** The label of the item. */
  label: string;

  /** The href of the item. */
  href: string;
};

export type BreadcrumbsProps = {
  /** The href */
  items: BreadcrumbItem[];

  /** Whether to stretch this component. */
  justify?: "h" | boolean;

  /** Optional onClick handler, gets called when the item is clicked. */
  onClick?: (path: string) => void;
};

/**
 * Breadcrumbs component
 * @param pathItems the href items to display
 * @param onClick the onClick handler that will be called when the item is clicked
 * @param props the Toolbar props
 * @constructor
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  justify,
  onClick,
  ...props
}) => {
  return (
    <nav
      className={clsx("mykn-breadcrumbs", {
        "mykn-breadcrumbs--justify-h": justify === "h",
      })}
      {...props}
    >
      <Ol inline listStyle="none">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <Li key={item.href} size="xs">
              <A
                href={item.href}
                muted={!isLastItem}
                textDecoration="none"
                onClick={() => onClick?.(item.href)}
              >
                {item.label}
              </A>
              {!isLastItem && <Outline.ChevronRightIcon />}
            </Li>
          );
        })}
      </Ol>
    </nav>
  );
};
