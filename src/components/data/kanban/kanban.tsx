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
import "./kanban.scss";

export type KanbanProps = GroupedAttributeDataProps;

/**
 * Kanban component
 */
export const Kanban: React.FC<KanbanProps> = ({
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
    <div className="mykn-kanban" {...props}>
      {title && (
        <Body className="mykn-kanban__header">
          <H2>{title}</H2>
        </Body>
      )}
      <Body className="mykn-kanban__body">
        <Grid cols={_fieldsets.length}>
          {_fieldsets.map((fieldset, index) => (
            <KanbanSection
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
        </Grid>
      </Body>
    </div>
  );
};

export type KanbanSectionProps = Omit<
  React.ComponentProps<"section">,
  "onClick"
> & {
  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;
  fieldset: FieldSet;
  objectList: AttributeData[];
  renderPreview?: (attributeData: AttributeData) => React.ReactNode;
  urlFields: (keyof KanbanSectionProps["objectList"][number])[];
  onClick?: (event: React.MouseEvent, attributeData: AttributeData) => void;
};

export const KanbanSection: React.FC<KanbanSectionProps> = ({
  buttonProps,
  buttonLinkProps,
  fieldset,
  objectList,
  renderPreview,
  urlFields,
  onClick,
}) => (
  <Column direction="column" gap={true} span={1}>
    {fieldset[0] && (
      <Body>
        <H3>{fieldset[0]}</H3>
      </Body>
    )}
    {objectList.map((o, index) => (
      <KanbanItem
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
  </Column>
);

export type KanbanItemProps = Omit<React.ComponentProps<"li">, "onClick"> & {
  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;
  fieldset: FieldSet;
  object: AttributeData;
  renderPreview?: (attributeData: AttributeData) => React.ReactNode;
  urlFields: (keyof KanbanItemProps["object"])[];
  onClick?: (event: React.MouseEvent, attributeData: AttributeData) => void;
};

export const KanbanItem: React.FC<KanbanItemProps> = ({
  buttonProps,
  buttonLinkProps,
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
    <KanbanButton
      buttonLinkProps={buttonLinkProps}
      buttonProps={buttonProps}
      href={href}
      object={object}
      renderPreview={renderPreview}
      title={String(title)}
      onClick={onClick}
    >
      <P bold size="xs">
        {field2Title(String(title))}
      </P>

      {otherFields.map((field) => (
        <P key={field} muted size="xs">
          {object[field]}
        </P>
      ))}
    </KanbanButton>
  );
};

export type KanbanButtonProps = {
  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;
  children: React.ReactNode;
  href?: string;
  object: AttributeData;
  renderPreview?: (attributeData: AttributeData) => React.ReactNode;
  title: string;
  onClick?: (event: React.MouseEvent, attributeData: AttributeData) => void;
};

export const KanbanButton: React.FC<KanbanButtonProps> = ({
  buttonProps,
  buttonLinkProps,
  children,
  href,
  title,
  object,
  renderPreview = () => <H1 aria-hidden>{title[0].toUpperCase()}</H1>,
  onClick,
}) => {
  const content = renderPreview(object);

  return href ? (
    <ButtonLink
      align="start"
      href={href}
      justify
      title={title}
      variant="outline"
      wrap={false}
      {...buttonLinkProps}
      onClick={(e) => onClick?.(e, object)}
    >
      <span className="mykn-kanban__preview">{content}</span>
      {children}
    </ButtonLink>
  ) : (
    <Button
      align="start"
      justify
      title={title}
      variant="outline"
      wrap={false}
      {...buttonProps}
      onClick={(e) => onClick?.(e, object)}
    >
      <span className="mykn-kanban__preview">{content}</span>
      {children}
    </Button>
  );
};
