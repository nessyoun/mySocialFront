import { describe, it, expect } from '@jest/globals';
import { EligibilityRules, CapacityManager } from '@/lib/rules';
import { User, Activite } from '@/lib/types';

describe('EligibilityRules', () => {
  const mockUser: User = {
    id: '1',
    matriculeRcar: 'H9984',
    role: 'collaborateur',
    categorieCollaborateur: 'HC',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@ocpgroup.ma',
    familleCharge: [
      {
        id: '1-1',
        nom: 'User',
        prenom: 'Spouse',
        relation: 'conjoint',
        dateNaissance: '1990-01-01'
      }
    ],
    active: true,
    createdAt: '2020-01-01T00:00:00Z'
  };

  const mockActivite: Activite = {
    id: '1',
    module: 'recreatives',
    type: 'voyage',
    titre: 'Test Activity',
    description: 'Test description',
    dateDebut: '2025-03-15T00:00:00Z',
    dateFin: '2025-03-17T23:59:59Z',
    dateInscriptionDebut: '2025-02-01T00:00:00Z',
    dateInscriptionFin: '2025-02-28T23:59:59Z',
    capacite: 50,
    beneficiairesCategorie: ['HC', 'TAMCA'],
    reglesEligibilite: [
      {
        type: 'anciennete',
        condition: 'minimum',
        valeur: 2
      }
    ],
    paiementRequis: false,
    statut: 'publiee',
    createdAt: '2025-01-01T00:00:00Z'
  };

  it('should check category eligibility correctly', () => {
    expect(EligibilityRules.checkCategorieEligibility(mockUser, mockActivite)).toBe(true);
    
    const restrictedActivity = {
      ...mockActivite,
      beneficiairesCategorie: ['OE']
    };
    expect(EligibilityRules.checkCategorieEligibility(mockUser, restrictedActivity)).toBe(false);
  });

  it('should check family eligibility correctly', () => {
    const coupleRule = {
      type: 'famille' as const,
      condition: 'couple',
      valeur: true
    };
    
    expect(EligibilityRules.checkFamilleEligibility(mockUser, coupleRule)).toBe(true);
    
    const singleRule = {
      type: 'famille' as const,
      condition: 'single',
      valeur: true
    };
    
    expect(EligibilityRules.checkFamilleEligibility(mockUser, singleRule)).toBe(false);
  });

  it('should calculate ranking correctly', () => {
    const inscriptions = [
      { userId: '1', points: 80, anciennete: 3, dateInscription: '2025-02-01T10:00:00Z' },
      { userId: '2', points: 90, anciennete: 2, dateInscription: '2025-02-01T11:00:00Z' },
      { userId: '3', points: 80, anciennete: 5, dateInscription: '2025-02-01T12:00:00Z' }
    ];

    const ranking = EligibilityRules.calculateRanking(inscriptions);
    
    expect(ranking[0].userId).toBe('2'); // Highest points
    expect(ranking[1].userId).toBe('3'); // Same points as user 1, but higher anciennete
    expect(ranking[2].userId).toBe('1'); // Lowest priority
  });
});

describe('CapacityManager', () => {
  it('should check capacity correctly', () => {
    const result = CapacityManager.checkCapacity('1', 45, 50);
    expect(result.available).toBe(true);
    expect(result.remaining).toBe(5);
    
    const fullResult = CapacityManager.checkCapacity('1', 50, 50);
    expect(fullResult.available).toBe(false);
    expect(fullResult.remaining).toBe(0);
  });

  it('should check withdrawal deadline correctly', () => {
    const recentInscription = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 24h ago
    expect(CapacityManager.canWithdraw(recentInscription)).toBe(true);
    
    const oldInscription = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(); // 72h ago
    expect(CapacityManager.canWithdraw(oldInscription)).toBe(false);
  });
});