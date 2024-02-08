import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Grid } from "../../layout";
import { Column } from "../../layout/column";
import { Body, Hr } from "../../typography";
import { AttributeList } from "./attributelist";

const meta = {
  title: "Data/AttributeList",
  component: AttributeList,
} satisfies Meta<typeof AttributeList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AttributeListComponent: Story = {
  args: {
    title: "Eigenschappen",
    data: {
      url: "https://www.example.com",
      Omschrijving: "Afvalpas vervangen",
      Zaaktype: "https://www.example.com",
      Versie: 2,
      Opmerkingen: null,
    },
  },
};

export const AttributeListOnMobile: Story = {
  ...AttributeListComponent,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const WithBool: Story = {
  ...AttributeListComponent,
  args: {
    ...AttributeListComponent.args,
    data: {
      url: "https://www.example.com",
      Omschrijving: "Afvalpas vervangen",
      Zaaktype: "https://www.example.com",
      Versie: 2,
      Opmerkingen: null,
      Actief: false,
      Toekomstig: false,
      Concept: true,
    },
    boolProps: {
      labelTrue: "This value is true",
      labelFalse: "This value is false",
    },
  },
};

export const SelectedFieldOnly: Story = {
  ...AttributeListComponent,
  args: {
    ...AttributeListComponent.args,
    data: {
      ...AttributeListComponent.args.data,
      userId: 1,
    },
    fields: ["Omschrijving", "url"],
  },
};

export const MultipleAttributeLists: Story = {
  ...WithBool,
  render: ({ ...args }) => (
    <Body>
      <Grid>
        <Column span={12}>
          <AttributeList {...args} />
        </Column>
      </Grid>

      <Hr size="xxl" />

      <Grid>
        <Column span={6}>
          <AttributeList {...args} />
        </Column>
        <Column span={6}>
          <AttributeList {...args} />
        </Column>
      </Grid>

      <Hr size="xxl" />

      <Grid>
        <Column span={6}>
          <AttributeList {...args} />
        </Column>
        <Column span={6}>
          <AttributeList {...args} />
        </Column>
      </Grid>
    </Body>
  ),
};
