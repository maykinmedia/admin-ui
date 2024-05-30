import React, { useEffect, useState } from "react";

import { Button, ButtonProps } from "../../button";
import { Select } from "../../form";
import { Column, Grid } from "../../layout";
import { Body, H2, H3 } from "../../typography";
import "./kanban.scss";

export type KanbanProps = {
  /** If set, items are `draggable` allowing the user to rearrange them (across columns). */
  draggable?: boolean;
  /** The kanban "change column" (accessible) label. It will be shown as an accessible label when selecting columns */
  labelSelectColumn?: string;

  /** The kanban "move object position" (accessible) label. It will be shown as an accessible label on dragging */
  labelMoveObject?: string;

  /** Get called when the componentList changes. */
  onComponentListChange?: (componentList: KanbanColumn[]) => void;

  /** Get called when a component changes columns. */
  onComponentChange?: (
    movedComponent: React.ReactNode,
    sourceColumnIndex: number,
    sourceObjectIndex: number,
    targetColumnIndex: number,
    targetObjectIndex: number,
  ) => void;

  /** The new componentList prop defining columns and their items */
  componentList: KanbanColumn[];

  /** The title of the kanban */
  title?: string;
};

export type KanbanColumn = {
  title: string;
  items: React.ReactNode[];
};

export type KanbanDragData = {
  sourceColumnIndex: number;
  sourceObjectIndex: number;
};

export const Kanban: React.FC<KanbanProps> = ({
  componentList,
  draggable = false,
  labelSelectColumn,
  labelMoveObject,
  onComponentListChange,
  title,
  onComponentChange,
  ...props
}) => {
  const [dragIndexState, setDragIndexState] = useState<[number, number] | null>(
    null,
  );
  const [componentListState, setComponentListState] =
    useState<KanbanColumn[]>(componentList);

  useEffect(() => {
    setComponentListState(componentList);
  }, [componentList]);

  const handleDragOver: React.DragEventHandler = (e) => {
    e.preventDefault();
    const currentTarget = e.currentTarget as HTMLElement;
    const columnIndex = parseInt(currentTarget.dataset.columnIndex || "0");
    const insertIndex = getInsertIndex(
      Array.from(currentTarget.children),
      e.clientY,
    );
    setDragIndexState([columnIndex, insertIndex]);
  };

  const handleDrop: React.DragEventHandler = (e) => {
    e.preventDefault();
    const [targetColumnIndex, targetObjectIndex] = dragIndexState || [0, 0];
    setDragIndexState(null);

    const json = e.dataTransfer.getData("application/json");
    const { sourceColumnIndex, sourceObjectIndex }: KanbanDragData = json
      ? JSON.parse(json)
      : {};

    if (typeof sourceColumnIndex !== "undefined") {
      const object =
        componentListState[sourceColumnIndex].items[sourceObjectIndex];
      moveObject(
        object,
        sourceColumnIndex,
        targetColumnIndex,
        sourceObjectIndex,
        targetObjectIndex,
      );
    }
  };

  const moveObject = (
    object: React.ReactNode,
    sourceColumnIndex: number,
    targetColumnIndex: number,
    sourceObjectIndex: number,
    targetObjectIndex: number,
  ) => {
    const newComponentListState = [...componentListState];
    const sourceItems = newComponentListState[sourceColumnIndex].items;
    const targetItems = newComponentListState[targetColumnIndex].items;
    const _targetObjectIndex =
      targetObjectIndex === -1 ? targetItems.length : targetObjectIndex;

    sourceItems.splice(sourceObjectIndex, 1);
    targetItems.splice(_targetObjectIndex, 0, object);

    setComponentListState(newComponentListState);
    onComponentListChange?.(newComponentListState);
    onComponentChange?.(
      object,
      sourceColumnIndex,
      sourceObjectIndex,
      targetColumnIndex,
      _targetObjectIndex,
    );
  };

  const getInsertIndex = (children: Element[], y: number): number => {
    const yPositions = Array.from(children).map(
      (n) => n.getBoundingClientRect().top,
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
        <Grid cols={componentListState.length}>
          {componentListState.map((column, columnIndex) => {
            const count = column.items.length;
            return (
              <div key={columnIndex}>
                <H3>
                  {column.title}
                  <div className="mykn-kanban__count">{count}</div>
                </H3>
                <KanbanSection
                  columnIndex={columnIndex}
                  items={column.items}
                  draggable={draggable}
                  dragIndex={dragIndexState}
                  labelSelectColumn={labelSelectColumn}
                  labelMoveObject={labelMoveObject}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  moveObject={moveObject}
                  componentListState={componentListState}
                />
              </div>
            );
          })}
        </Grid>
      </Body>
    </div>
  );
};
export type KanbanSectionProps = {
  columnIndex: number;
  items: React.ReactNode[];
  draggable?: boolean;
  dragIndex: [number, number] | null;
  labelSelectColumn?: string;
  labelMoveObject?: string;
  onDragOver: React.DragEventHandler;
  onDrop: React.DragEventHandler;
  moveObject: (
    object: React.ReactNode,
    sourceColumnIndex: number,
    targetColumnIndex: number,
    sourceObjectIndex: number,
    targetObjectIndex: number,
  ) => void;
  componentListState: KanbanColumn[];
};

export const KanbanSection: React.FC<KanbanSectionProps> = ({
  columnIndex,
  items,
  draggable,
  dragIndex,
  onDragOver,
  onDrop,
  moveObject,
  labelSelectColumn,
  labelMoveObject,
  componentListState,
}) => {
  const isDragging = Boolean(dragIndex && dragIndex[0] === columnIndex);

  return (
    <Column
      span={1}
      direction="column"
      gap={true}
      className={isDragging ? "mykn-kanban__drop-target" : undefined}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-column-index={columnIndex}
    >
      {items.map((item, index) => (
        <KanbanItem
          key={index}
          item={item}
          draggable={draggable}
          columnIndex={columnIndex}
          objectIndex={index}
          moveObject={moveObject}
          labelSelectColumn={labelSelectColumn}
          labelMoveObject={labelMoveObject}
          componentListState={componentListState}
        />
      ))}
      {isDragging && (dragIndex?.[1] || 0) >= items.length && (
        <div className="mykn-kanban__drop-indicator" aria-hidden />
      )}
    </Column>
  );
};
export type KanbanItemProps = {
  buttonProps?: ButtonProps;
  draggable?: boolean;
  item: React.ReactNode;
  columnIndex: number;
  objectIndex: number;
  moveObject: (
    object: React.ReactNode,
    sourceColumnIndex: number,
    targetColumnIndex: number,
    sourceObjectIndex: number,
    targetObjectIndex: number,
  ) => void;
  labelSelectColumn?: string;
  labelMoveObject?: string;
  componentListState: KanbanColumn[];
};

export const KanbanItem: React.FC<KanbanItemProps> = ({
  buttonProps,
  draggable,
  item,
  columnIndex,
  objectIndex,
  moveObject,
  labelSelectColumn = "Select column",
  labelMoveObject = "Select position",
  componentListState,
}) => {
  const [selectedColumn, setSelectedColumn] = useState(columnIndex);
  const [selectedPosition, setSelectedPosition] = useState(objectIndex);

  const onDragStart = (
    e: React.DragEvent,
    columnIndex: number,
    objectIndex: number,
  ) => {
    const data: KanbanDragData = {
      sourceColumnIndex: columnIndex,
      sourceObjectIndex: objectIndex,
    };
    e.dataTransfer.setData("application/json", JSON.stringify(data));
  };

  const handleColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetColumnIndex = parseInt(e.target.value);
    setSelectedColumn(targetColumnIndex);
    moveObject(item, columnIndex, targetColumnIndex, objectIndex, -1);
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetPositionIndex = parseInt(e.target.value);
    setSelectedPosition(targetPositionIndex);
    moveObject(
      item,
      columnIndex,
      selectedColumn,
      objectIndex,
      targetPositionIndex,
    );
  };

  const columnOptions = componentListState.map((column, index) => ({
    label: column.title,
    value: index.toString(),
  }));

  const positionOptions = componentListState[selectedColumn].items.map(
    (_, index) => ({
      label: `Position ${index + 1}`,
      value: index.toString(),
    }),
  );

  return (
    <Button
      align="start"
      draggable={draggable}
      justify
      variant="transparent"
      wrap={false}
      {...buttonProps}
      onDragStart={(e) => onDragStart(e, columnIndex, objectIndex)}
    >
      <div className="mykn-kanban__item">{item}</div>
      {draggable && (
        <>
          <Select
            aria-label={labelSelectColumn}
            value={selectedColumn.toString()}
            options={columnOptions}
            required
            textSize="xs"
            onClick={(e) => e.preventDefault()}
            onChange={handleColumnChange}
          />
          <Select
            aria-label={labelMoveObject}
            value={selectedPosition.toString()}
            options={positionOptions}
            required
            textSize="xs"
            onClick={(e) => e.preventDefault()}
            onChange={handlePositionChange}
          />
        </>
      )}
    </Button>
  );
};
