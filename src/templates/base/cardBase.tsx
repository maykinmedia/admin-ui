import React, { useContext } from "react";

import {
  Body,
  BreadcrumbItem,
  Breadcrumbs,
  BreadcrumbsProps,
  Breakout,
  Card,
  CardProps,
  Column,
  ErrorMessageProps,
  Errors,
  Form,
  FormProps,
  Toolbar,
  ToolbarItem,
} from "../../components";
import { NavigationContext } from "../../contexts";
import { BaseTemplate, BaseTemplateProps } from "./base";

export type CardBaseTemplateProps = BaseTemplateProps & {
  actions?: ToolbarItem[];

  /** When set to true, a breakout component is applied to remove the page padding to  the card. */
  breakout?: boolean;

  /** Card props.*/
  cardProps?: CardProps;

  /** Breadcrumb items to show. */
  breadcrumbItems?: BreadcrumbItem[];

  /** Breadcrumbs props. */
  breadcrumbsProps?: BreadcrumbsProps;

  /** ErrorMessage props. */
  errorMessageProps?: ErrorMessageProps;

  errors?: ErrorMessageProps["children"] | ErrorMessageProps["children"][];

  /** Form props. */
  formProps?: FormProps;

  /** Secondary navigation items to show. */
  secondaryNavigationItems?: ToolbarItem[];

  /** Secondary navigation (JSX) slot. */
  slotSecondaryNavigation?: React.ReactNode;
};

/**
 * BodyBase template, renders children within card component.
 * @constructor
 */
export const CardBaseTemplate: React.FC<CardBaseTemplateProps> = ({
  actions,
  breakout = false,
  children,
  cardProps,

  breadcrumbItems = [],
  breadcrumbsProps,
  errorMessageProps,
  errors = [],
  formProps,
  secondaryNavigationItems = [],
  slotSecondaryNavigation,
  ...props
}) => {
  const {
    breadcrumbs,
    secondaryNavigation,
    secondaryNavigationItems: _secondaryNavigationItems,
    breadcrumbItems: _breadcrumbItems,
  } = useContext(NavigationContext);

  const contextBreadcrumbs =
    breadcrumbs ||
    (breadcrumbItems.length || _breadcrumbItems?.length ? (
      <Breadcrumbs
        items={
          (breadcrumbItems.length ? breadcrumbItems : _breadcrumbItems) || []
        }
        {...breadcrumbsProps}
      />
    ) : null);

  const contextSecondaryNavigation =
    formProps ||
    secondaryNavigation ||
    secondaryNavigationItems.length ||
    _secondaryNavigationItems?.length ? (
      <Toolbar
        align="end"
        direction="horizontal"
        items={
          (secondaryNavigationItems.length
            ? secondaryNavigationItems
            : _secondaryNavigationItems) || []
        }
        pad={true}
        variant="alt"
      >
        {formProps && (
          <Form
            direction="horizontal"
            showRequiredExplanation={false}
            toolbarProps={{ pad: false }}
            {...Object(formProps)}
          />
        )}
      </Toolbar>
    ) : null;

  const renderCard = () => (
    <Card fullHeight {...cardProps}>
      {actions && (
        <Toolbar
          align="end"
          compact={true}
          pad={false}
          variant="transparent"
          items={actions}
        ></Toolbar>
      )}
      <Errors errors={errors} errorMessageProps={errorMessageProps} />
      {slotSecondaryNavigation ||
        (contextSecondaryNavigation && (
          <Column direction={"row"} span={12}>
            {contextSecondaryNavigation}
          </Column>
        ))}
      {contextBreadcrumbs && <Body>{contextBreadcrumbs}</Body>}
      {children}
    </Card>
  );

  return (
    <BaseTemplate {...props}>
      {breakout ? <Breakout>{renderCard()}</Breakout> : renderCard()}
    </BaseTemplate>
  );
};
