import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { ReactNode } from "react";

import { PAGE_DECORATOR } from "../../../../.storybook/decorators";
import { Outline } from "../../icon";
import { ItemGrid, ItemGridItemProps } from "./itemgrid";

const meta: Meta<typeof ItemGrid> = {
  title: "Data/Itemgrid",
  component: ItemGrid,
  decorators: [PAGE_DECORATOR],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ITEM_GRID_ITEMS: ItemGridItemProps[] = [
  {
    icon: <Outline.DocumentIcon />,
    title: "projectplan_2026_v3.pdf",
    informationLines: ["PDF", "842 KB", "10-02-2026"],
    actions: [
      { as: "a", href: "#", "aria-label": "Download projectplan_2026_v3.pdf" },
    ],
  },
  {
    icon: <Outline.PhotoIcon />,
    title:
      "teamfoto_bedrijfsuitje_heel_lang_bestandsnaam_extrateamfoto_bedrijfsuitje_heel_lang_bestandsnaam_extra.jpg",
    informationLines: ["JPG", "2.4 MB", "08-02-2026"],
    actions: [{ as: "a", href: "https://www.example.com/photo" }],
  },
  {
    icon: <Outline.VideoCameraIcon />,
    title: "product_demo_launch_event.mp4",
    informationLines: ["MP4", "84.1 MB", "01-02-2026"],
    actions: [
      {
        as: "a",
        href: "#",
        "aria-label": "Download product_demo_launch_event.mp4",
      },
    ],
  },
  {
    icon: <Outline.MusicalNoteIcon />,
    title: "podcast_aflevering_12_final_edit.mp3",
    informationLines: ["MP3", "12.7 MB", "28-01-2026"],
    actions: [
      {
        as: "a",
        href: "#",
        "aria-label": "Download podcast_aflevering_12_final_edit.mp3",
      },
    ],
  },
  {
    icon: <Outline.ArchiveBoxIcon />,
    title: "backup_2026_01_31.zip",
    informationLines: ["ZIP", "120 MB", "31-01-2026"],
    actions: [
      { as: "a", href: "#", "aria-label": "Download backup_2026_01_31.zip" },
    ],
  },
  {
    icon: <Outline.TableCellsIcon />,
    title: "financieel_overzicht_q1.xlsx",
    informationLines: ["XLSX", "356 KB", "15-01-2026"],
    actions: [
      {
        as: "a",
        href: "#",
        "aria-label": "Download financieel_overzicht_q1.xlsx",
      },
    ],
  },
  {
    icon: <Outline.PresentationChartBarIcon />,
    title: "kwartaalpresentatie_sales.pptx",
    informationLines: ["PPTX", "4.8 MB", "12-01-2026"],
    actions: [
      {
        as: "a",
        href: "#",
        "aria-label": "Download kwartaalpresentatie_sales.pptx",
      },
    ],
  },
  {
    icon: <Outline.CodeBracketIcon />,
    title: "api_client_config.ts",
    informationLines: ["TypeScript", "14 KB", "05-01-2026"],
    actions: [
      { as: "a", href: "#", "aria-label": "Download api_client_config.ts" },
    ],
  },
  {
    icon: <Outline.DocumentTextIcon />,
    title: "notulen_teamoverleg_januari.docx",
    informationLines: ["DOCX", "98 KB", "03-01-2026"],
    actions: [
      {
        as: "a",
        href: "#",
        "aria-label": "Download notulen_teamoverleg_januari.docx",
      },
    ],
  },
  {
    icon: <Outline.ShieldCheckIcon />,
    title: "security_audit_report_2025.pdf",
    informationLines: ["PDF", "1.2 MB", "22-12-2025"],
    actions: [
      {
        as: "a",
        href: "#",
        "aria-label": "Download security_audit_report_2025.pdf",
      },
    ],
  },
  {
    icon: <Outline.CloudArrowUpIcon />,
    title: "upload_export_dataset.csv",
    informationLines: ["CSV", "6.3 MB", "18-12-2025"],
    actions: [
      {
        as: "a",
        href: "#",
        "aria-label": "Download upload_export_dataset.csv",
      },
    ],
  },
  {
    icon: <Outline.ServerStackIcon />,
    title: "database_dump_production.sql",
    informationLines: ["SQL", "48 MB", "10-12-2025"],
    actions: [
      {
        as: "a",
        href: "#",
        "aria-label": "Download database_dump_production.sql",
      },
    ],
  },
  {
    icon: <Outline.MapIcon />,
    title: "locatie_overzicht_werkgebied.geojson",
    informationLines: ["GeoJSON", "2.1 MB", "02-12-2025"],
    actions: [
      {
        as: "a",
        href: "#",
        "aria-label": "Download locatie_overzicht_werkgebied.geojson",
      },
    ],
  },
  {
    icon: <Outline.DocumentDuplicateIcon />,
    title: "contract_klant_acme_corp_signed.pdf",
    informationLines: ["PDF", "512 KB", "25-11-2025"],
    actions: [{ as: "a", href: "https://www.example.com/contract" }],
  },
  {
    icon: <Outline.CalendarIcon />,
    title: "planning_roadmap_2026.xlsx",
    informationLines: ["XLSX", "221 KB", "20-11-2025"],
    actions: [
      {
        as: "a",
        href: "#",
        "aria-label": "Download planning_roadmap_2026.xlsx",
      },
    ],
  },
];

export const ItemGridComponent: Story = {
  args: {
    items: ITEM_GRID_ITEMS,
  },
};

export const ItemGridComponentWithEllipsis: Story = {
  args: {
    items: ITEM_GRID_ITEMS,
    ellipsis: true,
  },
};

export const ItemGridComponentDirectionRow: Story = {
  args: {
    items: ITEM_GRID_ITEMS,
    direction: "row",
  },
};

export const ItemGridComponentDirectionRowWithEllipsis: Story = {
  args: {
    items: ITEM_GRID_ITEMS,
    direction: "row",
    ellipsis: true,
  },
};

const addInfoIcons = (lines: string[]): ReactNode[] => [
  <>
    <Outline.DocumentIcon />
    {lines[0]}
  </>,
  <>
    <Outline.ArrowDownTrayIcon />
    {lines[1]}
  </>,
  <>
    <Outline.ClockIcon />
    {lines[2]}
  </>,
];

export const ItemGridWithInfoIcons: Story = {
  args: {
    items: ITEM_GRID_ITEMS.map((item) => ({
      ...item,
      informationLines: addInfoIcons(item.informationLines as string[]),
    })),
  },
};

const WITH_TWO_ACTIONS = ITEM_GRID_ITEMS.map((item) => ({
  ...item,
  actions: [
    {
      as: "a" as const,
      href: "#",
      "aria-label": `Download ${item.title}`,
      children: <Outline.ArrowDownTrayIcon />,
    },
    {
      as: "button" as const,
      "aria-label": `Open ${item.title} in editor`,
      onClick: () => alert(`Open in editor: ${item.title}`),
      children: <Outline.PencilSquareIcon />,
    },
  ],
}));

export const ItemGridWithActions: Story = {
  args: {
    items: WITH_TWO_ACTIONS,
  },
};

export const ItemGridWithActionsRow: Story = {
  args: {
    direction: "row",
    items: WITH_TWO_ACTIONS,
  },
};

export const WithPaginator: Story = {
  args: {
    items: ITEM_GRID_ITEMS,
    paginatorProps: {
      count: 100,
      page: 1,
      pageSize: 15,
    },
  },
};
