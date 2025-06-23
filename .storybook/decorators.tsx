import { Decorator } from "@storybook/react-vite";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

import { Column, Grid, Page, serializeForm } from "../src";

export const FORM_TEST_DECORATOR: Decorator = (Story, { parameters }) => {
  // Solely here to force re-rendering story on change.
  const [count, setCount] = useState(0);
  const formRef = useRef<HTMLFormElement | null>(null);

  const formTestDecoratorParameters = parameters.formTestDecorator || {};
  const { renderForm = true } = formTestDecoratorParameters;

  useEffect(() => {
    formRef.current = formRef.current || document.forms[0];
    const update = () => setCount(count + 1);
    formRef.current?.addEventListener("change", update);
    return () => formRef.current?.removeEventListener("change", update);
  }, [formRef.current, count]);

  const getData = () => {
    return formRef.current && serializeForm(formRef.current);
  };

  const content = (
    <>
      {Story()}
      <pre role="log">{JSON.stringify(getData())}</pre>
    </>
  );

  return renderForm ? (
    <form ref={formRef} aria-label="form" style={{ width: "100%" }}>
      {content}
    </form>
  ) : (
    content
  );
};

export const PAGE_DECORATOR: Decorator = (Story) => (
  <Page>
    <Grid>
      <Column span={12}>{Story()}</Column>
    </Grid>
  </Page>
);
