import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { useEffect, useState } from "react";

import { Badge, Outline } from "../../components";
import { AttributeData } from "../../lib";
import { Grid } from "./grid";

const meta: Meta<typeof Grid> = {
  title: "Templates/Grid",
  component: Grid,
  argTypes: { onClick: { action: "onClick" } },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const GridTemplate: Story = {
  args: {
    breadcrumbItems: [
      { label: "Home", href: "/" },
      { label: "Templates", href: "#" },
      { label: "Grid template", href: "#" },
    ],
    primaryNavigationItems: [
      { children: <Outline.HomeIcon />, title: "Home" },
      "spacer",
      { children: <Outline.CogIcon />, title: "Instellingen" },
      { children: <Outline.ArrowRightOnRectangleIcon />, title: "Uitloggen" },
    ],
    title: "The quick brown fox jumps over the lazy dog.",
    fieldset: [`{group}`, { fields: ["title"], title: "title" }],
    groupBy: "alphaIndex",
  },
  render: (args) => {
    const abortController = new AbortController();
    const [objectList, setObjectList] = useState<AttributeData[]>([]);
    // Process sorting and pagination locally in place for demonstration purposes.

    useEffect(() => {
      fetch(`https://jsonplaceholder.typicode.com/photos?_limit=200`, {
        signal: abortController.signal,
      })
        .then((response) => response.json())
        .then((data: AttributeData[]) => {
          setObjectList(
            data.map((d) => ({
              ...d,
              alphaIndex: String(d.title[0]).toUpperCase(),
            })),
          );
        });
    }, [args]);

    const even = objectList.filter((o, index) => index % 2 === 0);
    const odd = objectList.filter((o, index) => index % 2 !== 0);

    return "groupBy" in args ? (
      <Grid objectList={objectList} {...args} />
    ) : (
      <Grid objectLists={[even, odd]} {...args} />
    );
  },
};

export const WithSidebar = {
  ...GridTemplate,
  args: {
    ...GridTemplate.args,
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

export const WithCustomPreview = {
  ...WithSecondaryNavigation,
  args: {
    ...WithSecondaryNavigation.args,
    renderPreview: (attributeData) => (
      <img alt={attributeData.title} src={attributeData.thumbnailUrl} />
    ),
  },
};
