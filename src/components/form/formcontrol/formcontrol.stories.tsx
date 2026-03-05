import type { Meta, StoryObj } from "@storybook/react-vite";

import { FormControl } from "./formcontrol";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof FormControl> = {
  title: "Form/Formcontrol",
  component: FormControl,
};

export default meta;
type Story = StoryObj<typeof FormControl>;

export const FormControlWithErrorMessage: Story = {
  args: {
    error: 'Field "e-mail" does not contain a valid e-mail address',
    forceShowError: true, // Make sure the Story shows error.
    label: "Enter your e-mail address",
    name: "e-mail",
    value: "johndoe@example.com",
  },
   play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const errorMessage = canvas.getByRole("alert")
      const emailInput = canvas.getByLabelText('Enter your e-mail address'); 
      
      const wrapper = errorMessage.parentElement;

      const children = wrapper 
        ? [...wrapper.children] 
        : [];

      const iErrorMessage = children.indexOf(errorMessage);
      const iEmailInput = children.indexOf(emailInput);
    
      expect(wrapper).toContain(errorMessage);
      expect(wrapper).toContain(emailInput);

      // gh-180
      expect(iErrorMessage).toBeLessThan(iEmailInput);
    }
};

export const SelectFormControl: Story = {
  args: {
    error: 'Field "school year" is required',
    forceShowError: true, // Make sure the Story shows error.
    options: [
      { label: "Freshman" },
      { label: "Sophomore" },
      { label: "Junior" },
      { label: "Senior" },
      { label: "Graduate" },
    ],
    name: "school_year",
    label: "Select school year",
    value: "Junior",
  },
};

export const Required: Story = {
  args: {
    error: "Dit veld is verplicht",
    forceShowError: true, // Make sure the Story shows error.
    label: "Enter your e-mail address",
    name: "e-mail",
    required: true,
  },
};
