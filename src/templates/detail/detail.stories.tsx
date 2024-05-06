import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Badge, Outline } from "../../components";
import { Detail } from "./detail";

const meta: Meta<typeof Detail> = {
  title: "Templates/Detail",
  component: Detail,
  argTypes: { onSubmit: { action: "onSubmit" } },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DetailTemplate: Story = {
  args: {
    pad: true,
    title: "Detailweergave",
    fieldsets: [
      [
        "Statussen",
        {
          fields: [
            "uitgevoerd afgerond",
            "voorstel voor besluitvorming opgesteld",
          ],
          // span: 6,
        },
      ],
      ["Rollen", { fields: ["klantcontacter", "behandelaar"] }],
      ["Eigenschappen", { fields: ["einde", "begin", "datum vergadering"] }],
      ["Resultaten", { fields: ["goedgekeurd", "afgekeurd"] }],
    ],
    object: {
      afgekeurd: "Goedgekeurd",
      begin: "Erfpacht aanvraag wijzigen (2023-10-28)",
      behandelaar: "Initiator",
      "datum vergadering": "BInG aanvraag behandelen (2023-10-28)",
      einde: "Erfpacht aanvraag wijzigen (2023-10-28)",
      goedgekeurd: "Ingetrokken",
      klantcontacter: "Beslisser",
      "uitgevoerd afgerond": "Afgehandeld",
      "voorstel voor besluitvorming opgesteld": "In behandeling genomen",
    },
    breadcrumbItems: [
      { label: "Home", href: "/" },
      { label: "Templates", href: "#" },
      { label: "Detail template", href: "#" },
    ],
    primaryNavigationItems: [
      { children: <Outline.HomeIcon />, title: "Home" },
      "spacer",
      { children: <Outline.CogIcon />, title: "Instellingen" },
      { children: <Outline.ArrowRightOnRectangleIcon />, title: "Uitloggen" },
    ],
  },
};

export const WithSidebar = {
  ...DetailTemplate,
  args: {
    ...DetailTemplate.args,
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
