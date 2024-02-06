import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useState } from "react";

import { Page } from "../page";
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
} satisfies Meta<typeof DataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DataridComponent = {
  args: {
    booleanProps: {
      labelTrue: "This value is true",
      labelFalse: "This value is false",
    },
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
      labelLoading: "Loading",
      labelPagination: "pagination",
      labelCurrentPageRange: "{pageStart} - {pageEnd} of {pageCount}",
      labelGoToPage: "Go to",
      labelPageSize: "Show rows",
      labelPrevious: "Go to previous page",
      labelNext: "Go to next page",
    },
    results: [
      {
        url: "https://www.example.com",
        Omschrijving: "Afvalpas vervangen",
        Versie: 2,
        Actief: false,
        Toekomstig: false,
        Concept: true,
      },
      {
        url: "https://www.example.com",
        Omschrijving: "Erfpacht wijzigen",
        Versie: 4,
        Actief: true,
        Toekomstig: true,
        Concept: true,
      },
      {
        url: "https://www.example.com",
        Omschrijving: "Dakkapel vervangen",
        Versie: 1,
        Actief: false,
        Toekomstig: false,
        Concept: false,
      },
      {
        url: "https://www.example.com",
        Omschrijving: "Dakkapel vervangen",
        Versie: 4,
        Actief: true,
        Toekomstig: true,
        Concept: true,
      },
      {
        url: "https://www.example.com",
        Omschrijving: "Erfpacht wijzigen",
        Versie: 2,
        Actief: false,
        Toekomstig: false,
        Concept: true,
      },
      {
        url: "https://www.example.com",
        Omschrijving: "Dakkapel vervangen",
        Versie: 4,
        Actief: true,
        Toekomstig: true,
        Concept: true,
      },
      {
        url: "https://www.example.com",
        Omschrijving: "Erfpacht wijzigen",
        Versie: 1,
        Actief: false,
        Toekomstig: false,
        Concept: false,
      },
      {
        url: "https://www.example.com",
        Omschrijving: "Dakkapel vervangen",
        Versie: 1,
        Actief: false,
        Toekomstig: false,
        Concept: false,
      },
    ],
    title: "Posts",
    urlFields: ["url"],
  },
};

export const DatagridOnMobile: Story = {
  ...DataridComponent,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    chromatic: {
      viewports: ["mobile1"],
    },
  },
};

export const JSONPlaceholderExample: Story = {
  args: {
    booleanProps: {
      labelTrue: "This value is true",
      labelFalse: "This value is false",
    },
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
      labelLoading: "Loading",
      labelPagination: "pagination",
      labelCurrentPageRange: "{pageStart} - {pageEnd} of {pageCount}",
      labelGoToPage: "Go to",
      labelPageSize: "Show rows",
      labelPrevious: "Go to previous page",
      labelNext: "Go to next page",
    },
    results: [],
    title: "Posts",
  },
  render: (args) => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(args.paginatorProps?.page || 1);
    const [pageSize, setPageSize] = useState<number>(
      args.paginatorProps?.pageSize || 10,
    );
    const [results, setResults] = useState(args.results);
    const paginatorProps = args.paginatorProps as PaginatorProps;

    paginatorProps.pageSize = pageSize;

    useEffect(() => {
      setLoading(true);
      const index = page - 1;
      const abortController = new AbortController();

      fetch("https://jsonplaceholder.typicode.com/posts", {
        signal: abortController.signal,
      })
        .then((response) => response.json())
        .then((data) => {
          // Paginate locally for demonstration purposes.
          const posts = data.slice(
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
    }, [page, pageSize]);

    paginatorProps.loading = loading;
    paginatorProps.onPageChange = (page) => setPage(page);
    paginatorProps.onPageSizeChange = async (pageSize) => setPageSize(pageSize);

    return <DataGrid {...args} results={results} />;
  },
};
