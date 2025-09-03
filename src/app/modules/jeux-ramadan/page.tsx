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
import { Chart } from 'primereact/chart';
import SideMenu from '../../shared/nav-menu/SideMenu';
import { ActiveMenu } from '../../shared/nav-menu/activeMenu';
import dayjs from 'dayjs';

interface JeuRamadan {
  id: string;
  nom: string;
  categorie: 'individuel' | 'equipe' | 'famille';
  description: string;
  dateDebut: string;
  dateFin: string;
  participants: number;
  maxParticipants: number;
  prix: string[];
  statut: 'ouvert' | 'en_cours' | 'termine';
}

interface ParticipationRamadan {
  id: string;
  jeuId: string;
  jeuNom: string;
  categorie: string;
  dateInscription: string;
  statut: 'inscrit' | 'qualifie' | 'elimine' | 'gagnant';
  position?: number;
}

const mockJeuxRamadan: JeuRamadan[] = [
  {
    id: '1',
    nom: 'Concours de récitation du Coran',
    categorie: 'individuel',
    description: 'Concours de mémorisation et récitation du Saint Coran',
    dateDebut: '2025-03-10',
    dateFin: '2025-04-08',
    participants: 45,
    maxParticipants: 100,
    prix: ['1er: 5000 MAD', '2ème: 3000 MAD', '3ème: 2000 MAD'],
    statut: 'ouvert'
  },
  {
    id: '2',
    nom: 'Tournoi de football',
    categorie: 'equipe',
    description: 'Tournoi de football entre équipes OCP',
    dateDebut: '2025-03-15',
    dateFin: '2025-04-05',
    participants: 8,
    maxParticipants: 16,
    prix: ['1ère équipe: 20000 MAD', '2ème équipe: 12000 MAD'],
    statut: 'ouvert'
  },
  {
    id: '3',
    nom: 'Quiz culture islamique',
    categorie: 'famille',
    description: 'Quiz en famille sur la culture et l\'histoire islamique',
    dateDebut: '2025-03-20',
    dateFin: '2025-04-10',
    participants: 25,
    maxParticipants: 50,
    prix: ['1ère famille: 8000 MAD', '2ème famille: 5000 MAD', '3ème famille: 3000 MAD'],
    statut: 'ouvert'
  }
];

const mockParticipations: ParticipationRamadan[] = [
  {
    id: '1',
    jeuId: '1',
    jeuNom: 'Concours de récitation du Coran',
    categorie: 'individuel',
    dateInscription: '2025-02-15',
    statut: 'inscrit'
  },
  {
    id: '2',
    jeuId: '3',
    jeuNom: 'Quiz culture islamique',
    categorie: 'famille',
    dateInscription: '2025-02-18',
    statut: 'inscrit'
  }
];

export default function JeuxRamadanPage() {
  const [jeux, setJeux] = useState<JeuRamadan[]>([]);
  const [participations, setParticipations] = useState<ParticipationRamadan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInscriptionDialog, setShowInscriptionDialog] = useState(false);
  const [selectedJeu, setSelectedJeu] = useState<JeuRamadan | null>(null);
  const [selectedCategorie, setSelectedCategorie] = useState<string>('');

  useEffect(() => {
    // TODO(api): Fetch Ramadan games and participations
    setTimeout(() => {
      let filtered = [...mockJeuxRamadan];
      
      if (selectedCategorie) {
        filtered = filtered.filter(j => j.categorie === selectedCategorie);
      }
      
      setJeux(filtered);
      setParticipations(mockParticipations);
      setLoading(false);
    }, 500);
  }, [selectedCategorie]);

  const categorieOptions = [
    { label: 'Toutes les catégories', value: '' },
    { label: 'Individuel', value: 'individuel' },
    { label: 'Équipe', value: 'equipe' },
    { label: 'Famille', value: 'famille' }
  ];

  const statutJeuBodyTemplate = (rowData: JeuRamadan) => {
    const severityMap = {
      'ouvert': 'success',
      'en_cours': 'warning',
      'termine': 'secondary'
    } as const;

    const labelMap = {
      'ouvert': 'Ouvert',
      'en_cours': 'En cours',
      'termine': 'Terminé'
    };

    return <Tag value={labelMap[rowData.statut]} severity={severityMap[rowData.statut]} />;
  };

  const participantsBodyTemplate = (rowData: JeuRamadan) => {
    const percentage = (rowData.participants / rowData.maxParticipants) * 100;
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{rowData.participants}/{rowData.maxParticipants}</span>
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

  const statutParticipationBodyTemplate = (rowData: ParticipationRamadan) => {
    const severityMap = {
      'inscrit': 'info',
      'qualifie': 'success',
      'elimine': 'danger',
      'gagnant': 'warning'
    } as const;

    const labelMap = {
      'inscrit': 'Inscrit',
      'qualifie': 'Qualifié',
      'elimine': 'Éliminé',
      'gagnant': 'Gagnant'
    };

    return <Tag value={labelMap[rowData.statut]} severity={severityMap[rowData.statut]} />;
  };

  const jeuxColumns = [
    {
      field: 'nom',
      header: 'Jeu/Concours',
      sortable: true,
      style: { minWidth: '200px' }
    },
    {
      field: 'categorie',
      header: 'Catégorie',
      sortable: true,
      style: { width: '120px' },
      body: (rowData: JeuRamadan) => (
        <Tag value={rowData.categorie} severity="info" />
      )
    },
    {
      field: 'dateDebut',
      header: 'Début',
      sortable: true,
      style: { width: '120px' },
      body: (rowData: JeuRamadan) => dayjs(rowData.dateDebut).format('DD/MM/YYYY')
    },
    {
      field: 'dateFin',
      header: 'Fin',
      sortable: true,
      style: { width: '120px' },
      body: (rowData: JeuRamadan) => dayjs(rowData.dateFin).format('DD/MM/YYYY')
    },
    {
      field: 'participants',
      header: 'Participants',
      body: participantsBodyTemplate,
      style: { width: '150px' }
    },
    {
      field: 'statut',
      header: 'Statut',
      body: statutJeuBodyTemplate,
      sortable: true,
      style: { width: '120px' }
    }
  ];

  const participationsColumns = [
    {
      field: 'jeuNom',
      header: 'Jeu/Concours',
      sortable: true,
      style: { minWidth: '200px' }
    },
    {
      field: 'categorie',
      header: 'Catégorie',
      sortable: true,
      style: { width: '120px' }
    },
    {
      field: 'dateInscription',
      header: 'Date inscription',
      sortable: true,
      style: { width: '140px' },
      body: (rowData: ParticipationRamadan) => dayjs(rowData.dateInscription).format('DD/MM/YYYY')
    },
    {
      field: 'statut',
      header: 'Statut',
      body: statutParticipationBodyTemplate,
      sortable: true,
      style: { width: '120px' }
    }
  ];

  const handleInscription = (jeu: JeuRamadan) => {
    setSelectedJeu(jeu);
    setShowInscriptionDialog(true);
  };

  const handleSubmitInscription = () => {
    // TODO(api): Submit Ramadan game inscription
    console.log('New Ramadan game inscription:', selectedJeu?.id);
    setShowInscriptionDialog(false);
  };

  // Chart data for KPIs
  const chartData = {
    labels: ['Individuel', 'Équipe', 'Famille'],
    datasets: [
      {
        label: 'Participations',
        data: [45, 8, 25],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
        hoverBackgroundColor: ['#2563EB', '#059669', '#D97706']
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  };

  return (
    <SideMenu activeMenu={ActiveMenu.Activities}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Module Jeux Ramadan</h1>
          <p className="text-gray-600">Concours et jeux pendant le mois sacré de Ramadan</p>
        </div>

        <TabView>
          <TabPanel header="Jeux disponibles">
            <Card className="mb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filtrer par catégorie</h3>
                <Dropdown
                  value={selectedCategorie}
                  options={categorieOptions}
                  onChange={(e) => setSelectedCategorie(e.value)}
                  placeholder="Toutes les catégories"
                />
              </div>
            </Card>

            <DataTable
              value={jeux}
              loading={loading}
              paginator
              rows={10}
              showGridlines
              stripedRows
              className="p-datatable-sm"
            >
              {jeuxColumns.map((col) => (
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
                body={(rowData: JeuRamadan) => (
                  <div className="flex gap-2">
                    <Button
                      icon="pi pi-eye"
                      rounded
                      outlined
                      tooltip="Voir détails"
                      onClick={() => console.log('View game:', rowData.id)}
                    />
                    <Button
                      label="S'inscrire"
                      icon="pi pi-plus"
                      size="small"
                      disabled={rowData.statut !== 'ouvert' || rowData.participants >= rowData.maxParticipants}
                      onClick={() => handleInscription(rowData)}
                    />
                  </div>
                )}
                style={{ width: '150px' }}
              />
            </DataTable>
          </TabPanel>

          <TabPanel header="Mes participations">
            <DataTable
              value={participations}
              loading={loading}
              paginator
              rows={10}
              showGridlines
              stripedRows
              className="p-datatable-sm"
            >
              {participationsColumns.map((col) => (
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
                body={(rowData: ParticipationRamadan) => (
                  <div className="flex gap-2">
                    <Button
                      icon="pi pi-eye"
                      rounded
                      outlined
                      tooltip="Voir détails"
                      onClick={() => console.log('View participation:', rowData.id)}
                    />
                    {rowData.statut === 'gagnant' && (
                      <Button
                        icon="pi pi-trophy"
                        rounded
                        outlined
                        severity="warning"
                        tooltip="Certificat de prix"
                        onClick={() => console.log('Download certificate:', rowData.id)}
                      />
                    )}
                  </div>
                )}
                style={{ width: '120px' }}
              />
            </DataTable>
          </TabPanel>

          <TabPanel header="KPI & Statistiques">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Répartition par catégorie">
                <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full" />
              </Card>

              <Card title="Statistiques générales">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">78</div>
                      <div className="text-sm text-blue-800">Total participants</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-sm text-green-800">Jeux actifs</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">15</div>
                      <div className="text-sm text-orange-800">Gagnants</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">45,000</div>
                      <div className="text-sm text-purple-800">Prix total (MAD)</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card title="Classement par jeu" className="mt-6">
              <div className="space-y-4">
                {mockJeuxRamadan.map(jeu => (
                  <div key={jeu.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">{jeu.nom}</h4>
                      <Tag value={jeu.categorie} severity="info" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-3 bg-yellow-50 rounded">
                        <div className="font-bold text-yellow-600">1er</div>
                        <div className="text-yellow-800">En cours...</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="font-bold text-gray-600">2ème</div>
                        <div className="text-gray-800">En cours...</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded">
                        <div className="font-bold text-orange-600">3ème</div>
                        <div className="text-orange-800">En cours...</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabPanel>
        </TabView>
      </div>

      {/* Inscription Dialog */}
      <Dialog
        header="Inscription au jeu Ramadan"
        visible={showInscriptionDialog}
        onHide={() => setShowInscriptionDialog(false)}
        style={{ width: '600px' }}
        modal
      >
        {selectedJeu && (
          <div className="space-y-4">
            <Card>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{selectedJeu.nom}</h3>
                <p className="text-gray-700">{selectedJeu.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Catégorie:</span>
                    <div className="font-medium">{selectedJeu.categorie}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Période:</span>
                    <div className="font-medium">
                      {dayjs(selectedJeu.dateDebut).format('DD/MM')} - {dayjs(selectedJeu.dateFin).format('DD/MM/YYYY')}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Prix à gagner:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {selectedJeu.prix.map((prix, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <i className="pi pi-trophy"></i>
                        {prix}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <i className="pi pi-info-circle text-blue-500"></i>
                <span className="font-medium text-blue-800">Conditions de participation</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ouvert à tous les collaborateurs OCP et leurs familles</li>
                <li>• Inscription gratuite</li>
                <li>• Respect des règles du concours</li>
                {selectedJeu.categorie === 'famille' && (
                  <li>• Participation en famille (minimum 2 personnes)</li>
                )}
                {selectedJeu.categorie === 'equipe' && (
                  <li>• Équipe de 5 à 11 joueurs</li>
                )}
              </ul>
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