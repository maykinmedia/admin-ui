import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Form } from "../form";
import { Page } from "../layout";
import { Body, H3 } from "../typography";
import { Modal } from "./modal";

const meta: Meta<typeof Modal> = {
  title: "Building Blocks/Modal",
  component: Modal,
  decorators: [
    (Story) => (
      <Page pad={true}>
        <Story />
      </Page>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ModalComponent: Story = {
  args: {
    size: "s",
    title: <H3>Kolommen</H3>,
    open: true,
    children: (
      <Body>
        <Form
          fields={[
            {
              name: "columns",
              type: "checkbox",
              options: [
                { label: "Identificatie", selected: true },
                { label: "Zaaktype", selected: true },
                { label: "Omschrijving", selected: true },
                { label: "Looptijd", selected: true },
                { label: "Resultaattype", selected: true },
                { label: "Versie" },
              ],
            },
          ]}
          showActions={false}
        />
      </Body>
    ),
  },
};

export const NonClosable: Story = {
  ...ModalComponent,
  args: { ...ModalComponent.args, allowClose: false },
};

export const SideModal: Story = {
  ...ModalComponent,
  args: {
    ...ModalComponent.args,
    position: "side",
  },
};
