import React, { useContext } from "react";

import { Body, Card, Form, FormProps, Hr, Logo } from "../../components";
import { ConfigContext } from "../../contexts";
import {
  SerializedFormData,
  createMessageDescriptor,
  ucFirst,
  useIntl,
} from "../../lib";
import { BaseTemplate, BaseTemplateProps } from "../base";
import { TRANSLATIONS } from "./translations";

export type LoginTemplateProps<
  T extends SerializedFormData = SerializedFormData,
> = BaseTemplateProps & {
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
export const LoginTemplate = <
  T extends SerializedFormData = SerializedFormData,
>({
  formProps,
  labelLogin,
  labelOidcLogin,
  urlOidcLogin,
  slotLogo,
  ...props
}: LoginTemplateProps<T>) => {
  const { logo: CustomLogo } = useContext(ConfigContext);
  const intl = useIntl();

  const _labelLogin = intl.formatMessage(
    createMessageDescriptor(labelLogin, TRANSLATIONS.LABEL_LOGIN),
  );

  const _labelOidcLogin = intl.formatMessage(
    createMessageDescriptor(labelOidcLogin, TRANSLATIONS.LABEL_OIDC_LOGIN),
  );

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
            showRequiredExplanation={false}
            {...formProps}
          />
        </Body>
      </Card>
    </BaseTemplate>
  );
};
