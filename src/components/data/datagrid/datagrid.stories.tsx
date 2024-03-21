import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { useEffect, useState } from "react";

import { AttributeData } from "../../../lib/data/attributedata";
import { Page } from "../../layout";
import { DataGrid } from "./datagrid";

const meta = {
  title: "Data/DataGrid",
  component: DataGrid,
  decorators: [
    (Story) => (
      <Page>
        <Story />
      </Page>
    ),
  ],
  parameters: {
    actions: [], // Prevent auto mocked callback functions.
  },
} satisfies Meta<typeof DataGrid>;

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

      // Process sorting and pagination locally in place for demonstration purposes.
      fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${pageSize}&_sort=${sortKey}&_order=${sortDirection}`,
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
    }, [page, pageSize, sort]);

    return (
      <DataGrid
        {...args}
        count={100}
        objectList={objectList}
        onSort={(field) => setSort(field)}
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
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
};

export const SelectableRows: Story = {
  ...JSONPlaceholderExample,
  args: {
    ...JSONPlaceholderExample.args,
    selectable: true,
  },
  argTypes: {
    onSelect: { action: "onSelect" },
    onSelectionChange: { action: "onSelectionChange" },
  },
};
