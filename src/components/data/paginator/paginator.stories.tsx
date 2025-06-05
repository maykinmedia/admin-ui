import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { PAGE_DECORATOR } from "../../../../.storybook/decorators";
import { allModes } from "../../../../.storybook/modes";
import { Paginator } from "./paginator";

const meta: Meta<typeof Paginator> = {
  title: "Data/Paginator",
  component: Paginator,
  argTypes: {
    onPageChange: { action: "onPageChange" },
    onPageSizeChange: { action: "onPageSizeChange" },
  },
  decorators: [PAGE_DECORATOR],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PaginatorComponent: Story = {
  args: {
    count: 123,
    page: 3,
    pageSize: 20,
    pageSizeOptions: [
      { label: 10 },
      { label: 20 },
      { label: 30 },
      { label: 40 },
      { label: 50 },
    ],
  },
};

export const PaginatorComponentWithSpinner: Story = {
  ...PaginatorComponent,
  args: {
    ...PaginatorComponent.args,
    onPageChange: () => new Promise((resolve) => setTimeout(resolve, 1000)),
  },
  parameters: {
    chromatic: {
      modes: {
        "light desktop": allModes["light desktop"],
        "dark desktop": allModes["dark desktop"],
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Spinner not supported on mobile.
    if (window?.matchMedia("(max-width: 767px)").matches) {
      return;
    }

    const canvas = within(canvasElement);
    const previousButton = canvas.getByText("Previous");
    const nextButton = canvas.getByText("Next");
    canvas.getByRole("navigation");
    canvas.getByLabelText("Pagination");
    canvas.getByText("Number of results");

    // Click page size select.
    const pageSizeSelect = canvas.getByRole("combobox");
    userEvent.click(pageSizeSelect, { delay: 10 });

    // Select "10".
    const pageSize10Option = await canvas.findByText("10");
    userEvent.click(pageSize10Option, { delay: 10 });

    // Wait for...
    await waitFor(
      async () => {
        // ...spinner to become visible.
        await expect(await canvas.findByLabelText("Loading...")).toBeVisible();
      },
      {
        timeout: 800,
      },
    );

    // Wait for...
    await waitFor(
      async () =>
        //...spinner to become invisible again.
        await expect(canvas.queryByLabelText("Loading...")).toBeFalsy(),
      { timeout: 2000 },
    );

    await expect(canvas.getByLabelText("go to page 1")).toHaveAttribute(
      "aria-current",
    );

    await expect(previousButton).toBeDisabled();

    // Click next page.
    await userEvent.click(nextButton);
    await expect(canvas.getByLabelText("go to page 2")).toHaveAttribute(
      "aria-current",
    );

    // Click previous page.
    await userEvent.click(previousButton);
    await expect(canvas.getByLabelText("go to page 1")).toHaveAttribute(
      "aria-current",
    );

    // Click next page until 13.
    await userEvent.click(canvas.getByLabelText("go to page 2"));
    await userEvent.click(canvas.getByLabelText("go to page 3"));
    await userEvent.click(canvas.getByLabelText("go to page 4"));
    await userEvent.click(canvas.getByLabelText("go to page 5"));
    await userEvent.click(canvas.getByLabelText("go to page 6"));
    await userEvent.click(canvas.getByLabelText("go to page 7"));
    await userEvent.click(canvas.getByLabelText("go to page 8"));
    await userEvent.click(canvas.getByLabelText("go to page 9"));
    await userEvent.click(canvas.getByLabelText("go to page 10"));
    await userEvent.click(canvas.getByLabelText("go to page 11"));
    await userEvent.click(canvas.getByLabelText("go to page 12"));
    await userEvent.click(canvas.getByLabelText("go to page 13"));

    await expect(nextButton).toBeDisabled();
    await canvas.getByTitle("Result 121 to 123 of 13 pages");
  },
};
