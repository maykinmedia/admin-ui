import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Badge } from "../../components";
import { Detail } from "./detail";

const meta = {
  title: "Templates/Detail",
  component: Detail,
  argTypes: { onSubmit: { action: "onSubmit" } },
} satisfies Meta<typeof Detail>;

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
