import React, { useContext } from "react";

import { A, Body, Card, Form, FormProps, H1, Logo, P } from "../../components";
import { ConfigContext } from "../../contexts";
import { ucFirst } from "../../lib";
import { useIntl } from "../../lib/i18n/useIntl";
import { BaseTemplate, BaseTemplateProps } from "../base";

export type LoginTemplateProps = BaseTemplateProps & {
  fields?: FormProps["fields"];

  /** Form props. */
  formProps: FormProps;

  /** Password Forgotten Href */
  passwordForgottenHref?: string;

  /** The login form label. */
  labelLogin?: FormProps["labelSubmit"];

  /** The login form title. */
  titleLogin?: string;

  /** The password forgotten title. */
  titlePasswordForgotten?: string;

  /** The password forgotten "click here" link. */
  linkPasswordForgotten?: string;

  /** Background image */
  backgroundImageUrl?: string;

  /** Logo (JSX) slot. */
  slotLogo?: React.ReactNode;
};

/**
 * Login template
 * @constructor
 */
export const LoginTemplate: React.FC<LoginTemplateProps> = ({
  formProps,
  passwordForgottenHref,
  labelLogin,
  titleLogin,
  titlePasswordForgotten,
  linkPasswordForgotten,
  backgroundImageUrl,
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

  const _titleLogin = titleLogin
    ? titleLogin
    : intl.formatMessage({
        id: "mykn.templates.Login.titleLogin",
        description: "templates.Login: The login title",
        defaultMessage: "Welkom Terug",
      });

  const _titlePasswordForgotten = titlePasswordForgotten
    ? titlePasswordForgotten
    : intl.formatMessage({
        id: "mykn.templates.Login.titlePasswordForgotten",
        description: "templates.Login: The password forgotten title",
        defaultMessage: "Wachtwoord vergeten?",
      });

  const _linkPasswordForgotten = linkPasswordForgotten
    ? linkPasswordForgotten
    : intl.formatMessage({
        id: "mykn.templates.Login.linkPasswordForgotten",
        description: "templates.Login: The password forgotten link",
        defaultMessage: "Klik hier",
      });

  return (
    <BaseTemplate
      columnProps={{ start: 5, span: 4 }}
      pageProps={{
        valign: "middle",
        backgroundImageUrl,
      }}
      container={true}
      {...props}
    >
      <Card halign="center" shadow>
        <Body>
          {slotLogo || CustomLogo || <Logo />}
          <br />
          <br />
          <H1>{_titleLogin}</H1>
          <br />
          <Form
            labelSubmit={ucFirst(_labelLogin)}
            {...formProps}
            buttonProps={{
              justify: true,
            }}
          />
          {passwordForgottenHref && (
            <P muted>
              {_titlePasswordForgotten}{" "}
              <A href={passwordForgottenHref}>{_linkPasswordForgotten}</A>
            </P>
          )}
        </Body>
      </Card>
    </BaseTemplate>
  );
};
