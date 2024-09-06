import React, { createContext, useState } from "react";

import { Modal, ModalProps } from "../../components";

export type ModalServiceContextType = {
  modalProps: ModalProps;
  setModalProps: (props: ModalProps) => void;
};

/**
 * Can be set to allow access to and update `modalProps`, which is used by `ModalService`.
 */
export const ModalServiceContext = createContext<ModalServiceContextType>({
  modalProps: {},
  setModalProps: () => {
    throw new Error(
      "ModalService not initialized! Please wrap the current rendering tree in a ModalService.",
    );
  },
});

/**
 * Service that implements `ModalServiceContext` and maps it to a `Modal`. This is required for e.g. `useDialog()` and
 * friends.
 * @param children
 * @constructor
 */
export const ModalService: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [modalProps, setModalProps] = useState<ModalProps>({});

  return (
    <ModalServiceContext.Provider
      value={{ modalProps, setModalProps: setModalProps }}
    >
      {children}
      {modalProps.open && <Modal {...modalProps} />}
    </ModalServiceContext.Provider>
  );
};
