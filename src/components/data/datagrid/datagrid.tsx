import clsx from "clsx";
import React, { useEffect, useId, useRef, useState } from "react";

import {
  Field,
  SerializedFormData,
  TypedField,
  filterAttributeDataArray,
  formatMessage,
  serializeForm,
  typedFieldByFields,
  ucFirst,
  useIntl,
} from "../../../lib";
import {
  AttributeData,
  sortAttributeDataArray,
} from "../../../lib/data/attributedata";
import { field2Caption, isLink } from "../../../lib/format/string";
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

/**
 * The default URL fields,
 * @see DataGridProps.urlFields
 */
const DEFAULT_URL_FIELDS = [
  "absolute_url",
  "get_absolute_url",
  "href",
  "get_href",
  "url",
  "get_url",
];

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

  /** Whether checkboxes should be shown for every row. */
  selectable?: boolean;

  /** References to the selected items in `objectList`, setting this preselects the items. */
  selected?: AttributeData[];

  /** Renders buttons allowing to perform actions on selection, `onClick` is called with selection array. */
  selectionActions?: ButtonProps[];

  /** A title for the datagrid. */
  title?: React.ReactNode;

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
export const DataGrid: React.FC<DataGridProps> = ({
  aProps,
  badgeProps,
  boolProps,
  decorate,
  objectList,
  editable = undefined,
  fields,
  filterable = undefined,
  paginatorProps,
  showPaginator = Boolean(paginatorProps),
  pProps,
  selectable = false,
  fieldsSelectable = false,
  selected,
  selectionActions = [],
  sort,
  title = "",
  urlFields = DEFAULT_URL_FIELDS,
  labelSaveFieldSelection,
  labelFilterField,
  labelSelect,
  labelSelectFields,
  labelSelectAll,
  onChange,
  onEdit,
  onFieldsChange,
  onFilter,
  onSelect,
  onSelectionChange,
  onSort,
  // Aliases
  count,
  loading,
  page = paginatorProps?.page,
  pageSize,
  pageSizeOptions,
  onClick,
  onPageChange,
  onPageSizeChange,
  ...props
}) => {
  const id = useId();
  const onFilterTimeoutRef = useRef<NodeJS.Timeout>();
  const [editingState, setEditingState] = useState<
    [AttributeData | null, number | null]
  >([null, null]);
  const [filterState, setFilterState] = useState<AttributeData | null>();
  const [selectedState, setSelectedState] = useState<AttributeData[] | null>(
    null,
  );
  const [sortState, setSortState] = useState<
    [string, "ASC" | "DESC"] | undefined
  >();
  const [fieldsState, setFieldsState] = useState<Array<Field | TypedField>>([]);

  // Update selectedState when selected prop changes.
  useEffect(() => {
    selected && setSelectedState(selected);
  }, [selected]);

  // Update sortState when sort prop changes.
  useEffect(() => {
    if (typeof sort === "string") {
      setSortState([sort, "ASC"]);
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
    urlFields,
    editable,
    filterable,
  );

  const renderableFields = typedFieldsState.filter((f) => f.active !== false);
  const sortField = sortState?.[0];
  const sortDirection = sortState?.[1];
  const titleId = title ? `${id}-caption` : undefined;

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

  const handleSelect = (attributeData: AttributeData) => {
    const currentlySelected = selectedState || [];

    const isAttributeDataCurrentlySelected =
      currentlySelected.includes(attributeData);

    const newSelectedState = isAttributeDataCurrentlySelected
      ? [...currentlySelected].filter((a) => a !== attributeData)
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
      count || paginatorProps?.count,
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
    <div className="mykn-datagrid" {...props}>
      <table
        className="mykn-datagrid__table"
        role="grid"
        aria-labelledby={titleId}
      >
        {/* Caption */}
        {(title || selectable || fieldsSelectable) && (
          <DataGridCaption
            count={count || 0}
            fields={typedFieldsState}
            fieldsSelectable={fieldsSelectable}
            renderableRows={renderableRows}
            selectable={selectable}
            selectedRows={selectedState}
            selectionActions={selectionActions}
            title={title}
            titleId={titleId}
            labelSaveFieldSelection={labelSaveFieldSelection}
            labelSelectAll={labelSelectAll}
            labelSelectFields={labelSelectFields}
            onFieldsChange={(typedFields: TypedField[]) => {
              setFieldsState(typedFields);
              onFieldsChange?.(typedFields);
            }}
            onSelectAll={handleSelectAll}
          />
        )}

        {/* Heading */}
        <DataGridHeading
          dataGridId={id}
          filterable={Boolean(filterable)}
          id={id}
          labelFilterField={labelFilterField || ""}
          renderableFields={renderableFields}
          selectable={selectable}
          sortable={Boolean(sort)}
          sortDirection={sortDirection}
          sortField={sortField}
          onFilter={handleFilter}
          onSort={handleSort}
        />

        {/* Body */}
        <DataGridBody
          aProps={aProps}
          badgeProps={badgeProps}
          boolProps={boolProps}
          pProps={pProps}
          amountSelected={selectedState?.length || 0}
          count={count || 0}
          dataGridId={id}
          decorate={decorate}
          editable={Boolean(renderableFields.find((f) => f.editable))}
          editingRow={editingState[0]}
          editingFieldIndex={editingState[1]}
          handleSelect={handleSelect}
          labelSelect={labelSelect || ""}
          onChange={onChange}
          onClick={onClick}
          onEdit={onEdit}
          page={page || 1}
          renderableFields={renderableFields}
          renderableRows={renderableRows}
          setEditingState={setEditingState}
          selectable={selectable}
          selectedRows={selectedState || []}
          sortDirection={sortDirection}
          sortField={sortField}
          urlFields={urlFields}
        ></DataGridBody>

        {/* Paginator */}
        {showPaginator && (
          <DataGridFooter
            count={count || 0}
            loading={loading || false}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            page={page || 1}
            pageSize={pageSize || 0}
            pageSizeOptions={pageSizeOptions}
            paginatorProps={paginatorProps}
            renderableFields={renderableFields}
            selectable={selectable}
          />
        )}
      </table>
      {filterable && <form id={`${id}-filter-form`} />}
    </div>
  );
};

export type DataGridCaptionProps = {
  count: number;
  fields: TypedField[];
  fieldsSelectable: boolean;
  labelSaveFieldSelection?: string;
  labelSelectAll?: string;
  renderableRows: AttributeData[];
  selectable: boolean;
  selectedRows: AttributeData[] | null;
  selectionActions?: ButtonProps[];
  title: React.ReactNode;
  titleId?: string;
  labelSelectFields?: string;
  onFieldsChange: (typedFields: TypedField[]) => void;
  onSelectAll: (selected: boolean) => void;
};

export const DataGridCaption: React.FC<DataGridCaptionProps> = ({
  count,
  fields,
  fieldsSelectable,
  labelSaveFieldSelection,
  labelSelectAll,
  labelSelectFields,
  renderableRows,
  selectable,
  selectionActions,
  selectedRows,
  title,
  titleId,
  onFieldsChange,
  onSelectAll,
}) => {
  const [selectFieldsModalState, setSelectFieldsModalState] = useState(false);
  const intl = useIntl();

  const allSelected =
    selectedRows?.every((a) => renderableRows.includes(a)) &&
    renderableRows.every((a) => selectedRows.includes(a));

  const context = {
    open: Boolean(selectFieldsModalState),
  };

  const _labelSelectFields = labelSelectFields
    ? formatMessage(labelSelectFields, context)
    : intl.formatMessage(
        {
          id: "mykn.components.DataGrid.labelSelectFields",
          description:
            "mykn.components.Modal: The datagrid select fields label",
          defaultMessage: "selecteer kolommen",
        },
        context,
      );

  const _labelSaveFieldSelection = labelSaveFieldSelection
    ? formatMessage(labelSaveFieldSelection, context)
    : intl.formatMessage(
        {
          id: "mykn.components.DataGrid.labelSaveFieldSelection",
          description:
            "mykn.components.Modal: The datagrid save selection label",
          defaultMessage: "kolommen opslaan",
        },
        context,
      );

  return (
    <caption className="mykn-datagrid__caption">
      <Toolbar size="fit-content" pad={false}>
        {title &&
          (typeof title === "string" ? (
            <H2 id={titleId as string}>{title}</H2>
          ) : (
            title
          ))}
        {selectable && (
          <DataGridSelectionCheckbox
            checked={allSelected || false}
            count={count}
            handleSelect={() => onSelectAll(!allSelected)}
            labelSelect={labelSelectAll}
            amountSelected={selectedRows?.length || 0}
            selectAll={true}
            sortedObjectList={renderableRows}
          />
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
                      label: field2Caption(f.name),
                      value: f.name,
                      selected: f.active !== false,
                    })),
                    type: "checkbox",
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

export type DataGridHeadingProps = {
  selectable: boolean;
  dataGridId: string;
  filterable: boolean;
  id: string;
  labelFilterField: string;
  renderableFields: TypedField[];
  sortable: boolean;
  sortDirection: "ASC" | "DESC" | undefined;
  sortField: string | undefined;
  onFilter: (data: AttributeData) => void;
  onSort: (field: TypedField) => void;
};

/**
 * DataGrid heading
 */
export const DataGridHeading: React.FC<DataGridHeadingProps> = ({
  dataGridId,
  filterable,
  id,
  labelFilterField,
  onFilter,
  onSort,
  renderableFields,
  selectable,
  sortable,
  sortDirection,
  sortField,
}) => {
  const intl = useIntl();

  return (
    <thead className="mykn-datagrid__head" role="rowgroup">
      <tr className="mykn-datagrid__row mykn-datagrid__row--header" role="row">
        {renderableFields.map((field, index) => (
          <DataGridHeadingCell
            key={`${dataGridId}-heading-${field2Caption(field.name)}`}
            field={field}
            onSort={onSort}
            isSorted={sortField === field.name}
            sortable={sortable}
            sortDirection={sortDirection}
            span={selectable && index === 0 ? 2 : undefined}
          >
            {field2Caption(field.name)}
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
            const placeholder = ucFirst(field.name);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { options, ...context } = field;

            const _labelFilterField = labelFilterField
              ? formatMessage(labelFilterField, context)
              : intl.formatMessage(
                  {
                    id: "mykn.components.DataGrid.labelFilterField",
                    description:
                      "mykn.components.DataGrid: The filter field (accessible) label",
                    defaultMessage: 'filter veld "{name}"',
                  },
                  context,
                );

            return (
              <th
                key={`${dataGridId}-filter-${field2Caption(field.name)}`}
                className={clsx(
                  "mykn-datagrid__cell",
                  "mykn-datagrid__cell--filter",
                )}
              >
                <FormControl
                  aria-label={_labelFilterField}
                  icon={!field.options && <Outline.MagnifyingGlassIcon />}
                  form={`${id}-filter-form`}
                  name={field.name}
                  options={field.options}
                  min={
                    !field.options && field.type === "number" ? 0 : undefined
                  }
                  placeholder={placeholder}
                  type={field.type}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
                  ) => {
                    e.preventDefault();
                    const data = serializeForm(
                      e.target.form as HTMLFormElement,
                    );
                    onFilter(data as AttributeData);
                  }}
                />
              </th>
            );
          })}
        </tr>
      )}
    </thead>
  );
};

export type DataGridBodyProps = {
  aProps: AProps | undefined;
  badgeProps: BadgeProps | undefined;
  boolProps: Omit<BoolProps, "value"> | undefined;
  pProps: PProps | undefined;
  amountSelected: number;
  count: number;
  dataGridId: string;
  decorate?: boolean;
  editable: boolean;
  editingRow: AttributeData | null;
  editingFieldIndex: number | null;
  handleSelect: (attributeData: AttributeData) => void;
  labelSelect: string;
  onChange: DataGridProps["onChange"];
  onClick: DataGridProps["onClick"];
  onEdit: DataGridProps["onEdit"];
  page: number;
  renderableFields: TypedField[];
  renderableRows: AttributeData[];
  setEditingState: ([editingRow, fieldIndex]: [AttributeData, number]) => void;
  selectable: boolean;
  selectedRows: AttributeData[];
  sortDirection: "ASC" | "DESC" | undefined;
  sortField: string | undefined;
  urlFields: string[];
};

/**
 * DataGrid body
 */
export const DataGridBody: React.FC<DataGridBodyProps> = ({
  aProps,
  badgeProps,
  boolProps,
  pProps,
  amountSelected,
  count,
  dataGridId,
  decorate,
  editable,
  editingRow,
  editingFieldIndex,
  handleSelect,
  labelSelect,
  onChange,
  onClick,
  onEdit,
  page,
  renderableFields,
  renderableRows,
  selectable,
  selectedRows,
  setEditingState,
  sortDirection,
  sortField,
  urlFields,
}) => (
  <tbody className="mykn-datagrid__body" role="rowgroup">
    {renderableRows.map((rowData, index) => (
      <tr
        key={`${dataGridId}-row-${index}`}
        className={clsx("mykn-datagrid__row", {
          "mykn-datagrid__row--selected": selectedRows?.includes(rowData),
        })}
      >
        {selectable && (
          <td
            className={clsx(
              "mykn-datagrid__cell",
              `mykn-datagrid__cell--checkbox`,
            )}
          >
            <DataGridSelectionCheckbox
              amountSelected={amountSelected}
              checked={selectedRows?.includes(rowData) || false}
              count={count}
              handleSelect={handleSelect}
              labelSelect={labelSelect}
              rowData={rowData}
              sortedObjectList={renderableRows}
            />
          </td>
        )}
        {renderableFields.map((field) => (
          <DataGridContentCell
            key={`sort-${sortField}${sortDirection}-page-${page}-row-${renderableRows.indexOf(rowData)}-column-${renderableFields.indexOf(field)}`}
            aProps={aProps}
            badgeProps={badgeProps}
            boolProps={boolProps}
            pProps={pProps}
            dataGridId={dataGridId}
            decorate={decorate}
            rowData={rowData}
            editable={editable}
            isEditingRow={editingRow === rowData}
            isEditingField={
              editingRow === rowData &&
              editingFieldIndex === renderableFields.indexOf(field)
            }
            field={field}
            renderableFields={renderableFields}
            urlFields={urlFields}
            onChange={onChange}
            onClick={(e, rowData) => {
              if (editable) {
                setEditingState([rowData, renderableFields.indexOf(field)]);
                e.preventDefault();
              }
              e.currentTarget.nodeName === "A" && onClick?.(e, rowData);
            }}
            onEdit={onEdit}
          />
        ))}
      </tr>
    ))}
  </tbody>
);

export type DataGridFooterProps = {
  count: number;
  loading: boolean;
  onPageChange: DataGridProps["onPageChange"];
  onPageSizeChange: DataGridProps["onPageSizeChange"];
  page: number;
  pageSize: number;
  pageSizeOptions: DataGridProps["pageSizeOptions"];
  paginatorProps: DataGridProps["paginatorProps"];
  renderableFields: TypedField[];
  selectable: boolean;
};

/**
 * DataGrid footer
 */
export const DataGridFooter: React.FC<DataGridFooterProps> = ({
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
}) => (
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
            page={page}
            pageSize={pageSize}
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

export type DataGridHeadingCellProps = React.PropsWithChildren<{
  field: TypedField;
  isSorted: boolean;
  sortable: boolean;
  sortDirection: "ASC" | "DESC" | undefined;
  span?: number;
  onSort: (field: TypedField) => void;
}>;

/**
 * DataGrid (heading) cell
 */
export const DataGridHeadingCell: React.FC<DataGridHeadingCellProps> = ({
  children,
  onSort,
  field,
  isSorted,
  sortable,
  sortDirection,
  span,
}) => (
  <th
    className={clsx("mykn-datagrid__cell", "mykn-datagrid__cell--header", [
      `mykn-datagrid__cell--type-${field.type}`,
    ])}
    role="columnheader"
    colSpan={span}
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

export type DataGridContentCellProps = {
  aProps: DataGridProps["aProps"];
  badgeProps: DataGridProps["badgeProps"];
  boolProps: DataGridProps["boolProps"];
  decorate?: boolean;
  editable: boolean;
  isEditingRow: boolean;
  isEditingField: boolean;
  pProps: DataGridProps["pProps"];
  dataGridId: string;
  rowData: AttributeData;
  field: TypedField;
  renderableFields: TypedField[];
  urlFields: DataGridProps["urlFields"];
  onChange: DataGridProps["onChange"];
  onClick: DataGridProps["onClick"];
  onEdit: DataGridProps["onEdit"];
};

/**
 * DataGrid (content) cell
 */
export const DataGridContentCell: React.FC<DataGridContentCellProps> = ({
  aProps,
  badgeProps,
  boolProps,
  pProps,
  dataGridId,
  decorate,
  editable,
  isEditingRow,
  isEditingField,
  field,
  renderableFields = [],
  rowData,
  urlFields = DEFAULT_URL_FIELDS,
  onChange,
  onClick,
  onEdit,
}) => {
  const [pristine, setPristine] = useState<boolean>(true);

  const fieldEditable =
    typeof field.editable === "boolean" ? field.editable : editable;
  const fieldIndex = renderableFields.findIndex((f) => f.name === field.name);
  const urlField = urlFields.find((f) => rowData[f]);
  const rowUrl = urlField ? rowData[urlField] : null;
  const value = rowData[field.name];

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
      aria-description={field2Caption(field.name)}
    >
      {isEditingRow && !isEditingField && renderHiddenInput()}
      {isEditingField && renderFormControl()}
      {!isEditingField && fieldEditable && renderButton()}
      {!isEditingField && !fieldEditable && renderValue()}
    </td>
  );
};

export type DataGridSelectionCheckboxProps = {
  amountSelected: number;
  checked: boolean;
  count: DataGridProps["count"];
  handleSelect: (attributeData: AttributeData) => void;
  sortedObjectList: AttributeData[];
  labelSelect?: string;
  rowData?: AttributeData;
  selectAll?: boolean;
};

/**
 * A select (all) checkbox
 */
export const DataGridSelectionCheckbox: React.FC<
  DataGridSelectionCheckboxProps
> = ({
  amountSelected,
  checked,
  count,
  handleSelect,
  labelSelect,
  rowData,
  selectAll,
  sortedObjectList,
}) => {
  const intl = useIntl();

  const contextSelectAll = {
    count: count,
    countPage: sortedObjectList.length,
    amountSelected: amountSelected,
    selectAll: selectAll,
    amountUnselected: (count || 0) - (amountSelected || 0),
    amountUnselectedPage: sortedObjectList.length - (amountSelected || 0),
  };

  const label = labelSelect
    ? formatMessage(labelSelect, {
        ...contextSelectAll,
        ...rowData,
      })
    : selectAll
      ? intl.formatMessage(
          {
            id: "mykn.components.DataGrid.labelSelectAll",
            description:
              "mykn.components.DataGrid: The select row (accessible) label",
            defaultMessage: "(de)selecteer {countPage} rijen",
          },
          contextSelectAll as unknown as Record<string, string>,
        )
      : intl.formatMessage(
          {
            id: "mykn.components.DataGrid.labelSelect",
            description:
              "mykn.components.DataGrid: The select row (accessible) label",
            defaultMessage: "(de)selecteer rij",
          },
          {
            ...contextSelectAll,
            ...rowData,
          } as unknown as Record<string, string>,
        );

  return (
    <Checkbox
      checked={checked}
      onChange={() => handleSelect(rowData || {})}
      aria-label={label}
    >
      {selectAll && label}
    </Checkbox>
  );
};
