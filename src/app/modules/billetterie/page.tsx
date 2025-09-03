"use client";

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import SideMenu from '../../shared/nav-menu/SideMenu';
import { ActiveMenu } from '../../shared/nav-menu/activeMenu';
import DataTableWrapper from '@/components/shared/DataTableWrapper';
import dayjs from 'dayjs';

interface BilletterieInscription {
  id: string;
  activiteId: string;
  activiteTitre: string;
  nombreBillets: number;
  quotaFamille: number;
  quotaUtilise: number;
  statut: 'en_attente' | 'confirmee' | 'disponible' | 'recuperee';
  dateInscription: string;
  dateRecuperation?: string;
  lieuRecuperation?: string;
}

const mockBilletterieInscriptions: BilletterieInscription[] = [
  {
    id: '1',
    activiteId: '1',
    activiteTitre: 'Concert de musique andalouse',
    nombreBillets: 2,
    quotaFamille: 4,
    quotaUtilise: 2,
    statut: 'disponible',
    dateInscription: '2025-02-01T10:00:00Z',
    lieuRecuperation: 'Accueil OCP Casablanca'
  },
  {
    id: '2',
    activiteId: '2',
    activiteTitre: 'Spectacle de danse',
    nombreBillets: 3,
    quotaFamille: 4,
    quotaUtilise: 3,
    statut: 'confirmee',
    dateInscription: '2025-01-15T14:30:00Z'
  }
];

export default function BilletteriePage() {
  const [inscriptions, setInscriptions] = useState<BilletterieInscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [nombreBillets, setNombreBillets] = useState<number>(1);

  useEffect(() => {
    // TODO(api): Fetch billetterie inscriptions
    setTimeout(() => {
      setInscriptions(mockBilletterieInscriptions);
      setLoading(false);
    }, 500);
  }, []);

  const statutBodyTemplate = (rowData: BilletterieInscription) => {
    const severityMap = {
      'en_attente': 'warning',
      'confirmee': 'info',
      'disponible': 'success',
      'recuperee': 'secondary'
    } as const;

    const labelMap = {
      'en_attente': 'En attente',
      'confirmee': 'Confirmée',
      'disponible': 'Disponible',
      'recuperee': 'Récupérée'
    };

    return <Tag value={labelMap[rowData.statut]} severity={severityMap[rowData.statut]} />;
  };

  const quotaBodyTemplate = (rowData: BilletterieInscription) => {
    const percentage = (rowData.quotaUtilise / rowData.quotaFamille) * 100;
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{rowData.quotaUtilise}/{rowData.quotaFamille}</span>
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${
              percentage === 100 ? 'bg-red-500' : percentage > 75 ? 'bg-orange-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const actionsBodyTemplate = (rowData: BilletterieInscription) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          tooltip="Voir détails"
          onClick={() => console.log('View inscription:', rowData.id)}
        />
        {rowData.statut === 'disponible' && (
          <Button
            icon="pi pi-download"
            rounded
            outlined
            severity="success"
            tooltip="Télécharger billets"
            onClick={() => console.log('Download tickets:', rowData.id)}
          />
        )}
      </div>
    );
  };

  const columns = [
    {
      field: 'activiteTitre',
      header: 'Événement',
      sortable: true,
      style: { minWidth: '200px' }
    },
    {
      field: 'nombreBillets',
      header: 'Billets',
      sortable: true,
      style: { width: '100px' }
    },
    {
      field: 'quotaFamille',
      header: 'Quota famille',
      body: quotaBodyTemplate,
      style: { width: '150px' }
    },
    {
      field: 'dateInscription',
      header: 'Date inscription',
      body: (rowData: BilletterieInscription) => dayjs(rowData.dateInscription).format('DD/MM/YYYY'),
      sortable: true,
      style: { width: '130px' }
    },
    {
      field: 'statut',
      header: 'Statut',
      body: statutBodyTemplate,
      sortable: true,
      style: { width: '120px' }
    },
    {
      field: 'actions',
      header: 'Actions',
      body: actionsBodyTemplate,
      style: { width: '150px' }
    }
  ];

  const handleNewReservation = () => {
    setSelectedEvent(null);
    setNombreBillets(1);
    setShowReservationDialog(true);
  };

  const handleSubmitReservation = () => {
    // TODO(api): Submit reservation
    console.log('New reservation:', { selectedEvent, nombreBillets });
    setShowReservationDialog(false);
  };

  const eventOptions = [
    { label: 'Concert de jazz - 15/03/2025', value: 'concert-jazz' },
    { label: 'Théâtre - 22/03/2025', value: 'theatre' },
    { label: 'Festival de musique - 05/04/2025', value: 'festival' }
  ];

  return (
    <SideMenu activeMenu={ActiveMenu.Activities}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Module Billetterie</h1>
            <p className="text-gray-600">Réservation de billets pour les événements culturels</p>
          </div>
          <Button
            label="Nouvelle réservation"
            icon="pi pi-plus"
            onClick={handleNewReservation}
          />
        </div>

        <TabView>
          <TabPanel header="Mes réservations">
            <DataTableWrapper
              data={inscriptions}
              columns={columns}
              loading={loading}
              globalFilterFields={['activiteTitre']}
              title="Historique des réservations"
            />
          </TabPanel>

          <TabPanel header="Événements disponibles">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">Concert de jazz</h3>
                    <Tag value="Disponible" severity="success" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    Soirée jazz avec l'orchestre national
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date:</span>
                      <span>15/03/2025 20:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Lieu:</span>
                      <span>Théâtre Mohammed V</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Places restantes:</span>
                      <span className="font-medium text-green-600">156/200</span>
                    </div>
                  </div>
                  <Button
                    label="Réserver"
                    icon="pi pi-ticket"
                    className="w-full"
                    onClick={handleNewReservation}
                  />
                </div>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">Pièce de théâtre</h3>
                    <Tag value="Bientôt" severity="warning" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    Représentation théâtrale classique
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date:</span>
                      <span>22/03/2025 19:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Lieu:</span>
                      <span>Théâtre National</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ouverture:</span>
                      <span className="font-medium text-blue-600">10/03/2025</span>
                    </div>
                  </div>
                  <Button
                    label="Bientôt disponible"
                    icon="pi pi-clock"
                    className="w-full"
                    disabled
                  />
                </div>
              </Card>
            </div>
          </TabPanel>

          <TabPanel header="Quota famille">
            <Card>
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Quota annuel famille
                  </h3>
                  <p className="text-gray-600">
                    Vous pouvez réserver jusqu'à 4 billets par événement
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
                    <div className="text-sm text-blue-800">Billets utilisés ce mois</div>
                  </div>
                  
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">15</div>
                    <div className="text-sm text-green-800">Billets restants</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Règles du quota famille</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <i className="pi pi-check text-green-500"></i>
                      Maximum 4 billets par événement
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="pi pi-check text-green-500"></i>
                      Quota famille partagé (conjoint + enfants)
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="pi pi-check text-green-500"></i>
                      Réinitialisation mensuelle du quota
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="pi pi-info-circle text-blue-500"></i>
                      Couple OCP: une seule réservation par année
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabPanel>
        </TabView>
      </div>

      {/* Reservation Dialog */}
      <Dialog
        header="Nouvelle réservation"
        visible={showReservationDialog}
        onHide={() => setShowReservationDialog(false)}
        style={{ width: '500px' }}
        modal
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Événement
            </label>
            <Dropdown
              value={selectedEvent}
              options={eventOptions}
              onChange={(e) => setSelectedEvent(e.value)}
              placeholder="Sélectionner un événement"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de billets (max 4)
            </label>
            <InputNumber
              value={nombreBillets}
              onValueChange={(e) => setNombreBillets(e.value || 1)}
              min={1}
              max={4}
              className="w-full"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <i className="pi pi-info-circle text-blue-500"></i>
              <span className="font-medium text-blue-800">Information quota</span>
            </div>
            <p className="text-sm text-blue-700">
              Quota famille utilisé: 2/4 billets ce mois
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              label="Annuler"
              outlined
              onClick={() => setShowReservationDialog(false)}
            />
            <Button
              label="Réserver"
              icon="pi pi-ticket"
              onClick={handleSubmitReservation}
              disabled={!selectedEvent}
            />
          </div>
        </div>
      </Dialog>
    </SideMenu>
  );
}