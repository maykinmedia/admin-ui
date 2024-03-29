import { Decorator } from "@storybook/react";
import * as React from "react";
import { useState } from "react";

import { serializeForm } from "../../../lib";

export const FORM_TEST_DECORATOR: Decorator = (Story) => {
  // Solely here to force re-rendering story on change.
  const [count, setCount] = useState(0);

  const getData = () => {
    const form = document.forms[0];
    return form && serializeForm(form);
  };

  return (
    <form
      onChange={() => setCount(count + 1)}
      aria-label="form"
      style={{ width: "100%" }}
    >
      <Story />
      <pre role="log">{JSON.stringify(getData())}</pre>
    </form>
  );
};
