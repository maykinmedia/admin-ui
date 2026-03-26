import clsx from "clsx";
import React, { FC, HTMLAttributes, ReactNode, useId } from "react";

import { Button, ButtonLink, ButtonLinkProps, ButtonProps } from "../../button";
import { Body, H3, P } from "../../typography";
import { Paginator, PaginatorProps } from "../paginator";
import "./itemgrid.scss";

export type ItemGridProps = {
  /* The (flex) direction of the grid. */
  direction?: "row" | "column";
  /* Whether to truncate title/information lines with ellipsis. */
  ellipsis?: boolean;
  /* Whether to stretch to fill the parent's height, pushing the paginator to the bottom */
  fullHeight?: boolean;
  /* The items to display in the grid. */
  items: ItemGridItemProps[];
  /* Paginator props, when set renders a paginator */
  paginatorProps?: PaginatorProps;
};

/**
 * A grid of items, each consisting of an icon, title, information lines and an optional button.
 * The grid can be displayed in a row or column direction, and the information lines can be truncated
 * with ellipsis if desired.
 *
 * It is recommended to use `ellipsis: true` when you expect long titles or information lines
 *
 * @example
 * <ItemGrid
 *   direction="row"
 *   ellipsis
 *   items={[
 *     {
 *       icon: <MyIcon />,
 *       title: "Item 1",
 *       informationLines: ["Line 1", "Line 2"],
 *       buttonProps: { as: "button", onClick: () => alert("Clicked!") },
 *     },
 *     {
 *       icon: <MyIcon />,
 *       title: "Item 2",
 *       informationLines: ["Line 1", "Line 2"],
 *       buttonProps: { as: "a", href: "https://example.com" },
 *     },
 *   ]}
 * />
 */
export const ItemGrid: FC<ItemGridProps> = ({
  direction = "column",
  ellipsis = false,
  fullHeight = false,
  items,
  paginatorProps,
}) => (
  <div
    className={clsx("mykn-itemgrid__wrapper", {
      "mykn-itemgrid__wrapper--full-height": fullHeight,
    })}
  >
    <ul
      className={clsx("mykn-itemgrid", {
        "mykn-itemgrid--direction-row": direction === "row",
        "mykn-itemgrid__item--ellipsis": ellipsis,
      })}
    >
      {items.map((item, index) => (
        <li
          key={item.id ?? `${item.title}-${index}`}
          className="mykn-itemgrid__item-wrapper"
        >
          <ItemGridItem {...item} ellipsis={ellipsis} />
        </li>
      ))}
    </ul>
    {paginatorProps && (
      <div className="mykn-itemgrid__footer">
        <Paginator {...paginatorProps} />
      </div>
    )}
  </div>
);

export type ItemGridItemProps = {
  /* A stable key for the item */
  id?: string;
  /* The icon to display */
  icon: ReactNode;
  /* An accessible label for the icon. If not provided, the icon will be hidden from assistive technologies. */
  iconLabel?: string;
  /* Title string to display. */
  title: string;
  /* Information lines to display along with the title */
  informationLines?: ReactNode[];
  /* Whether to truncate title/information lines with ellipsis. */
  ellipsis?: boolean;
  /* Button props. If `as` is "button", a `<Button>` will be rendered. If `as` is "a", a `<ButtonLink>` will be rendered. */
  buttonProps?:
    | ({ as: "button" } & ButtonProps)
    | ({ as: "a" } & ButtonLinkProps);
};

export const ItemGridItem: FC<ItemGridItemProps> = ({
  id,
  icon,
  iconLabel,
  title,
  informationLines = [],
  ellipsis,
  buttonProps = { as: "button" },
}) => {
  const internalId = useId();
  const baseId = id ?? `${internalId}-item`;
  const infoId = `${baseId}-info`;
  const { as, ...rest } = buttonProps;

  const ariaDescribedBy = informationLines.length ? infoId : undefined;

  const iconProps: HTMLAttributes<HTMLDivElement> =
    iconLabel != null
      ? { role: "img", "aria-label": iconLabel }
      : { "aria-hidden": true };

  const content = (
    <Body className="mykn-itemgrid__item-body">
      <div className="mykn-itemgrid__item-icon" {...iconProps}>
        {icon}
      </div>
      <div className="mykn-itemgrid__item-content">
        <H3
          className="mykn-itemgrid__item-title"
          title={ellipsis ? title : undefined}
        >
          {title}
        </H3>
        <div id={infoId} className="mykn-itemgrid__item-information">
          {informationLines.map((line, index) => (
            <P
              key={index}
              className="mykn-itemgrid__item-information-line"
              title={ellipsis ? String(line) : undefined}
            >
              {line}
            </P>
          ))}
        </div>
      </div>
    </Body>
  );

  const sharedButtonProps = {
    pad: false,
    className: "mykn-itemgrid__item",
    "aria-describedby": ariaDescribedBy,
  };

  return as === "a" ? (
    <ButtonLink {...sharedButtonProps} {...(rest as ButtonLinkProps)}>
      {content}
    </ButtonLink>
  ) : (
    <Button {...sharedButtonProps} {...(rest as ButtonProps)}>
      {content}
    </Button>
  );
};
