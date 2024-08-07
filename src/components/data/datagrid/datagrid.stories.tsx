import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { useEffect, useState } from "react";

import { SerializedFormData } from "../../../lib";
import { AttributeData } from "../../../lib/data/attributedata";
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

export const DataGridComponent = {
  args: {
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
    objectList: [
      {
        url: "https://www.example.com",
        Omschrijving: "Afvalpas vervangen",
        Zaaktype: "https://www.example.com",
        Versie: 2,
        Opmerkingen: null,
        Actief: false,
        Toekomstig: false,
        Concept: true,
      },
      {
        url: "https://www.example.com",
        Omschrijving: "Erfpacht wijzigen",
        Zaaktype: "https://www.example.com",
        Versie: 4,
        Opmerkingen: null,
        Actief: true,
        Toekomstig: true,
        Concept: true,
      },
      {
        url: "https://www.example.com",
        Omschrijving: "Dakkapel vervangen",
        Zaaktype: "https://www.example.com",
        Versie: 1,
        Opmerkingen: null,
        Actief: false,
        Toekomstig: false,
        Concept: false,
      },
      {
        url: "https://www.example.com",
        Omschrijving: "Dakkapel vervangen",
        Zaaktype: "https://www.example.com",
        Versie: 4,
        Opmerkingen: null,
        Actief: true,
        Toekomstig: true,
        Concept: true,
      },
      {
        url: "https://www.example.com",
        Omschrijving: "Erfpacht wijzigen",
        Zaaktype: "https://www.example.com",
        Versie: 2,
        Opmerkingen: null,
        Actief: false,
        Toekomstig: false,
        Concept: true,
      },
      {
        url: "https://www.example.com",
        Omschrijving: "Dakkapel vervangen",
        Zaaktype: "https://www.example.com",
        Versie: 4,
        Opmerkingen: null,
        Actief: true,
        Toekomstig: true,
        Concept: true,
      },
      {
        url: "https://www.example.com",
        Omschrijving: "Erfpacht wijzigen",
        Zaaktype: "https://www.example.com",
        Versie: 1,
        Opmerkingen: null,
        Actief: false,
        Toekomstig: false,
        Concept: false,
      },
      {
        url: "https://www.example.com",
        Omschrijving: "Dakkapel vervangen",
        Zaaktype: "https://www.example.com",
        Versie: 1,
        Opmerkingen: null,
        Actief: false,
        Toekomstig: false,
        Concept: false,
      },
    ],
    title: "Posts",
    urlFields: ["url"],
  },
};

export const DecoratedDataGrid: Story = {
  ...DataGridComponent,
  args: {
    ...DataGridComponent.args,
    decorate: true,
  },
};

export const SortableDataGrid: Story = {
  ...DataGridComponent,
  args: {
    ...DataGridComponent.args,
    sort: true,
  },
};

export const SortedDataGrid: Story = {
  ...DataGridComponent,
  args: {
    ...DataGridComponent.args,
    sort: "Versie",
  },
};

export const JSONPlaceholderExample: Story = {
  args: {
    objectList: [],
    showPaginator: true,
    sort: true,
    title: "Posts",
  },
  render: (args) => {
    const [filterState, setFilterState] = useState<AttributeData>();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(args.paginatorProps?.page || 1);
    const [pageSize, setPageSize] = useState<number>(args.pageSize || 10);
    const [objectList, setObjectList] = useState<AttributeData[]>([]);
    const [sort, setSort] = useState<string>("");

    /**
     * Fetches object from jsonplaceholder.typicode.com.
     */
    useEffect(() => {
      setLoading(true);
      const abortController = new AbortController();
      const sortKey = sort.replace(/^-/, "");
      const sortDirection = sort.startsWith("-") ? "desc" : "asc";

      const filters = filterState
        ? Object.fromEntries(
            Object.entries(filterState)
              .filter(([, value]) => value)
              .map(([key, value]) => [key, String(value)]),
          )
        : {};
      const searchParams = new URLSearchParams(filters);

      // Process sorting and pagination locally in place for demonstration purposes.
      fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${pageSize}&_sort=${sortKey}&_order=${sortDirection}&${searchParams}`,
        {
          signal: abortController.signal,
        },
      )
        .then((response) => response.json())
        .then((data: AttributeData[]) => {
          setObjectList(data);
          setLoading(false);
        });

      return () => {
        abortController.abort();
        setLoading(false);
      };
    }, [filterState, page, pageSize, sort]);

    return (
      <DataGrid
        {...args}
        count={100}
        objectList={objectList}
        loading={loading}
        page={page}
        pageSize={pageSize}
        pageSizeOptions={[
          { label: 10 },
          { label: 20 },
          { label: 30 },
          { label: 40 },
          { label: 50 },
        ]}
        selected={
          // SelectableRows story
          args.selected ||
          (args.selectable
            ? objectList.length > 0
              ? [objectList[1], objectList[3], objectList[4]]
              : undefined
            : undefined)
        }
        equalityChecker={args.equalityChecker}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSort={(field) => setSort(field)}
        onEdit={async (rowData: SerializedFormData) => {
          setLoading(true);
          await fetch(
            `https://jsonplaceholder.typicode.com/posts/${rowData.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(rowData),
            },
          );
          const index = objectList.findIndex(
            (r) => Number(r.id) === rowData.id,
          );
          const newObjectList = [...objectList];
          newObjectList[index] = rowData as AttributeData;
          setObjectList(newObjectList);
          setLoading(false);
        }}
        onFilter={(data) => {
          setPage(1);
          setFilterState(data);
        }}
      />
    );
  },
};

export const SelectableRows: Story = {
  ...JSONPlaceholderExample,
  args: {
    ...JSONPlaceholderExample.args,
    fields: ["userId", "id", "title"],
    selectable: true,
    allowSelectAll: false,
    selectionActions: [
      {
        children: "Aanmaken",
        name: "create",
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

export const SelectableRowsWithCustomMatchFunction: Story = {
  ...JSONPlaceholderExample,
  args: {
    ...JSONPlaceholderExample.args,
    fields: ["userId", "id", "title"],
    selectable: true,
    selectionActions: [
      {
        children: "Aanmaken",
        name: "create",
        onClick: ({ detail }) => {
          // @ts-expect-error: TODO: type should be fixed
          alert(`${detail.length} items selected.`);
        },
      },
    ],
    selected: [
      {
        userId: 1,
        id: 1,
        title:
          "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
      },
      {
        userId: 1,
        id: 5,
        title: "nesciunt quas odio",
        body: "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque",
      },
    ],
    equalityChecker: (item1, item2) => item1.id === item2.id,
  },
  argTypes: {
    onSelect: { action: "onSelect" },
    onSelectionChange: { action: "onSelectionChange" },
  },
};

export const EditableRows: Story = {
  ...JSONPlaceholderExample,
  args: {
    ...JSONPlaceholderExample.args,
    // editable: true,
    fields: [
      {
        type: "number",
        name: "userId",
        options: [
          { label: 1, value: 1 },
          { label: 2, value: 2 },
        ],
        editable: true,
      },
      { name: "id", type: "number", editable: false },
      "title",
      {
        type: "boolean",
        name: "published",
      },
    ],
  },
  argTypes: {
    onEdit: { action: "onEdit" },
  },
};

export const FilterableRows: Story = {
  ...JSONPlaceholderExample,
  args: {
    ...JSONPlaceholderExample.args,
    filterable: true,
    fields: [
      {
        type: "number",
        name: "userId",
        options: [
          { label: 1, value: 1 },
          { label: 2, value: 2 },
        ],
      },
      { name: "id", type: "number", editable: false },
      "title",
      {
        type: "boolean",
        name: "published",
      },
    ],
  },
};

export const FieldsSelectable: Story = {
  ...JSONPlaceholderExample,
  args: {
    ...JSONPlaceholderExample.args,
    filterable: true,
    fields: [
      {
        type: "number",
        name: "userId",
        options: [
          { label: 1, value: 1 },
          { label: 2, value: 2 },
        ],
      },
      { name: "id", type: "number", editable: false },
      "title",
      {
        active: false,
        type: "boolean",
        name: "published",
      },
    ],
    fieldsSelectable: true,
  },
  argTypes: {
    onFieldsChange: { action: "onFieldsChange" },
  },
};

export const DateRangeFilter: Story = {
  argTypes: {
    onFilter: {
      action: "onFilter",
    },
  },
  args: {
    fields: [
      {
        name: "firstName",
        type: "string",
      },
      {
        name: "lastName",
        type: "string",
      },
      {
        name: "dateOfBirth",
        type: "daterange",
      },
    ],
    filterable: true,
    filterTransform: (data) => {
      const { dateOfBirth, ..._data } = data;
      const [dateOfBirth__gte = "", dateOfBirth__lte = ""] =
        String(dateOfBirth).split("/");
      return { dateOfBirth__gte, dateOfBirth__lte, ..._data };
    },
    objectList: [
      {
        firstName: "Albert",
        lastName: "Einstein",
        dateOfBirth: "1879-03-14",
      },
      {
        firstName: "Marie",
        lastName: "Curie",
        dateOfBirth: "1867-11-07",
      },
      {
        firstName: "Martin",
        lastName: "Luther King Jr.",
        dateOfBirth: "1929-01-15",
      },
      {
        firstName: "Nelson",
        lastName: "Mandela",
        dateOfBirth: "1918-07-18",
      },
      {
        firstName: "Isaac",
        lastName: "Newton",
        dateOfBirth: "1643-01-04",
      },
      {
        firstName: "Mahatma",
        lastName: "Gandhi",
        dateOfBirth: "1869-10-02",
      },
      {
        firstName: "Ada",
        lastName: "Lovelace",
        dateOfBirth: "1815-12-10",
      },
      {
        firstName: "Leonardo",
        lastName: "da Vinci",
        dateOfBirth: "1452-04-15",
      },
      {
        firstName: "Galileo",
        lastName: "Galilei",
        dateOfBirth: "1564-02-15",
      },
      {
        firstName: "Charles",
        lastName: "Darwin",
        dateOfBirth: "1809-02-12",
      },
    ],
  },
};

export const JSXAsValue: Story = {
  args: {
    objectList: [
      {
        Id: 1,
        Name: "Some product",
        action: <Button variant="secondary">Buy!</Button>,
      },
      {
        Id: 2,
        Name: "Some other product",
        action: <Button variant="secondary">Buy!</Button>,
      },
    ],
  },
};
