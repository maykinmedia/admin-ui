import type { Meta, StoryObj } from "@storybook/react-vite";
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
    page: 1,
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

    const firstPageButton = canvas.getByLabelText("Go to first page (page 1)");
    const previousPageButton = canvas.getByLabelText(
      "Go to previous page (page 0)",
    );
    const nextPageButton = canvas.getByLabelText("Go to next page (page 2)");
    canvas.getByRole("navigation");
    canvas.getByLabelText("Pagination");
    canvas.getByText("Number of results");

    // Click page size select.
    const pageSizeSelect = canvas.getByRole("combobox");
    await userEvent.click(pageSizeSelect, { delay: 10 });

    // Select "10".
    const pageSize10Option = await canvas.findByText("10");
    await userEvent.click(pageSize10Option, { delay: 10 });

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

    await expect(firstPageButton).toBeDisabled();
    await expect(previousPageButton).toBeDisabled();

    // Click next page.
    await userEvent.click(nextPageButton);

    // Click previous page.
    await userEvent.click(previousPageButton);

    // Click next page until 13.
    await userEvent.click(canvas.getByLabelText("Go to next page (page 2)"));
    await userEvent.click(canvas.getByLabelText("Go to next page (page 3)"));
    await userEvent.click(canvas.getByLabelText("Go to next page (page 4)"));
    await userEvent.click(canvas.getByLabelText("Go to next page (page 5)"));
    await userEvent.click(canvas.getByLabelText("Go to next page (page 6)"));
    await userEvent.click(canvas.getByLabelText("Go to next page (page 7)"));
    await userEvent.click(canvas.getByLabelText("Go to next page (page 8)"));
    await userEvent.click(canvas.getByLabelText("Go to next page (page 9)"));
    await userEvent.click(canvas.getByLabelText("Go to next page (page 10)"));
    await userEvent.click(canvas.getByLabelText("Go to next page (page 11)"));
    await userEvent.click(canvas.getByLabelText("Go to next page (page 12)"));
    await userEvent.click(canvas.getByLabelText("Go to next page (page 13)"));

    canvas.getByTitle("Result 121 to 123 of 13 pages");

    const lastPageButton = canvas.getByLabelText("Go to last page (page 13)");

    await expect(lastPageButton).toBeDisabled();
    await expect(nextPageButton).toBeDisabled();

    // Testing the input field to change the page number directly. Get it by label "Page"
    const pageInput = canvas.getByLabelText("Page");
    await userEvent.clear(pageInput);
    await userEvent.type(pageInput, "2", { delay: 10 });
    await userEvent.tab();
    await waitFor(() => {
      expect(canvas.getByTitle("Result 11 to 20 of 13 pages")).toBeVisible();
    });

    await userEvent.click(firstPageButton);
    await expect(firstPageButton).toBeDisabled();
    await expect(previousPageButton).toBeDisabled();

    await userEvent.click(lastPageButton);
    await expect(lastPageButton).toBeDisabled();
    await expect(nextPageButton).toBeDisabled();
  },
};
