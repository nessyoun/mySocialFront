import { User, Activite, RegleEligibilite } from './types';
import dayjs from 'dayjs';

// Centralized eligibility rules
export class EligibilityRules {
  static checkCategorieEligibility(user: User, activite: Activite): boolean {
    if (activite.beneficiairesCategorie.length === 0) return true;
    return activite.beneficiairesCategorie.includes(user.categorieCollaborateur);
  }

  static checkAncienneteEligibility(user: User, regle: RegleEligibilite): boolean {
    if (regle.type !== 'anciennete') return true;
    
    // Calculate anciennete based on user creation date (mock)
    const anciennete = dayjs().diff(dayjs(user.createdAt), 'year');
    return anciennete >= regle.valeur;
  }

  static checkFamilleEligibility(user: User, regle: RegleEligibilite): boolean {
    if (regle.type !== 'famille') return true;
    
    switch (regle.condition) {
      case 'single':
        return user.familleCharge.length === 0;
      case 'couple':
        return user.familleCharge.some(f => f.relation === 'conjoint');
      case 'famille':
        return user.familleCharge.length > 0;
      default:
        return true;
    }
  }

  static checkQuotaEligibility(user: User, activite: Activite): boolean {
    // TODO(api): Check against real quota usage from backend
    return true;
  }

  static checkDateEligibility(activite: Activite): boolean {
    const now = dayjs();
    const debut = dayjs(activite.dateInscriptionDebut);
    const fin = dayjs(activite.dateInscriptionFin);
    
    return now.isAfter(debut) && now.isBefore(fin);
  }

  static checkAllRules(user: User, activite: Activite): {
    eligible: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (!this.checkCategorieEligibility(user, activite)) {
      reasons.push('Catégorie de collaborateur non éligible');
    }

    if (!this.checkDateEligibility(activite)) {
      reasons.push('Période d\'inscription fermée');
    }

    for (const regle of activite.reglesEligibilite) {
      switch (regle.type) {
        case 'anciennete':
          if (!this.checkAncienneteEligibility(user, regle)) {
            reasons.push(`Ancienneté insuffisante (${regle.valeur} ans requis)`);
          }
          break;
        case 'famille':
          if (!this.checkFamilleEligibility(user, regle)) {
            reasons.push('Situation familiale non éligible');
          }
          break;
        case 'quota':
          if (!this.checkQuotaEligibility(user, activite)) {
            reasons.push('Quota dépassé');
          }
          break;
      }
    }

    return {
      eligible: reasons.length === 0,
      reasons
    };
  }

  // Ranking logic for recreatives
  static calculateRanking(inscriptions: Array<{
    userId: string;
    points: number;
    anciennete: number;
    dateInscription: string;
  }>): Array<{ userId: string; rank: number; points: number; anciennete: number }> {
    return inscriptions
      .sort((a, b) => {
        // First by points (descending)
        if (a.points !== b.points) {
          return b.points - a.points;
        }
        // Then by anciennete (descending)
        if (a.anciennete !== b.anciennete) {
          return b.anciennete - a.anciennete;
        }
        // Finally by inscription date (ascending - first come first served)
        return dayjs(a.dateInscription).diff(dayjs(b.dateInscription));
      })
      .map((inscription, index) => ({
        userId: inscription.userId,
        rank: index + 1,
        points: inscription.points,
        anciennete: inscription.anciennete
      }));
  }
}

// Capacity management
export class CapacityManager {
  static checkCapacity(activiteId: string, currentInscriptions: number, maxCapacity: number): {
    available: boolean;
    remaining: number;
  } {
    const remaining = maxCapacity - currentInscriptions;
    return {
      available: remaining > 0,
      remaining: Math.max(0, remaining)
    };
  }

  static canWithdraw(dateInscription: string, withdrawalDeadlineHours: number = 48): boolean {
    const inscriptionDate = dayjs(dateInscription);
    const deadline = inscriptionDate.add(withdrawalDeadlineHours, 'hour');
    return dayjs().isBefore(deadline);
  }
}