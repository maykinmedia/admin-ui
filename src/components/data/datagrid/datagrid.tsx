import clsx from "clsx";
import React, {
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Attribute,
  DEFAULT_URL_FIELDS,
  Field,
  SerializedFormData,
  TypedField,
  filterAttributeDataArray,
  formatMessage,
  isPrimitive,
  serializeForm,
  typedFieldByFields,
  ucFirst,
  useIntl,
} from "../../../lib";
import {
  AttributeData,
  sortAttributeDataArray,
} from "../../../lib/data/attributedata";
import { getByDotSeparatedPath } from "../../../lib/data/getByDotSeparatedPath";
import { field2Title, isLink } from "../../../lib/format/string";
import { BadgeProps } from "../../badge";
import { BoolProps } from "../../boolean";
import { Button, ButtonProps } from "../../button";
import { Checkbox, Form, FormControl } from "../../form";
import { Outline } from "../../icon";
import { Modal } from "../../modal";
import { Toolbar } from "../../toolbar";
import { AProps, Body, H2, H3, P, PProps } from "../../typography";
import { Paginator, PaginatorProps } from "../paginator";
import { Value } from "../value";
import "./datagrid.scss";
import { TRANSLATIONS } from "./translations";

export type DataGridProps = {
  /** The object list (after pagination), only primitive types supported for now. */
  objectList: AttributeData[];

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

export type DataGridContextType = Omit<
  DataGridProps,
  "equalityChecker" | "fields" | "onSelect" | "onSort"
> & {
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
const DataGridContext = React.createContext<DataGridContextType>(
  {} as unknown as DataGridContextType,
);

const getTypedFields = (
  fields: Array<Field | TypedField>,
  objectList: AttributeData[],
  urlFields: string[],
  editable: DataGridProps["editable"],
  filterable: DataGridProps["filterable"],
): TypedField[] =>
  typedFieldByFields(fields, objectList, {
    editable: Boolean(editable),
    filterable: Boolean(filterable),
  }).filter((f) => !urlFields.includes(String(f.name)));

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
    labelSelectFields,
    labelSelectAll,

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

  const typedFieldsState = getTypedFields(
    fieldsState,
    objectList,
    urlFields as string[],
    editable,
    filterable,
  );

  const renderableFields = typedFieldsState.filter((f) => f.active !== false);
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

  const filteredObjectList = filterState
    ? filterAttributeDataArray(objectList, filterState)
    : objectList || [];

  const renderableRows =
    !onSort && sortField && sortDirection
      ? sortAttributeDataArray(filteredObjectList, sortField, sortDirection)
      : filteredObjectList;

  /**
   * Gets called when tha select all checkbox is clicked.
   */
  const handleSelectAll = (selected: boolean) => {
    const value = selected ? renderableRows : [];
    setSelectedState(value);
    onSelect?.(value, selected);
    onSelectionChange?.(value);
  };

  /**
   * Gets called when tha select all checkbox is clicked.
   */
  const handleSelectAllPages = (selected: boolean) => {
    setAllPagesSelectedState(selected);
    onSelectAllPages?.(selected);
  };

  const handleSelect = (attributeData: AttributeData) => {
    const currentlySelected = selectedState || [];

    const isAttributeDataCurrentlySelected = currentlySelected.find((element) =>
      equalityChecker?.(element, attributeData),
    );

    const newSelectedState = isAttributeDataCurrentlySelected
      ? [...currentlySelected].filter(
          (a) => !equalityChecker?.(a, attributeData),
        )
      : [...currentlySelected, attributeData];

    setSelectedState(newSelectedState);
    onSelect?.([attributeData], !isAttributeDataCurrentlySelected);
    onSelectionChange?.(newSelectedState);
  };

  /**
   * Get called when a column is sorted.
   * @param field
   */
  const handleSort = (field: TypedField) => {
    const newSortDirection = sortDirection === "ASC" ? "DESC" : "ASC";
    setSortState([field.name, newSortDirection]);
    onSort &&
      onSort(newSortDirection === "ASC" ? field.name : `-${field.name}`);
  };
  /**
   * Get called when a column is filtered.
   * @param data
   */
  const handleFilter = (data: AttributeData) => {
    if (onFilter) {
      const handler = () => onFilter(data);
      onFilterTimeoutRef.current && clearTimeout(onFilterTimeoutRef.current);
      onFilterTimeoutRef.current = setTimeout(handler, 300);
      setFilterState(null);
      return;
    }

    if (Object.keys(data).filter((key) => data[key]).length === 0) {
      setFilterState(null);
    } else {
      setFilterState(data);
    }
  };

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
        fields: typedFieldsState,
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
      <div className="mykn-datagrid" {...attrs}>
        <table
          className={clsx("mykn-datagrid__table", {
            [`mykn-datagrid__table--layout-${tableLayout}`]: tableLayout,
          })}
          role="grid"
          aria-labelledby={titleId}
        >
          {/* Caption */}
          {(title || selectable || fieldsSelectable) && <DataGridCaption />}

          {/* Heading */}
          <DataGridHeading />
          <DataGridBody />

          {/* Paginator */}
          {showPaginator && <DataGridFooter />}
        </table>
        {filterable && <form id={`${id}-filter-form`} />}
      </div>
    </DataGridContext.Provider>
  );
};

export const DataGridCaption: React.FC = () => {
  const [selectFieldsModalState, setSelectFieldsModalState] = useState(false);
  const [selectFieldsActiveState, setSelectFieldsActiveState] = useState<
    Record<string, boolean>
  >({});
  const intl = useIntl();

  const {
    fields,
    fieldsSelectable,
    labelSaveFieldSelection,
    labelSelectFields,
    selectable,
    allowSelectAll,
    allowSelectAllPages,
    selectionActions,
    selectedRows,
    title,
    titleId,
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

  return (
    <caption className="mykn-datagrid__caption">
      <Toolbar size="fit-content" pad={false}>
        {title &&
          (typeof title === "string" ? (
            <H2 id={titleId as string}>{title}</H2>
          ) : (
            title
          ))}
        {selectable && allowSelectAll && (
          <DataGridSelectionCheckbox selectAll="page" />
        )}
        {selectable && allowSelectAllPages && (
          <DataGridSelectionCheckbox selectAll="allPages" />
        )}
        {selectionActions?.map((buttonProps, index) => (
          <Button
            key={buttonProps.name || index}
            size="xs"
            variant="secondary"
            {...buttonProps}
            onClick={() => {
              if (typeof buttonProps.onClick === "function") {
                const customEvent = new CustomEvent("click", {
                  detail: selectedRows,
                });
                buttonProps.onClick(
                  customEvent as unknown as React.MouseEvent<HTMLButtonElement>,
                );
              }
            }}
          />
        ))}
      </Toolbar>
      {fieldsSelectable && (
        <Toolbar size="fit-content" pad={false}>
          <Button
            size="xs"
            variant="outline"
            onClick={() => setSelectFieldsModalState(true)}
          >
            <Outline.ViewColumnsIcon />
            {ucFirst(_labelSelectFields)}
          </Button>
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
        </Toolbar>
      )}
    </caption>
  );
};

/**
 * DataGrid heading
 */
export const DataGridHeading: React.FC = () => {
  const intl = useIntl();
  const onFilterTimeoutRef = useRef<NodeJS.Timeout>();
  const [filterState, setFilterState] = useState<AttributeData>();

  const {
    dataGridId,
    filterable,
    filterTransform,
    labelFilterField,
    onFilter,
    renderableFields,
    selectable,
  } = useContext(DataGridContext);

  // Debounce filter
  useEffect(() => {
    const handler = () => {
      // No filter state.
      if (filterState === undefined) {
        return;
      }
      onFilter(filterState || {});
    };
    onFilterTimeoutRef.current && clearTimeout(onFilterTimeoutRef.current);
    onFilterTimeoutRef.current = setTimeout(handler, 300);
  }, [filterState]);

  return (
    <thead className="mykn-datagrid__head" role="rowgroup">
      <tr className="mykn-datagrid__row mykn-datagrid__row--header" role="row">
        {selectable && (
          <th className="mykn-datagrid__cell mykn-datagrid__cell--checkbox"></th>
        )}
        {renderableFields.map((field) => (
          <DataGridHeadingCell
            key={`${dataGridId}-heading-${field2Title(field.name, { lowerCase: false })}`}
            field={field}
          >
            {field2Title(field.name, { lowerCase: false })}
          </DataGridHeadingCell>
        ))}
      </tr>
      {filterable && (
        <tr
          className="mykn-datagrid__row mykn-datagrid__row--filter"
          role="row"
        >
          {selectable && (
            <th
              className={clsx(
                "mykn-datagrid__cell",
                "mykn-datagrid__cell--filter",
                "mykn-datagrid__cell--checkbox",
              )}
            ></th>
          )}
          {renderableFields.map((field) => {
            const placeholder = field2Title(field.name, { lowerCase: false });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { options, valueTransform, ...context } = field;

            const _labelFilterField = labelFilterField
              ? formatMessage(labelFilterField, context)
              : intl.formatMessage(TRANSLATIONS.LABEL_FILTER_FIELD, context);

            return (
              <th
                key={`${dataGridId}-filter-${field2Title(field.name, { lowerCase: false })}`}
                className={clsx(
                  "mykn-datagrid__cell",
                  "mykn-datagrid__cell--filter",
                )}
                style={field.width ? { width: field.width } : {}}
              >
                {field.filterable !== false && (
                  <FormControl
                    aria-label={_labelFilterField}
                    icon={!field.options && <Outline.MagnifyingGlassIcon />}
                    form={`${dataGridId}-filter-form`}
                    name={field.filterLookup || field.name}
                    options={field.options}
                    min={
                      !field.options && field.type === "number" ? 0 : undefined
                    }
                    placeholder={placeholder}
                    type={field.type}
                    value={field.filterValue}
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLSelectElement
                      >,
                    ) => {
                      e.preventDefault();
                      const data = serializeForm(
                        e.target.form as HTMLFormElement,
                      ) as AttributeData;
                      const _data = filterTransform
                        ? filterTransform(data)
                        : data;

                      // Reset page on filter (length of dataset may change).
                      setFilterState(_data);
                    }}
                  />
                )}
              </th>
            );
          })}
        </tr>
      )}
    </thead>
  );
};

/**
 * DataGrid body
 */
export const DataGridBody: React.FC = () => {
  const {
    dataGridId,
    page,
    renderableFields,
    renderableRows,
    selectable,
    selectedRows,
    equalityChecker = (item1: AttributeData, item2: AttributeData) =>
      item1 === item2,
    sortDirection,
    sortField,
  } = useContext(DataGridContext);

  return (
    <tbody className="mykn-datagrid__body" role="rowgroup">
      {renderableRows.map((rowData, index) => (
        <tr
          key={`${dataGridId}-row-${index}`}
          className={clsx("mykn-datagrid__row", {
            "mykn-datagrid__row--selected": !!selectedRows.find((element) =>
              equalityChecker(element, rowData),
            ),
          })}
        >
          {selectable && (
            <td
              className={clsx(
                "mykn-datagrid__cell",
                `mykn-datagrid__cell--checkbox`,
              )}
            >
              <DataGridSelectionCheckbox rowData={rowData} />
            </td>
          )}
          {renderableFields.map((field) => (
            <DataGridContentCell
              key={`sort-${sortField}${sortDirection}-page-${page}-row-${renderableRows.indexOf(rowData)}-column-${renderableFields.indexOf(field)}`}
              field={field}
              rowData={rowData}
            />
          ))}
        </tr>
      ))}
    </tbody>
  );
};

/**
 * DataGrid footer
 */
export const DataGridFooter: React.FC = () => {
  const {
    count,
    loading,
    onPageChange,
    onPageSizeChange,
    page,
    pageSize,
    pageSizeOptions,
    renderableFields,
    selectable,
    paginatorProps,
  } = useContext(DataGridContext);

  return (
    <tfoot className="mykn-datagrid__foot">
      <tr className="mykn-datagrid__row">
        <th
          className="mykn-datagrid__cell"
          colSpan={
            selectable ? renderableFields.length + 1 : renderableFields.length
          }
        >
          <Toolbar pad={true}>
            <Paginator
              count={count}
              loading={loading}
              page={page as number}
              pageSize={pageSize as number}
              pageSizeOptions={pageSizeOptions}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              {...paginatorProps}
            />
          </Toolbar>
        </th>
      </tr>
    </tfoot>
  );
};

export type DataGridHeadingCellProps = React.PropsWithChildren<{
  field: TypedField;
}>;

/**
 * DataGrid (heading) cell
 */
export const DataGridHeadingCell: React.FC<DataGridHeadingCellProps> = ({
  children,
  field,
}) => {
  const { sortField, sortable, sortDirection, onSort } =
    useContext(DataGridContext);
  const isSorted = sortField === field.name;

  return (
    <th
      className={clsx("mykn-datagrid__cell", "mykn-datagrid__cell--header", [
        `mykn-datagrid__cell--type-${field.type}`,
      ])}
      role="columnheader"
    >
      {sortable ? (
        <Button
          active={isSorted}
          align="space-between"
          bold={isSorted}
          justify={true}
          muted
          pad={false}
          size="xs"
          variant={"transparent"}
          wrap={false}
          onClick={() => onSort(field)}
        >
          {children}
          {isSorted && sortDirection === "ASC" && <Outline.ChevronUpIcon />}
          {isSorted && sortDirection === "DESC" && <Outline.ChevronDownIcon />}
          {!isSorted && <Outline.ChevronUpDownIcon />}
        </Button>
      ) : (
        <P muted size="xs">
          {children}
        </P>
      )}
    </th>
  );
};

export type DataGridContentCellProps = {
  field: TypedField;
  rowData: AttributeData;
};

/**
 * DataGrid (content) cell
 */
export const DataGridContentCell: React.FC<DataGridContentCellProps> = ({
  field,
  rowData,
}) => {
  const {
    aProps,
    badgeProps,
    boolProps,
    pProps,
    dataGridId,
    decorate,
    editable,
    editingFieldIndex,
    editingRow,
    renderableFields = [],
    urlFields = DEFAULT_URL_FIELDS,
    onChange,
    onClick,
    onEdit,
  } = useContext(DataGridContext);
  const [pristine, setPristine] = useState<boolean>(true);

  const fieldEditable =
    typeof field.editable === "boolean" ? field.editable : editable;
  const fieldIndex = renderableFields.findIndex((f) => f.name === field.name);
  const isEditingRow = editingRow === rowData;
  const isEditingField =
    isEditingRow && editingFieldIndex === renderableFields.indexOf(field);
  const urlField = urlFields.find((f) => rowData[f]);
  const rowUrl = urlField ? rowData[urlField] : null;
  const resolvedValue = getByDotSeparatedPath<Attribute>(
    rowData,
    field.valueLookup || field.name,
  );
  const value = field.valueTransform?.(rowData) || resolvedValue;
  const valueIsPrimitive = isPrimitive(value);

  const isImplicitLink = rowUrl && fieldIndex === 0 && !isLink(String(value));
  const link = isImplicitLink ? String(rowUrl) : "";

  /**
   * Renders a button triggering the editing state.
   */
  const renderButton = () => (
    <Button
      align={
        field.type === "boolean" ||
        field.type === "number" ||
        field.type === "null"
          ? "end"
          : "start"
      }
      pad={field.type !== "boolean"}
      justify={true}
      variant="transparent"
      // @ts-expect-error - FIXME: type confusion?
      onClick={(e) => onClick?.(e, rowData)}
    >
      {renderValue()}
    </Button>
  );

  /**
   * Renders a form control for editing the fields value.
   */
  const renderFormControl = () => (
    <form
      id={`${dataGridId}-editable-form`}
      onSubmit={(e) => e.preventDefault()}
    >
      <FormControl
        autoFocus
        key={"datagrid-editable"}
        name={field.name}
        defaultChecked={field.type === "boolean" ? Boolean(value) : undefined}
        options={field.options || undefined}
        type={field.type === "number" ? "number" : undefined}
        value={(value || "").toString()}
        form={`${dataGridId}-editable-form`}
        required={true}
        onChange={(e: React.ChangeEvent) => {
          setPristine(false);
          onChange?.(e);
        }}
        onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
          const data = Object.assign(
            rowData,
            serializeForm(e.target.form as HTMLFormElement, true),
          );
          !pristine && onEdit?.(data);
        }}
      />
    </form>
  );
  /**
   * Renders a hidden input allowing the form to serialize this fields data.
   */
  const renderHiddenInput = () => (
    <input
      defaultChecked={field.type === "boolean" ? Boolean(value) : undefined}
      defaultValue={value?.toString() || ""}
      form={`${dataGridId}-editable-form`}
      hidden
      name={field.name}
      type={
        field.type === "boolean"
          ? "checkbox"
          : field.type === "number"
            ? "number"
            : undefined
      }
    />
  );

  /**
   * Renders the value according to Value component
   */
  const renderValue = () => {
    // Support label from select
    const label = field.options?.find((o) => o.value === value)?.label;

    return (
      <Value
        aProps={aProps}
        badgeProps={badgeProps}
        boolProps={boolProps as BoolProps}
        pProps={pProps}
        href={link}
        decorate={decorate}
        value={label || (field.type === "boolean" ? Boolean(value) : value)}
      />
    );
  };

  return (
    <td
      className={clsx(
        "mykn-datagrid__cell",
        `mykn-datagrid__cell--type-${field.type}`,
        {
          "mykn-datagrid__cell--editable": fieldEditable,
          "mykn-datagrid__cell--editing": isEditingField,
          "mykn-datagrid__cell--link": link,
        },
      )}
      aria-description={field2Title(field.name, { lowerCase: false })}
    >
      {valueIsPrimitive &&
        isEditingRow &&
        !isEditingField &&
        renderHiddenInput()}
      {valueIsPrimitive && isEditingField && renderFormControl()}
      {valueIsPrimitive && !isEditingField && fieldEditable && renderButton()}
      {!isEditingField && !fieldEditable && renderValue()}
    </td>
  );
};

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
          labelSelect ||
          intl.formatMessage(TRANSLATIONS.LABEL_SELECT_ALL, i18nContext);
        break;

      case "allPages":
        allSelected = Boolean(allPagesSelected);
        checked = allPagesSelected || false;
        handleSelect = () => onSelectAllPages(!allSelected);

        i18nContext = { pages: count };
        ariaLabel =
          labelSelect ||
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
