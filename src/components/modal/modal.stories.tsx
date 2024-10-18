import type { Meta, StoryObj } from "@storybook/react";
import { expect, waitFor, within } from "@storybook/test";
import * as React from "react";

import { PAGE_DECORATOR } from "../../../.storybook/decorators";
import { Form } from "../form";
import { Body, H3 } from "../typography";
import { Modal } from "./modal";

const meta: Meta<typeof Modal> = {
  title: "Building Blocks/Modal",
  component: Modal,
  decorators: [PAGE_DECORATOR],
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
                { label: "Identificatie", defaultChecked: true },
                { label: "Zaaktype", defaultChecked: true },
                { label: "Omschrijving", defaultChecked: true },
                { label: "Looptijd", defaultChecked: true },
                { label: "Resultaattype", defaultChecked: true },
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

export const HiddenModal: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    open: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = await within(canvasElement);
    const modal = canvas.getByRole("dialog", { hidden: true });
    const modalElement = canvasElement.querySelector(
      "dialog",
    ) as HTMLDialogElement;
    await expect(modal).not.toBeVisible();
    await expect(modalElement.checkVisibility()).toBeFalsy();
  },
};

export const VisibleModal: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    open: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = await within(canvasElement);
    const modal = canvas.getByRole("dialog", { hidden: true });
    const modalElement = canvasElement.querySelector(
      "dialog",
    ) as HTMLDialogElement;
    await waitFor(() => expect(modal).toBeVisible());
    await expect(modalElement.checkVisibility()).toBeTruthy();
  },
};
