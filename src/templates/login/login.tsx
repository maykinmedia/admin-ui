import React, { useContext } from "react";

import { Body, Card, Form, FormProps, Hr, Logo } from "../../components";
import { ConfigContext } from "../../contexts";
import { ucFirst } from "../../lib/format/string";
import { useIntl } from "../../lib/i18n/useIntl";
import { Base } from "../base";

export type LoginProps = FormProps & {
  /** Logo (JSX) slot. */
  slotLogo?: React.ReactNode;
};

/**
 * Login template
 * @constructor
 */
export const Login: React.FC<LoginProps> = ({
  labelSubmit,
  slotLogo,
  ...formProps
}) => {
  const { logo: CustomLogo } = useContext(ConfigContext);
  const intl = useIntl();

  const labelLogin = labelSubmit
    ? labelSubmit
    : intl.formatMessage({
        id: "mykn.templates.Login.labelLogin",
        description: "templates.Login: The login button label",
        defaultMessage: "inloggen",
      });

  return (
    <Base showHeader={false} start={5} span={4}>
      <Card>
        <Body>
          {slotLogo || CustomLogo || <Logo />}
          <Hr />
          <Form labelSubmit={ucFirst(labelLogin)} {...formProps} />
        </Body>
      </Card>
    </Base>
  );
};
