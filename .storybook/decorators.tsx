import { Decorator } from "@storybook/react-webpack5";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

import { Column, Grid, Page, serializeForm } from "../src";

export const FORM_TEST_DECORATOR: Decorator = (Story) => {
  // Solely here to force re-rendering story on change.
  const [count, setCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const update = () => setCount(count + 1);
    formRef.current?.addEventListener("change", update);
    return () => formRef.current?.removeEventListener("change", update);
  }, [formRef.current, count]);

  const getData = () => {
    const form = document.forms[0];
    return form && serializeForm(form);
  };

  return (
    <form ref={formRef} aria-label="form" style={{ width: "100%" }}>
      {Story()}
      <pre role="log">{JSON.stringify(getData())}</pre>
    </form>
  );
};

export const PAGE_DECORATOR: Decorator = (Story) => (
  <Page>
    <Grid>
      <Column span={12}>{Story()}</Column>
    </Grid>
  </Page>
);
