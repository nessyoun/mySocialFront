"use client";

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import SideMenu from '../../shared/nav-menu/SideMenu';
import { ActiveMenu } from '../../shared/nav-menu/activeMenu';
import dayjs from 'dayjs';

interface FoyerActivite {
  id: string;
  foyer: string;
  activite: string;
  date: string;
  horaire: string;
  animateur: string;
  capacite: number;
  inscrits: number;
  statut: 'ouverte' | 'fermee' | 'annulee';
}

interface FoyerInscription {
  id: string;
  activiteId: string;
  activiteTitre: string;
  foyer: string;
  date: string;
  statut: 'confirmee' | 'en_attente' | 'annulee';
}

const mockFoyers = [
  { label: 'Foyer Casablanca Centre', value: 'casa-centre' },
  { label: 'Foyer Casablanca Ain Sebaa', value: 'casa-ain-sebaa' },
  { label: 'Foyer Rabat', value: 'rabat' },
  { label: 'Foyer Marrakech', value: 'marrakech' },
  { label: 'Foyer Agadir', value: 'agadir' }
];

const mockActivitesFoyer: FoyerActivite[] = [
  {
    id: '1',
    foyer: 'Foyer Casablanca Centre',
    activite: 'Atelier cuisine marocaine',
    date: '2025-02-25',
    horaire: '14:00 - 17:00',
    animateur: 'Chef Amina TAZI',
    capacite: 20,
    inscrits: 15,
    statut: 'ouverte'
  },
  {
    id: '2',
    foyer: 'Foyer Rabat',
    activite: 'Cours de couture',
    date: '2025-02-26',
    horaire: '09:00 - 12:00',
    animateur: 'Mme Fatima ALAMI',
    capacite: 15,
    inscrits: 15,
    statut: 'fermee'
  },
  {
    id: '3',
    foyer: 'Foyer Casablanca Centre',
    activite: 'Atelier pâtisserie',
    date: '2025-02-28',
    horaire: '15:00 - 18:00',
    animateur: 'Chef Mohammed BENNANI',
    capacite: 12,
    inscrits: 8,
    statut: 'ouverte'
  }
];

const mockInscriptions: FoyerInscription[] = [
  {
    id: '1',
    activiteId: '1',
    activiteTitre: 'Atelier cuisine marocaine',
    foyer: 'Foyer Casablanca Centre',
    date: '2025-02-25',
    statut: 'confirmee'
  }
];

const mockMessages = [
  {
    id: '1',
    type: 'info',
    titre: 'Nouvelle activité disponible',
    contenu: 'Un atelier de pâtisserie orientale aura lieu le 28 février au Foyer Casablanca Centre.',
    date: '2025-02-15'
  },
  {
    id: '2',
    type: 'warning',
    titre: 'Modification d\'horaire',
    contenu: 'L\'atelier cuisine du 25 février est reporté de 14h à 15h.',
    date: '2025-02-14'
  }
];

export default function FoyersPage() {
  const [activites, setActivites] = useState<FoyerActivite[]>([]);
  const [inscriptions, setInscriptions] = useState<FoyerInscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInscriptionDialog, setShowInscriptionDialog] = useState(false);
  const [selectedActivite, setSelectedActivite] = useState<FoyerActivite | null>(null);
  const [selectedFoyer, setSelectedFoyer] = useState<string>('');

  useEffect(() => {
    // TODO(api): Fetch foyer activities and inscriptions
    setTimeout(() => {
      let filtered = [...mockActivitesFoyer];
      
      if (selectedFoyer) {
        const foyerLabel = mockFoyers.find(f => f.value === selectedFoyer)?.label;
        filtered = filtered.filter(a => a.foyer === foyerLabel);
      }
      
      setActivites(filtered);
      setInscriptions(mockInscriptions);
      setLoading(false);
    }, 500);
  }, [selectedFoyer]);

  const statutBodyTemplate = (rowData: FoyerActivite) => {
    const severityMap = {
      'ouverte': 'success',
      'fermee': 'danger',
      'annulee': 'secondary'
    } as const;

    const labelMap = {
      'ouverte': 'Ouverte',
      'fermee': 'Fermée',
      'annulee': 'Annulée'
    };

    return <Tag value={labelMap[rowData.statut]} severity={severityMap[rowData.statut]} />;
  };

  const capaciteBodyTemplate = (rowData: FoyerActivite) => {
    const percentage = (rowData.inscrits / rowData.capacite) * 100;
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{rowData.inscrits}/{rowData.capacite}</span>
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

  const activitesColumns = [
    {
      field: 'activite',
      header: 'Activité',
      sortable: true,
      style: { minWidth: '200px' }
    },
    {
      field: 'foyer',
      header: 'Foyer',
      sortable: true,
      style: { width: '180px' }
    },
    {
      field: 'date',
      header: 'Date',
      sortable: true,
      style: { width: '120px' },
      body: (rowData: FoyerActivite) => dayjs(rowData.date).format('DD/MM/YYYY')
    },
    {
      field: 'horaire',
      header: 'Horaire',
      style: { width: '140px' }
    },
    {
      field: 'animateur',
      header: 'Animateur',
      style: { width: '150px' }
    },
    {
      field: 'capacite',
      header: 'Places',
      body: capaciteBodyTemplate,
      style: { width: '120px' }
    },
    {
      field: 'statut',
      header: 'Statut',
      body: statutBodyTemplate,
      sortable: true,
      style: { width: '100px' }
    }
  ];

  const inscriptionsColumns = [
    {
      field: 'activiteTitre',
      header: 'Activité',
      sortable: true,
      style: { minWidth: '200px' }
    },
    {
      field: 'foyer',
      header: 'Foyer',
      sortable: true,
      style: { width: '180px' }
    },
    {
      field: 'date',
      header: 'Date',
      sortable: true,
      style: { width: '120px' },
      body: (rowData: FoyerInscription) => dayjs(rowData.date).format('DD/MM/YYYY')
    },
    {
      field: 'statut',
      header: 'Statut',
      body: (rowData: FoyerInscription) => {
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
      },
      sortable: true,
      style: { width: '120px' }
    }
  ];

  const handleInscription = (activite: FoyerActivite) => {
    setSelectedActivite(activite);
    setShowInscriptionDialog(true);
  };

  const handleSubmitInscription = () => {
    // TODO(api): Submit foyer activity inscription
    console.log('New foyer inscription:', selectedActivite?.id);
    setShowInscriptionDialog(false);
  };

  return (
    <SideMenu activeMenu={ActiveMenu.Activities}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Module Foyers</h1>
          <p className="text-gray-600">Activités et ateliers dans les foyers sociaux</p>
        </div>

        <TabView>
          <TabPanel header="Activités disponibles">
            <Card className="mb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filtrer par foyer</h3>
                <Dropdown
                  value={selectedFoyer}
                  options={[{ label: 'Tous les foyers', value: '' }, ...mockFoyers]}
                  onChange={(e) => setSelectedFoyer(e.value)}
                  placeholder="Sélectionner un foyer"
                />
              </div>
            </Card>

            <DataTable
              value={activites}
              loading={loading}
              paginator
              rows={10}
              showGridlines
              stripedRows
              className="p-datatable-sm"
            >
              {activitesColumns.map((col) => (
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
                body={(rowData: FoyerActivite) => (
                  <Button
                    label="S'inscrire"
                    icon="pi pi-plus"
                    size="small"
                    disabled={rowData.statut !== 'ouverte' || rowData.inscrits >= rowData.capacite}
                    onClick={() => handleInscription(rowData)}
                  />
                )}
                style={{ width: '120px' }}
              />
            </DataTable>
          </TabPanel>

          <TabPanel header="Mes inscriptions">
            <DataTable
              value={inscriptions}
              loading={loading}
              paginator
              rows={10}
              showGridlines
              stripedRows
              className="p-datatable-sm"
            >
              {inscriptionsColumns.map((col) => (
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
                body={(rowData: FoyerInscription) => (
                  <div className="flex gap-2">
                    <Button
                      icon="pi pi-eye"
                      rounded
                      outlined
                      tooltip="Voir détails"
                      onClick={() => console.log('View inscription:', rowData.id)}
                    />
                    {rowData.statut === 'confirmee' && (
                      <Button
                        icon="pi pi-times"
                        rounded
                        outlined
                        severity="danger"
                        tooltip="Se désinscrire"
                        onClick={() => console.log('Cancel inscription:', rowData.id)}
                      />
                    )}
                  </div>
                )}
                style={{ width: '120px' }}
              />
            </DataTable>
          </TabPanel>

          <TabPanel header="Messages & Infos">
            <div className="space-y-4">
              {mockMessages.map(message => (
                <Message
                  key={message.id}
                  severity={message.type as any}
                  className="w-full"
                  content={
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{message.titre}</h4>
                        <span className="text-xs text-gray-500">
                          {dayjs(message.date).format('DD/MM/YYYY')}
                        </span>
                      </div>
                      <p className="text-sm">{message.contenu}</p>
                    </div>
                  }
                />
              ))}
              
              <Card title="Informations générales">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <i className="pi pi-clock text-blue-500"></i>
                    <span>Horaires d'ouverture: 08:00 - 20:00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="pi pi-phone text-blue-500"></i>
                    <span>Contact: 0522-123-456</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="pi pi-calendar text-blue-500"></i>
                    <span>Activités programmées chaque semaine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="pi pi-users text-blue-500"></i>
                    <span>Inscription gratuite pour tous les collaborateurs</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabPanel>
        </TabView>
      </div>

      {/* Inscription Dialog */}
      <Dialog
        header="Inscription à l'activité"
        visible={showInscriptionDialog}
        onHide={() => setShowInscriptionDialog(false)}
        style={{ width: '500px' }}
        modal
      >
        {selectedActivite && (
          <div className="space-y-4">
            <Card>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{selectedActivite.activite}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Foyer:</span>
                    <div className="font-medium">{selectedActivite.foyer}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <div className="font-medium">{dayjs(selectedActivite.date).format('DD/MM/YYYY')}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Horaire:</span>
                    <div className="font-medium">{selectedActivite.horaire}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Animateur:</span>
                    <div className="font-medium">{selectedActivite.animateur}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-800">Places disponibles:</span>
                  <span className="font-medium text-blue-900">
                    {selectedActivite.capacite - selectedActivite.inscrits} / {selectedActivite.capacite}
                  </span>
                </div>
              </div>
            </Card>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <i className="pi pi-check-circle text-green-500"></i>
                <span className="font-medium text-green-800">Inscription gratuite</span>
              </div>
              <p className="text-sm text-green-700">
                Cette activité est gratuite et ouverte à tous les collaborateurs OCP.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                label="Annuler"
                outlined
                onClick={() => setShowInscriptionDialog(false)}
              />
              <Button
                label="Confirmer l'inscription"
                icon="pi pi-check"
                onClick={handleSubmitInscription}
              />
            </div>
          </div>
        )}
      </Dialog>
    </SideMenu>
  );
}