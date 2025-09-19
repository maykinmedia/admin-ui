import React, { useEffect, useState } from "react";

import {
  DEFAULT_URL_FIELDS,
  FieldSet,
  GroupedDataProps,
  getContextData,
  getFieldName,
  gettextFirst,
} from "../../../lib";
import { Badge } from "../../badge";
import { Button, ButtonLink, ButtonLinkProps, ButtonProps } from "../../button";
import { Card } from "../../card";
import { Select } from "../../form";
import { Column, Grid } from "../../layout";
import { StackCtx } from "../../stackctx";
import { Toolbar, ToolbarProps } from "../../toolbar";
import { Body, H2, H3, Hr, P } from "../../typography";
import { Value } from "../value";
import "./kanban.scss";
import { TRANSLATIONS } from "./translations";

export type KanbanProps<T extends object = object> = GroupedDataProps<T> & {
  /** If set, items are `draggable` allowing the user to rearrange them (across) columns). */
  draggable?: boolean;

  /** Props to pass to Toolbar. */
  toolbarProps?: Partial<ToolbarProps>;

  /** The kanban "change column" (accessible) label */
  labelSelectColumn?: string;

  /** The kanban "move object position" (accessible) label. */
  labelMoveObject?: string;

  /** Get called when the fieldsets change. */
  onFieldsetsChange?: (fieldsets: FieldSet<T>[]) => void;

  /** Get called when the objectLists change. */
  onObjectListsChange?: (objectLists: T[][]) => void;

  /** Get called when an object is dropped onto a column. */
  onObjectChange?: (
    object: T,
    sourceColumnIndex: number,
    targetColumnIndex: number,
    sourceObjectIndex: number,
    targetObjectIndex: number,
  ) => void;
};

export type KanbanDragData<T extends object = object> = {
  sourceColumnIndex: number;
  sourceObjectIndex: number;
  object: T;
};

/**
 * Kanban Component
 *
 * Shows items over various columns. Items can be made `draggable` allowing the
 * user to rearrange them (across columns).
 *
 * @typeParam T - The shape of a single item.
 */
export const Kanban = <T extends object = object>({
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
  toolbarProps,
  urlFields = DEFAULT_URL_FIELDS,
  onClick,
  onFieldsetsChange,
  onObjectListsChange,
  onObjectChange,
  ...props
}: KanbanProps<T>) => {
  const [dragIndexState, setDragIndexState] = useState<[number, number] | null>(
    null,
  );
  const [fieldsetsState, setFieldsetsState] = useState<FieldSet<T>[]>([]);
  const [objectListsState, setObjectListsState] = useState<T[][]>([]);

  useEffect(() => {
    const [_fieldsets, _objectLists] = getContextData<T>(
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

    const siblings = [
      ...currentTarget.querySelectorAll(".mykn-kanban__button"),
    ].filter((child) => child.getAttribute("draggable"));

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
    object: T,
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
    object: T,
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
      {toolbarProps && (
        <Toolbar
          pad={true}
          sticky="top"
          variant="transparent"
          {...toolbarProps}
        />
      )}
      <Body className="mykn-kanban__body">
        <Grid cols={fieldsetsState.length}>
          {fieldsetsState.map((fieldset, index) => (
            <KanbanSection<T>
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
              objectList={objectListsState[index] || []}
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

export type KanbanSectionProps<T extends object = object> = Omit<
  React.ComponentProps<"section">,
  "onClick"
> & {
  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;
  columnIndex: number;
  draggable?: boolean;
  dragIndex: [number, number] | null;
  fieldset: FieldSet<T>;
  fieldsets: FieldSet<T>[];
  fieldsetIndex: number;
  labelSelectColumn?: string;
  labelMoveObject?: string;
  objectList: T[];
  renderPreview?: (data: T) => React.ReactNode;
  urlFields: string[];
  onClick?: (event: React.MouseEvent, data: T) => void;
  onDragOver: React.DragEventHandler;
  onDrop: React.DragEventHandler;
  onObjectChange?: (
    object: T,
    sourceColumnIndex: number,
    targetColumnIndex: number,
    sourceObjectIndex: number,
    targetObjectIndex: number,
  ) => void;
};

export const KanbanSection = <T extends object = object>({
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
}: KanbanSectionProps<T>) => {
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
        <Toolbar directionResponsive={false} pad={false} variant="transparent">
          <H3>{fieldset[0]}</H3>
          <Badge rounded>{objectList.length}</Badge>
        </Toolbar>
      )}
      <Body className="mykn-kanban__track">
        {objectList.map((o, index) => (
          <React.Fragment key={index}>
            {isDragging && dragIndex?.[1] === index && (
              <div className="mykn-kanban__drop-indicator" aria-hidden />
            )}
            <KanbanItem<T>
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

export type KanbanItemProps<T extends object = object> = Omit<
  React.ComponentProps<"li">,
  "onClick"
> & {
  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;
  draggable?: boolean;
  fieldset: FieldSet<T>;
  fieldsets: FieldSet<T>[];
  fieldsetIndex: number;
  labelSelectColumn?: string;
  labelMoveObject?: string;
  object: T;
  objectIndex: number;
  objectList: T[];
  renderPreview?: (data: T) => React.ReactNode;
  urlFields: string[];
  onClick?: (event: React.MouseEvent, data: T) => void;
  onObjectChange?: (
    object: T,
    sourceColumnIndex: number,
    targetColumnIndex: number,
    sourceObjectIndex: number,
    targetObjectIndex: number,
  ) => void;
};

export const KanbanItem = <T extends object = object>({
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
}: KanbanItemProps<T>) => {
  const _labelSelectColumn = gettextFirst(
    labelSelectColumn,
    TRANSLATIONS.LABEL_SELECT_COLUMN,
    object,
  );

  const _labelMoveObject = gettextFirst(
    labelMoveObject,
    TRANSLATIONS.LABEL_MOVE_OBJECT,
    object,
  );

  const titleField = fieldset[1].title || Object.keys(object)[0];
  const urlField = urlFields.find((f) => object[f as keyof T]);

  const label = String(object[titleField as keyof T]);
  const href = urlField
    ? String(object[urlField as keyof T]) || undefined
    : undefined;

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
    e.dataTransfer.setData("text/plain", label);
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    href && e.dataTransfer.setData("text/uri-list", href);
  };

  const Component = fieldset[1].component || KanbanButton<T>;

  const renderContent = () => {
    if (!draggable) {
      return;
    }
    return (
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
          size="xs"
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
              label: String(o[titleField as keyof T] || index),
              selected: o === object,
              value: index,
            };
            return option;
          })}
          required
          size="xs"
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
    );
  };

  return (
    <StackCtx>
      <Component
        buttonLinkProps={buttonLinkProps}
        buttonProps={buttonProps}
        draggable={draggable}
        fieldset={fieldset}
        href={href}
        object={object}
        renderPreview={renderPreview}
        urlFields={urlFields}
        title={label}
        onClick={onClick}
        onDragStart={onDragStart}
      />
      {renderContent()}
    </StackCtx>
  );
};

export type KanbanButtonProps<T extends object = object> = {
  buttonLinkProps?: ButtonLinkProps;
  buttonProps?: ButtonProps;
  draggable?: boolean;
  fieldset: FieldSet<T>;
  href?: string;
  object: T & {
    children?: React.ReactNode;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent, data: T) => void;
  };
  renderPreview?: ((data: T) => React.ReactNode) | false;
  urlFields: string[];
  title: string;
  onClick?: (event: React.MouseEvent, data: T) => void;
  onDragStart: React.DragEventHandler;
};

export const KanbanButton = <T extends object = object>({
  buttonProps,
  buttonLinkProps,
  draggable,
  fieldset,
  href,
  title,
  object,
  renderPreview = () => title && <Badge>{title[0].toUpperCase()}</Badge>,
  urlFields,
  onClick,
  onDragStart,
}: KanbanButtonProps<T>) => {
  const fields = fieldset[1].fields;
  const titleField = fieldset[1].title || Object.keys(object)[0];
  const otherFields = fields.filter(
    (field) => ![...urlFields, titleField].includes(getFieldName(field)),
  );
  const _onClick = (object.onClick || onClick) as typeof onClick;

  const renderTitle = () => {
    const preview = renderPreview && renderPreview(object);
    return (
      <Toolbar
        direction="vertical"
        directionResponsive={false}
        justify="h"
        pad={false}
        variant="transparent"
      >
        {preview}
        <P wordBreak="break-word">{title}</P>
      </Toolbar>
    );
  };

  const renderFooter = () => {
    if (!otherFields.length) {
      return;
    }

    return (
      <>
        <Hr />
        <Body>
          <Toolbar
            directionResponsive={false}
            pad={false}
            variant="transparent"
          >
            {otherFields.map((field) => (
              <Value
                key={getFieldName(field).toString()}
                decorate={true}
                pProps={{ size: "xs" }}
                value={object[getFieldName(field)]}
              />
            ))}
          </Toolbar>
        </Body>
      </>
    );
  };

  return href ? (
    <ButtonLink
      align="start"
      className="mykn-kanban__button"
      disabled={
        typeof object.disabled === "undefined"
          ? !href
          : Boolean(object.disabled)
      }
      draggable={draggable}
      href={href}
      justify
      pad={false}
      title={title}
      variant="outline"
      wrap={false}
      {...buttonLinkProps}
      onClick={(e) => _onClick?.(e, object)}
      onDragStart={draggable ? onDragStart : undefined}
    >
      <Card title={renderTitle()}>
        {object.children as React.ReactNode}
        {renderFooter()}
      </Card>
    </ButtonLink>
  ) : (
    <Button
      align="start"
      className="mykn-kanban__button"
      disabled={
        typeof object.disabled === "undefined"
          ? !_onClick
          : Boolean(object.disabled)
      }
      draggable={draggable}
      justify
      pad={false}
      title={title}
      variant="outline"
      wrap={false}
      {...buttonProps}
      onClick={(e) => _onClick?.(e, object)}
      onDragStart={draggable ? onDragStart : undefined}
    >
      {object.children as React.ReactNode}
      <Card title={renderTitle()}>{renderFooter()}</Card>
    </Button>
  );
};
