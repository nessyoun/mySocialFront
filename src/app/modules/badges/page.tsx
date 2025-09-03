"use client";

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import SideMenu from '../../shared/nav-menu/SideMenu';
import { ActiveMenu } from '../../shared/nav-menu/activeMenu';
import dayjs from 'dayjs';

interface BadgeReservation {
  id: string;
  ets: string;
  groupe: string;
  date: string;
  statut: 'confirmee' | 'en_attente' | 'annulee';
  nombrePersonnes: number;
}

interface ETSGroupe {
  id: string;
  ets: string;
  nom: string;
  capacite: number;
  reserves: number;
  disponible: boolean;
}

const mockETS = [
  { label: 'ETS Casablanca', value: 'casa' },
  { label: 'ETS Rabat', value: 'rabat' },
  { label: 'ETS Marrakech', value: 'marrakech' },
  { label: 'ETS Agadir', value: 'agadir' },
  { label: 'ETS Fès', value: 'fes' }
];

const mockGroupes: ETSGroupe[] = [
  {
    id: '1',
    ets: 'ETS Casablanca',
    nom: 'Groupe A - Matin',
    capacite: 50,
    reserves: 35,
    disponible: true
  },
  {
    id: '2',
    ets: 'ETS Casablanca',
    nom: 'Groupe B - Après-midi',
    capacite: 50,
    reserves: 48,
    disponible: true
  },
  {
    id: '3',
    ets: 'ETS Rabat',
    nom: 'Groupe A - Matin',
    capacite: 40,
    reserves: 40,
    disponible: false
  }
];

const mockReservations: BadgeReservation[] = [
  {
    id: '1',
    ets: 'ETS Casablanca',
    groupe: 'Groupe A - Matin',
    date: '2025-02-25',
    statut: 'confirmee',
    nombrePersonnes: 3
  },
  {
    id: '2',
    ets: 'ETS Rabat',
    groupe: 'Groupe A - Matin',
    date: '2025-03-05',
    statut: 'en_attente',
    nombrePersonnes: 2
  }
];

export default function BadgesPage() {
  const [reservations, setReservations] = useState<BadgeReservation[]>([]);
  const [groupes, setGroupes] = useState<ETSGroupe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [selectedETS, setSelectedETS] = useState<string>('');
  const [selectedGroupe, setSelectedGroupe] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [nombrePersonnes, setNombrePersonnes] = useState<number>(1);

  useEffect(() => {
    // TODO(api): Fetch badges reservations and available groups
    setTimeout(() => {
      setReservations(mockReservations);
      setGroupes(mockGroupes);
      setLoading(false);
    }, 500);
  }, []);

  const statutBodyTemplate = (rowData: BadgeReservation) => {
    const severityMap = {
      'confirmee': 'success',
      'en_attente': 'warning',
      'annulee': 'danger'
    } as const;

    const labelMap = {
      'confirmee': 'Confirmée',
      'en_attente': 'En attente',
      'annulee': 'Annulée'
    };

    return <Tag value={labelMap[rowData.statut]} severity={severityMap[rowData.statut]} />;
  };

  const capaciteBodyTemplate = (rowData: ETSGroupe) => {
    const percentage = (rowData.reserves / rowData.capacite) * 100;
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{rowData.reserves}/{rowData.capacite}</span>
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${
              percentage === 100 ? 'bg-red-500' : percentage > 80 ? 'bg-orange-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const reservationColumns = [
    {
      field: 'ets',
      header: 'ETS',
      sortable: true,
      style: { width: '150px' }
    },
    {
      field: 'groupe',
      header: 'Groupe',
      sortable: true,
      style: { width: '180px' }
    },
    {
      field: 'date',
      header: 'Date',
      sortable: true,
      style: { width: '120px' },
      body: (rowData: BadgeReservation) => dayjs(rowData.date).format('DD/MM/YYYY')
    },
    {
      field: 'nombrePersonnes',
      header: 'Personnes',
      sortable: true,
      style: { width: '100px' }
    },
    {
      field: 'statut',
      header: 'Statut',
      body: statutBodyTemplate,
      sortable: true,
      style: { width: '120px' }
    }
  ];

  const groupesColumns = [
    {
      field: 'ets',
      header: 'ETS',
      sortable: true,
      style: { width: '150px' }
    },
    {
      field: 'nom',
      header: 'Groupe',
      sortable: true,
      style: { width: '180px' }
    },
    {
      field: 'capacite',
      header: 'Capacité',
      body: capaciteBodyTemplate,
      style: { width: '150px' }
    },
    {
      field: 'disponible',
      header: 'Statut',
      body: (rowData: ETSGroupe) => (
        <Tag 
          value={rowData.disponible ? 'Disponible' : 'Complet'} 
          severity={rowData.disponible ? 'success' : 'danger'} 
        />
      ),
      style: { width: '120px' }
    }
  ];

  const handleNewReservation = () => {
    setSelectedETS('');
    setSelectedGroupe('');
    setSelectedDate(null);
    setNombrePersonnes(1);
    setShowReservationDialog(true);
  };

  const handleSubmitReservation = () => {
    // TODO(api): Submit badge reservation
    console.log('New badge reservation:', {
      ets: selectedETS,
      groupe: selectedGroupe,
      date: selectedDate,
      nombrePersonnes
    });
    setShowReservationDialog(false);
  };

  const filteredGroupes = groupes.filter(g => 
    !selectedETS || g.ets === mockETS.find(e => e.value === selectedETS)?.label
  );

  return (
    <SideMenu activeMenu={ActiveMenu.Activities}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Module Badges ETS/Hammams</h1>
            <p className="text-gray-600">Réservation d'accès aux établissements thermaux et sociaux</p>
          </div>
          <Button
            label="Nouvelle réservation"
            icon="pi pi-plus"
            onClick={handleNewReservation}
          />
        </div>

        <TabView>
          <TabPanel header="Mes réservations">
            <DataTable
              value={reservations}
              loading={loading}
              paginator
              rows={10}
              showGridlines
              stripedRows
              className="p-datatable-sm"
              header={
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Mes réservations badges</h3>
                </div>
              }
            >
              {reservationColumns.map((col) => (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  sortable={col.sortable}
                  style={col.style}
                />
              ))}
              <Column
                header="Actions"
                body={(rowData: BadgeReservation) => (
                  <div className="flex gap-2">
                    <Button
                      icon="pi pi-eye"
                      rounded
                      outlined
                      tooltip="Voir détails"
                      onClick={() => console.log('View reservation:', rowData.id)}
                    />
                    {rowData.statut === 'confirmee' && (
                      <Button
                        icon="pi pi-download"
                        rounded
                        outlined
                        severity="success"
                        tooltip="Télécharger badge"
                        onClick={() => console.log('Download badge:', rowData.id)}
                      />
                    )}
                  </div>
                )}
                style={{ width: '120px' }}
              />
            </DataTable>
          </TabPanel>

          <TabPanel header="Groupes disponibles">
            <DataTable
              value={filteredGroupes}
              loading={loading}
              showGridlines
              stripedRows
              className="p-datatable-sm"
              header={
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Groupes et capacités</h3>
                  <Dropdown
                    value={selectedETS}
                    options={[{ label: 'Tous les ETS', value: '' }, ...mockETS]}
                    onChange={(e) => setSelectedETS(e.value)}
                    placeholder="Filtrer par ETS"
                  />
                </div>
              }
            >
              {groupesColumns.map((col) => (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  sortable={col.sortable}
                  style={col.style}
                />
              ))}
              <Column
                header="Actions"
                body={(rowData: ETSGroupe) => (
                  <Button
                    label="Réserver"
                    icon="pi pi-plus"
                    size="small"
                    disabled={!rowData.disponible}
                    onClick={() => {
                      setSelectedETS(mockETS.find(e => e.label === rowData.ets)?.value || '');
                      setSelectedGroupe(rowData.nom);
                      setShowReservationDialog(true);
                    }}
                  />
                )}
                style={{ width: '120px' }}
              />
            </DataTable>
          </TabPanel>

          <TabPanel header="Informations ETS">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockETS.map(ets => (
                <Card key={ets.value} title={ets.label}>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Horaires:</span>
                      <span>08:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Services:</span>
                      <span>Hammam, Piscine, Gym</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Groupes:</span>
                      <span>{groupes.filter(g => g.ets === ets.label).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Disponibilité:</span>
                      <Tag 
                        value={groupes.some(g => g.ets === ets.label && g.disponible) ? 'Ouvert' : 'Complet'} 
                        severity={groupes.some(g => g.ets === ets.label && g.disponible) ? 'success' : 'danger'} 
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabPanel>
        </TabView>
      </div>

      {/* Reservation Dialog */}
      <Dialog
        header="Réservation badge ETS/Hammam"
        visible={showReservationDialog}
        onHide={() => setShowReservationDialog(false)}
        style={{ width: '500px' }}
        modal
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ETS
            </label>
            <Dropdown
              value={selectedETS}
              options={mockETS}
              onChange={(e) => setSelectedETS(e.value)}
              placeholder="Sélectionner un ETS"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Groupe
            </label>
            <Dropdown
              value={selectedGroupe}
              options={filteredGroupes.map(g => ({ label: g.nom, value: g.nom }))}
              onChange={(e) => setSelectedGroupe(e.value)}
              placeholder="Sélectionner un groupe"
              className="w-full"
              disabled={!selectedETS}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de visite
            </label>
            <Calendar
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.value as Date)}
              placeholder="Sélectionner une date"
              className="w-full"
              showIcon
              dateFormat="dd/mm/yy"
              minDate={new Date()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de personnes (famille)
            </label>
            <Dropdown
              value={nombrePersonnes}
              options={[
                { label: '1 personne', value: 1 },
                { label: '2 personnes', value: 2 },
                { label: '3 personnes', value: 3 },
                { label: '4 personnes', value: 4 }
              ]}
              onChange={(e) => setNombrePersonnes(e.value)}
              className="w-full"
            />
          </div>

          {selectedGroupe && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <i className="pi pi-info-circle text-blue-500"></i>
                <span className="font-medium text-blue-800">Informations du groupe</span>
              </div>
              <div className="text-sm text-blue-700 space-y-1">
                <p>Capacité: {filteredGroupes.find(g => g.nom === selectedGroupe)?.capacite} personnes</p>
                <p>Places restantes: {(filteredGroupes.find(g => g.nom === selectedGroupe)?.capacite || 0) - (filteredGroupes.find(g => g.nom === selectedGroupe)?.reserves || 0)}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              label="Annuler"
              outlined
              onClick={() => setShowReservationDialog(false)}
            />
            <Button
              label="Réserver"
              icon="pi pi-id-card"
              onClick={handleSubmitReservation}
              disabled={!selectedETS || !selectedGroupe || !selectedDate}
            />
          </div>
        </div>
      </Dialog>
    </SideMenu>
  );
}