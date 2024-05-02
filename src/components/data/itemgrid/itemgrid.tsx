import React from "react";

import {
  AttributeData,
  DEFAULT_URL_FIELDS,
  FieldSet,
  field2Title,
  formatMessage,
} from "../../../lib";
import { Button, ButtonLink, ButtonLinkProps, ButtonProps } from "../../button";
import { Column, Grid } from "../../layout";
import { Body, H1, H2, H3, P } from "../../typography";
import "./itemgrid.scss";

export type ItemGridProps = Omit<
  React.ComponentProps<"div">,
  "title" | "onClick"
> & {
  /** A title for the datagrid. */
  title?: React.ReactNode;

  /** A `Function` that is used to create the preview for an object. */
  renderPreview?: (attributeData: AttributeData) => React.ReactNode;

  /**
   *  A `string[]` containing the fields which should be used to detect the url
   *  of a row. Fields specified in this object won't be rendered, instead: the
   *  first (non url) field is rendered as link (`A`) with `href` set to the
   *  resolved url of the row.
   */
  urlFields?: string[];

  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;

  /**
   * Gets called when a button is clicked.
   * @param event
   * @param attributeData
   */
  onClick?: (event: React.MouseEvent, attributeData: AttributeData) => void;
} & ItemGridConfigurationProps;

export type ItemGridConfigurationProps =
  | ItemGridFieldsetProps
  | ItemGridGroupByProps;

/**
 * WHen using `fieldsets` / `objectLists` to define sections. The length of `fieldSets` and `objectLists` should match.
 */
export type ItemGridFieldsetProps = {
  /** The field to sort by, if `undefined`: `fieldsets` and `objectLists` are used for manual segmentation. */
  groupBy?: undefined;

  /** The fieldsets to render. */
  fieldsets: FieldSet[];

  /** The object lists to show, each index should match `fieldsets` index. */
  objectLists: AttributeData[][];

  fieldset?: undefined;
  objectList?: undefined;
};

export type ItemGridGroupByProps = {
  /**
   * The field to sort by, if specified: `fieldset` acts as base fieldset and `objectList` as list of objects to group.`.
   * The first item in `fieldset` (the label) may contain "{group}" placeholder which will be replaced by the matching
   * value.
   */
  groupBy: string;

  /** The fieldset to render. */
  fieldset: FieldSet;

  /** The objects to show. */
  objectList: AttributeData[];

  fieldsets?: undefined;
  objectLists?: undefined;
};

/**
 * Itemgrid component
 */
export const ItemGrid: React.FC<ItemGridProps> = ({
  buttonProps,
  buttonLinkProps,
  fieldset,
  fieldsets,
  groupBy,
  objectList,
  objectLists,
  renderPreview,
  title,
  urlFields = DEFAULT_URL_FIELDS,
  onClick,
  ...props
}) => {
  /**
   * Returns segments represented by `[Fieldset[], AttributeData[][]]`.
   */
  const getContextData = (): [FieldSet[], AttributeData[][]] => {
    if (groupBy) {
      const groups = [...new Set(objectList.map((o) => o[groupBy]))].sort(
        (a, b) =>
          String(a).localeCompare(String(b), undefined, { numeric: true }),
      );

      const _fieldsets = groups.map<FieldSet>((g) => [
        fieldset[0] ? formatMessage(fieldset[0], { group: g }) : String(g),
        fieldset[1],
      ]);

      const _objectLists = groups.map((g) =>
        objectList.filter((o) => o[groupBy] === g),
      );
      return [_fieldsets, _objectLists];
    }
    return [fieldsets as FieldSet[], objectLists as AttributeData[][]];
  };

  const [_fieldsets, _objectLists] = getContextData();

  return (
    <div className="mykn-itemgrid" {...props}>
      {title && (
        <Body>
          <H2>{title}</H2>
        </Body>
      )}
      {_fieldsets.map((fieldset, index) => (
        <ItemGridSection
          key={fieldset[0] ? fieldset[0] : index}
          buttonLinkProps={buttonLinkProps}
          buttonProps={buttonProps}
          fieldset={fieldset}
          objectList={_objectLists[index]}
          renderPreview={renderPreview}
          urlFields={urlFields}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

export type ItemGridSectionProps = Omit<
  React.ComponentProps<"section">,
  "onClick"
> & {
  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;
  fieldset: FieldSet;
  objectList: AttributeData[];
  renderPreview?: (attributeData: AttributeData) => React.ReactNode;
  urlFields: (keyof ItemGridSectionProps["objectList"][number])[];
  onClick?: (event: React.MouseEvent, attributeData: AttributeData) => void;
};

export const ItemGridSection: React.FC<ItemGridSectionProps> = ({
  buttonLinkProps,
  buttonProps,
  fieldset,
  objectList,
  renderPreview,
  urlFields,
  onClick,
}) => (
  <section className="mykn-itemgrid__section">
    <Body>
      <Grid>
        {fieldset[0] && (
          <Column span={12}>
            <H3>{fieldset[0]}</H3>
          </Column>
        )}
        {objectList.map((o, index) => (
          <ItemGridItem
            key={index}
            buttonLinkProps={buttonLinkProps}
            buttonProps={buttonProps}
            fieldset={fieldset}
            object={o}
            renderPreview={renderPreview}
            urlFields={urlFields}
            onClick={onClick}
          />
        ))}
      </Grid>
    </Body>
  </section>
);

export type ItemGridItemProps = Omit<React.ComponentProps<"li">, "onClick"> & {
  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;
  fieldset: FieldSet;
  object: AttributeData;
  renderPreview?: (attributeData: AttributeData) => React.ReactNode;
  urlFields: (keyof ItemGridItemProps["object"])[];
  onClick?: (event: React.MouseEvent, attributeData: AttributeData) => void;
};

export const ItemGridItem: React.FC<ItemGridItemProps> = ({
  buttonLinkProps,
  buttonProps,
  fieldset,
  object,
  renderPreview,
  urlFields,
  onClick,
}) => {
  const fields = fieldset[1].fields;
  const titleField = fieldset[1].title || Object.keys(object)[0];
  const urlField = urlFields.find((f) => object[f]);

  const title = object[titleField];
  const href = urlField ? String(object[urlField]) || undefined : undefined;
  const otherFields = fields.filter(
    (field) => ![...urlFields, titleField].includes(field),
  );

  return (
    <Column direction="column" span={1} mobileSpan={2}>
      <ItemGridButton
        buttonLinkProps={buttonLinkProps}
        buttonProps={buttonProps}
        href={href}
        object={object}
        renderPreview={renderPreview}
        title={String(title)}
        onClick={onClick}
      ></ItemGridButton>
      <P bold size="xs">
        {field2Title(String(title))}
      </P>

      {otherFields.map((field) => (
        <P key={field} muted size="xs">
          {object[field]}
        </P>
      ))}
    </Column>
  );
};

export type ItemGridButtonProps = {
  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;
  href?: string;
  object: AttributeData;
  renderPreview?: (attributeData: AttributeData) => React.ReactNode;
  title: string;
  onClick?: (event: React.MouseEvent, attributeData: AttributeData) => void;
};

export const ItemGridButton: React.FC<ItemGridButtonProps> = ({
  buttonLinkProps,
  buttonProps,
  href,
  title,
  object,
  renderPreview = () => <H1 aria-hidden>{title[0].toUpperCase()}</H1>,
  onClick,
}) => {
  const content = renderPreview(object);

  return href ? (
    <ButtonLink
      href={href}
      title={title}
      variant="outline"
      {...buttonLinkProps}
      onClick={(e) => onClick?.(e, object)}
    >
      <span className="mykn-itemgrid__preview">{content}</span>
    </ButtonLink>
  ) : (
    <Button
      square={true}
      title={title}
      variant="outline"
      {...buttonProps}
      onClick={(e) => onClick?.(e, object)}
    >
      <span className="mykn-itemgrid__preview">{content}</span>
    </Button>
  );
};
