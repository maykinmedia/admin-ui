import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

import { gettextFirst, isPrimitive } from "../../lib";
import { ButtonProps } from "../button";
import { Card } from "../card";
import { Outline } from "../icon";
import { H2 } from "../typography";
import "./modal.scss";
import { TRANSLATIONS } from "./translations";

export type ModalProps = Omit<React.ComponentProps<"dialog">, "title"> & {
  allowClose?: boolean;
  labelClose?: string;
  open?: React.ComponentProps<"dialog">["open"];
  onClose?: React.ComponentProps<"dialog">["onClose"];
  position?: "float" | "side";
  restoreAutofocus?: boolean;
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
  restoreAutofocus = true,
  size,
  title,
  labelClose,
  ...props
}) => {
  const [openState, setOpenState] = useState<ModalProps["open"]>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const context = {
    open: Boolean(openState),
  };

  const _labelClose = gettextFirst(
    labelClose,
    TRANSLATIONS.LABEL_CLOSE,
    context,
  );

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
      setOpenState(true);
      if (restoreAutofocus) {
        doRestoreAutofocus();
      }
    } else {
      setOpenState(false);
      dialogRef.current?.close();
    }
  }, [open]);

  /**
   * Focuses the first child element with "autofocus" set.
   */
  const doRestoreAutofocus = () => {
    setTimeout(() => {
      const input =
        dialogRef.current?.querySelector<HTMLInputElement>("[autofocus]");
      input?.focus();
    });
  };

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
      hidden={!openState}
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
        fullHeight
        title={isPrimitive(title) ? <H2>{title}</H2> : title}
      >
        {children}
      </Card>
    </dialog>
  );
};
