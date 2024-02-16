import { Decorator } from "@storybook/react";
import React, { useState } from "react";

export const FORM_TEST_DECORATOR: Decorator = (Story) => {
  // Solely here to force re-rendering story on change.
  const [count, setCount] = useState(0);

  const getData = () => {
    const form = document.forms[0];
    const formData = new FormData(form);

    // Convert FormData to JSON using Array.from and reduce
    return Array.from(formData.entries()).reduce<
      Record<string, FormDataEntryValue>
    >((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  };
  return (
    <form onChange={() => setCount(count + 1)} aria-label="form" style={{width: '100%'}}>
      <Story />
      <pre role="log">{JSON.stringify(getData())}</pre>
    </form>
  );
};
