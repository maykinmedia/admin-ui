import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import React from "react";

import { Page } from "../../page";
import { Paginator } from "./paginator";

const meta = {
  title: "Data/Paginator",
  component: Paginator,
  argTypes: {
    onPageChange: { action: "onPageChange" },
    onPageSizeChange: { action: "onPageSizeChange" },
  },
  decorators: [
    (Story) => (
      <Page>
        <Story />
      </Page>
    ),
  ],
} satisfies Meta<typeof Paginator>;

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

export const PaginatorOnMobile = {
  ...PaginatorComponent,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const PaginatorComponentWithSpinner: Story = {
  ...PaginatorComponent,
  args: {
    ...PaginatorComponent.args,
    onPageChange: () => new Promise((resolve) => setTimeout(resolve, 1000)),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pageInput = canvas.getByRole("spinbutton");
    const previousButton = canvas.getByLabelText("Previous");
    const nextButton = canvas.getByLabelText("Next");
    canvas.getByRole("navigation");
    canvas.getByLabelText("Pagination");
    canvas.getByText("Number of results");
    canvas.getByText("Go to page");

    // Click page size select.
    const pageSizeSelect = canvas.getByRole("combobox");
    userEvent.click(pageSizeSelect, { delay: 10 });

    // Select "10".
    const pageSize10Option = await canvas.findByText("10");
    userEvent.click(pageSize10Option, { delay: 10 });

    // Wait for...
    await waitFor(
      async () => {
        // ...page input to be reset to 1.
        await expect(pageInput).toHaveValue(1);

        // ...spinner to become visible.
        await expect(await canvas.findByLabelText("Loading...")).toBeVisible();
      },
      {
        timeout: 400,
      },
    );

    // Wait for...
    await waitFor(
      async () =>
        //...spinner to become invisible again.
        await expect(canvas.queryByLabelText("Loading...")).toBeFalsy(),
      { timeout: 2000 },
    );

    // Type to "2" in pageInput.
    await userEvent.click(pageInput, { delay: 10 });
    await userEvent.clear(pageInput);
    await userEvent.type(pageInput, "2");

    // Click previous page.
    await userEvent.click(previousButton);
    await expect(pageInput).toHaveValue(1);

    // Click previous page again.
    await userEvent.click(previousButton);
    await expect(pageInput).toHaveValue(1);

    // Click next page.
    await userEvent.click(nextButton);
    await expect(pageInput).toHaveValue(2);
    await canvas.findByText("Result 11 to 20 of 13 pages");

    // Click next page until 13.
    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await expect(pageInput).toHaveValue(13);

    // Click next page again.
    await userEvent.click(nextButton);
    await expect(pageInput).toHaveValue(13);
    await canvas.findByText("Result 121 to 123 of 13 pages");
  },
};
