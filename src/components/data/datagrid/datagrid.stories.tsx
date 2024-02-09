import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useState } from "react";

import { sortAttributeDataArray } from "../../../lib/data/attributedata";
import { Page } from "../../page";
import { PaginatorProps } from "../paginator";
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
    results: [
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

export const DataGridOnMobile: Story = {
  ...DataGridComponent,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    chromatic: {
      viewports: ["mobile1"],
    },
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
    results: [],
    sort: true,
    title: "Posts",
  },
  render: (args) => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(args.paginatorProps?.page || 1);
    const [pageSize, setPageSize] = useState<number>(
      args.paginatorProps?.pageSize || 10,
    );
    const [results, setResults] = useState(args.results);
    const [sort, setSort] = useState<string>("");
    const paginatorProps = args.paginatorProps as PaginatorProps;

    paginatorProps.pageSize = pageSize;

    useEffect(() => {
      setLoading(true);
      const index = page - 1;
      const abortController = new AbortController();

      // Process sorting and pagination locally in place for demonstration purposes.
      fetch("https://jsonplaceholder.typicode.com/posts", {
        signal: abortController.signal,
      })
        .then((response) => response.json())
        .then((data) => {
          // Sort.
          const direction = String(sort).startsWith("-") ? "DESC" : "ASC";
          const sorted = sort
            ? sortAttributeDataArray(
                data,
                String(sort).replace(/^-/, ""),
                direction,
              )
            : data;

          // Paginate.
          const posts = sorted.slice(
            index * pageSize,
            index * pageSize + pageSize,
          );

          setResults(posts);
          setLoading(false);
        });

      return () => {
        abortController.abort();
        setLoading(false);
      };
    }, [page, pageSize, sort]);

    paginatorProps.loading = loading;
    paginatorProps.onPageChange = (page) => setPage(page);
    paginatorProps.onPageSizeChange = async (pageSize) => setPageSize(pageSize);

    return (
      <DataGrid
        {...args}
        results={results}
        onSort={(field) => setSort(field)}
      />
    );
  },
};
