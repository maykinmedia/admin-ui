import { useContext, useEffect, useState } from "react";
import React from "react";

import {
  field2Title,
  formatMessage,
  serializeForm,
  ucFirst,
  useIntl,
} from "../../../lib";
import { ButtonProps } from "../../button";
import { Form } from "../../form";
import { Outline } from "../../icon";
import { Modal } from "../../modal";
import { Toolbar, ToolbarItem } from "../../toolbar";
import { Body, H3 } from "../../typography";
import { DataGridContext } from "./datagrid";
import { DataGridSelectionCheckbox } from "./datagridselectioncheckbox";
import { TRANSLATIONS } from "./translations";

/**
 * DataGrid toolbar, shows selection actions and/or allows the user to select fields (columns).
 */
export const DataGridToolbar: React.FC = () => {
  const { toolbarRef } = useContext(DataGridContext);
  const intl = useIntl();
  const [selectFieldsModalState, setSelectFieldsModalState] = useState(false);
  const [selectFieldsActiveState, setSelectFieldsActiveState] = useState<
    Record<string, boolean>
  >({});

  const {
    allowSelectAll,
    allowSelectAllPages,
    fields,
    fieldsSelectable,
    labelSaveFieldSelection,
    labelSelectFields,
    selectable,
    selectedRows,
    selectionActions,
    onFieldsChange,
  } = useContext(DataGridContext);

  // Create map mapping `field.name` to active state.
  useEffect(() => {
    setSelectFieldsActiveState(
      fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: field.active !== false,
        }),
        {},
      ),
    );
  }, [fields]);

  const context = {
    open: Boolean(selectFieldsModalState),
  };

  const _labelSelectFields = labelSelectFields
    ? formatMessage(labelSelectFields, context)
    : intl.formatMessage(TRANSLATIONS.LABEL_SELECT_FIELDS, context);

  const _labelSaveFieldSelection = labelSaveFieldSelection
    ? formatMessage(labelSaveFieldSelection, context)
    : intl.formatMessage(TRANSLATIONS.LABEL_SAVE_FIELD_SELECTION, context);

  const toolbarItems: ToolbarItem[] = [
    selectable && allowSelectAll ? (
      <DataGridSelectionCheckbox key="selectPage" selectAll="page" />
    ) : null,

    selectable && allowSelectAllPages ? (
      <DataGridSelectionCheckbox key="selectAllPages" selectAll="allPages" />
    ) : null,

    ...(selectionActions || []).map(
      (buttonProps): ButtonProps => ({
        variant: "secondary",
        ...buttonProps,
        onClick: () => {
          if (typeof buttonProps.onClick === "function") {
            const customEvent = new CustomEvent("click", {
              detail: selectedRows,
            });
            buttonProps.onClick(
              customEvent as unknown as React.MouseEvent<HTMLButtonElement>,
            );
          }
        },
      }),
    ),

    fieldsSelectable ? "spacer" : null,
    fieldsSelectable
      ? {
          variant: "outline",
          wrap: false,
          onClick: () => setSelectFieldsModalState(true),
          children: (
            <>
              <Outline.ViewColumnsIcon />
              {ucFirst(_labelSelectFields)}
            </>
          ),
        }
      : null,
  ];

  return (
    <div ref={toolbarRef} className="mykn-datagrid__toolbar">
      <Toolbar directionResponsive={true} items={toolbarItems} pad={true} />

      <Modal
        open={selectFieldsModalState}
        position="side"
        size="s"
        title={<H3>{ucFirst(_labelSelectFields)}</H3>}
        onClose={() => setSelectFieldsModalState(false)}
      >
        <Body>
          <Form
            fields={[
              {
                name: "fields",
                options: fields.map((f) => ({
                  label: field2Title(f.name, { lowerCase: false }),
                  value: f.name,
                  selected: Boolean(selectFieldsActiveState[f.name]),
                })),
                type: "checkbox",
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const name = e.target.value;
                  setSelectFieldsActiveState({
                    ...selectFieldsActiveState,
                    [name]: !selectFieldsActiveState[name],
                  });
                },
              },
            ]}
            labelSubmit={ucFirst(_labelSaveFieldSelection)}
            onSubmit={(e) => {
              const form = e.target as HTMLFormElement;
              const data = serializeForm(form);
              const selectedFields = (data.fields || []) as string[];
              const newTypedFieldsState = fields.map((f) => ({
                ...f,
                active: selectedFields.includes(f.name),
              }));
              onFieldsChange?.(newTypedFieldsState);
              setSelectFieldsModalState(false);
            }}
          />
        </Body>
      </Modal>
    </div>
  );
};
