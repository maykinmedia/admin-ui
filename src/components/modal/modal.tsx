import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

import { gettextFirst } from "../../lib";
import { Card } from "../card";
import { Outline } from "../icon";
import { ToolbarItem } from "../toolbar";
import "./modal.scss";
import { TRANSLATIONS } from "./translations";

export type ModalProps = Omit<React.ComponentProps<"dialog">, "title"> & {
  /** Buttons to use in the header. */
  actions?: ToolbarItem[];

  /** Whether to allow the dialog to be closed.*/
  allowClose?: boolean;

  /** Whether to show the close button.*/
  showClose?: boolean;

  /** Whether to show the `labelClose` label. */
  showLabelClose?: boolean;

  /** The close (accessible) label. */
  labelClose?: string;

  /** Whether the dialog is opened or closed. */
  open?: React.ComponentProps<"dialog">["open"];

  /** Gets called when the dialog is closed. */
  onClose?: React.ComponentProps<"dialog">["onClose"];

  /** The position of the modal. */
  position?: "float" | "side";

  /**
   * Attempts to fix the autofocus by focussing the first available input with
   * an `autofocus` attribute.
   */
  restoreAutofocus?: boolean;

  /** The size of the dialog. */
  size?: "m" | "s";

  /** The title of the dialog. */
  title?: string | React.ReactNode;

  /**
   * The type of dialog: "modal" is a blocking variant where "dialog" is solely
   * an overlay.
   */
  type?: "modal" | "dialog";
};

/**
 * Modal component (mode dialog).
 */
export const Modal: React.FC<ModalProps> = ({
  actions = [],
  allowClose = true,
  children,
  labelClose,
  showLabelClose = false,
  onClose,
  open,
  position = "float",
  restoreAutofocus = true,
  size,
  showClose = true,
  title,
  type = "modal",
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
      switch (type) {
        case "dialog":
          dialogRef.current?.show();
          break;
        default:
          dialogRef.current?.showModal();
      }

      setOpenState(true);
      if (restoreAutofocus) {
        dialogRef.current?.addEventListener("animationend", doRestoreAutofocus);
        return () =>
          dialogRef.current?.removeEventListener(
            "animationend",
            doRestoreAutofocus,
          );
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
    const target =
      dialogRef.current?.querySelector<HTMLInputElement>("[autofocus]") ||
      dialogRef.current;

    target?.focus();
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
    // Prevent unwanted close.
    if (!allowClose && e.key === "Escape") {
      e.preventDefault();
    }

    // Force possible non-native close when `type==="dialog".
    if (type === "dialog" && allowClose && e.key === "Escape") {
      dialogRef.current?.close();
    }
  };

  const _actions: ToolbarItem[] =
    allowClose && showClose
      ? [
          ...actions,
          {
            "aria-label": _labelClose,
            children: showLabelClose ? (
              <>
                <Outline.XMarkIcon /> {_labelClose}
              </>
            ) : (
              <Outline.XMarkIcon />
            ),
            variant: "transparent",
            onClick: () => dialogRef.current?.close(),
          },
        ]
      : actions;

  return (
    <dialog
      hidden={!openState}
      ref={dialogRef}
      className={clsx("mykn-modal", {
        [`mykn-modal--size-${size}`]: size,
        [`mykn-modal--position-${position}`]: position,
        [`mykn-modal--type-${type}`]: type,
      })}
      onClose={handleClose}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <Card actions={_actions} fullHeight={position === "side"} title={title}>
        {children}
      </Card>
    </dialog>
  );
};
