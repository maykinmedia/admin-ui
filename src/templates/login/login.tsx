import React, { useContext } from "react";

import { Body, Card, Form, FormProps, Hr, Logo } from "../../components";
import { ConfigContext } from "../../contexts";
import { ucFirst } from "../../lib/format/string";
import { useIntl } from "../../lib/i18n/useIntl";
import { BaseTemplate, BaseTemplateProps } from "../base";

export type LoginTemplateProps<T extends object = object> =
  BaseTemplateProps & {
    fields?: FormProps<T>["fields"];

    /** Form props. */
    formProps: FormProps<T>;

    /** The login form label. */
    labelLogin?: FormProps<T>["labelSubmit"];

    /** Logo (JSX) slot. */
    slotLogo?: React.ReactNode;

    labelOidcLogin?: string;
    urlOidcLogin?: string;
  };

/**
 * Login Template
 *
 * Uses a `Form` to render form fields within `CardBaseTemplate`, styled to
 * resemble a login page.
 *
 * @typeParam T - The shape of the serialized form data.
 */
export const LoginTemplate = <T extends object = object>({
  formProps,
  labelLogin,
  labelOidcLogin,
  urlOidcLogin,
  slotLogo,
  ...props
}: LoginTemplateProps<T>) => {
  const { logo: CustomLogo } = useContext(ConfigContext);
  const intl = useIntl();

  const _labelLogin = labelLogin
    ? labelLogin
    : intl.formatMessage({
        id: "mykn.templates.Login.labelLogin",
        description: "templates.Login: The login button label",
        defaultMessage: "inloggen",
      });

  const _labelOidcLogin = labelOidcLogin
    ? labelOidcLogin
    : intl.formatMessage({
        id: "mykn.templates.Login.labelOidcLogin",
        description: "templates.Login: The label for the OIDC login button.",
        defaultMessage: "Inloggen met organisatie account",
      });

  const secondaryActions = [];
  if (urlOidcLogin)
    secondaryActions.push({
      href: urlOidcLogin,
      variant: "secondary",
      children: _labelOidcLogin,
      disabled: false,
    });

  return (
    <BaseTemplate
      columnProps={{ start: 5, span: 4 }}
      pageProps={{ valign: "middle" }}
      container={true}
      {...props}
    >
      <Card>
        <Body>
          {slotLogo || CustomLogo || <Logo />}
          <Hr />
          <Form<T>
            justify="stretch"
            labelSubmit={ucFirst(_labelLogin)}
            secondaryActions={secondaryActions}
            {...formProps}
          />
        </Body>
      </Card>
    </BaseTemplate>
  );
};
