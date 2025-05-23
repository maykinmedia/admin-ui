import clsx from "clsx";
import React from "react";

import { Button } from "../button";
import { Solid } from "../icon";
import { P } from "../typography";
import "./banner.scss";

export type BannerProps = {
  variant?: "info" | "success" | "warning" | "danger";

  /** Whether to show an icon. */
  withIcon?: boolean;

  /** Title of the banner */
  title: string;

  /** Description text under the title */
  description?: string;

  /** Button text for optional action button */
  actionText?: string;

  /** Callback function when action button is clicked */
  onActionClick?: () => void;
};

/**
 * Banner component
 * @param title
 * @param description
 * @param variant
 * @param withIcon
 * @param actionText
 * @param onActionClick
 * @param props
 * @constructor
 */
export const Banner: React.FC<BannerProps> = ({
  title,
  description,
  variant = "info",
  withIcon = false,
  actionText,
  onActionClick,
  ...props
}) => {
  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <Solid.XCircleIcon className="mykn-banner__icon" />;
      case "info":
        return <Solid.InformationCircleIcon className="mykn-banner__icon" />;
      case "warning":
        return <Solid.ExclamationTriangleIcon className="mykn-banner__icon" />;
      case "success":
        return <Solid.CheckCircleIcon className="mykn-banner__icon" />;
      default:
        return <></>;
    }
  };

  return (
    <div
      className={clsx("mykn-banner", {
        [`mykn-banner--variant-${variant}`]: variant,
        "mykn-banner--with-icon": withIcon,
        "mykn-banner--with-action": actionText,
      })}
      {...props}
    >
      {withIcon && getIcon()}
      <div className="mykn-banner__content">
        <P className="mykn-banner__title" bold>
          {title}
        </P>
        {description && (
          <P className="mykn-banner__description">{description}</P>
        )}
      </div>
      {actionText && onActionClick && (
        <Button
          variant="outline"
          onClick={onActionClick}
          className="mykn-banner__button"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
