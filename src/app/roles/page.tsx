"use client";

import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import SideMenu from '../shared/nav-menu/SideMenu';
import { ActiveMenu } from '../shared/nav-menu/activeMenu';
import DataTableWrapper from '@/components/shared/DataTableWrapper';
import FormBuilder, { FormField } from '@/components/forms/FormBuilder';
import { RoleAppDTO } from '../entites/roles';
import { PermissionsDTO } from '../entites/permissions';
import { z } from 'zod';

// Mock data
const mockPermissions: PermissionsDTO[] = [
  { id: 1, name: 'Créer des activités' },
  { id: 2, name: 'Modifier des activités' },
  { id: 3, name: 'Supprimer des activités' },
  { id: 4, name: 'Gérer les utilisateurs' },
  { id: 5, name: 'Voir les rapports' },
  { id: 6, name: 'Exporter les données' },
  { id: 7, name: 'Gérer les rôles' },
  { id: 8, name: 'Accès administration' }
];

const mockRoles: RoleAppDTO[] = [
  {
    id: 1,
    name: 'Administrateur',
    permissions: mockPermissions
  },
  {
    id: 2,
    name: 'Back-office',
    permissions: mockPermissions.slice(0, 6)
  },
  {
    id: 3,
    name: 'Superviseur',
    permissions: mockPermissions.slice(0, 5)
  },
  {
    id: 4,
    name: 'Délégué',
    permissions: mockPermissions.slice(4, 6)
  },
  {
    id: 5,
    name: 'Collaborateur',
    permissions: [mockPermissions[4]]
  }
];

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleAppDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleAppDTO | null>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    // TODO(api): Replace with real API call
    setTimeout(() => {
      setRoles(mockRoles);
      setLoading(false);
    }, 500);
  }, []);

  const roleFormFields: FormField[] = [
    {
      name: 'name',
      label: 'Nom du rôle',
      type: 'text',
      required: true,
      validation: z.string().min(2, 'Nom requis')
    },
    {
      name: 'permissions',
      label: 'Permissions',
      type: 'multiselect',
      required: true,
      options: mockPermissions.map(p => ({ label: p.name, value: p.id })),
      validation: z.array(z.number()).min(1, 'Au moins une permission requise')
    }
  ];

  const permissionsBodyTemplate = (rowData: RoleAppDTO) => {
    return (
      <div className="flex flex-wrap gap-1">
        {rowData.permissions.slice(0, 3).map(permission => (
          <Chip key={permission.id} label={permission.name} className="text-xs" />
        ))}
        {rowData.permissions.length > 3 && (
          <Chip label={`+${rowData.permissions.length - 3} autres`} className="text-xs bg-gray-200" />
        )}
      </div>
    );
  };

  const columns = [
    {
      field: 'name',
      header: 'Nom du rôle',
      sortable: true,
      style: { width: '200px' }
    },
    {
      field: 'permissions',
      header: 'Permissions',
      body: permissionsBodyTemplate,
      style: { minWidth: '300px' }
    }
  ];

  const handleCreateRole = () => {
    setEditingRole(null);
    setShowDialog(true);
  };

  const handleEditRole = (role: RoleAppDTO) => {
    setEditingRole(role);
    setShowDialog(true);
  };

  const handleDeleteRole = (role: RoleAppDTO) => {
    // TODO(api): Implement role deletion
    console.log('Delete role:', role.id);
    toast.current?.show({
      severity: 'success',
      summary: 'Rôle supprimé',
      detail: `Le rôle ${role.name} a été supprimé`,
      life: 3000
    });
  };

  const handleSubmitRole = async (data: any) => {
    try {
      // TODO(api): Create or update role
      const selectedPermissions = mockPermissions.filter(p => 
        data.permissions.includes(p.id)
      );
      
      const roleData = {
        ...data,
        permissions: selectedPermissions
      };
      
      console.log('Submit role:', roleData);
      
      toast.current?.show({
        severity: 'success',
        summary: editingRole ? 'Rôle modifié' : 'Rôle créé',
        detail: 'Les modifications ont été enregistrées',
        life: 3000
      });
      
      setShowDialog(false);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Une erreur est survenue',
        life: 3000
      });
    }
  };

  const handleExport = () => {
    // TODO(api): Implement export
    console.log('Export roles');
    toast.current?.show({
      severity: 'info',
      summary: 'Export en cours',
      detail: 'Le fichier sera téléchargé sous peu',
      life: 3000
    });
  };

  return (
    <SideMenu activeMenu={ActiveMenu.Roles}>
      <Toast ref={toast} />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des rôles</h1>
            <p className="text-gray-600">Créer et gérer les rôles et leurs permissions</p>
          </div>
          
          <Button
            label="Nouveau rôle"
            icon="pi pi-plus"
            onClick={handleCreateRole}
          />
        </div>

        <DataTableWrapper
          data={roles}
          columns={columns}
          loading={loading}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
          onExport={handleExport}
          globalFilterFields={['name']}
          selectionMode="multiple"
        />
      </div>

      {/* Role Form Dialog */}
      <Dialog
        header={editingRole ? 'Modifier le rôle' : 'Nouveau rôle'}
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: '600px' }}
        modal
      >
        <FormBuilder
          fields={roleFormFields}
          onSubmit={handleSubmitRole}
          defaultValues={editingRole ? {
            name: editingRole.name,
            permissions: editingRole.permissions.map(p => p.id)
          } : {}}
          submitLabel={editingRole ? 'Modifier' : 'Créer'}
        />
      </Dialog>
    </SideMenu>
  );
}