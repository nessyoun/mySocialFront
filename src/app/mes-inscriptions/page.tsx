"use client";

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Timeline } from 'primereact/timeline';
import AppShell from '@/components/layout/AppShell';
import Guard from '@/components/auth/Guard';
import DataTableWrapper from '@/components/shared/DataTableWrapper';
import { Inscription } from '@/lib/types';
import { mockInscriptions } from '@/lib/mock-data';
import { CapacityManager } from '@/lib/rules';
import dayjs from 'dayjs';

export default function MesInscriptionsPage() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO(api): Fetch user's inscriptions
    setTimeout(() => {
      setInscriptions(mockInscriptions);
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
            onClick={() => handleWithdrawal(rowData)}
          />
        )}
      </div>
    );
  };

  const handleWithdrawal = (inscription: Inscription) => {
    // TODO(api): Implement withdrawal logic
    console.log('Withdraw from inscription:', inscription.id);
  };

  const columns = [
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

  // Mock timeline events
  const timelineEvents = [
    {
      status: 'Inscription soumise',
      date: '15/02/2025 10:30',
      icon: 'pi pi-check',
      color: '#10B981'
    },
    {
      status: 'Documents vérifiés',
      date: '16/02/2025 14:20',
      icon: 'pi pi-file-check',
      color: '#3B82F6'
    },
    {
      status: 'Paiement confirmé',
      date: '17/02/2025 09:15',
      icon: 'pi pi-credit-card',
      color: '#8B5CF6'
    },
    {
      status: 'Inscription confirmée',
      date: '17/02/2025 16:45',
      icon: 'pi pi-star',
      color: '#F59E0B'
    }
  ];

  return (
    <Guard role="collaborateur">
      <AppShell>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes inscriptions</h1>
            <p className="text-gray-600">Suivi de vos demandes et inscriptions</p>
          </div>

          <TabView>
            <TabPanel header="Toutes mes inscriptions">
              <DataTableWrapper
                data={inscriptions}
                columns={columns}
                loading={loading}
                globalFilterFields={['activiteId']}
                title="Historique des inscriptions"
              />
            </TabPanel>

            <TabPanel header="En cours">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Voyage à Marrakech">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Statut:</span>
                      <Tag value="Confirmée" severity="success" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Date:</span>
                      <span>15-17 Mars 2025</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Montant:</span>
                      <span>1,500 MAD</span>
                    </div>
                    <Button
                      label="Voir les détails"
                      icon="pi pi-eye"
                      text
                      className="w-full"
                    />
                  </div>
                </Card>

                <Card title="Suivi de l'inscription">
                  <Timeline
                    value={timelineEvents}
                    align="left"
                    className="customized-timeline"
                    marker={(item) => (
                      <span 
                        className="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-lg"
                        style={{ backgroundColor: item.color }}
                      >
                        <i className={item.icon}></i>
                      </span>
                    )}
                    content={(item) => (
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{item.status}</div>
                        <div className="text-sm text-gray-600">{item.date}</div>
                      </div>
                    )}
                  />
                </Card>
              </div>
            </TabPanel>

            <TabPanel header="Historique">
              <Card>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Formation Excel Avancé</h4>
                      <p className="text-sm text-gray-600">Terminée le 20/01/2025</p>
                    </div>
                    <Tag value="Terminée" severity="success" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Voyage à Agadir</h4>
                      <p className="text-sm text-gray-600">Annulée le 15/12/2024</p>
                    </div>
                    <Tag value="Annulée" severity="danger" />
                  </div>
                </div>
              </Card>
            </TabPanel>
          </TabView>
        </div>
      </AppShell>
    </Guard>
  );
}