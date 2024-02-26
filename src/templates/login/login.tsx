import React from "react";

import {
  Body,
  Card,
  Column,
  Container,
  Form,
  FormProps,
  Grid,
  Hr,
  Logo,
  Page,
} from "../../components";
import { ucFirst } from "../../lib/format/string";
import { useIntl } from "../../lib/i18n/useIntl";

export type LoginProps = FormProps;

/**
 * Login template
 * @constructor
 */
export const Login: React.FC<LoginProps> = ({ labelSubmit, ...formProps }) => {
  const intl = useIntl();

  const labelLogin = labelSubmit
    ? labelSubmit
    : intl.formatMessage({
        id: "mykn.templates.Login.labelLogin",
        description: "templates.Login: The login button label",
        defaultMessage: "inloggen",
      });

  return (
    <Page valign="middle">
      <Container>
        <Grid>
          <Column start={5} span={4}>
            <Card>
              <Body>
                <Logo />
                <Hr />
                <Form labelSubmit={ucFirst(labelLogin)} {...formProps} />
              </Body>
            </Card>
          </Column>
        </Grid>
      </Container>
    </Page>
  );
};
