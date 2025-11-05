import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "Typography/Badge",
  component: Badge,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Badges: Story = {
  args: {},
  render: (args) => (
    <>
      <Badge variant="primary" {...args}>
        Primary badge
      </Badge>
      <br />
      <br />
      <Badge variant="secondary" {...args}>
        Secondary badge
      </Badge>
      <br />
      <br />
      <Badge variant="accent" {...args}>
        Accent badge
      </Badge>
      <br />
      <br />
      <Badge variant="outline" {...args}>
        Outline badge
      </Badge>
      <br />
      <br />
      <Badge variant="info" {...args}>
        Info badge
      </Badge>
      <br />
      <br />
      <Badge variant="success" {...args}>
        Success badge
      </Badge>
      <br />
      <br />
      <Badge variant="warning" {...args}>
        Warning badge
      </Badge>
      <br />
      <br />
      <Badge variant="danger" {...args}>
        Danger badge
      </Badge>
      <br />
      <br />
      <Badge {...args}>Default badge</Badge>
    </>
  ),
};

export const BadgesLink: Story = {
  args: {},
  render: (args) => (
    <>
      <Badge href="#" variant="primary" {...args}>
        Primary badge
      </Badge>
      <br />
      <br />
      <Badge href="#" variant="secondary" {...args}>
        Secondary badge
      </Badge>
      <br />
      <br />
      <Badge href="#" variant="accent" {...args}>
        Accent badge
      </Badge>
      <br />
      <br />
      <Badge href="#" variant="outline" {...args}>
        Outline badge
      </Badge>
      <br />
      <br />
      <Badge href="#" variant="info" {...args}>
        Info badge
      </Badge>
      <br />
      <br />
      <Badge href="#" variant="success" {...args}>
        Success badge
      </Badge>
      <br />
      <br />
      <Badge href="#" variant="warning" {...args}>
        Warning badge
      </Badge>
      <br />
      <br />
      <Badge href="#" variant="danger" {...args}>
        Danger badge
      </Badge>
      <br />
      <br />
      <Badge href="#" {...args}>
        Default badge
      </Badge>
    </>
  ),
};
