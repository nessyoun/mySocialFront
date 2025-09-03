import { useState, useRef } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';

interface DataTableWrapperProps {
  data: any[];
  columns: Array<{
    field: string;
    header: string;
    body?: (rowData: any) => React.ReactNode;
    sortable?: boolean;
    filter?: boolean;
    style?: React.CSSProperties;
  }>;
  loading?: boolean;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onExport?: () => void;
  selectionMode?: 'single' | 'multiple';
  onSelectionChange?: (selection: any) => void;
  globalFilterFields?: string[];
  title?: string;
  createButton?: {
    label: string;
    onClick: () => void;
  };
}

export default function DataTableWrapper({
  data,
  columns,
  loading = false,
  onEdit,
  onDelete,
  onExport,
  selectionMode,
  onSelectionChange,
  globalFilterFields = [],
  title,
  createButton
}: DataTableWrapperProps) {
  const [selectedItems, setSelectedItems] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const toast = useRef<Toast>(null);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        {onEdit && (
          <Button
            icon="pi pi-pencil"
            rounded
            outlined
            className="mr-2"
            onClick={() => onEdit(rowData)}
            tooltip="Modifier"
          />
        )}
        {onDelete && (
          <Button
            icon="pi pi-trash"
            rounded
            outlined
            severity="danger"
            onClick={() => onDelete(rowData)}
            tooltip="Supprimer"
          />
        )}
      </div>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <div className="flex items-center gap-2">
        {title && <h4 className="m-0 text-lg font-semibold">{title}</h4>}
        {createButton && (
          <Button
            label={createButton.label}
            icon="pi pi-plus"
            onClick={createButton.onClick}
            className="ml-2"
          />
        )}
      </div>
      
      <div className="flex gap-2">
        {globalFilterFields.length > 0 && (
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Rechercher..."
            />
          </span>
        )}
        
        {onExport && (
          <Button
            label="Exporter"
            icon="pi pi-download"
            onClick={onExport}
            outlined
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <DataTable
        value={data}
        header={header}
        filters={filters}
        globalFilterFields={globalFilterFields}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        selection={selectedItems}
        onSelectionChange={(e) => {
          setSelectedItems(e.value);
          onSelectionChange?.(e.value);
        }}
        selectionMode={selectionMode}
        dataKey="id"
        removableSort
        resizableColumns
        showGridlines
        stripedRows
        className="p-datatable-sm"
      >
        {selectionMode && (
          <Column selectionMode={selectionMode} headerStyle={{ width: '3rem' }} />
        )}
        
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            body={col.body}
            sortable={col.sortable !== false}
            filter={col.filter !== false}
            style={col.style}
          />
        ))}
        
        {(onEdit || onDelete) && (
          <Column
            header="Actions"
            body={actionBodyTemplate}
            style={{ width: '120px' }}
          />
        )}
      </DataTable>
    </>
  );
}