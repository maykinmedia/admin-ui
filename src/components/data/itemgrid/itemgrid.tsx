import React from "react";

import {
  AttributeData,
  DEFAULT_URL_FIELDS,
  FieldSet,
  field2Title,
} from "../../../lib";
import {
  GroupedAttributeDataProps,
  getContextData,
} from "../../../lib/data/groupedattributedata";
import { Button, ButtonLink, ButtonLinkProps, ButtonProps } from "../../button";
import { Column, Grid } from "../../layout";
import { Body, H1, H2, H3, P } from "../../typography";
import { Value } from "../value";
import "./itemgrid.scss";

export type ItemGridProps = GroupedAttributeDataProps;

/**
 * ItemGrid component
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
  const [_fieldsets, _objectLists] = getContextData(
    groupBy,
    fieldset,
    fieldsets,
    objectList,
    objectLists,
  );

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
          <Value value={object[field]} />
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
      title={title}
      variant="outline"
      {...buttonProps}
      onClick={(e) => onClick?.(e, object)}
    >
      <span className="mykn-itemgrid__preview">{content}</span>
    </Button>
  );
};
