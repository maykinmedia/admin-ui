[![Storybook](https://raw.githubusercontent.com/storybooks/brand/master/badge/badge-storybook.svg)](https://main--659d1ab1b20571e0dbb5e47c.chromatic.com)
![GitHub Actions](https://github.com/maykinmedia/admin-ui/actions/workflows/ci.yaml/badge.svg)
[![codecov](https://codecov.io/gh/maykinmedia/admin-ui/graph/badge.svg?token=V2JBYN9OWE)](https://codecov.io/gh/maykinmedia/admin-ui)

<p align="center">
  <a href="https://maykinmedia.nl">
    <img alt="Maykin logo" src=".storybook/static/maykin_logo.png" />
  </a>
</p>

## Introduction

**Admin-ui** is the official (React) component library developed and maintained by **Maykin Media**, specifically designed for **admin-like applications** within our projects. It provides a **consistent, efficient, and accessible** foundation for application interfaces.

By standardizing UI components, Admin-ui helps teams **streamline development, ensure a cohesive user experience, and reduce maintenance overhead** across multiple projects.

## Project goals

- **Consistency** – Maintain a uniform UI across all Maykin Media admin panels, dashboards, and tools.
- **Efficiency** – Speed up development with ready-to-use components optimized for admin workflows.
- **Accessibility** – Ensure compliance with WCAG standards by default.

## Getting Started

**Installation**:

```sh
npm install @maykin-ui/admin-ui
```

**Using templates**:

```tsx
import { ListTemplate } from "@maykin-ui/admin-ui";

<ListTemplate dataGridProps={{objectList: []}} />
```

**Using components**:
```tsx
import { Button } from "@maykin-ui/admin-ui";

<Button variant="primary">Primary Button</Button>
```

## Documentation & Storybook

For an overview of available components, templates, and usage examples, visit the **Storybook** environment:

➡ **[Admin-ui Storybook](https://main--659d1ab1b20571e0dbb5e47c.chromatic.com)**

Storybook provides interactive documentation, allowing you to explore and test components in isolation.
