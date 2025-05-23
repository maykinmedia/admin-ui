import React, { useContext } from "react";

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
} from "../../components";
import { ConfigContext } from "../../contexts";
import { SerializedFormData, gettextFirst, ucFirst } from "../../lib";
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
  columnProps,
  formProps,
  labelLogin,
  labelOidcLogin,
  urlOidcLogin,
  slotLogo,
  ...props
}: LoginTemplateProps<T>) => {
  const { logo: CustomLogo } = useContext(ConfigContext);

  const _labelLogin = gettextFirst(labelLogin, TRANSLATIONS.LABEL_LOGIN);
  const _labelOidcLogin = gettextFirst(
    labelOidcLogin,
    TRANSLATIONS.LABEL_OIDC_LOGIN,
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
    <BaseTemplate {...props} grid={false}>
      <Container>
        <Grid fullHeight valign="middle">
          <Column direction="row" start={5} span={4} {...columnProps}>
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
          </Column>
        </Grid>
      </Container>
    </BaseTemplate>
  );
};
