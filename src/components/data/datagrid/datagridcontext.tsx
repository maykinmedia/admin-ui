import React, { useContext } from "react";

import type { TypedField } from "../../../lib";
import type { DataGridProps } from "./datagrid";

export type DataGridContextType<T extends object, F extends object> = Omit<
  DataGridProps<T, F>,
  "equalityChecker" | "fields" | "onSelect" | "onSort"
> & {
  toolbarRef: React.RefObject<HTMLDivElement>;

  amountSelected: number;
  count: number;
  dataGridId: string;
  editable: boolean;
  editingFieldIndex: number | null; // TODO: undefined?
  editingRow: T | null;
  equalityChecker: (item1: T, item2: T) => boolean;
  fields: TypedField<T>[];
  pages: number;
  renderableFields: TypedField<T>[];
  renderableRows: T[];
  selectedRows: T[];
  setEditingState: React.Dispatch<[T, number] | [null, null]>; // TODO: Wrap?
  sortable: boolean;
  sortDirection?: "ASC" | "DESC";
  sortField?: string;
  titleId?: string; // TODO: Move?;
  wrap?: boolean;
  onFieldsChange?: (typedFields: TypedField<T>[]) => void;
  onFilter: (rowData: F) => void;
  onSelect: (rows: T) => void;
  onSelectAll: (selected: boolean) => void;
  onSelectAllPages: (selected: boolean) => void;
  onSort: (field: TypedField<T>) => void;
};

export const DataGridContext = React.createContext<
  DataGridContextType<object, object>
>({} as DataGridContextType<object, object>);

export const useDataGridContext = <
  T extends object = object,
  F extends object = T,
>() => {
  return useContext(DataGridContext) as unknown as DataGridContextType<T, F>;
};
