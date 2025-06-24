import { string2Title } from "@maykin-ui/client-common";
import React from "react";

import { DEFAULT_URL_FIELDS, FieldSet } from "../../../lib";
import {
  GroupedDataProps,
  getContextData,
} from "../../../lib/data/groupeddata";
import { Button, ButtonLink, ButtonLinkProps, ButtonProps } from "../../button";
import { Column, Grid } from "../../layout";
import { Body, H1, H2, H3, P } from "../../typography";
import { Value } from "../value";
import "./itemgrid.scss";

export type ItemGridProps<T extends object = object> = GroupedDataProps<T>;

/**
 * ItemGrid Component
 *
 * Shows item over various rows.
 *
 * @typeParam T - The shape of a single item.
 */
export const ItemGrid = <T extends object = object>({
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
}: ItemGridProps<T>) => {
  const [_fieldsets, _objectLists] = getContextData<T>(
    groupBy,
    fieldset,
    fieldsets,
    objectList as T[],
    objectLists as T[][],
  );

  return (
    <div className="mykn-itemgrid" {...props}>
      {title && (
        <Body>
          <H2>{title}</H2>
        </Body>
      )}
      {_fieldsets.map((fieldset, index) => (
        <ItemGridSection<T>
          key={fieldset[0] ? fieldset[0] : index}
          buttonLinkProps={buttonLinkProps}
          buttonProps={buttonProps}
          fieldset={fieldset}
          objectList={_objectLists[index]}
          renderPreview={renderPreview}
          // @ts-expect-error - complex union
          urlFields={urlFields}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

export type ItemGridSectionProps<T extends object = object> = Omit<
  React.ComponentProps<"section">,
  "onClick"
> & {
  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;
  fieldset: FieldSet<T>;
  objectList: T[];
  renderPreview?: (data: T) => React.ReactNode;
  urlFields: (keyof ItemGridSectionProps["objectList"][number])[];
  onClick?: (event: React.MouseEvent, data: T) => void;
};

export const ItemGridSection = <T extends object = object>({
  buttonLinkProps,
  buttonProps,
  fieldset,
  objectList,
  renderPreview,
  urlFields,
  onClick,
}: ItemGridSectionProps<T>) => (
  <section className="mykn-itemgrid__section">
    <Body>
      <Grid>
        {fieldset[0] && (
          <Column span={12}>
            <H3>{string2Title(fieldset[0])}</H3>
          </Column>
        )}
        {objectList.map((o, index) => (
          <ItemGridItem<T>
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

export type ItemGridItemProps<T extends object = object> = Omit<
  React.ComponentProps<"li">,
  "onClick"
> & {
  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;
  fieldset: FieldSet<T>;
  object: T;
  renderPreview?: (data: T) => React.ReactNode;
  urlFields: (keyof ItemGridItemProps["object"])[];
  onClick?: (event: React.MouseEvent, data: T) => void;
};

export const ItemGridItem = <T extends object = object>({
  buttonLinkProps,
  buttonProps,
  fieldset,
  object,
  renderPreview,
  urlFields,
  onClick,
}: ItemGridItemProps<T>) => {
  const fields = fieldset[1].fields;
  const titleField = fieldset[1].title || Object.keys(object)[0];
  const urlField = urlFields.find((f) => object[f]);

  const label = String(object[titleField as keyof T]);
  const href = urlField ? String(object[urlField]) || undefined : undefined;
  const otherFields = fields.filter(
    (field) => ![...urlFields, titleField].includes(field),
  );

  return (
    <Column direction="column" span={1} mobileSpan={2}>
      <ItemGridButton<T>
        buttonLinkProps={buttonLinkProps}
        buttonProps={buttonProps}
        href={href}
        object={object}
        renderPreview={renderPreview}
        title={label}
        onClick={onClick}
      ></ItemGridButton>
      <P bold size="xs">
        {string2Title(label)}
      </P>

      {otherFields.map((field) => (
        <P key={field.toString()} muted size="xs">
          <Value value={object[field]} />
        </P>
      ))}
    </Column>
  );
};

export type ItemGridButtonProps<T extends object = object> = {
  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;
  href?: string;
  object: T;
  renderPreview?: (data: T) => React.ReactNode;
  title: string;
  onClick?: (event: React.MouseEvent, data: T) => void;
};

export const ItemGridButton = <T extends object = object>({
  buttonLinkProps,
  buttonProps,
  href,
  title,
  object,
  renderPreview = () => <H1 aria-hidden>{title[0].toUpperCase()}</H1>,
  onClick,
}: ItemGridButtonProps<T>) => {
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
