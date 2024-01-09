#!/bin/bash

COMPONENTS_DIR="src/components"
INDEX_FILE="$COMPONENTS_DIR/index.ts"

component_name=$1
component_name_lowercase=$(echo "$component_name" | tr '[:upper:]' '[:lower:]')
capitalized_component_name=$(echo "$component_name" | awk '{print toupper(substr($0, 1, 1)) tolower(substr($0, 2))}')
component_dir="$COMPONENTS_DIR/$component_name_lowercase"

# Function to check if a directory exists
function directory_exists() {
  [ -d $1 ]
}

# Function to create a directory if it doesn't exist
function create_directory() {
  if ! directory_exists $1; then
    mkdir -p $1
  fi
}

# Function to create the index.ts file
function create_index_file() {
  echo "export * from \"./$component_name_lowercase\";" > "$2/index.ts"
}

# Function to create the CSS file
function create_css_file() {
  echo ".mykn-$component_name_lowercase {" > "$2/$component_name_lowercase.css"
  echo "  /* Rules here. */" >> "$2/$component_name_lowercase.css"
  echo "}" >> "$2/$component_name_lowercase.css"
}

# Function to create the stories.tsx file
function create_stories_file() {
  cat > "$2/$component_name_lowercase.stories.tsx" <<EOF
import type { Meta, StoryObj } from "@storybook/react";

import { ${capitalized_component_name} } from "./$component_name_lowercase";

const meta = {
  title: "Uncategorized/${capitalized_component_name}",
  component: ${capitalized_component_name},
} satisfies Meta<typeof ${capitalized_component_name}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ${capitalized_component_name}Component: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};
EOF
}

# Function to create the component file
function create_component_file() {
  cat > "$2/$component_name_lowercase.tsx" <<EOF
import React from "react";

import "./$component_name_lowercase.css";

export type ${capitalized_component_name}Props = React.PropsWithChildren<{
  // Props here.
}>;

/**
 * ${capitalized_component_name} component
 * @param children
 * @param props
 * @constructor
 */
export const ${capitalized_component_name}: React.FC<${capitalized_component_name}Props> = ({ children, ...props }) => (
  <div className="mykn-$component_name_lowercase" {...props}>
    {children}
  </div>
);
EOF
}

# Function to update the index.ts file in components
function update_index_file() {
  echo "// Auto-generated file. Do not modify manually." > "$INDEX_FILE"
  for component_dir in "$COMPONENTS_DIR"/*/; do
    component_name=$(basename "$component_dir")
    echo "export * from \"./$component_name\";" >> "$INDEX_FILE"
  done
}

# Main script

# Check if $COMPONENTS_DIR directory exists, if not create it
create_directory $COMPONENTS_DIR

# Check if a component name is provided
if [ -z "$1" ]; then
  echo "Error: Please provide a component name."
  exit 1
fi

# Check if component already exists
if directory_exists $component_dir; then
  echo "Error: Component '$component_name_lowercase' already exists."
  exit 1
fi

# Create component directory
create_directory $component_dir

# Create individual files
create_index_file $component_name_lowercase $component_dir
create_css_file $component_name_lowercase $component_dir
create_stories_file $component_name_lowercase $component_dir
create_component_file $component_name_lowercase $component_dir

# Update components/index.ts file
update_index_file

echo "Component '$component_name' created successfully."
