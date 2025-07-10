import React, { useContext, useEffect } from "react";

import { Form, FormProps, ModalProps, P } from "../../components";
import { ModalServiceContext } from "../../contexts";
import { FormField, SerializedFormData } from "../../lib";
import { useDialog } from "./usedialog";

/**
 * Returns a function which, when called: shows a form dialog with a
 * confirmation callback and an optional cancellation callback.
 *
 * @typeParam T - The shape of the serialized form data.
 */
export const useFormDialog = <T extends object = object>() => {
  const dialog = useDialog();

  /**
   * Shows a prompt dialog with a confirmation callback and an optional
   * cancellation callback.

   * @typeParam T - The shape of the serialized form data.
   *
   * @param title
   * @param message
   * @param fields
   * @param labelConfirm
   * @param labelCancel
   * @param onConfirm
   * @param onCancel
   * @param modalProps
   * @param formProps
   * @param autofocus
   */
  const fn = <
    FT extends SerializedFormData = Record<keyof T, SerializedFormData[string]>,
  >(
    title: string,
    message: React.ReactNode,
    fields: FormField[],
    labelConfirm: string,
    labelCancel: string,
    onConfirm: (data: FT) => void,
    onCancel?: () => void,
    modalProps?: Partial<ModalProps>,
    formProps?: FormProps<FT>,
    autofocus?: boolean,
  ) => {
    dialog(
      title,
      <>
        {typeof message === "string" ? <P>{message}</P> : message}
        <PromptForm<FT>
          message={message}
          fields={fields}
          labelConfirm={labelConfirm}
          labelCancel={labelCancel}
          onConfirm={onConfirm}
          onCancel={onCancel}
          formProps={{ "aria-label": title, ...formProps }}
          autofocus={autofocus}
        />
      </>,
      undefined,
      { allowClose: false, ...modalProps },
    );
  };

  return fn;
};

const PromptForm = <T extends SerializedFormData = SerializedFormData>({
  fields,
  labelConfirm,
  labelCancel,
  onConfirm,
  onCancel,
  formProps,
  autofocus = false,
}: {
  message: React.ReactNode;
  fields: FormField[];
  labelConfirm: string;
  labelCancel: string;
  onConfirm: (data: T) => void;
  onCancel?: () => void;
  formProps?: FormProps<T>;
  autofocus?: boolean;
}) => {
  const { setModalProps } = useContext(ModalServiceContext);

  useEffect(() => {
    if (!autofocus) return;
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
    <Form<T>
      fields={fields}
      justify="stretch"
      labelSubmit={labelConfirm}
      secondaryActions={[
        {
          children: labelCancel,
          minWidth: true,
          type: "button",
          variant: "secondary",
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            onCancel?.();
            setModalProps({ open: false });
          },
        },
      ]}
      validateOnChange={true}
      onSubmit={(e, data) => {
        e.preventDefault();
        e.stopPropagation();
        onConfirm(data);
        setModalProps({ open: false });
      }}
      {...formProps}
    />
  );
};
