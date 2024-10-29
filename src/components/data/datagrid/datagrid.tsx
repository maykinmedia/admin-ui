import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  DEFAULT_URL_FIELDS,
  Field,
  SerializedFormData,
  TypedField,
  filterAttributeDataArray,
  typedFieldByFields,
} from "../../../lib";
import {
  AttributeData,
  sortAttributeDataArray,
} from "../../../lib/data/attributedata";
import { BadgeProps } from "../../badge";
import { BoolProps } from "../../boolean";
import { ButtonProps } from "../../button";
import { AProps, PProps } from "../../typography";
import { PaginatorProps } from "../paginator";
import "./datagrid.scss";
import { DataGridFooter } from "./datagridfooter";
import { DataGridHeader } from "./datagridheader";
import { DataGridScrollPane } from "./datagridscrollpane";
import { DataGridTable } from "./datagridtable";
import { DataGridTBody } from "./datagridtbody";
import { DataGridTHead } from "./datagridthead";
import { DataGridToolbar } from "./datagridtoolbar";

export type DataGridProps = {
  /** The object list (after pagination), only primitive types supported for now. */
  objectList: AttributeData[];

  /**
   * Whether to allow horizontal contents to exceed the bounding box width
   * resulting in a horizontal scrollbar.
   */
  allowOverflowX?: boolean;

  /** Whether to use a "decorative" component instead of `<P>` if applicable. */
  decorate?: boolean;

  /**
   * Whether values should be made editable, default is determined by whether any of `fields` is a `TypedField` and has
   * `editable` set.
   */
  editable?: boolean;

  /** A `string[]` or `TypedField[]` containing the keys in `objectList` to show object for. */
  fields?: Array<Field | TypedField>;

  /** Whether the fields should be selectable. */
  fieldsSelectable?: boolean;

  /**
   * Whether values should be made filterable, default is determined by whether any of `fields` is a `TypedField` and has
   * `filterable` set.
   */
  filterable?: boolean;

  /**
   * A function transforming the filter values.
   * This can be used to adjust filter input to an API spec.
   */
  filterTransform?: (value: AttributeData) => AttributeData;

  /**
   * Can be any valid CSS `height` property or `"fill-available-space"` to
   * automatically use the available vertical in the document.
   */
  height?: CSSProperties["height"] | "fill-available-space";

  /** Whether to allow sorting/the field to sort on. */
  sort?: boolean | string;

  /**
   *  A `string[]` containing the fields which should be used to detect the url
   *  of a row. Fields specified in this object won't be rendered, instead: the
   *  first (non url) field is rendered as link (`A`) with `href` set to the
   *  resolved url of the row.
   */
  urlFields?: string[];

  /** Props for A. */
  aProps?: Omit<AProps, "href">;

  /** Props for Badge. */
  badgeProps?: BadgeProps;

  /** Props for Bool. */
  boolProps?: Omit<BoolProps, "value">;

  /**
   * If set, the paginator is enabled.
   * @see {PaginatorPropsAliases}
   */
  paginatorProps?: PaginatorProps;

  /** Defaults to whether paginatorProps is set. */
  showPaginator?: boolean;

  /** Props for P. */
  pProps?: PProps;

  /** Whether checkboxes should be shown for every row. */
  selectable?: boolean;

  /** References to the selected items in `objectList`, setting this preselects the items. */
  selected?: AttributeData[];

  /** Whether a select all checkbox should be shown (when `selectable=true`). */
  allowSelectAll?: boolean;

  /**
   * Whether a select all checkbox should be shown (when `selectable=true`) allowing to select all pages. If
   * `allPagesSelectedManaged=true` rows are considered selected when `allPagesSelected=true`. Clicking the
   * "select all pages" checkbox calls `onSelectAllPages(selected)`.
   */
  allowSelectAllPages?: boolean;

  /**
   * Whether all pages are selected. If `allPagesSelectedManaged=true`, setting this to `true` selects all rows. If
   * `allPagesSelectedManaged=false`.
   */
  allPagesSelected?: boolean;

  /**
   * Whether all rows are considered to be selected when `allowSelectAllPages=true`. If support for excluding rows from
   * the multi-page selection is required: this should be set to false and the selected rows should be provided as part
   * of the `selected` prop instead.
   */
  allPagesSelectedManaged?: boolean;

  /** The table layout algorithm. */
  tableLayout?: "auto" | "fixed";

  /** A title for the datagrid. */
  title?: React.ReactNode;

  /** The save selection label .*/
  labelSaveFieldSelection?: string;

  /** The select fields label .*/
  labelSelectFields?: string;

  /** The filter field (accessible) label .*/
  labelFilterField?: string;

  /** The select item label. */
  labelSelect?: string;

  /** The select all items label. */
  labelSelectAll?: string;

  /** The select all pages label. */
  labelSelectAllPages?: string;

  /** Can be used to specify how to compare the selected items and the items in the data grid */
  equalityChecker?: (item1: AttributeData, item2: AttributeData) => boolean;

  /** Renders buttons allowing to perform actions on selection, `onClick` is called with selection array. */
  selectionActions?: ButtonProps[];

  /** Get called to when the active field selection is changed. */
  onFieldsChange?: (typedFields: TypedField[]) => void;

  /**
   * Gets called when a selection is made, receives two arguments:
   *
   * - rows: an array containing:
   *   - a single selected item (regular selection).
   *   - all items on page (select all).
   * - selected: boolean indicating whether the rows are selected (true) or deselected (false).
   */
  onSelect?: (rows: AttributeData[], selected: boolean) => void;

  /** Gets called when the selection is changed, receives all currently selected items. */
  onSelectionChange?: (rows: AttributeData[]) => void;

  /** Gets called when the "select all pages" checkbox is clicked. */
  onSelectAllPages?: (selected: boolean) => void;

  /** Gets called when an object is selected. */
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement>,
    attributeData: DataGridProps["objectList"][number],
  ) => void;

  /** Gets called when a row value is edited. */
  onChange?: (event: React.ChangeEvent) => void;

  /** Gets called when a row value is edited. */
  onEdit?: (rowData: SerializedFormData) => void;

  /**
   *  Gets called when a row value is filtered.
   *  This callback is debounced every 300 milliseconds.
   */
  onFilter?: (rowData: AttributeData) => void;

  /** Gets called when the object list is sorted. */
  onSort?: (sort: string) => Promise<unknown> | void;
} & PaginatorPropsAliases;

export const toolbarRef = React.createRef<HTMLDivElement>();

export type DataGridContextType = Omit<
  DataGridProps,
  "equalityChecker" | "fields" | "onSelect" | "onSort"
> & {
  toolbarRef: React.RefObject<HTMLDivElement>;

  amountSelected: number;
  count: number;
  dataGridId: string;
  editable: boolean;
  editingFieldIndex: number | null; // TODO: undefined?
  editingRow: AttributeData | null;
  equalityChecker: (item1: AttributeData, item2: AttributeData) => boolean;
  fields: TypedField[];
  pages: number;
  renderableFields: TypedField[];
  renderableRows: AttributeData[];
  selectedRows: AttributeData[];
  setEditingState: React.Dispatch<[AttributeData | null, number | null]>; // TODO: Wrap?
  sortable: boolean;
  sortDirection?: "ASC" | "DESC";
  sortField?: string;
  titleId?: string; // TODO: Move?;
  onFieldsChange?: (typedFields: TypedField[]) => void;
  onFilter: (rowData: AttributeData) => void;
  onSelect: (rows: AttributeData) => void;
  onSelectAll: (selected: boolean) => void;
  onSelectAllPages: (selected: boolean) => void;
  onSort: (field: TypedField) => void;
};

export const DataGridContext = React.createContext<DataGridContextType>(
  {} as unknown as DataGridContextType,
);

/**
 * A subset of `PaginatorProps` that act as aliases.
 * @see {PaginatorProps}
 */
type PaginatorPropsAliases = {
  count?: PaginatorProps["count"];
  loading?: PaginatorProps["loading"];
  page?: PaginatorProps["page"];
  pageSize?: PaginatorProps["pageSize"];
  pageSizeOptions?: PaginatorProps["pageSizeOptions"];
  onPageChange?: PaginatorProps["onPageChange"];
  onPageSizeChange?: PaginatorProps["onPageSizeChange"];
};

/**
 * DataGrid component
 */
export const DataGrid: React.FC<DataGridProps> = (props) => {
  // Specify the default props.
  const defaults: Partial<DataGridProps> = {
    allowOverflowX: true,
    showPaginator: Boolean(props.paginatorProps),
    selectable: false,
    allowSelectAll: true,
    allowSelectAllPages: false,
    allPagesSelected: false,
    allPagesSelectedManaged: true,
    fieldsSelectable: false,
    equalityChecker: (item1: AttributeData, item2: AttributeData) =>
      item1 == item2,
    selectionActions: [],
    title: "",
    urlFields: DEFAULT_URL_FIELDS,
    page: props.paginatorProps?.page,
  };

  // Create a props object with defaults applied.
  const defaultedProps = { ...defaults, ...props };

  // Strip all `props` from `attrs`, allowing `attrs` to be passed to the DOM.
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    allowOverflowX,
    aProps,
    badgeProps,
    boolProps,
    decorate,
    objectList,
    editable,
    equalityChecker,
    fields,
    filterable,
    filterTransform,
    height,
    paginatorProps,
    showPaginator,
    pProps,
    selectable,
    allowSelectAll,
    allowSelectAllPages,
    allPagesSelected,
    allPagesSelectedManaged,
    fieldsSelectable,
    selected,
    selectionActions,
    sort,
    tableLayout,
    title,
    urlFields,
    labelSaveFieldSelection,
    labelFilterField,
    labelSelect,
    labelSelectAll,
    labelSelectAllPages,
    labelSelectFields,

    // Events
    onChange,
    onEdit,
    onFieldsChange,
    onFilter,
    onSelect,
    onSelectionChange,
    onSelectAllPages,
    onSort,

    // Aliases
    count,
    loading,
    page,
    pageSize,
    pageSizeOptions,
    onClick,
    onPageChange,
    onPageSizeChange,
    ...attrs
  } = defaultedProps;
  /* eslint-enable */

  const id = useId();
  const onFilterTimeoutRef = useRef<NodeJS.Timeout>();

  const [editingState, setEditingState] = useState<
    [AttributeData | null, number | null]
  >([null, null]);

  const [filterState, setFilterState] = useState<AttributeData | null>();
  const [selectedState, setSelectedState] = useState<AttributeData[] | null>(
    null,
  );

  const [allPagesSelectedState, setAllPagesSelectedState] =
    useState(allPagesSelected);

  const [sortState, setSortState] = useState<
    [string, "ASC" | "DESC"] | undefined
  >();

  const [fieldsState, setFieldsState] = useState<Array<Field | TypedField>>([]);

  // Update selectedState when selected prop changes.
  useEffect(() => {
    selected && setSelectedState(selected);
  }, [selected]);

  // Update selectedState when selected prop changes.
  useEffect(() => {
    setAllPagesSelectedState(allPagesSelected);
  }, [allPagesSelected]);

  // Update sortState when sort prop changes.
  useEffect(() => {
    if (typeof sort === "string") {
      const direction = sort.startsWith("-") ? "DESC" : "ASC";
      const field = sort.replace(/^-/, "");
      setSortState([field, direction]);
    }
  }, [sort]);

  // Update fieldsState when fields prop changes.
  useEffect(() => {
    const _fields =
      fields || (objectList?.length ? Object.keys(objectList[0]) : []);
    setFieldsState(_fields);
  }, [fields]);

  // Update fieldsState when objectList prop changes.
  useEffect(() => {
    if (!fieldsState.length) {
      const _fields =
        fields || (objectList?.length ? Object.keys(objectList[0]) : []);
      setFieldsState(_fields);
    }
  }, [objectList]);

  // Sync height
  const dataGridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = () => {
      requestAnimationFrame(() => {
        const node = dataGridRef.current;
        if (!node) return;

        // Height should be computed.
        if (height === "fill-available-space") {
          const rect = node.getBoundingClientRect();
          node.style.height = `auto`;

          const windowHeight = document.documentElement.clientHeight;
          const dataGridOffsetTop = rect.top;
          const availableHeight = Math.min(windowHeight - dataGridOffsetTop);
          node.style.height = `${availableHeight}px`;
        }

        // Height is defined.
        if (height) {
          node.style.height = height as string;
        }
      });
    };
    window.addEventListener("click", fn);
    window.addEventListener("resize", fn);
    window.addEventListener("scroll", fn);
    fn();

    return () => {
      window.removeEventListener("click", fn);
      window.removeEventListener("resize", fn);
      window.removeEventListener("scroll", fn);
    };
  });

  // Convert `Array<Field|TypedField>` to `TypedField[]`.
  const typedFields = useMemo(
    () =>
      typedFieldByFields(fieldsState, objectList, {
        editable: Boolean(editable),
        filterable: Boolean(filterable),
      }).filter((f) => !(urlFields || []).includes(String(f.name))),
    [fieldsState, objectList, urlFields, editable, filterable],
  );

  // Exclude inactive fields.
  const renderableFields = useMemo(
    () => typedFields.filter((f) => f.active !== false),
    [typedFields],
  );

  // Variable.
  const sortField = sortState?.[0];
  const sortDirection = sortState?.[1];
  const titleId = title ? `${id}-caption` : undefined;
  const _count = count || paginatorProps?.count || 0;
  const _pageSize = pageSize || _count;
  const _pages = Math.ceil(_count / _pageSize);

  const _selectedRows =
    (allPagesSelectedManaged && allPagesSelectedState
      ? objectList
      : selectedState) || [];

  // Filter rows.
  const filteredObjectList = useMemo(
    () =>
      filterState
        ? filterAttributeDataArray(objectList, filterState)
        : objectList || [],
    [objectList, filterState],
  );

  // Sort rows.
  const renderableRows = useMemo(
    () =>
      !onSort && sortField && sortDirection
        ? sortAttributeDataArray(filteredObjectList, sortField, sortDirection)
        : filteredObjectList,
    [onSort, sortField, sortDirection, filteredObjectList],
  );

  /**
   * Gets called when the select checkbox is clicked.
   */
  const handleSelect = useCallback(
    (attributeData: AttributeData) => {
      const currentlySelected = selectedState || [];

      const isAttributeDataCurrentlySelected = currentlySelected.find(
        (element) => equalityChecker?.(element, attributeData),
      );

      const newSelectedState = isAttributeDataCurrentlySelected
        ? currentlySelected.filter((a) => !equalityChecker?.(a, attributeData))
        : [...currentlySelected, attributeData];

      setSelectedState(newSelectedState);
      onSelect?.([attributeData], !isAttributeDataCurrentlySelected);
      onSelectionChange?.(newSelectedState);
    },
    [
      selectedState,
      setSelectedState,
      onSelect,
      onSelectionChange,
      equalityChecker,
    ],
  );

  /**
   * Gets called when the select all checkbox is clicked.
   */
  const handleSelectAll = useCallback(
    (selected: boolean) => {
      const value = selected ? renderableRows : [];
      setSelectedState(value);
      onSelect?.(value, selected);
      onSelectionChange?.(value);
    },
    [renderableRows, setSelectedState, onSelect, onSelectionChange],
  );

  /**
   * Gets called when the select all pages checkbox is clicked.
   */
  const handleSelectAllPages = useCallback(
    (selected: boolean) => {
      setAllPagesSelectedState(selected);
      onSelectAllPages?.(selected);
    },
    [setAllPagesSelectedState, onSelectAllPages],
  );

  /**
   * Get called when a column is sorted.
   * @param field
   */
  const handleSort = useCallback(
    (field: TypedField) => {
      const newSortDirection = sortDirection === "ASC" ? "DESC" : "ASC";
      setSortState([field.name, newSortDirection]);
      if (onSort) {
        onSort(newSortDirection === "ASC" ? field.name : `-${field.name}`);
      }
    },
    [sortDirection, setSortState, onSort], // Dependencies
  );

  /**
   * Get called when a column is filtered.
   * @param data
   */
  const handleFilter = useCallback(
    (data: AttributeData) => {
      if (onFilter) {
        const handler = () => onFilter(data);
        if (onFilterTimeoutRef.current) {
          clearTimeout(onFilterTimeoutRef.current);
        }
        onFilterTimeoutRef.current = setTimeout(handler, 300);
        setFilterState(null);
        return;
      }

      const hasFilterData = Object.keys(data).some((key) => data[key]);
      setFilterState(hasFilterData ? data : null);
    },
    [onFilter, onFilterTimeoutRef, setFilterState],
  );

  // Run assertions for aliased fields.
  if (showPaginator) {
    console.assert(
      typeof count !== "undefined" ||
        typeof paginatorProps?.count !== "undefined",
      "Either `count` or `paginatorProps.count` should be set when `showPaginator` is `true`.",
    );

    console.assert(
      page || paginatorProps?.page,
      "Either `page` or `paginatorProps.page` should be set when `showPaginator` is `true`.",
    );
    console.assert(
      pageSize || paginatorProps?.pageSize,
      "Either `pageSize` or `paginatorProps.pageSize` should be set when `showPaginator` is `true`.",
    );
  }
  return (
    <DataGridContext.Provider
      value={{
        toolbarRef,

        ...defaultedProps,
        // @ts-expect-error - FIXME, line required due due to story passing undefined.
        equalityChecker:
          defaultedProps.equalityChecker || defaults.equalityChecker,

        allPagesSelected: allPagesSelectedState,
        amountSelected: selectedState?.length || 0,
        count: _count,
        dataGridId: id,
        editable: Boolean(renderableFields.find((f) => f.editable)),
        editingFieldIndex: editingState[1],
        editingRow: editingState[0],
        fields: typedFields,
        pages: _pages,
        renderableFields: renderableFields,
        renderableRows: renderableRows,
        selectedRows: _selectedRows,
        setEditingState: setEditingState, // TODO: Wrap?
        sortable: Boolean(sort),
        sortDirection: sortDirection,
        sortField: sortField,
        titleId: titleId,

        // Events
        onFieldsChange: (typedFields: TypedField[]) => {
          setFieldsState(typedFields);
          onFieldsChange?.(typedFields);
        },
        onFilter: handleFilter,
        onSelect: handleSelect,
        onSort: handleSort,
        onSelectAll: handleSelectAll,
        onSelectAllPages: handleSelectAllPages,
      }}
    >
      <div ref={dataGridRef} className="mykn-datagrid" {...attrs}>
        {title && <DataGridHeader />}
        {(selectable || fieldsSelectable) && <DataGridToolbar />}

        <DataGridScrollPane>
          <DataGridTable>
            <DataGridTHead />
            <DataGridTBody />
          </DataGridTable>
        </DataGridScrollPane>

        {showPaginator && <DataGridFooter />}
        {filterable && <form id={`${id}-filter-form`} />}
      </div>
    </DataGridContext.Provider>
  );
};
