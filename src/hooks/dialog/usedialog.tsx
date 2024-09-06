import React, { useContext } from "react";

import { Body, ModalProps, P, Toolbar, ToolbarItem } from "../../components";
import { ModalServiceContext } from "../../contexts";

/**
 * Returns a function which, when called: shows a `Modal` component. This is
 * used to facilitate `useAlert()`, `useConfirm()` etc. and depends on
 * `ModalService`/`ModalServiceContext` being available.
 */
export const useDialog = () => {
  const { setModalProps } = useContext(ModalServiceContext);

  /**
   * Shows a `Modal` component.
   * @param title
   * @param body
   * @param actions
   * @param modalProps
   */
  const fn = (
    title: string,
    body: React.ReactNode,
    actions?: ToolbarItem[],
    modalProps?: Partial<ModalProps>,
  ) => {
    setModalProps({
      open: true,
      size: "m",
      title,
      children: (
        <>
          <Body>{typeof body === "string" ? <P>{body}</P> : body}</Body>
          {actions && (
            <Toolbar
              align="space-between"
              variant="transparent"
              pad={true}
              items={actions}
              overrideItemProps={false}
            />
          )}
        </>
      ),
      ...modalProps,
    });
  };

  return fn;
};
