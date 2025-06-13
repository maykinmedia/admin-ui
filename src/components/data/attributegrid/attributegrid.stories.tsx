import type { Meta, StoryObj } from "@storybook/react-vite";

import { AttributeGrid } from "./attributegrid";

const meta: Meta<typeof AttributeGrid> = {
  title: "Data/AttributeGrid",
  component: AttributeGrid,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AttributeGridComponent: Story = {
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
