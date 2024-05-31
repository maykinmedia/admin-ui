import type { Meta, StoryObj } from "@storybook/react";

import { AttributeTable } from "./attributetable";

const meta: Meta<typeof AttributeTable> = {
  title: "Data/AttributeTable",
  component: AttributeTable,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AttributeTableComponent: Story = {
  args: {
    object: {
      url: "https://www.example.com",
      Omschrijving: "Afvalpas vervangen",
      Zaaktype: "https://www.example.com",
      Versie: 2,
      Opmerkingen: null,
      Actief: false,
      Toekomstig: false,
      Concept: true,
    },
  },
};
