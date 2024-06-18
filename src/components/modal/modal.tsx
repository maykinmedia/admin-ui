import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

import { formatMessage, isPrimitive, useIntl } from "../../lib";
import { ButtonProps } from "../button";
import { Card } from "../card";
import { Outline } from "../icon";
import { H2 } from "../typography";
import "./modal.scss";

export type ModalProps = Omit<React.ComponentProps<"dialog">, "title"> & {
  allowClose?: boolean;
  labelClose?: string;
  open?: React.ComponentProps<"dialog">["open"];
  onClose?: React.ComponentProps<"dialog">["onClose"];
  position?: "float" | "side";
  size?: "m" | "s";
  title?: string | React.ReactNode;
};

/**
 * Modal component (mode dialog).
 */
export const Modal: React.FC<ModalProps> = ({
  allowClose = true,
  children,
  open,
  onClose,
  position = "float",
  size,
  title,
  labelClose,
  ...props
}) => {
  const [openState, setOpenState] = useState<ModalProps["open"]>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const intl = useIntl();

  useEffect(
    () => (open ? dialogRef.current?.showModal() : dialogRef.current?.close()),
    [open],
  );

  /**
   * Gets called when to modal is closed.
   * @param e
   */
  const handleClose: React.ReactEventHandler<HTMLDialogElement> = (e) => {
    setOpenState(false);
    onClose?.(e);
  };

  /**
   * Get called when a key is pressed, prevents the default action if key is "Escape" and closing is not allowed.
   * @param e
   */
  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    if (allowClose || e.key !== "Escape") {
      return;
    }
    e.preventDefault();
  };

  const context = {
    open: Boolean(openState),
  };

  const _labelClose = labelClose
    ? formatMessage(labelClose, context)
    : intl.formatMessage(
        {
          id: "mykn.components.Modal.labelClose",
          description:
            "mykn.components.Modal: The modal close (accessible) label",
          defaultMessage: "Sluiten",
        },
        context,
      );

  const controls: ButtonProps[] | undefined = allowClose
    ? [
        {
          "aria-label": _labelClose,
          children: <Outline.XMarkIcon />,
          variant: "transparent",
          onClick: () => dialogRef.current?.close(),
        },
      ]
    : undefined;

  return (
    <dialog
      aria-hidden={openState ? undefined : true}
      ref={dialogRef}
      className={clsx("mykn-modal", {
        [`mykn-modal--size-${size}`]: size,
        [`mykn-modal--position-${position}`]: position,
      })}
      onClose={handleClose}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <Card
        controls={controls}
        title={isPrimitive(title) ? <H2>{title}</H2> : title}
      >
        {children}
      </Card>
    </dialog>
  );
};
