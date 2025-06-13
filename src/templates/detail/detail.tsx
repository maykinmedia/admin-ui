import {
  AttributeGrid,
  AttributeGridProps,
  Body,
  DataGrid,
  DataGridProps,
  H2,
} from "../../components";
import { slugify } from "../../lib";
import { BodyBaseTemplateProps, CardBaseTemplate } from "../base";

export type DetailTemplateProps<T extends object = object> =
  BodyBaseTemplateProps & {
    attributeGridProps: AttributeGridProps<T>;
    inlines?: DataGridProps[];
  };

/**
 * Detail template
 * @constructor
 */
export const DetailTemplate = <T extends object = object>({
  children,
  attributeGridProps,
  inlines = [],
  ...props
}: DetailTemplateProps<T>) => (
  <CardBaseTemplate {...props}>
    {children}
    <AttributeGrid<T> generateTitleIds={true} {...attributeGridProps} />
    {inlines.map(({ title, ...props }, index) => {
      return (
        <Body key={typeof title === "string" ? title : index}>
          <H2 id={typeof title === "string" ? slugify(title) : undefined}>
            {title}
          </H2>
          <DataGrid key={index} {...props} />
        </Body>
      );
    })}
  </CardBaseTemplate>
);
