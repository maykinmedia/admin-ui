import type { Meta, StoryObj } from "@storybook/react-vite";

import { AttributeList } from "./attributelist";

const meta: Meta<typeof AttributeList> = {
  title: "Data/AttributeList",
  component: AttributeList,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AttributeListComponent: Story = {
  args: {
    title: "Eigenschappen",
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

export const SelectedFieldOnly: Story = {
  ...AttributeListComponent,
  args: {
    ...AttributeListComponent.args,
    object: {
      ...AttributeListComponent?.args?.object,
      userId: 1,
    },
    fields: ["Omschrijving", "url"],
  },
};
