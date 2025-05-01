import React, { useEffect, useState } from "react";

import {
  gettextFirst,
  serializeForm,
  string2Title,
  ucFirst,
} from "../../../lib";
import { ButtonProps } from "../../button";
import { Form } from "../../form";
import { Outline } from "../../icon";
import { Modal } from "../../modal";
import { Toolbar, ToolbarItem } from "../../toolbar";
import { Body, H3 } from "../../typography";
import { useDataGridContext } from "./datagrid";
import { DataGridSelectionCheckbox } from "./datagridselectioncheckbox";
import { TRANSLATIONS } from "./translations";

/**
 * DataGrid toolbar, shows selection actions and/or allows the user to select fields (columns).
 */
export const DataGridToolbar = <
  T extends object = object,
  F extends object = T,
>() => {
  const { toolbarRef } = useDataGridContext<T, F>();
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
  } = useDataGridContext<T, F>();

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

  const _labelSelectFields = gettextFirst(
    labelSelectFields,
    TRANSLATIONS.LABEL_SELECT_FIELDS,
    context,
  );

  const _labelSaveFieldSelection = gettextFirst(
    labelSaveFieldSelection,
    TRANSLATIONS.LABEL_SAVE_FIELD_SELECTION,
    context,
  );

  const toolbarItems: ToolbarItem[] = [
    selectable && allowSelectAll ? (
      <DataGridSelectionCheckbox<T, F> key="selectPage" selectAll="page" />
    ) : null,

    selectable && allowSelectAllPages ? (
      <DataGridSelectionCheckbox<T, F>
        key="selectAllPages"
        selectAll="allPages"
      />
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
        <Body allowScroll>
          <Form
            fields={[
              {
                name: "fields",
                options: fields.map((f) => ({
                  label: string2Title(f.name.toString(), { lowerCase: false }),
                  value: f.name.toString(),
                  selected: Boolean(selectFieldsActiveState[f.name.toString()]),
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
            showRequiredExplanation={false}
            onSubmit={(e) => {
              const form = e.target as HTMLFormElement;
              const data = serializeForm(form, false);
              const selectedFields = (data.fields || []) as string[];
              const newTypedFieldsState = fields.map((f) => ({
                ...f,
                active: selectedFields.includes(f.name.toString()),
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
