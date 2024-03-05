import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { useEffect, useState } from "react";

import { AttributeData } from "../../lib/data/attributedata";
import { List } from "./list";

const meta = {
  title: "Templates/List",
  component: List,
  argTypes: { onSubmit: { action: "onSubmit" } },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ListTemplate: Story = {
  args: {
    pageSize: 50,
    results: [],
    showPaginator: true,
    sort: true,
    title: "Lijstweergave",
  },
  render: (args) => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(args.paginatorProps?.page || 1);
    const [pageSize, setPageSize] = useState<number>(args.pageSize || 10);
    const [results, setResults] = useState<AttributeData[]>([]);
    const [sort, setSort] = useState<string>("");

    /**
     * Fetches data from jsonplaceholder.typicode.com.
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
          setResults(data);
          setLoading(false);
        });

      return () => {
        abortController.abort();
        setLoading(false);
      };
    }, [page, pageSize, sort]);

    return (
      <List
        {...args}
        count={100}
        results={results}
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
