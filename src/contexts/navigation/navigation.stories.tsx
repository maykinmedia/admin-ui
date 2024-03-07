import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import {
  Breadcrumbs,
  Button,
  ButtonLink,
  Navbar,
  Outline,
  P,
} from "../../components";
import { BodyBase } from "../../templates";
import { NavigationContext } from "./navigation";

const meta = {
  title: "Contexts/NavigationContext",
  // @ts-expect-error - not a component but a context
  component: NavigationContext,
} satisfies Meta<typeof NavigationContext>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Navigation: Story = {
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
        breadcrumbs: (
          <Breadcrumbs
            items={[
              { label: "Zaaktype", href: "#1" },
              { label: "Zaaktype detail", href: "#2" },
            ]}
          />
        ),
      }}
    >
      <BodyBase>
        <P>The quick brown fox jumps over the lazy dog.</P>
      </BodyBase>
    </NavigationContext.Provider>
  ),
};
