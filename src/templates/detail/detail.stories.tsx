import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Badge, Outline } from "../../components";
import { DetailTemplate } from "./detail";

const FIXTURE = {
  afgekeurd: "Goedgekeurd",
  begin: "Erfpacht aanvraag wijzigen (2023-10-28)",
  behandelaar: "Initiator",
  "datum vergadering": "BInG aanvraag behandelen (2023-10-28)",
  einde: "Erfpacht aanvraag wijzigen (2023-10-28)",
  goedgekeurd: "Ingetrokken",
  klantcontacter: "Beslisser",
  "uitgevoerd afgerond": "Afgehandeld",
  "voorstel voor besluitvorming opgesteld": "In behandeling genomen",
};

const meta: Meta<typeof DetailTemplate<typeof FIXTURE>> = {
  title: "Templates/Detail",
  component: DetailTemplate<typeof FIXTURE>,
  argTypes: { onSubmit: { action: "onSubmit" } },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const detailTemplate: Story = {
  args: {
    attributeGridProps: {
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
      object: FIXTURE,
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
  ...detailTemplate,
  args: {
    ...detailTemplate.args,
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
