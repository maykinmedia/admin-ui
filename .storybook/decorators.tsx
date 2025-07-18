import { serializeFormElement } from "@maykin-ui/client-common";
import { Decorator } from "@storybook/react-vite";
import * as React from "react";
import { useEffect, useState } from "react";

import { Column, Grid, Page } from "../src";

export const FORM_TEST_DECORATOR: Decorator = (Story, { parameters }) => {
  // Solely here to force re-rendering story on change.
  const [count, setCount] = useState(0);
  const [formState, setFormState] = useState<HTMLFormElement | null>(null);
  const data = formState && serializeFormElement(formState);

  const formTestDecoratorParameters = parameters.formTestDecorator || {};
  const { renderForm = true } = formTestDecoratorParameters;
  useEffect(() => {
    setFormState(formState || document.forms[0]);
    const update = () => setCount(count + 1);
    formState?.addEventListener("change", update);
    return () => formState?.removeEventListener("change", update);
  }, [formState, count]);

  const content = (
    <>
      {Story()}
      {<pre role="log">{JSON.stringify(data)}</pre>}
    </>
  );

  return renderForm ? (
    <form
      ref={(form) => setFormState(form)}
      aria-label="form"
      style={{ width: "100%" }}
    >
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
