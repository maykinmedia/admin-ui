import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { useEffect, useState } from "react";

import { Badge, Outline } from "../../components";
import { AttributeData } from "../../lib/data/attributedata";
import { List } from "./list";

const meta: Meta<typeof List> = {
  title: "Templates/List",
  component: List,
  argTypes: { onSubmit: { action: "onSubmit" } },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ListTemplate: Story = {
  args: {
    pageSize: 50,
    objectList: [],
    showPaginator: true,
    sort: true,
    title: "List template",
    fields: ["userId", "id", "title", { active: false, name: "body" }],
    breadcrumbItems: [
      { label: "Home", href: "/" },
      { label: "Templates", href: "#" },
      { label: "List template", href: "#" },
    ],
    primaryNavigationItems: [
      { children: <Outline.HomeIcon />, title: "Home" },
      "spacer",
      { children: <Outline.CogIcon />, title: "Instellingen" },
      { children: <Outline.ArrowRightOnRectangleIcon />, title: "Uitloggen" },
    ],
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
      <List
        {...args}
        count={100}
        dataGridProps={{
          filterable: true,
          fieldsSelectable: true,
        }}
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

export const WithSidebar = {
  ...ListTemplate,
  args: {
    ...ListTemplate.args,
    sidebarItems: [
      {
        active: true,
        align: "space-between",
        children: (
          <>
            Lorem ipsum<Badge level="success">Verwerkt</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
      {
        align: "space-between",
        children: (
          <>
            Dolor<Badge level="warning">In behandeling</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
      {
        align: "space-between",
        children: (
          <>
            Sit<Badge level="danger">Actie vereist</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
      {
        align: "space-between",
        children: (
          <>
            Amet<Badge level="warning">In behandeling</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
    ],
  },
};

export const WithSecondaryNavigation = {
  ...WithSidebar,
  args: {
    ...WithSidebar.args,
    secondaryNavigationItems: [
      <Badge key="badge">In bewerking</Badge>,
      "spacer",
      {
        children: (
          <>
            <Outline.CloudArrowUpIcon />
            Tussentijds Opslaan
          </>
        ),
        pad: "h",
        variant: "transparent",
        wrap: false,
      },
      {
        children: (
          <>
            <Outline.CheckIcon />
            Opslaan en afsluiten
          </>
        ),
        pad: "h",
        variant: "primary",
        wrap: false,
      },
    ],
  },
};
