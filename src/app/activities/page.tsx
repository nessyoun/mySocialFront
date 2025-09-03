"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import SideMenu from '../shared/nav-menu/SideMenu';
import { ActiveMenu } from '../shared/nav-menu/activeMenu';
import DataTableWrapper from '@/components/shared/DataTableWrapper';
import { Activite, ModuleType } from '@/lib/types';
import { mockActivites } from '@/lib/mock-data';
import dayjs from 'dayjs';

export default function ActivitiesPage() {
  const [activites, setActivites] = useState<Activite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const router = useRouter();

  const moduleOptions = [
    { label: 'Toutes', value: null },
    { label: 'Récréatives', value: 'recreatives' },
    { label: 'Bourse de fond', value: 'bourse-fond' },
    { label: 'Billetterie', value: 'billetterie' },
    { label: 'Badges ETS/Hammams', value: 'badges' },
    { label: 'Foyers', value: 'foyers' },
    { label: 'Prix élèves', value: 'prix-eleves' },
    { label: 'Jeux Ramadan', value: 'jeux-ramadan' },
    { label: 'Terrains', value: 'terrains' },
    { label: 'Tournois Ramadan', value: 'tournois-ramadan' }
  ];

  useEffect(() => {
    // TODO(api): Replace with real API call
    setTimeout(() => {
      let filtered = [...mockActivites];
      
      if (selectedModule) {
        filtered = filtered.filter(a => a.module === selectedModule);
      }
      
      if (dateFilter) {
        const filterDate = dayjs(dateFilter);
        filtered = filtered.filter(a => 
          filterDate.isBetween(dayjs(a.dateDebut), dayjs(a.dateFin), 'day', '[]')
        );
      }
      
      setActivites(filtered);
      setLoading(false);
    }, 500);
  }, [selectedModule, dateFilter]);

  const statutBodyTemplate = (rowData: Activite) => {
    const severityMap = {
      'brouillon': 'secondary',
      'publiee': 'success',
      'fermee': 'warning',
      'annulee': 'danger'
    } as const;

    return <Tag value={rowData.statut} severity={severityMap[rowData.statut]} />;
  };

  const moduleBodyTemplate = (rowData: Activite) => {
    const moduleLabels = {
      'recreatives': 'Récréatives',
      'bourse-fond': 'Bourse de fond',
      'billetterie': 'Billetterie',
      'badges': 'Badges',
      'foyers': 'Foyers',
      'prix-eleves': 'Prix élèves',
      'jeux-ramadan': 'Jeux Ramadan',
      'terrains': 'Terrains',
      'tournois-ramadan': 'Tournois Ramadan'
    };

    return <span>{moduleLabels[rowData.module]}</span>;
  };

  const dateBodyTemplate = (rowData: Activite) => {
    return dayjs(rowData.dateDebut).format('DD/MM/YYYY');
  };

  const capaciteBodyTemplate = (rowData: Activite) => {
    // TODO(api): Get real inscription count
    const inscriptions = Math.floor(Math.random() * rowData.capacite);
    const percentage = (inscriptions / rowData.capacite) * 100;
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{inscriptions}/{rowData.capacite}</span>
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${
              percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-orange-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const columns = [
    {
      field: 'titre',
      header: 'Titre',
      sortable: true,
      style: { minWidth: '200px' }
    },
    {
      field: 'module',
      header: 'Module',
      body: moduleBodyTemplate,
      sortable: true,
      style: { width: '150px' }
    },
    {
      field: 'dateDebut',
      header: 'Date',
      body: dateBodyTemplate,
      sortable: true,
      style: { width: '120px' }
    },
    {
      field: 'capacite',
      header: 'Capacité',
      body: capaciteBodyTemplate,
      style: { width: '150px' }
    },
    {
      field: 'statut',
      header: 'Statut',
      body: statutBodyTemplate,
      sortable: true,
      style: { width: '120px' }
    }
  ];

  const handleEdit = (activite: Activite) => {
    router.push(`/activities/${activite.id}/edit`);
  };

  const handleView = (activite: Activite) => {
    router.push(`/activities/${activite.id}`);
  };

  return (
    <SideMenu activeMenu={ActiveMenu.Activities}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Activités</h1>
            <p className="text-gray-600">Gestion des activités sociales</p>
          </div>
          <Button
            label="Nouvelle activité"
            icon="pi pi-plus"
            onClick={() => router.push('/activities/create')}
          />
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Module
              </label>
              <Dropdown
                value={selectedModule}
                options={moduleOptions}
                onChange={(e) => setSelectedModule(e.value)}
                placeholder="Filtrer par module"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <Calendar
                value={dateFilter}
                onChange={(e) => setDateFilter(e.value as Date)}
                placeholder="Filtrer par date"
                className="w-full"
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>
            
            <div className="flex items-end">
              <Button
                label="Réinitialiser"
                icon="pi pi-refresh"
                outlined
                onClick={() => {
                  setSelectedModule(null);
                  setDateFilter(null);
                }}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Activities Table */}
        <DataTableWrapper
          data={activites}
          columns={columns}
          loading={loading}
          onEdit={handleEdit}
          onDelete={(activite) => {
            // TODO(api): Implement delete
            console.log('Delete activite:', activite.id);
          }}
          globalFilterFields={['titre', 'description']}
          title="Liste des activités"
          createButton={{
            label: 'Nouvelle activité',
            onClick: () => router.push('/activities/create')
          }}
        />
      </div>
    </SideMenu>
  );
}