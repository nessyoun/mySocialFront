import { User, Activite, Inscription, DashboardKPI } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    matriculeRcar: 'H9984',
    role: 'collaborateur',
    categorieCollaborateur: 'HC',
    firstName: 'Youness',
    lastName: 'AIT HADDOU',
    email: 'youness.aithaddou@ocpgroup.ma',
    familleCharge: [
      {
        id: '1-1',
        nom: 'AIT HADDOU',
        prenom: 'Salma',
        relation: 'conjoint',
        dateNaissance: '1995-05-15'
      }
    ],
    active: true,
    createdAt: '2020-01-15T00:00:00Z'
  },
  {
    id: '2',
    matriculeRcar: 'H4521',
    role: 'delegue',
    categorieCollaborateur: 'TAMCA',
    firstName: 'Omar',
    lastName: 'EL MANSOURI',
    email: 'omar.elmansouri@ocpgroup.ma',
    familleCharge: [],
    active: true,
    createdAt: '2019-03-12T00:00:00Z'
  },
  {
    id: '3',
    matriculeRcar: 'H7643',
    role: 'admin',
    categorieCollaborateur: 'OE',
    firstName: 'Sara',
    lastName: 'BENALI',
    email: 'sara.benali@ocpgroup.ma',
    familleCharge: [
      {
        id: '3-1',
        nom: 'BENALI',
        prenom: 'Aya',
        relation: 'enfant',
        dateNaissance: '2010-02-11'
      }
    ],
    active: true,
    createdAt: '2018-06-01T00:00:00Z'
  }
];

export const mockActivites: Activite[] = [
  {
    id: '1',
    module: 'recreatives',
    type: 'voyage',
    titre: 'Voyage à Marrakech',
    description: 'Voyage organisé de 3 jours à Marrakech avec visite des monuments historiques',
    dateDebut: '2025-03-15T00:00:00Z',
    dateFin: '2025-03-17T23:59:59Z',
    dateInscriptionDebut: '2025-02-01T00:00:00Z',
    dateInscriptionFin: '2025-02-28T23:59:59Z',
    capacite: 50,
    beneficiairesCategorie: ['HC', 'TAMCA', 'OE'],
    reglesEligibilite: [
      {
        type: 'anciennete',
        condition: 'minimum',
        valeur: 2
      }
    ],
    paiementRequis: true,
    montant: 1500,
    statut: 'publiee',
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: '2',
    module: 'billetterie',
    type: 'spectacle',
    titre: 'Concert de musique andalouse',
    description: 'Soirée musicale avec l\'orchestre national',
    dateDebut: '2025-04-20T20:00:00Z',
    dateFin: '2025-04-20T23:00:00Z',
    dateInscriptionDebut: '2025-03-01T00:00:00Z',
    dateInscriptionFin: '2025-04-15T23:59:59Z',
    capacite: 200,
    beneficiairesCategorie: ['HC', 'TAMCA', 'OE', 'CDI'],
    reglesEligibilite: [
      {
        type: 'quota',
        condition: 'famille_max',
        valeur: 4
      }
    ],
    paiementRequis: false,
    statut: 'publiee',
    createdAt: '2025-01-20T00:00:00Z'
  },
  {
    id: '3',
    module: 'bourse-fond',
    type: 'aide',
    titre: 'Bourse d\'études supérieures',
    description: 'Aide financière pour les études supérieures des enfants',
    dateDebut: '2025-09-01T00:00:00Z',
    dateFin: '2026-06-30T23:59:59Z',
    dateInscriptionDebut: '2025-02-01T00:00:00Z',
    dateInscriptionFin: '2025-05-31T23:59:59Z',
    capacite: 100,
    beneficiairesCategorie: ['HC', 'TAMCA', 'OE'],
    reglesEligibilite: [
      {
        type: 'famille',
        condition: 'enfant_etudiant',
        valeur: true
      }
    ],
    paiementRequis: false,
    statut: 'publiee',
    createdAt: '2025-01-10T00:00:00Z'
  }
];

export const mockInscriptions: Inscription[] = [
  {
    id: '1',
    activiteId: '1',
    userId: '1',
    statut: 'confirmee',
    points: 85,
    anciennete: 5,
    dateInscription: '2025-02-05T10:30:00Z',
    piecesJointes: [],
    paiement: {
      id: '1',
      inscriptionId: '1',
      statut: 'paye',
      montant: 1500,
      preuveUrl: '/uploads/paiement-1.pdf',
      dateCreation: '2025-02-05T10:30:00Z',
      datePaiement: '2025-02-06T14:20:00Z'
    }
  },
  {
    id: '2',
    activiteId: '2',
    userId: '2',
    statut: 'en_attente',
    points: 70,
    anciennete: 6,
    dateInscription: '2025-03-02T09:15:00Z',
    piecesJointes: []
  }
];

export const mockDashboardKPI: DashboardKPI = {
  totalDemandes: 1247,
  demandesEnAttente: 89,
  budgetTotal: 2500000,
  budgetUtilise: 1850000,
  activitesActives: 15,
  utilisateursActifs: 3420
};