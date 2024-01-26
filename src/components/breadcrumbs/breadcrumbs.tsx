import React from "react";

import { Outline } from "../icon";
import { A } from "../typography";
import { Li } from "../typography/li";
import { Ol } from "../typography/ol";
import "./breadcrumbs.scss";

export type BreadcrumbItem = {
  /** The label of the item. */
  label: string;

  /** The path of the item. */
  path: string;
};

export type BreadcrumbsProps = {
  /** The path */
  pathItems: BreadcrumbItem[];

  /** Optional onClick handler, gets called when the item is clicked. */
  onClick?: (path: string) => void;
};

/**
 * Breadcrumbs component
 * @param pathItems the path items to display
 * @param onClick the onClick handler that will be called when the item is clicked
 * @param props the Toolbar props
 * @constructor
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  pathItems,
  onClick,
  ...props
}) => {
  return (
    <nav className="mykn-breadcrumbs" {...props}>
      <Ol inline listStyle="none">
        {pathItems.map((item, index) => {
          const isLastItem = index === pathItems.length - 1;

          return (
            <Li key={item.path} size="xs">
              <A
                href={item.path}
                muted={!isLastItem}
                textDecoration="none"
                onClick={() => onClick?.(item.path)}
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
