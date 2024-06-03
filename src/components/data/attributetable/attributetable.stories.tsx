import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { ButtonLink } from "../../button";
import { Outline } from "../../icon";
import { AttributeTable } from "./attributetable";

const meta: Meta<typeof AttributeTable> = {
  title: "Data/AttributeTable",
  component: AttributeTable,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LabeledAttributeTableComponent: Story = {
  args: {
    labeledObject: {
      url: { label: "Url", value: "https://www.example.com" },
      omschrijving: { label: "Omschrijving", value: "Afvalpas vervangen" },
      zaaktype: { label: "Zaaktype", value: "https://www.example.com" },
      versie: { label: "Versie", value: 2 },
      opmerkingen: { label: "Opmerkingen", value: null },
      actief: { label: "Actief", value: false },
      toekomstig: { label: "Toekomstig", value: false },
      concept: { label: "Concept", value: true },
    },
  },
};

export const LabeledAttributeTableComponentWithNodes: Story = {
  args: {
    labeledObject: {
      button: {
        label: "A button!",
        value: (
          <ButtonLink
            href="https://www.example.com"
            target="_blank"
            variant="transparent"
          >
            <Outline.AcademicCapIcon />
            Click me!
          </ButtonLink>
        ),
      },
      labelWithIcon: {
        label: (
          <div>
            A label with icon <Outline.AcademicCapIcon />
          </div>
        ),
        value: "Some value",
      },
    },
  },
};

export const AttributeTableComponent: Story = {
  args: {
    object: {
      url: "https://www.example.com",
      omschrijving: "Afvalpas vervangen",
      zaaktype: "https://www.example.com",
      versie: 2,
      opmerkingen: null,
      actief: false,
      toekomstig: false,
      concept: true,
    },
  },
};
