import React, { useContext, useEffect } from "react";

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
      <PromptForm
        message={message}
        label={label}
        labelConfirm={labelConfirm}
        labelCancel={labelCancel}
        onConfirm={onConfirm}
        onCancel={onCancel}
        setModalProps={setModalProps}
      />,
      undefined,
      { allowClose: false, ...modalProps },
    );
  };

  return fn;
};

const PromptForm = ({
  message,
  label,
  labelConfirm,
  labelCancel,
  onConfirm,
  onCancel,
  setModalProps,
}: {
  message: React.ReactNode;
  label: string;
  labelConfirm: string;
  labelCancel: string;
  onConfirm: (message: string) => void;
  onCancel?: () => void;
  setModalProps: (props: Partial<ModalProps>) => void;
}) => {
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
        fields={[{ label, name: "message", required: true }]} // No need to pass ref
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
    </>
  );
};
