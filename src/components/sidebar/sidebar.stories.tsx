import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { expect, within } from "storybook/test";

import { PAGE_DECORATOR } from "../../../.storybook/decorators";
import { Badge } from "../badge";
import { Outline } from "../icon";
import { Page } from "../layout";
import { Toolbar } from "../toolbar";
import { P } from "../typography";
import { Sidebar } from "./sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Building Blocks/Sidebar",
  component: Sidebar,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SidebarComponent: Story = {
  decorators: [PAGE_DECORATOR],
  args: {
    expanded: true,
    children: (
      <Toolbar
        align="space-between"
        direction="vertical"
        directionResponsive={false}
        pad={true}
        variant="transparent"
        items={[
          {
            componentType: "button",
            children: (
              <>
                Lorem ipsum<Badge variant="success">Verwerkt</Badge>
              </>
            ),
            align: "space-between",
            justify: true,
            variant: "transparent",
            active: true,
          },
          {
            componentType: "button",
            children: (
              <>
                Dolor<Badge variant="warning">In behandeling</Badge>
              </>
            ),
            align: "space-between",
            justify: true,
            variant: "transparent",
          },
          {
            componentType: "button",
            children: (
              <>
                Sit<Badge variant="danger">Actie vereist</Badge>
              </>
            ),
            align: "space-between",
            justify: true,
            variant: "transparent",
          },
          {
            componentType: "button",
            children: (
              <>
                Amet<Badge variant="warning">In behandeling</Badge>
              </>
            ),
            align: "space-between",
            justify: true,
            variant: "transparent",
          },
          {
            componentType: "accordion",
            children: (
              <>
                <Outline.AcademicCapIcon />
                Consectetur
              </>
            ),
            items: [
              {
                componentType: "button",
                children: "Adipiscing elit",
              },
              {
                componentType: "button",
                children: "Elit sed do",
              },
            ],
          },
        ]}
      ></Toolbar>
    ),
  },
};

export const SidebarCollapsed: Story = {
  decorators: [
    (Story) => (
      <Page>
        {Story()}
        <P>Lorem ipsum dolor sit amet.</P>
      </Page>
    ),
  ],
  args: {
    expanded: false,
    showLogo: true,
    children: (
      <Toolbar
        direction="vertical"
        directionResponsive={false}
        pad={true}
        variant="transparent"
        items={[
          {
            componentType: "button",
            children: (
              <>
                <Outline.HomeIcon />
                Lorem ipsum
              </>
            ),
            align: "start",
            justify: true,
            variant: "transparent",
          },
          {
            componentType: "button",
            children: (
              <>
                <Outline.FolderIcon />
                Dolor
              </>
            ),
            align: "start",
            justify: true,
            variant: "transparent",
          },
        ]}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByRole("complementary");
    const toolbar = canvas.getByRole("toolbar");
    const item = canvas.getByRole("button", { name: "Lorem ipsum" });
    const content = canvas.getByText("Lorem ipsum dolor sit amet.");
    const contentLeft = content.getBoundingClientRect().left;
    const toolbarTop = toolbar.getBoundingClientRect().top;

    item.focus();
    await Promise.all(
      sidebar.getAnimations({ subtree: true }).map((a) => a.finished),
    );

    const sidebarBody = sidebar.querySelector(".mykn-sidebar__body")!;
    expect(sidebarBody.getBoundingClientRect().right).toBeGreaterThanOrEqual(
      item.getBoundingClientRect().right,
    );
    expect(content.getBoundingClientRect().left).toBe(contentLeft);
    expect(toolbar.getBoundingClientRect().top).toBe(toolbarTop);
  },
};
