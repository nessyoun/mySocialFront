"use client";

import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { FileUpload } from 'primereact/fileupload';
import AppShell from '@/components/layout/AppShell';
import Guard from '@/components/auth/Guard';
import DataTableWrapper from '@/components/shared/DataTableWrapper';
import FormBuilder, { FormField } from '@/components/forms/FormBuilder';
import { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';
import { z } from 'zod';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    // TODO(api): Fetch users from backend
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  const userFormFields: FormField[] = [
    {
      name: 'matriculeRcar',
      label: 'Matricule RCAR',
      type: 'text',
      required: true,
      validation: z.string().min(4, 'Matricule requis')
    },
    {
      name: 'firstName',
      label: 'Prénom',
      type: 'text',
      required: true,
      validation: z.string().min(2, 'Prénom requis')
    },
    {
      name: 'lastName',
      label: 'Nom',
      type: 'text',
      required: true,
      validation: z.string().min(2, 'Nom requis')
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validation: z.string().email('Email invalide')
    },
    {
      name: 'role',
      label: 'Rôle',
      type: 'select',
      required: true,
      options: [
        { label: 'Administrateur', value: 'admin' },
        { label: 'Back-office', value: 'back-office' },
        { label: 'Superviseur', value: 'superviseur' },
        { label: 'Délégué', value: 'delegue' },
        { label: 'Collaborateur', value: 'collaborateur' }
      ],
      validation: z.string().min(1, 'Rôle requis')
    },
    {
      name: 'categorieCollaborateur',
      label: 'Catégorie',
      type: 'select',
      required: true,
      options: [
        { label: 'OE', value: 'OE' },
        { label: 'TAMCA', value: 'TAMCA' },
        { label: 'HC', value: 'HC' },
        { label: 'CDI', value: 'CDI' },
        { label: 'CDD', value: 'CDD' }
      ],
      validation: z.string().min(1, 'Catégorie requise')
    }
  ];

  const roleBodyTemplate = (rowData: User) => {
    const roleColors = {
      'admin': 'danger',
      'back-office': 'warning',
      'superviseur': 'info',
      'delegue': 'secondary',
      'collaborateur': 'success'
    } as const;

    return <Tag value={rowData.role} severity={roleColors[rowData.role]} />;
  };

  const statusBodyTemplate = (rowData: User) => {
    return (
      <Tag 
        value={rowData.active ? 'Actif' : 'Inactif'} 
        severity={rowData.active ? 'success' : 'danger'} 
      />
    );
  };

  const columns = [
    {
      field: 'matriculeRcar',
      header: 'Matricule',
      sortable: true,
      style: { width: '120px' }
    },
    {
      field: 'firstName',
      header: 'Prénom',
      sortable: true
    },
    {
      field: 'lastName',
      header: 'Nom',
      sortable: true
    },
    {
      field: 'email',
      header: 'Email',
      sortable: true
    },
    {
      field: 'role',
      header: 'Rôle',
      body: roleBodyTemplate,
      sortable: true,
      style: { width: '150px' }
    },
    {
      field: 'categorieCollaborateur',
      header: 'Catégorie',
      sortable: true,
      style: { width: '120px' }
    },
    {
      field: 'active',
      header: 'Statut',
      body: statusBodyTemplate,
      style: { width: '100px' }
    }
  ];

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowDialog(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowDialog(true);
  };

  const handleDeleteUser = (user: User) => {
    // TODO(api): Implement user deletion
    console.log('Delete user:', user.id);
    toast.current?.show({
      severity: 'success',
      summary: 'Utilisateur supprimé',
      detail: `${user.firstName} ${user.lastName} a été supprimé`,
      life: 3000
    });
  };

  const handleSubmitUser = async (data: any) => {
    try {
      // TODO(api): Create or update user
      console.log('Submit user:', data);
      
      toast.current?.show({
        severity: 'success',
        summary: editingUser ? 'Utilisateur modifié' : 'Utilisateur créé',
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
    console.log('Export users');
    toast.current?.show({
      severity: 'info',
      summary: 'Export en cours',
      detail: 'Le fichier sera téléchargé sous peu',
      life: 3000
    });
  };

  const handleImport = () => {
    setShowImportDialog(true);
  };

  return (
    <Guard role="admin">
      <AppShell>
        <Toast ref={toast} />
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
              <p className="text-gray-600">Créer, modifier et gérer les comptes utilisateurs</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                label="Importer"
                icon="pi pi-upload"
                outlined
                onClick={handleImport}
              />
              <Button
                label="Nouvel utilisateur"
                icon="pi pi-plus"
                onClick={handleCreateUser}
              />
            </div>
          </div>

          <DataTableWrapper
            data={users}
            columns={columns}
            loading={loading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onExport={handleExport}
            globalFilterFields={['firstName', 'lastName', 'email', 'matriculeRcar']}
            selectionMode="multiple"
          />
        </div>

        {/* User Form Dialog */}
        <Dialog
          header={editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          visible={showDialog}
          onHide={() => setShowDialog(false)}
          style={{ width: '600px' }}
          modal
        >
          <FormBuilder
            fields={userFormFields}
            onSubmit={handleSubmitUser}
            defaultValues={editingUser || {}}
            submitLabel={editingUser ? 'Modifier' : 'Créer'}
          />
        </Dialog>

        {/* Import Dialog */}
        <Dialog
          header="Importer des utilisateurs"
          visible={showImportDialog}
          onHide={() => setShowImportDialog(false)}
          style={{ width: '500px' }}
          modal
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Téléchargez un fichier Excel (.xlsx) contenant les informations des utilisateurs
            </p>
            
            <FileUpload
              name="usersImport"
              accept=".xlsx,.xls,.csv"
              maxFileSize={10000000}
              emptyTemplate={
                <p className="text-center">
                  Glissez-déposez votre fichier Excel ici
                </p>
              }
              customUpload
              uploadHandler={(event) => {
                // TODO(api): Handle file upload and processing
                console.log('Import file:', event.files[0]);
                toast.current?.show({
                  severity: 'success',
                  summary: 'Import réussi',
                  detail: 'Les utilisateurs ont été importés',
                  life: 3000
                });
                setShowImportDialog(false);
              }}
            />
            
            <div className="text-center">
              <Button
                label="Télécharger le modèle"
                icon="pi pi-download"
                text
                onClick={() => {
                  // TODO(api): Download template file
                  console.log('Download template');
                }}
              />
            </div>
          </div>
        </Dialog>
      </AppShell>
    </Guard>
  );
}