import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Badge, Outline } from "../../components";
import { DetailTemplate as DetailTemplateComponent } from "./detail";

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

const meta: Meta<typeof DetailTemplateComponent<typeof FIXTURE>> = {
  title: "Templates/Detail",
  component: DetailTemplateComponent<typeof FIXTURE>,
  argTypes: { onSubmit: { action: "onSubmit" } },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DetailTemplate: Story = {
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
      {
        componentType: "button",
        children: <Outline.HomeIcon />,
        title: "Home",
      },
      "spacer",
      {
        componentType: "button",
        children: <Outline.CogIcon />,
        title: "Instellingen",
      },
      {
        componentType: "button",
        children: <Outline.ArrowRightOnRectangleIcon />,
        title: "Uitloggen",
      },
    ],
  },
};

export const WithSidebar: Story = {
  ...DetailTemplate,
  args: {
    ...DetailTemplate.args,
    sidebarItems: [
      {
        componentType: "button",
        active: true,
        align: "space-between",
        children: (
          <>
            Lorem ipsum<Badge variant="success">Verwerkt</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
      {
        componentType: "button",
        align: "space-between",
        children: (
          <>
            Dolor<Badge variant="warning">In behandeling</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
      {
        componentType: "button",
        align: "space-between",
        children: (
          <>
            Sit<Badge variant="danger">Actie vereist</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
      {
        componentType: "button",
        align: "space-between",
        children: (
          <>
            Amet<Badge variant="warning">In behandeling</Badge>
          </>
        ),
        justify: true,
        variant: "transparent",
      },
    ],
  },
};

export const WithSecondaryNavigation: Story = {
  ...WithSidebar,
  args: {
    ...WithSidebar.args,
    secondaryNavigationItems: [
      <Badge key="badge">In bewerking</Badge>,
      "spacer",
      {
        componentType: "button",
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
        componentType: "button",
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
