import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Button, ButtonLink } from "../button";
import { Card } from "../card";
import { DataGrid } from "../datagrid";
import { Select } from "../form";
import { Outline } from "../icon";
import { Container, Grid } from "../layout";
import { Column } from "../layout/column";
import { Logo } from "../logo";
import { Navbar } from "../navbar";
import { Body, H1 } from "../typography";
import { Hr } from "../typography/hr";
import { Page } from "./page";

type PagePropsAndCustomArgs = React.ComponentProps<typeof Page> & {
  debug?: boolean;
};

const meta = {
  title: "Building Blocks/Page",
  component: Page,
  parameters: {
    ignoreGlobalDecorator: true,
    layout: "fullscreen",
  },
} satisfies Meta<PagePropsAndCustomArgs>;

export default meta;
type Story = StoryObj<PagePropsAndCustomArgs>;

export const PageComponent: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};

export const SamplePage: Story = {
  args: {
    debug: false,
  },
  render: ({ debug }) => (
    <Page>
      <Container debug={debug}>
        <Grid debug={debug}>
          <Column debug={debug} span={12}>
            <Logo
              href="/?path=/story/building-blocks-page--sample-page"
              hrefLabel="Navigate to story page"
              label="Maykin"
            />

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
          </Column>

          <Column span={12}>
            <Card>
              <Body>
                <H1>Catalogi</H1>
                <Hr />
                <Select
                  name=""
                  options={[{ label: "Wonen en leven" }]}
                  value="Wonen en leven"
                  required
                ></Select>
              </Body>
            </Card>

            <Card>
              <DataGrid
                booleanProps={{
                  labelFalse: "This value is false",
                  labelTrue: "This value is true",
                }}
                paginatorProps={{
                  count: 100,
                  labelCurrentPageRange:
                    "{pageStart} - {pageEnd} of {pageCount}",
                  labelGoToPage: "Go to",
                  labelLoading: "Loading",
                  labelNext: "Go to next page",
                  labelPageSize: "Show rows",
                  labelPagination: "pagination",
                  labelPrevious: "Go to previous page",
                  onPageChange: () => {},
                  page: 3,
                  pageSize: 20,
                  pageSizeOptions: [
                    {
                      label: 10,
                    },
                    {
                      label: 20,
                    },
                    {
                      label: 30,
                    },
                    {
                      label: 40,
                    },
                    {
                      label: 50,
                    },
                  ],
                }}
                results={[
                  {
                    Omschrijving: "Afvalpas vervangen",
                    Versie: 2,
                    Actief: false,
                    Concept: true,
                    Toekomstig: false,
                  },
                  {
                    Omschrijving: "Erfpacht wijzigen",
                    Actief: true,
                    Versie: 4,
                    Concept: true,
                    Toekomstig: true,
                  },
                  {
                    Omschrijving: "Dakkapel vervangen",
                    Actief: false,
                    Versie: 1,
                    Concept: false,
                    Toekomstig: false,
                  },
                  {
                    Omschrijving: "Dakkapel vervangen",
                    Actief: true,
                    Versie: 4,
                    Concept: true,
                    Toekomstig: true,
                  },
                  {
                    Omschrijving: "Erfpacht wijzigen",
                    Actief: false,
                    Versie: 2,
                    Concept: true,
                    Toekomstig: false,
                  },
                  {
                    Omschrijving: "Dakkapel vervangen",
                    Actief: true,
                    Versie: 4,
                    Concept: true,
                    Toekomstig: true,
                  },
                  {
                    Omschrijving: "Erfpacht wijzigen",
                    Actief: false,
                    Versie: 1,
                    Concept: false,
                    Toekomstig: false,
                  },
                  {
                    Omschrijving: "Dakkapel vervangen",
                    Versie: 1,
                    Actief: false,
                    Concept: false,
                    Toekomstig: false,
                  },
                ]}
                title="Zaaktypen"
              />
            </Card>
          </Column>
        </Grid>
      </Container>
    </Page>
  ),
};

export const SamplePageOnMobile: Story = {
  ...SamplePage,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
