import { useContext } from "react";

import { ModalProps } from "../../components";
import { ModalServiceContext } from "../../contexts";
import { useDialog } from "./usedialog";

/**
 * Returns a function which, when called: shows a confirm dialog with a
 * confirmation callback and an optional cancellation callback.
 */
export const useConfirm = () => {
  const dialog = useDialog();
  const { setModalProps } = useContext(ModalServiceContext);

  /**
   * Shows a confirm dialog with a confirmation callback and an optional
   * cancellation callback.
   * @param title
   * @param body
   * @param labelConfirm
   * @param labelCancel
   * @param onConfirm
   * @param onCancel
   * @param modalProps
   */
  const fn = (
    title: string,
    body: string,
    labelConfirm: string,
    labelCancel: string,
    onConfirm: () => void,
    onCancel?: () => void,
    modalProps?: Partial<ModalProps>,
  ) => {
    dialog(
      title,
      body,
      [
        {
          children: labelCancel,
          variant: "secondary",
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            onCancel?.();
            setModalProps({ open: false });
          },
        },
        {
          children: labelConfirm,
          variant: "primary",
          type: "submit",
          onClick: (e) => {
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
