import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Outline } from "../icon";
import { GlobalSearch, SearchResult } from "./global-search";

const results: SearchResult[] = [
  {
    title: "Apple",
    href: "/fruit/apple",
    group: "Fruit",
    subtitle: "Fresh apples from the Netherlands",
    icon: <Outline.DocumentIcon />,
  },
  {
    title: "Banana",
    href: "/fruit/banana",
    group: "Fruit",
    subtitle: "Ripe and sweet",
    icon: <Outline.DocumentIcon />,
  },
  {
    title: "Pear",
    href: "/fruit/pear",
    group: "Fruit",
    subtitle: "Golden yellow pears",
    icon: <Outline.DocumentIcon />,
  },
  {
    title: "Apple slices",
    href: "/fruit/apple/pieces",
    group: "Fruit Pieces",
    subtitle: "Convenient portions for snacks",
    icon: <Outline.DocumentIcon />,
  },
  {
    title: "Banana slices",
    href: "/fruit/banana/pieces",
    group: "Fruit Pieces",
    subtitle: "Perfect for breakfast or yogurt",
    icon: <Outline.DocumentIcon />,
  },
  {
    title: "Pear pieces",
    href: "/fruit/pear/pieces",
    group: "Fruit Pieces",
    subtitle: "Sweet pieces for baking recipes",
    icon: <Outline.DocumentIcon />,
  },
  {
    title: "Cucumber",
    href: "/vegetables/cucumber",
    group: "Vegetables",
    subtitle: "Long and fresh",
    icon: <Outline.DocumentIcon />,
  },
  {
    title: "Bell pepper",
    href: "/vegetables/bell-pepper",
    group: "Vegetables",
    subtitle: "Red, yellow and green",
    icon: <Outline.DocumentIcon />,
  },
  {
    title: "Tomato",
    href: "/vegetables/tomato",
    group: "Vegetables",
    subtitle: "For salads and sauces",
    icon: <Outline.DocumentIcon />,
  },
  {
    title: "Apple pie recipe",
    href: "/recipes/apple-pie",
    group: "Recipes",
    subtitle: "Step by step instructions",
    icon: <Outline.DocumentIcon />,
  },
  {
    title: "Banana bread recipe",
    href: "/recipes/banana-bread",
    group: "Recipes",
    subtitle: "Healthy and delicious",
    icon: <Outline.DocumentIcon />,
  },
  {
    title: "Pear crumble recipe",
    href: "/recipes/pear-crumble",
    group: "Recipes",
    subtitle: "Sweet treat",
    icon: <Outline.DocumentIcon />,
  },

  {
    title: "Contact",
    href: "/contact",
    group: "General",
    subtitle: "Reach us quickly",
    icon: <Outline.DocumentIcon />,
  },
  {
    title: "About us",
    href: "/about",
    group: "General",
    subtitle: "Who we are",
    icon: <Outline.DocumentIcon />,
  },
  {
    title: "Blog",
    href: "/blog",
    group: "General",
    subtitle: "Latest news and tips",
    icon: <Outline.DocumentIcon />,
  },
];

const meta = {
  title: "Uncategorized/GlobalSearch",
  component: GlobalSearch,
  args: {
    placeholder: "Zoek voor documenten, zaken, etc.",
    search: async (query: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return results.filter((result) =>
        (result.title as string)?.toLowerCase().includes(query.toLowerCase()),
      );
    },
    onNavigate: (href: string) => {
      alert(`Navigating to ${href}`);
    },
  },
} satisfies Meta<typeof GlobalSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutSubtitles: Story = {
  args: {
    search: async (query: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return results
        .map((r) => ({ ...r, subtitle: undefined })) // remove subtitles
        .filter((result) =>
          (result.title as string).toLowerCase().includes(query.toLowerCase()),
        );
    },
  },
};

export const WithSubtitles: Story = {
  args: {
    search: async (query: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return results.filter((result) =>
        (result.title as string).toLowerCase().includes(query.toLowerCase()),
      );
    },
  },
};

export const EmptyResults: Story = {
  args: {
    search: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    },
  },
};

export const InitialQuery: Story = {
  args: {
    initialQuery: "appel",
    search: async (query: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return results.filter((result) =>
        (result.title as string).toLowerCase().includes(query.toLowerCase()),
      );
    },
  },
};
