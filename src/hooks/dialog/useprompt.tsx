import React, { useContext } from "react";

import { Form, ModalProps, P } from "../../components";
import { ModalServiceContext } from "../../contexts";
import { useDialog } from "./usedialog";

/**
 * Returns a function which, when called: shows a prompt dialog with a
 * confirmation callback and an optional cancellation callback.
 */
export const usePrompt = () => {
  const dialog = useDialog();
  const { setModalProps } = useContext(ModalServiceContext);

  /**
   * Shows a prompt dialog with a confirmation callback and an optional
   * cancellation callback.
   * @param title
   * @param message
   * @param label
   * @param labelConfirm
   * @param labelCancel
   * @param onConfirm
   * @param onCancel
   * @param modalProps
   */
  const fn = (
    title: string,
    message: React.ReactNode,
    label: string,
    labelConfirm: string,
    labelCancel: string,
    onConfirm: (message: string) => void,
    onCancel?: () => void,
    modalProps?: Partial<ModalProps>,
  ) => {
    dialog(
      title,
      <>
        {typeof message === "string" ? <P>{message}</P> : message}
        <Form
          fields={[{ label, name: "message", required: true }]}
          labelSubmit={labelConfirm}
          secondaryActions={[
            {
              children: labelCancel,
              variant: "secondary",
              type: "button",
              onClick: () => {
                setModalProps({ open: false });
                onCancel?.();
              },
            },
          ]}
          validateOnChange={true}
          onSubmit={(_, { message }) => {
            setModalProps({ open: false });
            onConfirm(message as string);
          }}
        />
      </>,
      undefined,
      { allowClose: false, ...modalProps },
    );
  };

  return fn;
};
