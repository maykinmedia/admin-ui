import {
  AttributeData,
  Form,
  FormField,
  FormProps,
  ModalProps,
  P,
} from "@maykin-ui/admin-ui";
import React, { useContext, useEffect } from "react";

import { ModalServiceContext } from "../../contexts";
import { useDialog } from "./usedialog";

/**
 * Returns a function which, when called: shows a form dialog with a
 * confirmation callback and an optional cancellation callback.
 */
export const useFormDialog = () => {
  const dialog = useDialog();

  /**
   * Shows a prompt dialog with a confirmation callback and an optional
   * cancellation callback.
   * @param title
   * @param message
   * @param fields
   * @param labelConfirm
   * @param labelCancel
   * @param onConfirm
   * @param onCancel
   * @param modalProps
   * @param formProps
   */
  const fn = (
    title: string,
    message: React.ReactNode,
    fields: FormField[],
    labelConfirm: string,
    labelCancel: string,
    onConfirm: (data: AttributeData) => void,
    onCancel?: () => void,
    modalProps?: Partial<ModalProps>,
    formProps?: FormProps,
  ) => {
    dialog(
      title,
      <>
        {typeof message === "string" ? <P>{message}</P> : message}
        <PromptForm
          message={message}
          fields={fields}
          labelConfirm={labelConfirm}
          labelCancel={labelCancel}
          onConfirm={onConfirm}
          onCancel={onCancel}
          formProps={formProps}
        />
      </>,
      undefined,
      { allowClose: false, ...modalProps },
    );
  };

  return fn;
};

const PromptForm = ({
  message,
  fields,
  labelConfirm,
  labelCancel,
  onConfirm,
  onCancel,
  formProps,
}: {
  message: React.ReactNode;
  fields: FormField[];
  labelConfirm: string;
  labelCancel: string;
  onConfirm: (data: AttributeData) => void;
  onCancel?: () => void;
  formProps?: FormProps;
}) => {
  const { setModalProps } = useContext(ModalServiceContext);

  useEffect(() => {
    // Delay the focus slightly to ensure modal and form are fully rendered
    const timer = setTimeout(() => {
      // We focus a form element, and if none are found, we focus the submit button, and otherwise none
      const formElement: HTMLFormElement | null = document.querySelector(
        "form input , form textarea , form select , form button[type=submit]",
      );
      if (formElement) {
        formElement.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {typeof message === "string" ? <P>{message}</P> : message}
      <Form
        fields={fields}
        labelSubmit={labelConfirm}
        secondaryActions={[
          {
            children: labelCancel,
            type: "button",
            variant: "secondary",
            onClick: () => {
              setModalProps({ open: false });
              onCancel?.();
            },
          },
        ]}
        validateOnChange={true}
        onSubmit={(_, data) => {
          setModalProps({ open: false });
          onConfirm(data);
        }}
        {...formProps}
      />
    </>
  );
};
