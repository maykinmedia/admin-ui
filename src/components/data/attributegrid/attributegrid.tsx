import React from "react";

import {
  AttributeData,
  FieldSet,
  attributeDataByFieldsets,
  slugify,
} from "../../../lib";
import { Column, Grid } from "../../layout";
import { Toolbar } from "../../toolbar";
import { Body, H2, Hr } from "../../typography";
import { AttributeList, AttributeListProps } from "../attributelist";
import "./attributegrid.scss";

export type AttributeGridProps = {
  object: AttributeData;
  fieldsets: FieldSet[];
  generateTitleIds?: boolean;
  title?: React.ReactNode;
};

/**
 * AttributeGrid component, renders multiple `AttributeList`s in a `Grid` component based on `fieldsets`.
 */
export const AttributeGrid: React.FC<AttributeGridProps> = ({
  object,
  fieldsets,
  generateTitleIds = false,
  title,
  ...props
}) => {
  const objectList =
    object && fieldsets?.length
      ? attributeDataByFieldsets(object, fieldsets)
      : [];

  // The grid datastructure:
  //
  // Built an Array of Array of tuples, each Array (1) represents a row with a max span of 12, the total span is defined
  // by the sum of the first key of each tuple in Array (2).
  const rowArray: [number, AttributeListProps][][] = [[]];

  let currentRowSpan = 0;
  objectList.forEach((object, index) => {
    const fieldset = fieldsets[index];
    const span = fieldset[1].span || 6;
    const title = fieldset[0];
    const attributeListProps: AttributeListProps = {
      object: object,
      title: title,
    };

    if (currentRowSpan + span > 12) {
      // Start a new row
      rowArray.push([]);
      currentRowSpan = 0;
    }

    rowArray[rowArray.length - 1].push([span, attributeListProps]);
    currentRowSpan += span;
  });

  return (
    <div className="mykn-attributegrid" {...props}>
      {title && (
        <Toolbar pad={true}>
          {typeof title === "string" ? <H2>{title}</H2> : title}
        </Toolbar>
      )}
      <Body>
        {rowArray.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <Grid>
              {row.map(([span, props], colIndex) => (
                <Column key={colIndex} span={span}>
                  <AttributeList
                    key={colIndex}
                    titleId={
                      generateTitleIds && props.title
                        ? slugify(props.title)
                        : undefined
                    }
                    {...props}
                  />
                </Column>
              ))}
            </Grid>
            {rowArray[rowIndex + 1] ? <Hr size="xxl" /> : undefined}
          </React.Fragment>
        ))}
      </Body>
    </div>
  );
};
