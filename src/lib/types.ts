// Core data models
export interface User {
  id: string;
  matriculeRcar: string;
  role: 'admin' | 'back-office' | 'superviseur' | 'delegue' | 'collaborateur';
  categorieCollaborateur: 'OE' | 'TAMCA' | 'HC' | 'CDI' | 'CDD';
  firstName: string;
  lastName: string;
  email: string;
  familleCharge: FamilleCharge[];
  active: boolean;
  createdAt: string;
}

export interface FamilleCharge {
  id: string;
  nom: string;
  prenom: string;
  relation: 'conjoint' | 'enfant';
  dateNaissance: string;
}

export interface Activite {
  id: string;
  module: ModuleType;
  type: string;
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  dateInscriptionDebut: string;
  dateInscriptionFin: string;
  capacite: number;
  beneficiairesCategorie: string[];
  reglesEligibilite: RegleEligibilite[];
  paiementRequis: boolean;
  montant?: number;
  statut: 'brouillon' | 'publiee' | 'fermee' | 'annulee';
  createdAt: string;
}

export interface RegleEligibilite {
  type: 'categorie' | 'anciennete' | 'famille' | 'quota';
  condition: string;
  valeur: any;
}

export interface Inscription {
  id: string;
  activiteId: string;
  userId: string;
  statut: 'draft' | 'soumise' | 'confirmee' | 'en_attente' | 'annulee';
  points: number;
  anciennete: number;
  dateInscription: string;
  piecesJointes: PiecesJointes[];
  paiement?: Paiement;
}

export interface Groupe {
  id: string;
  nom: string;
  ets?: string;
  foyer?: string;
  terrain?: string;
  jour: string;
  capacite: number;
  reste: number;
  activiteId: string;
}

export interface Paiement {
  id: string;
  inscriptionId: string;
  statut: 'en_attente' | 'paye' | 'rembourse' | 'annule';
  montant: number;
  preuveUrl?: string;
  dateCreation: string;
  datePaiement?: string;
}

export interface PiecesJointes {
  id: string;
  inscriptionId: string;
  type: string;
  nom: string;
  url: string;
  taille: number;
  dateUpload: string;
}

export type ModuleType = 
  | 'recreatives'
  | 'bourse-fond'
  | 'billetterie'
  | 'badges'
  | 'foyers'
  | 'prix-eleves'
  | 'jeux-ramadan'
  | 'terrains'
  | 'tournois-ramadan';

export interface DashboardKPI {
  totalDemandes: number;
  demandesEnAttente: number;
  budgetTotal: number;
  budgetUtilise: number;
  activitesActives: number;
  utilisateursActifs: number;
}