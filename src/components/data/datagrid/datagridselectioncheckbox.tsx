import React, { useMemo } from "react";

import { gettextFirst } from "../../../lib";
import { Checkbox } from "../../form";
import { useDataGridContext } from "./datagrid";
import { TRANSLATIONS } from "./translations";

export type DataGridSelectionCheckboxProps<
  T extends object = object,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  F extends object = T,
> = {
  rowData?: T;
  selectAll?: false | "page" | "allPages";
};

/**
 * A select (all) checkbox
 */
export const DataGridSelectionCheckbox = <
  T extends object = object,
  F extends object = T,
>({
  rowData,
  selectAll,
}: DataGridSelectionCheckboxProps<T, F>) => {
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
  } = useDataGridContext<T, F>();

  const i18nContext = {
    count: count,
    countPage: renderableRows.length,
    pages: pages,
    amountSelected: amountSelected,
    selectAll: selectAll,
    amountUnselected: (count || 0) - (amountSelected || 0),
    amountUnselectedPage: renderableRows.length - (amountSelected || 0),
  };

  const _labelSelectAll = gettextFirst(
    labelSelectAll,
    TRANSLATIONS.LABEL_SELECT_ALL,
    i18nContext,
  );

  const _labelSelectAllPages = gettextFirst(
    labelSelectAllPages,
    TRANSLATIONS.LABEL_SELECT_ALL_PAGES,
    i18nContext,
  );

  const _labelSelect = gettextFirst(labelSelect, TRANSLATIONS.LABEL_SELECT, {
    i18nContext,
    ...rowData,
  });

  const { checked, disabled, onChange, ariaLabel } = useMemo(() => {
    let allSelected: boolean = false;
    let checked: boolean = false;
    let disabled: boolean = false;
    let handleSelect: (rows: T) => void;
    let ariaLabel: string = "";

    switch (selectAll) {
      case "page":
        allSelected = renderableRows?.every((a, index) =>
          equalityChecker(a, selectedRows[index]),
        );
        checked = allSelected || false;
        disabled = Boolean(allPagesSelectedManaged && allPagesSelected);
        handleSelect = () => onSelectAll(!allSelected);
        ariaLabel = _labelSelectAll;
        break;

      case "allPages":
        allSelected = Boolean(allPagesSelected);
        checked = allPagesSelected || false;
        handleSelect = () => onSelectAllPages(!allSelected);
        ariaLabel = _labelSelectAllPages;
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
        ariaLabel = _labelSelect;
    }

    const onChange = () => handleSelect(rowData || ({} as T));
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
