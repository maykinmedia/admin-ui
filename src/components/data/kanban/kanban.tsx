import React, { useEffect, useState } from "react";

import {
  AttributeData,
  DEFAULT_URL_FIELDS,
  FieldSet,
  field2Title,
  formatMessage,
  useIntl,
} from "../../../lib";
import {
  GroupedAttributeDataProps,
  getContextData,
} from "../../../lib/data/groupedattributedata";
import { Badge } from "../../badge";
import { Button, ButtonLink, ButtonLinkProps, ButtonProps } from "../../button";
import { Select } from "../../form";
import { Column, Grid } from "../../layout";
import { Body, H1, H2, H3, P } from "../../typography";
import { Value } from "../value";
import "./kanban.scss";

export type KanbanProps = GroupedAttributeDataProps & {
  /** If set, items are `draggable` allowing the user to rearrange them (across) columns). */
  draggable?: boolean;
  /** The kanban "change column" (accessible) label */
  labelSelectColumn?: string;

  /** The kanban "move object position" (accessible) label. */
  labelMoveObject?: string;

  /** Get called when the fieldsets change. */
  onFieldsetsChange?: (fieldsets: FieldSet[]) => void;

  /** Get called when the objectLists change. */
  onObjectListsChange?: (objectLists: AttributeData[][]) => void;

  /** Get called when an object is dropped onto a column. */
  onObjectChange?: (
    object: AttributeData,
    sourceColumnIndex: number,
    targetColumnIndex: number,
    sourceObjectIndex: number,
    targetObjectIndex: number,
  ) => void;
};

export type KanbanDragData = {
  sourceColumnIndex: number;
  sourceObjectIndex: number;
  object: AttributeData;
};

/**
 * Kanban component, shows item over various columns. Items can be made `draggable` allowing the user to rearrange them
 * (across columns).
 */
export const Kanban: React.FC<KanbanProps> = ({
  buttonProps,
  buttonLinkProps,
  draggable = false,
  fieldset,
  fieldsets,
  groupBy,
  labelSelectColumn,
  labelMoveObject,
  objectList,
  objectLists,
  renderPreview,
  title,
  urlFields = DEFAULT_URL_FIELDS,
  onClick,
  onFieldsetsChange,
  onObjectListsChange,
  onObjectChange,
  ...props
}) => {
  const [dragIndexState, setDragIndexState] = useState<[number, number] | null>(
    null,
  );
  const [fieldsetsState, setFieldsetsState] = useState<FieldSet[]>([]);
  const [objectListsState, setObjectListsState] = useState<AttributeData[][]>(
    [],
  );

  useEffect(() => {
    const [_fieldsets, _objectLists] = getContextData(
      groupBy,
      fieldset,
      fieldsets,
      objectList,
      objectLists,
    );
    setFieldsetsState(_fieldsets);
    setObjectListsState(_objectLists);
    onFieldsetsChange?.(_fieldsets);
    onObjectListsChange?.(_objectLists);
  }, [groupBy, fieldset, fieldsets, objectList, objectLists]);

  /**
   * Gets called when the user drags an item over a column.
   * Updates `setDragIndexState` with column/object index.
   * @param e
   */
  const handleDragOver: React.DragEventHandler = (e) => {
    e.preventDefault();
    const currentTarget: HTMLElement = e.currentTarget as HTMLElement;
    const target: HTMLElement = e.currentTarget as HTMLElement;
    if (target.className !== e.currentTarget.className) {
      return;
    }

    const siblings = [...currentTarget.children].filter((child) =>
      child.getAttribute("draggable"),
    );

    const columnIndex = parseInt(currentTarget.dataset.columnIndex || "0");
    const insertIndex = getInsertIndex(siblings, e.nativeEvent.clientY);
    setDragIndexState([columnIndex, insertIndex]);
  };

  /**
   * Gets called when the user drops an item on a colum.
   * @param e
   */
  const handleDrop: React.DragEventHandler = (e) => {
    const [targetColumnIndex, targetObjectIndex] = dragIndexState || [0, 0];
    setDragIndexState(null);

    const json = e.dataTransfer.getData("application/json");
    const { sourceColumnIndex, sourceObjectIndex }: KanbanDragData = json
      ? JSON.parse(json)
      : {};

    if (typeof sourceColumnIndex !== "undefined") {
      const object = objectListsState[sourceColumnIndex][sourceObjectIndex];
      moveObject(
        object,
        sourceColumnIndex,
        targetColumnIndex,
        sourceObjectIndex,
        targetObjectIndex,
      );
    }
  };

  const handleObjectChange = (
    object: AttributeData,
    sourceColumnIndex: number,
    targetColumnIndex: number,
    sourceObjectIndex: number,
    targetObjectIndex: number,
  ) =>
    moveObject(
      object,
      sourceColumnIndex,
      targetColumnIndex,
      sourceObjectIndex,
      targetObjectIndex,
    );

  /**
   * Moves `object` to column/position at given indices and updates `objectListsState`.
   * on`onObjectChange` and `onObjectListsChange` are called subsequently.
   * @param object
   * @param sourceColumnIndex
   * @param targetColumnIndex
   * @param sourceObjectIndex
   * @param targetObjectIndex
   */
  const moveObject = (
    object: AttributeData,
    sourceColumnIndex: number,
    targetColumnIndex: number,
    sourceObjectIndex: number,
    targetObjectIndex: number,
  ) => {
    const newObjectListsState = [...objectListsState];
    const sourceObjectList = newObjectListsState[sourceColumnIndex];
    const targetObjectList = newObjectListsState[targetColumnIndex] || [];
    const _targetObjectIndex =
      targetObjectIndex === -1 ? targetObjectList.length : targetObjectIndex;

    // Remove item from source column
    sourceObjectList.splice(sourceObjectIndex, 1);

    // Add item to target column
    targetObjectList.splice(_targetObjectIndex, 0, object);

    // Update objectListsState
    setObjectListsState(newObjectListsState);

    // Call callbacks
    onObjectChange?.(
      object,
      sourceColumnIndex,
      targetColumnIndex,
      sourceObjectIndex,
      _targetObjectIndex,
    );
    onObjectListsChange?.(newObjectListsState);
  };

  /**
   * Returns the `index` required to insert a new (HTML) sibling in `children` at closes to `y`.
   * @param children
   * @param y Y position based on the viewport.
   */
  const getInsertIndex = (children: ArrayLike<Element>, y: number): number => {
    const yPositions = Array.from(children).map(
      (n) => n.getBoundingClientRect().y,
    );
    const lastIndex = yPositions.findIndex((p) => p >= y);
    return lastIndex === -1 ? children.length : lastIndex;
  };

  return (
    <div className="mykn-kanban" {...props}>
      {title && (
        <Body className="mykn-kanban__header">
          <H2>{title}</H2>
        </Body>
      )}
      <Body className="mykn-kanban__body">
        <Grid cols={fieldsetsState.length}>
          {fieldsetsState.map((fieldset, index) => (
            <KanbanSection
              key={fieldset[0] ? fieldset[0] : index}
              columnIndex={index}
              buttonLinkProps={buttonLinkProps}
              buttonProps={buttonProps}
              draggable={draggable}
              dragIndex={dragIndexState}
              fieldset={fieldset}
              fieldsets={fieldsetsState}
              fieldsetIndex={index}
              labelSelectColumn={labelSelectColumn}
              labelMoveObject={labelMoveObject}
              objectList={objectListsState[index]}
              renderPreview={renderPreview}
              urlFields={urlFields}
              onClick={onClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onObjectChange={handleObjectChange}
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
  columnIndex: number;
  draggable?: boolean;
  dragIndex: [number, number] | null;
  fieldset: FieldSet;
  fieldsets: FieldSet[];
  fieldsetIndex: number;
  labelSelectColumn?: string;
  labelMoveObject?: string;
  objectList: AttributeData[];
  renderPreview?: (attributeData: AttributeData) => React.ReactNode;
  urlFields: (keyof KanbanSectionProps["objectList"][number])[];
  onClick?: (event: React.MouseEvent, attributeData: AttributeData) => void;
  onDragOver: React.DragEventHandler;
  onDrop: React.DragEventHandler;
  onObjectChange?: (
    object: AttributeData,
    sourceColumnIndex: number,
    targetColumnIndex: number,
    sourceObjectIndex: number,
    targetObjectIndex: number,
  ) => void;
};

export const KanbanSection: React.FC<KanbanSectionProps> = ({
  buttonProps,
  buttonLinkProps,
  columnIndex,
  draggable,
  dragIndex,
  fieldset,
  fieldsets,
  fieldsetIndex,
  labelSelectColumn,
  labelMoveObject,
  objectList,
  renderPreview,
  urlFields,
  onClick,
  onDragOver,
  onDrop,
  onObjectChange,
}) => {
  const isDragging = Boolean(
    draggable && dragIndex && dragIndex[0] === columnIndex,
  );
  return (
    <Column
      className={isDragging ? "mykn-kanban__drop-target" : undefined}
      direction="column"
      gap={true}
      span={1}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-column-index={columnIndex}
    >
      {fieldset[0] && (
        <Body>
          <H3>
            {fieldset[0]}
            <Badge>{objectList.length}</Badge>
          </H3>
        </Body>
      )}
      <Body className="mykn-kanban__track">
        {objectList.map((o, index) => (
          <React.Fragment key={index}>
            {isDragging && dragIndex?.[1] === index && (
              <div className="mykn-kanban__drop-indicator" aria-hidden />
            )}
            <KanbanItem
              key={index}
              buttonLinkProps={buttonLinkProps}
              buttonProps={buttonProps}
              draggable={draggable}
              fieldset={fieldset}
              fieldsets={fieldsets}
              fieldsetIndex={fieldsetIndex}
              labelSelectColumn={labelSelectColumn}
              labelMoveObject={labelMoveObject}
              object={o}
              objectIndex={index}
              objectList={objectList}
              renderPreview={renderPreview}
              urlFields={urlFields}
              onClick={onClick}
              onObjectChange={onObjectChange}
            />
          </React.Fragment>
        ))}
        {isDragging && (dragIndex?.[1] || 0) >= objectList.length && (
          <div className="mykn-kanban__drop-indicator" aria-hidden />
        )}
      </Body>
    </Column>
  );
};

export type KanbanItemProps = Omit<React.ComponentProps<"li">, "onClick"> & {
  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;
  draggable?: boolean;
  fieldset: FieldSet;
  fieldsets: FieldSet[];
  fieldsetIndex: number;
  labelSelectColumn?: string;
  labelMoveObject?: string;
  object: AttributeData;
  objectIndex: number;
  objectList: AttributeData[];
  renderPreview?: (attributeData: AttributeData) => React.ReactNode;
  urlFields: (keyof KanbanItemProps["object"])[];
  onClick?: (event: React.MouseEvent, attributeData: AttributeData) => void;
  onObjectChange?: (
    object: AttributeData,
    sourceColumnIndex: number,
    targetColumnIndex: number,
    sourceObjectIndex: number,
    targetObjectIndex: number,
  ) => void;
};

export const KanbanItem: React.FC<KanbanItemProps> = ({
  buttonProps,
  buttonLinkProps,
  draggable,
  fieldset,
  fieldsets,
  fieldsetIndex,
  labelSelectColumn,
  labelMoveObject,
  object,
  objectIndex,
  objectList,
  renderPreview,
  urlFields,
  onClick,
  onObjectChange,
}) => {
  const intl = useIntl();
  const fields = fieldset[1].fields;
  const titleField = fieldset[1].title || Object.keys(object)[0];
  const urlField = urlFields.find((f) => object[f]);

  const title = field2Title(String(object[titleField]));
  const href = urlField ? String(object[urlField]) || undefined : undefined;
  const otherFields = fields.filter(
    (field) => ![...urlFields, titleField].includes(field),
  );
  const _labelSelectColumn = labelSelectColumn
    ? formatMessage(labelSelectColumn, object)
    : intl.formatMessage(
        {
          id: "mykn.components.Kanban.labelSelectColumn",
          description:
            'mykn.components.Kanban: The kanban "change column" (accessible) label',
          defaultMessage: "verplaats onderdeel naar kolom",
        },
        object as Record<string, string>,
      );

  const _labelMoveObject = labelMoveObject
    ? formatMessage(labelMoveObject, object)
    : intl.formatMessage(
        {
          id: "mykn.components.Kanban.labelMoveObject",
          description:
            'mykn.components.Kanban: The kanban "move object position" (accessible) label',
          defaultMessage: "wijzig positie van onderdeel",
        },
        object as Record<string, string>,
      );

  /**
   * Gets called when the user starts dragging the item.
   * Populates the datatransfer with stringified `KanbanDragData`.
   * @param e
   */
  const onDragStart: React.DragEventHandler = (e) => {
    const data: KanbanDragData = {
      sourceColumnIndex: fieldsetIndex,
      sourceObjectIndex: objectIndex,
      object,
    };
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("text/plain", title);
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    href && e.dataTransfer.setData("text/uri-list", href);
  };

  const Component = fieldset[1].component;

  return (
    <KanbanButton
      buttonLinkProps={buttonLinkProps}
      buttonProps={buttonProps}
      draggable={draggable}
      href={href}
      object={object}
      renderPreview={!Component && renderPreview}
      title={title}
      onClick={onClick}
      onDragStart={onDragStart}
    >
      {Component && <Component {...object} />}

      {!Component && (
        <>
          <P bold size="xs">
            {title}
          </P>

          {otherFields.map((field) => (
            <P key={field} muted size="xs">
              <Value value={object[field]}></Value>
            </P>
          ))}
        </>
      )}

      {/* A11y column selector. */}
      {draggable && (
        <>
          <Select
            aria-label={_labelSelectColumn}
            className="mykn-kanban__select mykn-kanban__select--column"
            options={fieldsets.map((fieldset, index) => {
              const option = {
                label: fieldset[0] || "",
                selected: index === fieldsetIndex,
                value: index,
              };
              return option;
            })}
            required
            textSize="xs"
            onClick={(e) => e.preventDefault()}
            onChange={(e) =>
              onObjectChange?.(
                object,
                fieldsetIndex,
                parseInt(e.target.value),
                objectIndex,
                -1,
              )
            }
          />

          {/* A11y position selector. */}
          <Select
            aria-label={_labelMoveObject}
            className="mykn-kanban__select mykn-kanban__select--position"
            options={objectList.map((o, index) => {
              const option = {
                label: String(o[titleField] || index),
                selected: o === object,
                value: index,
              };
              return option;
            })}
            required
            textSize="xs"
            onClick={(e) => e.preventDefault()}
            onChange={(e) =>
              onObjectChange?.(
                object,
                fieldsetIndex,
                fieldsetIndex,
                objectIndex,
                parseInt(e.target.value),
              )
            }
          />
        </>
      )}
    </KanbanButton>
  );
};

export type KanbanButtonProps = {
  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;
  children: React.ReactNode;
  draggable?: boolean;
  href?: string;
  object: AttributeData;
  renderPreview?: ((attributeData: AttributeData) => React.ReactNode) | false;
  title: string;
  onClick?: (event: React.MouseEvent, attributeData: AttributeData) => void;
  onDragStart: React.DragEventHandler;
};

export const KanbanButton: React.FC<KanbanButtonProps> = ({
  buttonProps,
  buttonLinkProps,
  children,
  draggable,
  href,
  title,
  object,
  renderPreview = () => <H1 aria-hidden>{title[0].toUpperCase()}</H1>,
  onClick,
  onDragStart,
}) => {
  const content = renderPreview ? renderPreview(object) : null;

  return href ? (
    <ButtonLink
      align="start"
      className="mykn-kanban__button"
      draggable={draggable}
      href={href}
      justify
      title={title}
      variant="outline"
      wrap={false}
      {...buttonLinkProps}
      onClick={(e) => onClick?.(e, object)}
      onDragStart={draggable ? onDragStart : undefined}
    >
      {content && <span className="mykn-kanban__preview">{content}</span>}
      {children}
    </ButtonLink>
  ) : (
    <Button
      align="start"
      className="mykn-kanban__button"
      draggable={draggable}
      justify
      title={title}
      variant="outline"
      wrap={false}
      {...buttonProps}
      onClick={(e) => onClick?.(e, object)}
      onDragStart={draggable ? onDragStart : undefined}
    >
      <span className="mykn-kanban__preview">{content}</span>
      {children}
    </Button>
  );
};
