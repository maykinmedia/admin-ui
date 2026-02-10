import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { Accordion } from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "Controls/Accordion",
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Accordions: Story = {
  args: {
    variant: "primary",
    children: "Open accordion",
    items: [
      {
        componentType: "button",
        children: "Accordion item 1",
      },
      {
        componentType: "button",
        children: "Accordion item 2",
      },
    ],
    onOpen: fn(),
    onClose: fn(),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const accordionButton = canvas.getByRole("button", {
      name: "Open accordion",
    });

    await step("Accordion is initially closed", () => {
      // Accordion is initially closed
      expect(accordionButton).toBeVisible();
      expect(accordionButton).toHaveAttribute("aria-expanded", "false");

      // Expect the accordion items to be visible
      expect(
        canvas.queryByRole("button", { name: "Accordion item 1" }),
      ).not.toBeInTheDocument();
      expect(
        canvas.queryByRole("button", { name: "Accordion item 2" }),
      ).not.toBeInTheDocument();
    });

    await step("Opening accordion button", async () => {
      // Open the accordion
      await userEvent.click(accordionButton);
      expect(args.onOpen).toBeCalled();
      expect(accordionButton).toHaveAttribute("aria-expanded", "true");

      // Expect the accordion items to be visible
      expect(
        canvas.getByRole("button", { name: "Accordion item 1" }),
      ).toBeVisible();
      expect(
        canvas.getByRole("button", { name: "Accordion item 2" }),
      ).toBeVisible();
    });

    await step("Closing accordion", async () => {
      // Closing the accordion
      await userEvent.click(accordionButton);
      expect(args.onClose).toBeCalled();
      expect(accordionButton).toHaveAttribute("aria-expanded", "false");

      // Expect the accordion items to be hidden
      expect(
        canvas.queryByRole("button", { name: "Accordion item 1" }),
      ).not.toBeInTheDocument();
      expect(
        canvas.queryByRole("button", { name: "Accordion item 2" }),
      ).not.toBeInTheDocument();
    });
  },
};

export const AccordionInitiallyOpened: Story = {
  args: {
    variant: "primary",
    children: "Open accordion",
    items: [
      {
        componentType: "button",
        children: "Accordion item 1",
      },
      {
        componentType: "button",
        children: "Accordion item 2",
      },
    ],
    open: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const accordionButton = canvas.getByRole("button", {
      name: "Open accordion",
    });

    // Expect the accordion button to be visible and have to aria-expanded attribute.
    expect(accordionButton).toBeVisible();
    // Wait for the component state to be updated
    await waitFor(() =>
      expect(accordionButton).toHaveAttribute("aria-expanded", "true"),
    );

    // Expect the accordion items to be visible
    expect(
      canvas.getByRole("button", { name: "Accordion item 1" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Accordion item 2" }),
    ).toBeVisible();
  },
};

export const CompactAccordion: Story = {
  args: {
    variant: "primary",
    children: "Open accordion",
    compact: true,
    items: [
      {
        componentType: "button",
        children: "Accordion item 1",
      },
      {
        componentType: "button",
        children: "Accordion item 2",
      },
    ],
    open: true,
  },
};
