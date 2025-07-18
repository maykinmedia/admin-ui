import React, { useContext } from "react";

import { ModalProps } from "../../components";
import { ModalServiceContext } from "../../contexts";
import { useDialog } from "./usedialog";

/**
 * Returns a function which, when called: shows an alert dialog with an optional
 * callback.
 */
export const useAlert = () => {
  const dialog = useDialog();
  const { setModalProps } = useContext(ModalServiceContext);

  /**
   * Shows an alert dialog with an optional callback.
   * @param title
   * @param body
   * @param labelConfirm
   * @param onConfirm
   * @param modalProps
   */
  const fn = (
    title: string,
    body: string,
    labelConfirm: string,
    onConfirm?: () => void,
    modalProps?: Partial<ModalProps>,
  ) => {
    dialog(
      title,
      body,
      [
        "spacer",
        {
          children: labelConfirm,
          minWidth: true,
          type: "submit",
          variant: "primary",
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            onConfirm?.();
            setModalProps({ open: false });
          },
        },
      ],
      { allowClose: false, ...modalProps },
    );
  };

  return fn;
};
