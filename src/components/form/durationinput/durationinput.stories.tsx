import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { expect, userEvent, waitFor } from "storybook/test";

import { DurationInput } from "./durationinput";

function Controlled({
  initial = "",
  ...props
}: React.ComponentProps<typeof DurationInput> & { initial?: string }) {
  const [val, setVal] = React.useState(initial);
  return (
    <div>
      <DurationInput
        {...props}
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <pre role="log">{JSON.stringify({ value: val }, null, 2)}</pre>
    </div>
  );
}

const findBySection = (root: HTMLElement, section: string) =>
  root.querySelector<HTMLInputElement>(
    `[data-section="${section}"]`,
  ) as HTMLInputElement;

const getLog = (root: HTMLElement) => root.querySelector('[role="log"]');

const meta: Meta<typeof DurationInput> = {
  title: "Form/DurationInput",
  component: DurationInput,
  args: {
    mode: "designator",
    label: "Duration",
    name: "duration",
    disabled: false,
    required: false,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Designator: Story = {
  args: { mode: "designator" },
  render: (args) => <Controlled {...args} initial="" />,
  play: async ({ canvasElement }) => {
    const years = findBySection(canvasElement, "YY");
    const months = findBySection(canvasElement, "MM");
    const days = findBySection(canvasElement, "DD");
    const log = getLog(canvasElement);

    await userEvent.clear(years);
    await userEvent.type(years, "4", { delay: 5 });
    await waitFor(() => expect(log).toHaveTextContent("P4Y"));

    await userEvent.clear(months);
    await userEvent.type(months, "2", { delay: 5 });
    await waitFor(() => expect(log).toHaveTextContent("P4Y2M"));

    await userEvent.clear(days);
    await userEvent.type(days, "3", { delay: 5 });
    await waitFor(() => expect(log).toHaveTextContent("P4Y2M3D"));

    await userEvent.clear(years);
    await waitFor(() => expect(log).toHaveTextContent("P2M3D"));

    await userEvent.clear(months);
    await waitFor(() => expect(log).toHaveTextContent("P3D"));

    await userEvent.clear(days);
    await waitFor(() => expect(log).toHaveTextContent("PT0S"));
  },
};

export const DesignatorWithWeeks: Story = {
  args: { mode: "designator" },
  render: (args) => <Controlled {...args} initial="P8W" />,
  play: async ({ canvasElement }) => {
    const years = findBySection(canvasElement, "YY");
    const months = findBySection(canvasElement, "MM");
    const days = findBySection(canvasElement, "DD");
    const log = getLog(canvasElement);

    await waitFor(() => expect(log).toHaveTextContent("P56D"));

    await userEvent.clear(years);
    await userEvent.type(years, "1", { delay: 5 });
    await waitFor(() => expect(log).toHaveTextContent("P1Y56D"));

    await userEvent.clear(months);
    await userEvent.type(months, "1", { delay: 5 });
    await waitFor(() => expect(log).toHaveTextContent("P1Y1M56D"));

    await userEvent.clear(days);
    await userEvent.type(days, "1", { delay: 5 });
    await waitFor(() => expect(log).toHaveTextContent("P1Y1M1D"));

    await userEvent.clear(years);
    await waitFor(() => expect(log).toHaveTextContent("P1M1D"));

    await userEvent.clear(months);
    await waitFor(() => expect(log).toHaveTextContent("P1D"));

    await userEvent.clear(days);
    await waitFor(() => expect(log).toHaveTextContent("PT0S"));
  },
};

export const Weeks: Story = {
  args: { mode: "weeks" },
  render: (args) => <Controlled {...args} initial="P2W" />,
  play: async ({ canvasElement }) => {
    const weeks = findBySection(canvasElement, "WW");
    const log = getLog(canvasElement);

    await expect(log).toHaveTextContent("P2W");

    await userEvent.clear(weeks);
    await userEvent.type(weeks, "1", { delay: 5 });
    await waitFor(() => expect(log).toHaveTextContent("P1W"));

    await userEvent.type(weeks, "2", { delay: 5 }); // "12"
    await waitFor(() => expect(log).toHaveTextContent("P12W"));

    await userEvent.clear(weeks);
    await userEvent.type(weeks, "0", { delay: 5 });
    await waitFor(() => expect(log).toHaveTextContent("PT0S"));
  },
};

export const Disabled: Story = {
  args: { mode: "designator", disabled: true },
  render: (args) => <Controlled {...args} initial="P10D" />,
  play: async ({ canvasElement }) => {
    const years = findBySection(canvasElement, "YY");
    const months = findBySection(canvasElement, "MM");
    const days = findBySection(canvasElement, "DD");
    const log = getLog(canvasElement);

    await expect(years).toBeDisabled();
    await expect(months).toBeDisabled();
    await expect(days).toBeDisabled();
    await expect(log).toHaveTextContent("P10D");
  },
};
