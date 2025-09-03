"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { TabView, TabPanel } from 'primereact/tabview';
import { Steps } from 'primereact/steps';
import { MenuItem } from 'primereact/menuitem';
import AppShell from '@/components/layout/AppShell';
import Guard from '@/components/auth/Guard';
import RankingView from '@/components/shared/RankingView';
import { Activite } from '@/lib/types';
import { mockActivites, mockInscriptions } from '@/lib/mock-data';
import { AuthService } from '@/lib/auth';
import { EligibilityRules } from '@/lib/rules';
import dayjs from 'dayjs';

export default function ActiviteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activite, setActivite] = useState<Activite | null>(null);
  const [loading, setLoading] = useState(true);
  const [inscriptionStep, setInscriptionStep] = useState(0);
  const user = AuthService.getCurrentUser();

  const activiteId = params.id as string;

  useEffect(() => {
    // TODO(api): Replace with real API call
    setTimeout(() => {
      const found = mockActivites.find(a => a.id === activiteId);
      setActivite(found || null);
      setLoading(false);
    }, 500);
  }, [activiteId]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppShell>
    );
  }

  if (!activite) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Activité non trouvée</h2>
          <Button
            label="Retour aux activités"
            icon="pi pi-arrow-left"
            onClick={() => router.push('/activites')}
            className="mt-4"
          />
        </div>
      </AppShell>
    );
  }

  const eligibilityCheck = user ? EligibilityRules.checkAllRules(user, activite) : { eligible: false, reasons: [] };

  const inscriptionSteps: MenuItem[] = [
    { label: 'Informations' },
    { label: 'Documents' },
    { label: 'Paiement' },
    { label: 'Confirmation' }
  ];

  // Mock ranking data
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
    }
  ];

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

  return (
    <Guard role="collaborateur">
      <AppShell>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <Button
                icon="pi pi-arrow-left"
                label="Retour"
                text
                onClick={() => router.push('/activites')}
                className="mb-2"
              />
              <h1 className="text-2xl font-bold text-gray-900">{activite.titre}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Tag value={moduleLabels[activite.module]} />
                <Tag value={activite.statut} severity={
                  activite.statut === 'publiee' ? 'success' : 
                  activite.statut === 'fermee' ? 'warning' : 'secondary'
                } />
              </div>
            </div>
            
            <Guard role="back-office">
              <Button
                label="Modifier"
                icon="pi pi-pencil"
                onClick={() => router.push(`/activites/${activite.id}/edit`)}
              />
            </Guard>
          </div>

          {/* Activity Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card title="Détails de l'activité">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700">{activite.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Date de début</h4>
                      <p className="text-gray-700">{dayjs(activite.dateDebut).format('DD/MM/YYYY HH:mm')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Date de fin</h4>
                      <p className="text-gray-700">{dayjs(activite.dateFin).format('DD/MM/YYYY HH:mm')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Inscriptions ouvertes</h4>
                      <p className="text-gray-700">
                        Du {dayjs(activite.dateInscriptionDebut).format('DD/MM/YYYY')} au {dayjs(activite.dateInscriptionFin).format('DD/MM/YYYY')}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Capacité</h4>
                      <p className="text-gray-700">{activite.capacite} places</p>
                    </div>
                  </div>

                  {activite.paiementRequis && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Montant</h4>
                      <p className="text-gray-700">{activite.montant} MAD</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div>
              <Card title="Inscription">
                {eligibilityCheck.eligible ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <i className="pi pi-check-circle text-4xl text-green-500 mb-2"></i>
                      <p className="text-green-700 font-medium">Vous êtes éligible</p>
                    </div>
                    
                    <Steps
                      model={inscriptionSteps}
                      activeIndex={inscriptionStep}
                      className="mb-4"
                    />
                    
                    <Button
                      label="Commencer l'inscription"
                      icon="pi pi-arrow-right"
                      className="w-full"
                      onClick={() => router.push(`/activites/${activite.id}/inscription`)}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <i className="pi pi-times-circle text-4xl text-red-500 mb-2"></i>
                      <p className="text-red-700 font-medium">Non éligible</p>
                    </div>
                    
                    <div className="space-y-2">
                      {eligibilityCheck.reasons.map((reason, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                          <i className="pi pi-exclamation-triangle"></i>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Tabs for additional information */}
          <TabView>
            <TabPanel header="Règles d'éligibilité">
              <div className="space-y-3">
                <h4 className="font-semibold">Catégories éligibles</h4>
                <div className="flex gap-2 flex-wrap">
                  {activite.beneficiairesCategorie.map(cat => (
                    <Tag key={cat} value={cat} />
                  ))}
                </div>
                
                <h4 className="font-semibold mt-4">Règles spécifiques</h4>
                <div className="space-y-2">
                  {activite.reglesEligibilite.map((regle, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <i className="pi pi-info-circle text-blue-500"></i>
                      <span>{regle.condition}: {regle.valeur}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabPanel>

            <TabPanel header="Classement" disabled={activite.module !== 'recreatives'}>
              <RankingView
                activiteId={activite.id}
                inscriptions={mockRankingData}
                capacite={activite.capacite}
                onExport={() => console.log('Export ranking')}
              />
            </TabPanel>

            <TabPanel header="Statistiques">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">42</div>
                  <div className="text-sm text-blue-800">Inscriptions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-green-800">Places restantes</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">15</div>
                  <div className="text-sm text-orange-800">Liste d'attente</div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </AppShell>
    </Guard>
  );
}