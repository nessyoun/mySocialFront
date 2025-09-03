"use client";

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import SideMenu from '../../shared/nav-menu/SideMenu';
import { ActiveMenu } from '../../shared/nav-menu/activeMenu';
import DataTableWrapper from '@/components/shared/DataTableWrapper';
import RankingView from '@/components/shared/RankingView';
import { Inscription } from '@/lib/types';
import { mockInscriptions } from '@/lib/mock-data';
import { CapacityManager } from '@/lib/rules';
import dayjs from 'dayjs';

export default function RecreativesPage() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);
  const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);

  useEffect(() => {
    // TODO(api): Fetch recreatives inscriptions
    setTimeout(() => {
      const recreativesInscriptions = mockInscriptions.filter(i => 
        // Mock filter for recreatives module
        true
      );
      setInscriptions(recreativesInscriptions);
      setLoading(false);
    }, 500);
  }, []);

  const statutBodyTemplate = (rowData: Inscription) => {
    const severityMap = {
      'draft': 'secondary',
      'soumise': 'info',
      'confirmee': 'success',
      'en_attente': 'warning',
      'annulee': 'danger'
    } as const;

    const labelMap = {
      'draft': 'Brouillon',
      'soumise': 'Soumise',
      'confirmee': 'Confirmée',
      'en_attente': 'En attente',
      'annulee': 'Annulée'
    };

    return <Tag value={labelMap[rowData.statut]} severity={severityMap[rowData.statut]} />;
  };

  const dateBodyTemplate = (rowData: Inscription) => {
    return dayjs(rowData.dateInscription).format('DD/MM/YYYY HH:mm');
  };

  const actionsBodyTemplate = (rowData: Inscription) => {
    const canWithdraw = CapacityManager.canWithdraw(rowData.dateInscription);
    
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          tooltip="Voir détails"
          onClick={() => console.log('View inscription:', rowData.id)}
        />
        {canWithdraw && rowData.statut === 'confirmee' && (
          <Button
            icon="pi pi-times"
            rounded
            outlined
            severity="danger"
            tooltip="Se désister (≤48h)"
            onClick={() => {
              setSelectedInscription(rowData);
              setShowWithdrawalDialog(true);
            }}
          />
        )}
      </div>
    );
  };

  const handleWithdrawal = async () => {
    if (!selectedInscription) return;
    
    try {
      // TODO(api): Implement withdrawal logic
      console.log('Withdraw from inscription:', selectedInscription.id);
      
      // Update local state
      setInscriptions(prev => 
        prev.map(i => 
          i.id === selectedInscription.id 
            ? { ...i, statut: 'annulee' as const }
            : i
        )
      );
      
      setShowWithdrawalDialog(false);
      setSelectedInscription(null);
    } catch (error) {
      console.error('Withdrawal failed:', error);
    }
  };

  const inscriptionsColumns = [
    {
      field: 'activiteId',
      header: 'Activité',
      sortable: true
    },
    {
      field: 'dateInscription',
      header: 'Date inscription',
      body: dateBodyTemplate,
      sortable: true,
      style: { width: '150px' }
    },
    {
      field: 'points',
      header: 'Points',
      sortable: true,
      style: { width: '100px' }
    },
    {
      field: 'anciennete',
      header: 'Ancienneté',
      sortable: true,
      style: { width: '120px' },
      body: (rowData: Inscription) => `${rowData.anciennete} ans`
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

  // Mock ranking data for demo
  const mockRankingData = [
    {
      userId: '1',
      userName: 'Youness AIT HADDOU',
      matricule: 'H9984',
      points: 85,
      anciennete: 5,
      dateInscription: '2025-02-05T10:30:00Z'
    },
    {
      userId: '2',
      userName: 'Omar EL MANSOURI',
      matricule: 'H4521',
      points: 70,
      anciennete: 6,
      dateInscription: '2025-02-06T14:20:00Z'
    },
    {
      userId: '3',
      userName: 'Sara BENALI',
      matricule: 'H7643',
      points: 85,
      anciennete: 3,
      dateInscription: '2025-02-07T09:15:00Z'
    }
  ];

  return (
    <SideMenu activeMenu={ActiveMenu.Activities}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Module Récréatives</h1>
          <p className="text-gray-600">Gestion des activités récréatives et voyages</p>
        </div>

        <TabView>
          <TabPanel header="Mes inscriptions">
            <DataTableWrapper
              data={inscriptions}
              columns={inscriptionsColumns}
              loading={loading}
              globalFilterFields={['activiteId']}
              title="Mes inscriptions récréatives"
            />
          </TabPanel>

          <TabPanel header="Classement">
            <RankingView
              activiteId="1"
              inscriptions={mockRankingData}
              capacite={50}
              onExport={() => console.log('Export ranking')}
            />
          </TabPanel>

          <TabPanel header="Paiements">
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Voyage à Marrakech</h4>
                    <p className="text-sm text-gray-600">Montant: 1,500 MAD</p>
                    <p className="text-sm text-gray-500">Date limite: 28/02/2025</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Tag value="Payé" severity="success" />
                    <Button
                      label="Voir reçu"
                      icon="pi pi-file-pdf"
                      text
                      size="small"
                    />
                  </div>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                  <i className="pi pi-info-circle text-2xl mb-2"></i>
                  <p>Aucun autre paiement en attente</p>
                </div>
              </div>
            </Card>
          </TabPanel>

          <TabPanel header="Historique">
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Voyage à Agadir</h4>
                    <p className="text-sm text-gray-600">15-17 Décembre 2024</p>
                    <p className="text-sm text-gray-500">Classement: 12ème position</p>
                  </div>
                  <Tag value="Terminé" severity="success" />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Voyage à Fès</h4>
                    <p className="text-sm text-gray-600">10-12 Octobre 2024</p>
                    <p className="text-sm text-gray-500">Désistement le 08/10/2024</p>
                  </div>
                  <Tag value="Annulé" severity="danger" />
                </div>
              </div>
            </Card>
          </TabPanel>
        </TabView>
      </div>

      {/* Withdrawal Confirmation Dialog */}
      <Dialog
        header="Confirmer le désistement"
        visible={showWithdrawalDialog}
        onHide={() => setShowWithdrawalDialog(false)}
        style={{ width: '450px' }}
        modal
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
            <i className="pi pi-exclamation-triangle text-orange-500 text-xl"></i>
            <div>
              <p className="font-medium text-orange-800">Attention</p>
              <p className="text-sm text-orange-700">
                Cette action est irréversible. Vous perdrez votre place dans l'activité.
              </p>
            </div>
          </div>
          
          <p className="text-gray-700">
            Êtes-vous sûr de vouloir vous désister de cette activité ?
          </p>
          
          <div className="flex justify-end gap-2">
            <Button
              label="Annuler"
              outlined
              onClick={() => setShowWithdrawalDialog(false)}
            />
            <Button
              label="Confirmer le désistement"
              severity="danger"
              onClick={handleWithdrawal}
            />
          </div>
        </div>
      </Dialog>
    </SideMenu>
  );
}