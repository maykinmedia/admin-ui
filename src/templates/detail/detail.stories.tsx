import type { Meta, StoryObj } from "@storybook/react";

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
    fieldsets: [
      [
        "Statussen",
        {
          fields: [
            "uitgevoerd afgerond",
            "voorstel voor besluitvorming opgesteld",
          ],
          span: 7,
        },
      ],
      ["Rollen", { fields: ["klantcontacter", "behandelaar"], span: 5 }],
      [
        "Eigenschappen",
        { fields: ["einde", "begin", "datum vergadering"], span: 7 },
      ],
      ["Resultaten", { fields: ["goedgekeurd", "afgekeurd"], span: 5 }],
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
