import type { Meta, StoryObj } from "@storybook/react-webpack5";
import * as React from "react";

import { Banner } from "./banner";

const meta: Meta<typeof Banner> = {
  title: "Components/Banner",
  component: Banner,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BannerComponent: Story = {
  args: {
    withIcon: true,
    actionText: "Retry",
    onActionClick: () => alert("Action button clicked!"),
  },
  render: (args) => (
    <>
      <Banner
        {...args}
        variant="info"
        title="Information"
        description="This is an informational banner."
      />
      <br />
      <Banner
        {...args}
        variant="success"
        title="Success"
        description="Your changes were saved successfully."
      />
      <br />
      <Banner
        {...args}
        variant="warning"
        title="Warning"
        description="Your account is approaching its limit."
      />
      <br />
      <Banner
        {...args}
        variant="danger"
        title="Error"
        description="There was a problem processing your request."
      />
    </>
  ),
};
