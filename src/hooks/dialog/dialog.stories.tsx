import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { userEvent, within } from "storybook/test";

import { Button } from "../../components";
import { ModalService } from "../../contexts";
import { useAlert } from "./usealert";
import { useConfirm } from "./useconfirm";
import { usePrompt } from "./useprompt";

const meta: Meta = {
  argTypes: {
    onConfirm: { action: "onConfirm" },
    onCancel: { action: "onCancel" },
  },
  title: "Hooks/Dialog",
  decorators: [
    (Story) => (
      <ModalService>
        <Story />
      </ModalService>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.click(button, { delay: 10 });
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Alert: Story = {
  name: "useAlert",
  render: (args) => {
    const alert = useAlert();
    return (
      <ModalService>
        <Button
          variant="primary"
          onClick={() =>
            alert(
              "Alert dialog",
              "The quick brown fox jumps over the lazy dog.",
              "Ok",
              args.onConfirm,
            )
          }
        >
          Show alert dialog
        </Button>
      </ModalService>
    );
  },
};

export const Confirm: Story = {
  name: "useConfirm",
  render: (args) => {
    const confirm = useConfirm();
    return (
      <ModalService>
        <Button
          variant="primary"
          onClick={() =>
            confirm(
              "Confirm dialog",
              "The quick brown fox jumps over the lazy dog.",
              "Ok",
              "Annuleren",
              args.onConfirm,
              args.onCancel,
            )
          }
        >
          Show confirmation dialog
        </Button>
      </ModalService>
    );
  },
};

export const Prompt: Story = {
  name: "usePrompt",
  render: (args) => {
    const prompt = usePrompt();
    return (
      <ModalService>
        <Button
          variant="primary"
          onClick={() =>
            prompt(
              "Prompt dialog",
              "Geef een reden op",
              "Reden",
              "Ok",
              "Annuleren",
              args.onConfirm,
              args.onCancel,
              undefined,
              true,
            )
          }
        >
          Show prompt dialog
        </Button>
      </ModalService>
    );
  },
};
