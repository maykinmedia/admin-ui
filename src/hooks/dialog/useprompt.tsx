import { FormField } from "@maykin-ui/admin-ui";
import React from "react";

import { ModalProps } from "../../components";
import { useFormDialog } from "./useFormDialog";

/**
 * Returns a function which, when called: shows a prompt dialog with a
 * confirmation callback and an optional cancellation callback.
 */
export const usePrompt = () => {
  const formDialog = useFormDialog();

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
    const fields: FormField[] = [
      {
        label,
        name: "message",
        required: true,
        type: "text",
      },
    ];

    formDialog(
      title,
      message,
      fields,
      labelConfirm,
      labelCancel,
      (data) => {
        const message = data.message as string;
        onConfirm(message);
      },
      onCancel,
      modalProps,
    );
  };

  return fn;
};
