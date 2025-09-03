"use client";

import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import SideMenu from '../../shared/nav-menu/SideMenu';
import { ActiveMenu } from '../../shared/nav-menu/activeMenu';
import Guard from '@/components/auth/Guard';

interface EquipeTournoi {
  id: string;
  nom: string;
  capitaine: string;
  matriculeCapitaine: string;
  nombreJoueurs: number;
  poste: string;
  statut: 'inscrite' | 'validee' | 'rejetee';
  listeSignee?: string; // URL du fichier
}

interface TournoiMatch {
  id: string;
  equipe1: string;
  equipe2: string;
  date: string;
  heure: string;
  terrain: string;
  score?: string;
  statut: 'programme' | 'en_cours' | 'termine';
}

const mockPostes = [
  { label: 'Khouribga', value: 'khouribga' },
  { label: 'Casablanca', value: 'casablanca' },
  { label: 'Rabat', value: 'rabat' },
  { label: 'Marrakech', value: 'marrakech' },
  { label: 'Agadir', value: 'agadir' },
  { label: 'Fès', value: 'fes' }
];

const mockEquipes: EquipeTournoi[] = [
  {
    id: '1',
    nom: 'Les Lions de Khouribga',
    capitaine: 'Youness AIT HADDOU',
    matriculeCapitaine: 'H9984',
    nombreJoueurs: 11,
    poste: 'Khouribga',
    statut: 'validee',
    listeSignee: '/uploads/liste-lions.pdf'
  },
  {
    id: '2',
    nom: 'Eagles Casa',
    capitaine: 'Omar EL MANSOURI',
    matriculeCapitaine: 'H4521',
    nombreJoueurs: 9,
    poste: 'Casablanca',
    statut: 'inscrite'
  }
];

const mockMatches: TournoiMatch[] = [
  {
    id: '1',
    equipe1: 'Les Lions de Khouribga',
    equipe2: 'Eagles Casa',
    date: '2025-03-25',
    heure: '16:00',
    terrain: 'Terrain Central Khouribga',
    statut: 'programme'
  },
  {
    id: '2',
    equipe1: 'Atlas Rabat',
    equipe2: 'Sharks Agadir',
    date: '2025-03-26',
    heure: '17:00',
    terrain: 'Complexe Sportif Rabat',
    statut: 'programme'
  }
];

export default function TournoisRamadanPage() {
  const [equipes, setEquipes] = useState<EquipeTournoi[]>([]);
  const [matches, setMatches] = useState<TournoiMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEquipeDialog, setShowEquipeDialog] = useState(false);
  const [newEquipe, setNewEquipe] = useState<{
    nom: string;
    poste: string;
    nombreJoueurs: number;
  }>({
    nom: '',
    poste: '',
    nombreJoueurs: 11
  });
  const toast = useRef<Toast>(null);

  useEffect(() => {
    // TODO(api): Fetch tournament teams and matches
    setTimeout(() => {
      setEquipes(mockEquipes);
      setMatches(mockMatches);
      setLoading(false);
    }, 500);
  }, []);

  const statutEquipeBodyTemplate = (rowData: EquipeTournoi) => {
    const severityMap = {
      'inscrite': 'warning',
      'validee': 'success',
      'rejetee': 'danger'
    } as const;

    const labelMap = {
      'inscrite': 'Inscrite',
      'validee': 'Validée',
      'rejetee': 'Rejetée'
    };

    return <Tag value={labelMap[rowData.statut]} severity={severityMap[rowData.statut]} />;
  };

  const joueurBodyTemplate = (rowData: EquipeTournoi) => {
    const isComplete = rowData.nombreJoueurs >= 11;
    return (
      <div className="flex items-center gap-2">
        <span className={`font-medium ${isComplete ? 'text-green-600' : 'text-orange-600'}`}>
          {rowData.nombreJoueurs}/11
        </span>
        {isComplete && <i className="pi pi-check-circle text-green-500"></i>}
      </div>
    );
  };

  const listeBodyTemplate = (rowData: EquipeTournoi) => {
    return rowData.listeSignee ? (
      <Button
        icon="pi pi-file-pdf"
        rounded
        outlined
        severity="success"
        tooltip="Liste signée uploadée"
        onClick={() => window.open(rowData.listeSignee, '_blank')}
      />
    ) : (
      <Tag value="Manquante" severity="warning" />
    );
  };

  const statutMatchBodyTemplate = (rowData: TournoiMatch) => {
    const severityMap = {
      'programme': 'info',
      'en_cours': 'warning',
      'termine': 'success'
    } as const;

    const labelMap = {
      'programme': 'Programmé',
      'en_cours': 'En cours',
      'termine': 'Terminé'
    };

    return <Tag value={labelMap[rowData.statut]} severity={severityMap[rowData.statut]} />;
  };

  const equipesColumns = [
    {
      field: 'nom',
      header: 'Nom équipe',
      sortable: true,
      style: { minWidth: '180px' }
    },
    {
      field: 'capitaine',
      header: 'Capitaine',
      sortable: true,
      style: { width: '150px' }
    },
    {
      field: 'poste',
      header: 'Poste',
      sortable: true,
      style: { width: '120px' }
    },
    {
      field: 'nombreJoueurs',
      header: 'Joueurs',
      body: joueurBodyTemplate,
      style: { width: '100px' }
    },
    {
      field: 'listeSignee',
      header: 'Liste signée',
      body: listeBodyTemplate,
      style: { width: '120px' }
    },
    {
      field: 'statut',
      header: 'Statut',
      body: statutEquipeBodyTemplate,
      sortable: true,
      style: { width: '120px' }
    }
  ];

  const matchesColumns = [
    {
      field: 'equipe1',
      header: 'Équipe 1',
      sortable: true,
      style: { width: '150px' }
    },
    {
      field: 'equipe2',
      header: 'Équipe 2',
      sortable: true,
      style: { width: '150px' }
    },
    {
      field: 'date',
      header: 'Date',
      sortable: true,
      style: { width: '120px' },
      body: (rowData: TournoiMatch) => dayjs(rowData.date).format('DD/MM/YYYY')
    },
    {
      field: 'heure',
      header: 'Heure',
      style: { width: '80px' }
    },
    {
      field: 'terrain',
      header: 'Terrain',
      style: { minWidth: '180px' }
    },
    {
      field: 'score',
      header: 'Score',
      style: { width: '100px' },
      body: (rowData: TournoiMatch) => rowData.score || '-'
    },
    {
      field: 'statut',
      header: 'Statut',
      body: statutMatchBodyTemplate,
      sortable: true,
      style: { width: '120px' }
    }
  ];

  const handleNewEquipe = () => {
    setNewEquipe({
      nom: '',
      poste: '',
      nombreJoueurs: 11
    });
    setShowEquipeDialog(true);
  };

  const handleSubmitEquipe = () => {
    // TODO(api): Submit new team
    console.log('New team:', newEquipe);
    toast.current?.show({
      severity: 'success',
      summary: 'Équipe créée',
      detail: 'Votre équipe a été inscrite au tournoi',
      life: 3000
    });
    setShowEquipeDialog(false);
  };

  const handleUploadListe = (equipeId: string, file: File) => {
    // TODO(api): Upload signed team list
    console.log('Upload liste for team:', equipeId, file);
    toast.current?.show({
      severity: 'success',
      summary: 'Liste uploadée',
      detail: 'La liste signée a été enregistrée',
      life: 3000
    });
  };

  return (
    <SideMenu activeMenu={ActiveMenu.Activities}>
      <Toast ref={toast} />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Module Tournois Ramadan</h1>
            <p className="text-gray-600">Tournoi de football inter-postes pendant Ramadan</p>
          </div>
          <Button
            label="Inscrire une équipe"
            icon="pi pi-plus"
            onClick={handleNewEquipe}
          />
        </div>

        <TabView>
          <TabPanel header="Équipes inscrites">
            <DataTable
              value={equipes}
              loading={loading}
              paginator
              rows={10}
              showGridlines
              stripedRows
              className="p-datatable-sm"
              header={
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Liste des équipes</h3>
                  <div className="text-sm text-gray-600">
                    Limite: 2 équipes par poste • Min 11 joueurs • Max 16 joueurs
                  </div>
                </div>
              }
            >
              {equipesColumns.map((col) => (
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
                body={(rowData: EquipeTournoi) => (
                  <div className="flex gap-2">
                    <Button
                      icon="pi pi-eye"
                      rounded
                      outlined
                      tooltip="Voir équipe"
                      onClick={() => console.log('View team:', rowData.id)}
                    />
                    {!rowData.listeSignee && rowData.statut === 'inscrite' && (
                      <FileUpload
                        mode="basic"
                        name="listeSignee"
                        accept=".pdf,.jpg,.png"
                        maxFileSize={5000000}
                        chooseLabel="Upload liste"
                        className="p-button-sm"
                        customUpload
                        uploadHandler={(event) => handleUploadListe(rowData.id, event.files[0])}
                      />
                    )}
                  </div>
                )}
                style={{ width: '180px' }}
              />
            </DataTable>
          </TabPanel>

          <TabPanel header="Planning des matchs">
            <DataTable
              value={matches}
              loading={loading}
              paginator
              rows={10}
              showGridlines
              stripedRows
              className="p-datatable-sm"
              header={
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Calendrier des matchs</h3>
                  <Guard role="back-office">
                    <Button
                      label="Programmer match"
                      icon="pi pi-calendar-plus"
                      outlined
                      onClick={() => console.log('Schedule new match')}
                    />
                  </Guard>
                </div>
              }
            >
              {matchesColumns.map((col) => (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  sortable={col.sortable}
                  style={col.style}
                />
              ))}
              <Guard role="back-office">
                <Column
                  header="Actions"
                  body={(rowData: TournoiMatch) => (
                    <div className="flex gap-2">
                      <Button
                        icon="pi pi-pencil"
                        rounded
                        outlined
                        tooltip="Modifier"
                        onClick={() => console.log('Edit match:', rowData.id)}
                      />
                      {rowData.statut === 'termine' && (
                        <Button
                          icon="pi pi-file"
                          rounded
                          outlined
                          severity="success"
                          tooltip="Rapport de match"
                          onClick={() => console.log('Match report:', rowData.id)}
                        />
                      )}
                    </div>
                  )}
                  style={{ width: '120px' }}
                />
              </Guard>
            </DataTable>
          </TabPanel>

          <TabPanel header="Classement">
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Classement du tournoi</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <i className="pi pi-trophy text-4xl text-yellow-500 mb-2"></i>
                    <div className="text-xl font-bold text-yellow-700">1ère place</div>
                    <div className="text-lg font-semibold">Les Lions de Khouribga</div>
                    <div className="text-sm text-yellow-600">9 points • +5 goal average</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <i className="pi pi-trophy text-4xl text-gray-400 mb-2"></i>
                    <div className="text-xl font-bold text-gray-600">2ème place</div>
                    <div className="text-lg font-semibold">Atlas Rabat</div>
                    <div className="text-sm text-gray-500">6 points • +2 goal average</div>
                  </div>
                  
                  <div className="text-center p-6 bg-orange-50 rounded-lg border-2 border-orange-200">
                    <i className="pi pi-trophy text-4xl text-orange-500 mb-2"></i>
                    <div className="text-xl font-bold text-orange-700">3ème place</div>
                    <div className="text-lg font-semibold">Eagles Casa</div>
                    <div className="text-sm text-orange-600">4 points • 0 goal average</div>
                  </div>
                </div>

                <DataTable
                  value={[
                    { position: 1, equipe: 'Les Lions de Khouribga', matchs: 3, victoires: 3, nuls: 0, defaites: 0, points: 9, goalAverage: '+5' },
                    { position: 2, equipe: 'Atlas Rabat', matchs: 3, victoires: 2, nuls: 0, defaites: 1, points: 6, goalAverage: '+2' },
                    { position: 3, equipe: 'Eagles Casa', matchs: 3, victoires: 1, nuls: 1, defaites: 1, points: 4, goalAverage: '0' },
                    { position: 4, equipe: 'Sharks Agadir', matchs: 3, victoires: 0, nuls: 1, defaites: 2, points: 1, goalAverage: '-7' }
                  ]}
                  showGridlines
                  stripedRows
                  className="p-datatable-sm"
                >
                  <Column field="position" header="Pos" style={{ width: '60px' }} />
                  <Column field="equipe" header="Équipe" />
                  <Column field="matchs" header="J" style={{ width: '50px' }} />
                  <Column field="victoires" header="V" style={{ width: '50px' }} />
                  <Column field="nuls" header="N" style={{ width: '50px' }} />
                  <Column field="defaites" header="D" style={{ width: '50px' }} />
                  <Column field="points" header="Pts" style={{ width: '60px' }} />
                  <Column field="goalAverage" header="Diff" style={{ width: '70px' }} />
                </DataTable>
              </div>
            </Card>
          </TabPanel>
        </TabView>
      </div>

      {/* Équipe Dialog */}
      <Dialog
        header="Inscrire une nouvelle équipe"
        visible={showEquipeDialog}
        onHide={() => setShowEquipeDialog(false)}
        style={{ width: '600px' }}
        modal
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'équipe <span className="text-red-500">*</span>
            </label>
            <InputText
              value={newEquipe.nom}
              onChange={(e) => setNewEquipe(prev => ({ ...prev, nom: e.target.value }))}
              placeholder="Nom de votre équipe"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poste <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={newEquipe.poste}
              options={mockPostes}
              onChange={(e) => setNewEquipe(prev => ({ ...prev, poste: e.value }))}
              placeholder="Sélectionner votre poste"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Liste des joueurs signée <span className="text-red-500">*</span>
            </label>
            <FileUpload
              name="listeJoueurs"
              accept=".pdf,.jpg,.png"
              maxFileSize={5000000}
              emptyTemplate={
                <p className="text-center text-gray-500">
                  Glissez-déposez la liste signée des joueurs (PDF recommandé)
                </p>
              }
              customUpload
              uploadHandler={(event) => {
                console.log('Upload team list:', event.files[0]);
                toast.current?.show({
                  severity: 'success',
                  summary: 'Fichier uploadé',
                  detail: 'La liste des joueurs a été enregistrée',
                  life: 3000
                });
              }}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <i className="pi pi-info-circle text-blue-500"></i>
              <span className="font-medium text-blue-800">Règles du tournoi</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Maximum 2 équipes par poste</li>
              <li>• Minimum 11 joueurs, maximum 16 joueurs par équipe</li>
              <li>• Liste des joueurs signée obligatoire</li>
              <li>• Tous les joueurs doivent être collaborateurs OCP</li>
              <li>• Le capitaine doit être le responsable de l'équipe</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              label="Annuler"
              outlined
              onClick={() => setShowEquipeDialog(false)}
            />
            <Button
              label="Inscrire l'équipe"
              icon="pi pi-check"
              onClick={handleSubmitEquipe}
              disabled={!newEquipe.nom || !newEquipe.poste}
            />
          </div>
        </div>
      </Dialog>
    </SideMenu>
  );
}