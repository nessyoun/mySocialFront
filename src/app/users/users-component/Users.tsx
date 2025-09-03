import React, { useState, useEffect } from "react";
import {
  TreeTable,
  TreeTableSelectionEvent,
  TreeTableSelectionKeysType,
} from "primereact/treetable";
import { Column } from "primereact/column";
import { TreeNode } from "primereact/treenode";
import { Roles, users } from "./NodeService";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { columns } from "./userConfig";
import { ColumnMeta } from "./ColumnMeta";



export default function UserManagementPage() { 

  const [selectedRoles, setSelectedRoles] = useState(null);

  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<ColumnMeta>(columns);
  const [selectedNodeKeys, setSelectedNodeKeys] =
    useState<TreeTableSelectionKeysType | null>(null);

  const selectedEntries = Object.entries(selectedNodeKeys ?? {});
  const checkedKeys = selectedEntries.filter(
    ([, v]) => v === true || (typeof v === "object" && (v as any)?.checked)
  );
  const hasSelection = checkedKeys.length > 0;
  const singleSelected = checkedKeys.length === 1;

  useEffect(() => setNodes(users), []);

  const onColumnToggle = (event: MultiSelectChangeEvent) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );
    setVisibleColumns(orderedSelectedColumns);
  };

  const header = (
    <div className="flex items-center gap-2">
      {/* Sélecteur des colonnes */}
      <MultiSelect
        value={visibleColumns}
        options={columns}
        onChange={onColumnToggle}
        optionLabel="header"
        display="chip"
        style={{ width: "10rem" }}
      />

      {/* Bouton Export Excel */}
      <div className="flex gap-2 ml-auto">
        <Button
          icon="pi pi-download"
          label="Exporter"
          severity="success"
          style={{ width: "7rem" }}
        />

        {/* Bouton Import Excel */}
        <Button
          icon="pi pi-upload"
          label="Importer"
          severity="secondary"
          style={{ width: "8rem" }}
        />
        <Button
          icon="pi pi-times"
          label="Supprimer"
          severity="danger"
          disabled={!hasSelection}
          style={{ width: "8rem", marginLeft: "20px" }}
        />
        <Button
          icon="pi pi-pencil"
          label="Modifier"
          severity="secondary"
          disabled={!hasSelection}
          style={{ width: "8rem" }}
        />
      </div>
    </div>
  );
  const getSeverity = (user) => {
    switch (user.data.active) {
      case "Active":
        return "success";

      default:
        return "danger";
    }
  };
  const statusBodyTemplate = (user) => {
    return <Tag value={user.data.active} severity={getSeverity(user)}></Tag>;
  };
  const rolesBodyTemplate = () => {
    return <MultiSelect value={selectedRoles} onChange={(e) => setSelectedRoles(e.value)} options={Roles} optionLabel="name" 
                filter filterDelay={400} placeholder="Selectionner les roles" maxSelectedLabels={3}/>;
  };

  return (
    <div className="card">
      <TreeTable
        value={nodes}
        header={header}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25]}
        resizableColumns
        style={{ width: "100%", }}
        scrollable
        stateKey={"tree-table-state-demo-session"}
        stateStorage={"session"}
        selectionMode="checkbox"
        selectionKeys={selectedNodeKeys}
        onSelectionChange={(e: TreeTableSelectionEvent) =>
          setSelectedNodeKeys(e.value)
        }
      >
        {/*hshha hhadbbd bjd iia hhhd gcdhhhd  hhd  dkyzhab ojaj un d  lijijbhbhba djnd dhh hdb hhd bb lo */ }
        <Column
          field="matricule"
          header="Matricule"
          expander
          filter
          filterPlaceholder="Filtrer par matricule"
          style={{ width: "150px" }}
        ></Column>
        {visibleColumns.map((col) => {
  switch (col.field) {
    case "active":
      return (
        <Column
          key={col.field}
          header="Active"
          body={statusBodyTemplate}
          style={{ width: "250px", }}
        />
      );
      case "roles":
      return (
        <Column
          key={col.field}
          header="Roles"
          body={rolesBodyTemplate}
          style={{ width: "50px", }}
        />
      );
    

    default:
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          filter
          filterPlaceholder={"Filtrer par " + col.header}
          style={{ width: "250px", }}
          sortable
        />
      );
  }
})}

      </TreeTable>
    </div>
  );
}
