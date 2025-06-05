import type { Meta, StoryObj } from "@storybook/react-webpack5";
import * as React from "react";

import { PAGE_DECORATOR } from "../../../../.storybook/decorators";
import { FIXTURE_PRODUCTS } from "../../../../.storybook/fixtures/products";
import { Button } from "../../button";
import { DataGrid, DataGridProps } from "./datagrid";

const meta: Meta<typeof DataGrid<(typeof FIXTURE_PRODUCTS)[number]>> = {
  title: "Data/DataGrid",
  component: DataGrid<(typeof FIXTURE_PRODUCTS)[number]>,
  decorators: [PAGE_DECORATOR],
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
  argTypes: {
    onPageChange: { action: "onPageChange" },
    onPageSizeChange: { action: "onPageSizeChange" },
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
  args: {
    objectList: FIXTURE_PRODUCTS,
    decorate: true,
  },
};

/**
 * Pass `true` to `editable` prop to allow values to be edited, the exact fields
 * to be editable can be controlled by passing `TypedField` items to the `fields`
 * prop.
 */
export const Editable: Story = {
  args: {
    objectList: FIXTURE_PRODUCTS,
    fields: ["name", "category", "price", "stock", "isAvailable"],
    editable: true,
  },
  argTypes: {
    ...DataGridComponent.argTypes,
    onEdit: { action: "onEdit" },
  },
};

/**
 * Pass `true` to `fieldsSelectable` prop to allow fields to be selectable, the
 * default fields be active can be controlled by passing `TypedField` items to
 * the `fields` prop.
 */
export const FieldsSelectable: Story = {
  args: {
    objectList: FIXTURE_PRODUCTS,
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
    ...DataGridComponent.argTypes,
    onFieldsChange: { action: "onFieldsChange" },
  },
};

export const FieldsSelectableOverflow: Story = {
  args: {
    objectList: FIXTURE_PRODUCTS,
    fields: [
      { name: "id", type: "number", active: false },
      "name",
      "category",
      "price",
      "stock",
      "isAvailable",
      { name: "releaseDate", type: "date", active: false },
      { name: "overflowFilter1", active: false },
      { name: "overflowFilter2", active: false },
      { name: "overflowFilter3", active: false },
      { name: "overflowFilter4", active: false },
      { name: "overflowFilter5", active: false },
      { name: "overflowFilter6", active: false },
      { name: "overflowFilter7", active: false },
      { name: "overflowFilter8", active: false },
      { name: "overflowFilter9", active: false },
      { name: "overflowFilter10", active: false },
      { name: "overflowFilter11", active: false },
      { name: "overflowFilter12", active: false },
      { name: "overflowFilter13", active: false },
      { name: "overflowFilter14", active: false },
      { name: "overflowFilter15", active: false },
      { name: "overflowFilter16", active: false },
      { name: "overflowFilter17", active: false },
      { name: "overflowFilter18", active: false },
      { name: "overflowFilter19", active: false },
      { name: "overflowFilter20", active: false },
    ],
    fieldsSelectable: true,
  },
  argTypes: {
    ...DataGridComponent.argTypes,
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
    ...DataGridComponent.argTypes,
    onFilter: { action: "onFilter" },
    filterTransform: { action: "filterTransform" },
  },
};

/**
 * Without the `onFilter` prop, filter is applied to `objectList` without external
 * processing.
 */
export const LocalFilter: Story = {
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
};

/**
 * Minimal example with only required props showing a simple table.
 */
export const Paginated = {
  args: {
    objectList: FIXTURE_PRODUCTS,
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
 * pass a `true` to `selectable` to allow selecting rows.
 */
export const Selectable: Story = {
  args: {
    objectList: FIXTURE_PRODUCTS,
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
    ...DataGridComponent.argTypes,
    onSelect: { action: "onSelect" },
    onSelectionChange: { action: "onSelectionChange" },
    onSelectAllPages: { action: "onSelectAllPages" },
  },
};

/**
 * Pass a function `(item1, item2) => bool`) to the `equalityChecker` prop to
 * allow items in `selected` to be matched to item in `objectList`. If
 * `equalityChecker` is omitted: strict checking (`item1 === item2`) is used to
 * determine a match.
 */
export const SelectionMatchEqualityChecker: Story = {
  args: {
    objectList: FIXTURE_PRODUCTS,
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
  } as Partial<
    DataGridProps<{ id: number } & (typeof FIXTURE_PRODUCTS)[number]>
  >,
};

/**
 * pass `true` to `sort` prop to use sorting, sorting will be performed locally
 * if no `onSort` prop is passed.
 */
export const Sortable: Story = {
  args: {
    objectList: FIXTURE_PRODUCTS,
    sort: true,
  },
  // Don't set argTypes.onSort as it will result in a onSort prop being passed
  // preventing built-in sort (external sorting is expected in such cases).
};

/**
 * pass `false` to `field.sortable` to exclude field from sorting.
 */
export const FieldExcludedFromSortable: Story = {
  args: {
    fields: [
      "name",
      "category",
      "price",
      "stock",
      "isAvailable",
      { name: "action", type: "jsx", sortable: false },
    ],
    objectList: FIXTURE_PRODUCTS.map((item) => ({
      ...item,
      action: (
        <Button pad="h" variant="secondary">
          Buy!
        </Button>
      ),
    })),
    sort: true,
  },
  // Don't set argTypes.onSort as it will result in a onSort prop being passed
  // preventing built-in sort (external sorting is expected in such cases).
};

/**
 * pass `true` to `field.sortable` to explicitly allow sorting on field.
 */
export const SingleFieldSortable: Story = {
  args: {
    fields: [
      { name: "id", type: "number", sortable: true },
      "name",
      "category",
      "price",
      "stock",
      "isAvailable",
    ],
    objectList: FIXTURE_PRODUCTS,
  },
  // Don't set argTypes.onSort as it will result in a onSort prop being passed
  // preventing built-in sort (external sorting is expected in such cases).
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

export const FilterablePaginatedSelectableSortable: Story = {
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
    selectable: true,
    selected: [
      {
        id: 1,
      },
      {
        id: 5,
      },
    ],
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
  } as DataGridProps<{ id: number } & (typeof FIXTURE_PRODUCTS)[number]>,
  argTypes: {
    ...DataGridComponent.argTypes,
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
    ...Filterable.argTypes,
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
};

export const FillAvailableSpace: Story = {
  args: {
    objectList: FIXTURE_PRODUCTS,
    height: "fill-available-space",
    fields: [
      "name",
      "category",
      { name: "price", type: "number", filterable: false },
      { name: "stock", type: "number", filterable: false },
      { name: "isAvailable", type: "boolean" },
    ],
    filterable: true,
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
  argTypes: {
    ...DataGridComponent.argTypes,
    onFilter: { action: "onFilter" },
    onSelect: { action: "onSelect" },
    onSelectionChange: { action: "onSelectionChange" },
    onSelectAllPages: { action: "onSelectAllPages" },
    onSort: { action: "onSort" },
  },
};

export const JSXAsValue: Story = {
  args: {
    // @ts-expect-error - fixme
    fields: ["name", "category", "price", "stock", "isAvailable", "action"],
    objectList: FIXTURE_PRODUCTS.map((item) => ({
      ...item,
      action: (
        <Button pad="h" variant="secondary">
          Buy!
        </Button>
      ),
    })),
  },
};
