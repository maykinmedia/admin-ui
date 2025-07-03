import { slugify } from "@maykin-ui/client-common";
import clsx from "clsx";
import React from "react";

import { FieldSet, dataByFieldsets } from "../../../lib";
import { Column, Grid } from "../../layout";
import { Toolbar } from "../../toolbar";
import { Body, H2 } from "../../typography";
import { AttributeList, AttributeListProps } from "../attributelist";
import "./attributegrid.scss";

export type AttributeGridProps<T extends object = object> = {
  /** The object to show object attributes of. */
  object: T;

  /** The fieldsets to render. */
  fieldsets: FieldSet<T>[];

  /** Props for AttributeList. */
  attributeListProps?: Partial<AttributeListProps<T>>;

  /** Whether to use `height 100%;`. */
  fullHeight?: boolean;

  /** Whether to automatically generate id's for titles. */
  generateTitleIds?: boolean;

  /** A title. */
  title?: React.ReactNode;
};

/**
 * AttributeGrid Component
 *
 * Uses multiple `AttributeList`s to render lists of data within a `Grid`.
 *
 * @typeParam T - The shape of a single data item.
 */
export const AttributeGrid = <T extends object = object>({
  attributeListProps = {},
  object,
  fieldsets,
  fullHeight,
  generateTitleIds = false,
  title,
  ...props
}: AttributeGridProps<T>) => {
  const objectList =
    object && fieldsets?.length ? dataByFieldsets(object, fieldsets) : [];

  // The grid data structure:
  //
  // Built an Array of Array of tuples, each Array (1) represents a row with a max span of 12, the total span is defined
  // by the sum of the first key of each tuple in Array (2).
  const rowArray: [number, AttributeListProps<T>][][] = [[]];

  let currentRowSpan = 0;
  objectList.forEach((object, index) => {
    const fieldset = fieldsets[index];
    const span = fieldset[1].span || 6;
    const title = fieldset[0];
    const row: AttributeListProps<T> = {
      ...attributeListProps,
      object: object,
      title: title,
      colSpan: fieldset[1].colSpan || attributeListProps.colSpan,
      titleSpan: fieldset[1].titleSpan || attributeListProps.titleSpan,
    };

    if (currentRowSpan + span > 12) {
      // Start a new row
      rowArray.push([]);
      currentRowSpan = 0;
    }

    rowArray[rowArray.length - 1].push([span, row]);
    currentRowSpan += span;
  });

  return (
    <div
      className={clsx("mykn-attributegrid", {
        "mykn-attributegrid--full-height": fullHeight,
      })}
      {...props}
    >
      {title && (
        <Toolbar pad={true}>
          {typeof title === "string" ? <H2>{title}</H2> : title}
        </Toolbar>
      )}
      <Body>
        {rowArray.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <Grid>
              {row.map(([span, attributeListProps], colIndex) => (
                <Column key={colIndex} span={span}>
                  <AttributeList
                    key={colIndex}
                    titleId={
                      generateTitleIds && attributeListProps.title
                        ? slugify(attributeListProps.title)
                        : undefined
                    }
                    {...attributeListProps}
                  />
                </Column>
              ))}
            </Grid>
          </React.Fragment>
        ))}
      </Body>
    </div>
  );
};
