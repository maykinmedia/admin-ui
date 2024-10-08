import React, { useContext, useMemo } from "react";

import { AttributeData, useIntl } from "../../../lib";
import { Checkbox } from "../../form";
import { DataGridContext } from "./datagrid";
import { TRANSLATIONS } from "./translations";

export type DataGridSelectionCheckboxProps = {
  rowData?: AttributeData;
  selectAll?: false | "page" | "allPages";
};

/**
 * A select (all) checkbox
 */
export const DataGridSelectionCheckbox: React.FC<
  DataGridSelectionCheckboxProps
> = ({ rowData, selectAll }) => {
  const intl = useIntl();
  const {
    allPagesSelected,
    allPagesSelectedManaged,
    amountSelected,
    count,
    equalityChecker,
    labelSelect,
    labelSelectAll,
    labelSelectAllPages,
    pages,
    renderableRows,
    selectedRows,
    onSelect,
    onSelectAll,
    onSelectAllPages,
  } = useContext(DataGridContext);

  const { checked, disabled, onChange, ariaLabel } = useMemo(() => {
    let allSelected: boolean = false;
    let checked: boolean = false;
    let disabled: boolean = false;
    let handleSelect: (() => void) | ((rows: AttributeData) => void);
    let i18nContext;
    let ariaLabel: string = "";

    switch (selectAll) {
      case "page":
        allSelected =
          selectedRows?.every((a) => renderableRows.includes(a)) &&
          renderableRows.every((a) => selectedRows.includes(a));
        checked = allSelected || false;
        disabled = Boolean(allPagesSelectedManaged && allPagesSelected);
        handleSelect = () => onSelectAll(!allSelected);

        i18nContext = {
          count: count,
          countPage: renderableRows.length,
          pages: pages,
          amountSelected: amountSelected,
          selectAll: selectAll,
          amountUnselected: (count || 0) - (amountSelected || 0),
          amountUnselectedPage: renderableRows.length - (amountSelected || 0),
        };
        ariaLabel =
          labelSelectAll ||
          intl.formatMessage(TRANSLATIONS.LABEL_SELECT_ALL, i18nContext);
        break;

      case "allPages":
        allSelected = Boolean(allPagesSelected);
        checked = allPagesSelected || false;
        handleSelect = () => onSelectAllPages(!allSelected);

        i18nContext = { pages: count };
        ariaLabel =
          labelSelectAllPages ||
          intl.formatMessage(TRANSLATIONS.LABEL_SELECT_ALL_PAGES, i18nContext);
        break;

      default:
        allSelected = false;
        checked =
          (rowData &&
            !!selectedRows.find((element) =>
              equalityChecker(element, rowData),
            )) ||
          false;
        disabled = Boolean(allPagesSelectedManaged && allPagesSelected);
        handleSelect = onSelect;

        i18nContext = {
          count: count,
          countPage: renderableRows.length,
          pages: pages,
          amountSelected: amountSelected,
          selectAll: selectAll,
          amountUnselected: (count || 0) - (amountSelected || 0),
          amountUnselectedPage: renderableRows.length - (amountSelected || 0),
          ...rowData,
        };
        ariaLabel =
          labelSelect ||
          intl.formatMessage(TRANSLATIONS.LABEL_SELECT, i18nContext);
    }

    const onChange = () => handleSelect(rowData || {});
    return { checked, disabled, onChange, ariaLabel };
  }, [
    allPagesSelected,
    allPagesSelectedManaged,
    amountSelected,
    count,
    labelSelect,
    pages,
    renderableRows,
    rowData,
    selectAll,
    selectedRows,
  ]);

  return (
    <Checkbox
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      aria-label={ariaLabel}
    >
      {selectAll && ariaLabel}
    </Checkbox>
  );
};
