import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

import { formatMessage, isPrimitive, useIntl } from "../../lib";
import { ButtonProps } from "../button";
import { Card } from "../card";
import { Outline } from "../icon";
import { H2 } from "../typography";
import "./modal.scss";

export type ModalProps = Omit<React.ComponentProps<"dialog">, "title"> & {
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

  const handleClose: React.ReactEventHandler<HTMLDialogElement> = (e) => {
    setOpenState(false);
    onClose?.(e);
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

  const controls: ButtonProps[] = [
    {
      "aria-label": _labelClose,
      children: <Outline.XMarkIcon />,
      variant: "transparent",
      onClick: () => dialogRef.current?.close(),
    },
  ];

  return (
    <dialog
      aria-hidden={openState ? undefined : true}
      ref={dialogRef}
      className={clsx("mykn-modal", {
        [`mykn-modal--size-${size}`]: size,
        [`mykn-modal--position-${position}`]: position,
      })}
      onClose={handleClose}
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
