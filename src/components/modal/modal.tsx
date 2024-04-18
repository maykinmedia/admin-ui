import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

import { ButtonProps } from "../button";
import { Card } from "../card";
import { Outline } from "../icon";
import "./modal.scss";

export type ModalProps = React.ComponentProps<"dialog"> & {
  open?: React.ComponentProps<"dialog">["open"];
  onClose?: React.ComponentProps<"dialog">["onClose"];
  position?: "float" | "side";
  size?: "m" | "s";
  title?: string;
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
  ...props
}) => {
  const [openState, setOpenState] = useState<ModalProps["open"]>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(
    () => (open ? dialogRef.current?.showModal() : dialogRef.current?.close()),
    [open],
  );

  const handleClose: React.ReactEventHandler<HTMLDialogElement> = (e) => {
    setOpenState(false);
    onClose?.(e);
  };

  const controls: ButtonProps[] = [
    {
      "aria-label": "todo",
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
      <Card controls={controls} title={title}>
        {children}
      </Card>
    </dialog>
  );
};
