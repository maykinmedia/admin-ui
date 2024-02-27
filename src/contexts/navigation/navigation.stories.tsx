import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Button, ButtonLink, Navbar, Outline } from "../../components";
import { NavigationContext } from "./navigation";

const meta = {
  title: "Contexts/NavigationContext",
  // @ts-expect-error - not a component but a context
  component: NavigationContext,
} satisfies Meta<typeof NavigationContext>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryNavigation: Story = {
  render: () => (
    <NavigationContext.Provider
      value={{
        primaryNavigation: (
          <Navbar align="end">
            <Button variant="transparent">
              <Outline.PencilIcon />
              Zaaktypen
            </Button>

            <Button variant="transparent">
              <Outline.ClipboardDocumentIcon />
              Documenttypen
            </Button>

            <ButtonLink
              href="https://www.example.com"
              target="_blank"
              variant="transparent"
            >
              <Outline.UserIcon />
              Admin
            </ButtonLink>

            <Button variant="primary">
              <Outline.ArrowRightStartOnRectangleIcon />
              Uitloggen
            </Button>
          </Navbar>
        ),
      }}
    >
    </NavigationContext.Provider>
  ),
};
