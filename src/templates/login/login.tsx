import React, { useContext } from "react";

import { Body, Card, Form, FormProps, Hr, Logo } from "../../components";
import { ConfigContext } from "../../contexts";
import { ucFirst } from "../../lib/format/string";
import { useIntl } from "../../lib/i18n/useIntl";
import { Base, BaseProps } from "../base";

export type LoginProps = BaseProps & {
  fields?: FormProps["fields"];

  /** Form props. */
  formProps: FormProps;

  /** The login form label. */
  labelLogin?: FormProps["labelSubmit"];

  /** Logo (JSX) slot. */
  slotLogo?: React.ReactNode;
};

/**
 * Login template
 * @constructor
 */
export const Login: React.FC<LoginProps> = ({
  fields,
  formProps,
  labelLogin,
  slotLogo,
  ...props
}) => {
  const { logo: CustomLogo } = useContext(ConfigContext);
  const intl = useIntl();

  const _labelLogin = labelLogin
    ? labelLogin
    : intl.formatMessage({
        id: "mykn.templates.Login.labelLogin",
        description: "templates.Login: The login button label",
        defaultMessage: "inloggen",
      });

  return (
    <Base
      showHeader={false}
      columnProps={{ start: 5, span: 4 }}
      pageProps={{ valign: "middle" }}
      {...props}
    >
      <Card>
        <Body>
          {slotLogo || CustomLogo || <Logo />}
          <Hr />
          <Form
            fields={fields}
            labelSubmit={ucFirst(_labelLogin)}
            {...formProps}
          />
        </Body>
      </Card>
    </Base>
  );
};
