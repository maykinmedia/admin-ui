import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { FIXTURE_PRODUCTS } from "../../../../.storybook/fixtures/products";
import { Button } from "../../button";
import { Page } from "../../layout";
import { DataGrid } from "./datagrid";

const meta: Meta<typeof DataGrid> = {
  title: "Data/DataGrid",
  component: DataGrid,
  decorators: [
    (Story) => (
      <Page pad={false}>
        <Story />
      </Page>
    ),
  ],
  parameters: {
    actions: [], // Prevent auto mocked callback functions.
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Typical example: a subset of `fields` from `objectList` representing one of
 * multiple pages.
 *
 * `fields` prop accepts an array of either `string` or `TypedField` values,
 * Please refer to `TypedField` for advanced usage.
 */
export const DataGridComponent = {
  args: {
    title: "Products",
    objectList: FIXTURE_PRODUCTS,
    fields: ["name", "category", "price", "stock", "isAvailable"],
    urlFields: ["url"],
    paginatorProps: {
      count: 100,
      page: 1,
      pageSize: 10,
      pageSizeOptions: [
        { label: 10 },
        { label: 20 },
        { label: 30 },
        { label: 40 },
        { label: 50 },
      ],
    },
  },
};

/**
 * Minimal example with only required props showing a simple table.
 */
export const MinimalExample = {
  args: {
    objectList: FIXTURE_PRODUCTS,
  },
};

/**
 * pass `true` to `decorate` prop to use value decoration (see `Value` component).
 */
export const Decorated: Story = {
  ...DataGridComponent,
  args: {
    ...DataGridComponent.args,
    decorate: true,
  },
};

/**
 * Pass `true` to `editable` prop to allow values to be edited, the exact fields
 * to be editable can be controlled by passing `TypedField` items to the `fields`
 * prop.
 */
export const EditableRows: Story = {
  ...DataGridComponent,
  args: {
    ...DataGridComponent.args,
    fields: ["name", "category", "price", "stock", "isAvailable"],
    editable: true,
  },
  argTypes: {
    onEdit: { action: "onEdit" },
  },
};

/**
 * Pass `true` to `fieldsSelectable` prop to allow fields to be selectable, the
 * default fields be active can be controlled by passing `TypedField` items to
 * the `fields` prop.
 */
export const FieldsSelectable: Story = {
  ...DataGridComponent,
  args: {
    ...DataGridComponent.args,
    fields: [
      { name: "id", type: "number", active: false },
      "name",
      "category",
      "price",
      "stock",
      "isAvailable",
      { name: "releaseDate", type: "date", active: false },
    ],
    fieldsSelectable: true,
  },
  argTypes: {
    onFieldsChange: { action: "onFieldsChange" },
  },
};

/**
 * Pass `true` to `filterable` prop to allow values to be filtered, the exact fields
 * to be filterable can be controlled by passing `TypedField` items to the `fields`
 * prop.
 */
export const Filterable: Story = {
  ...DataGridComponent,
  args: {
    ...DataGridComponent.args,
    filterable: true,
    fields: [
      "name",
      "category",
      { name: "price", type: "number", filterable: false },
      { name: "stock", type: "number", filterable: false },
      { name: "isAvailable", type: "boolean" },
    ],
  },
  argTypes: {
    onFilter: { action: "onFilter" },
  },
};

/**
 * pass a `true` to `selectable` to allow selecting rows.
 */
export const Selectable: Story = {
  ...DataGridComponent,
  args: {
    ...DataGridComponent.args,
    selectable: true,
    allowSelectAll: false,
    selectionActions: [
      {
        children: "Buy!",
        name: "order",
        onClick: ({ detail }) => {
          // @ts-expect-error - TODO: type should be fixed
          alert(`${detail.length} items selected.`);
        },
      },
    ],
  },
  argTypes: {
    onSelect: { action: "onSelect" },
    onSelectionChange: { action: "onSelectionChange" },
    onSelectAllPages: { action: "onSelectAllPages" },
  },
};

/**
 * Pass a function `(item1: AttributeData, item2: AttributeData) => bool`) to the `equalityChecker` prop to allow items
 * in `selected` to be matched to item in `objectList`. If `equalityChecker` is omitted: strict checking
 * (`item1 === item2`) is used to determine a match.
 */
export const SelectionMatchEqualityChecker: Story = {
  ...Selectable,
  args: {
    ...Selectable.args,
    selected: [
      {
        id: 1,
      },
      {
        id: 5,
      },
    ],
    equalityChecker: (item1, item2) => item1?.id === item2?.id,
  },
};

/**
 * pass `true` to `sort` prop to use sorting, sorting will be performed locally
 * if no `onSort` prop is passed.
 */
export const Sortable: Story = {
  ...DataGridComponent,
  args: {
    ...DataGridComponent.args,
    sort: true,
  },
  // Don't set argTypes.onSort as it will result in a onSort prop being passed.
};

/**
 * pass a `string` to `sort` (optionally prefix by `-` to invert sorting) prop
 * to set a predefined order.
 */
export const Sorted: Story = {
  ...Sortable,
  args: {
    ...Sortable.args,
    sort: "-price",
  },
};

export const FilterableSelectableSortable: Story = {
  args: {
    objectList: FIXTURE_PRODUCTS,
    fields: [
      "name",
      "category",
      { name: "price", type: "number", filterable: false },
      { name: "stock", type: "number", filterable: false },
      { name: "isAvailable", type: "boolean" },
    ],
    filterable: true,
    selectable: true,
    selected: [
      {
        id: 1,
      },
      {
        id: 5,
      },
    ],
    equalityChecker: (item1, item2) => item1?.id === item2?.id,
    allowSelectAll: true,
    selectionActions: [
      {
        children: "Buy!",
        name: "order",
        onClick: ({ detail }) => {
          // @ts-expect-error - TODO: type should be fixed
          alert(`${detail.length} items selected.`);
        },
      },
    ],
    sort: "price",
  },
  argTypes: {
    onFilter: { action: "onFilter" },
    onSelect: { action: "onSelect" },
    onSelectionChange: { action: "onSelectionChange" },
    onSelectAllPages: { action: "onSelectAllPages" },
    onSort: { action: "onSort" },
  },
};

/**
 * Pass `date` as `type` field on `TypedField` on filterable DataGrid to allow
 * specifying a specific date.
 */
export const DateFilter: Story = {
  ...Filterable,
  args: {
    ...Filterable.args,
    fields: [
      "name",
      "category",
      "price",
      "stock",
      "isAvailable",
      { name: "releaseDate", type: "date" },
    ],
  },
  argTypes: {
    onFilter: {
      action: "onFilter",
    },
  },
};

/**
 * Pass `daterange` as `type` field on `TypedField` on filterable DataGrid to
 * allow specifying a start and end date.
 */
export const DateRangeFilter: Story = {
  ...Filterable,
  args: {
    ...Filterable.args,
    fields: [
      "name",
      "category",
      "price",
      "stock",
      "isAvailable",
      { name: "releaseDate", type: "daterange" },
    ],
  },
  argTypes: {
    onFilter: {
      action: "onFilter",
    },
  },
};

export const JSXAsValue: Story = {
  ...DataGridComponent,
  args: {
    ...DataGridComponent.args,
    fields: ["name", "category", "price", "stock", "isAvailable", "action"],
    objectList: DataGridComponent.args.objectList.map((item) => ({
      ...item,
      action: (
        <Button pad="h" variant="secondary">
          Buy!
        </Button>
      ),
    })),
  },
};
