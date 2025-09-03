import { User } from './types';

// Mock authentication service
export class AuthService {
  private static currentUser: User | null = null;

  static async login(email: string, password: string): Promise<User> {
    // TODO(api): Replace with real authentication
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    // Mock user based on email
    const mockUser: User = {
      id: '1',
      matriculeRcar: 'H9984',
      role: email.includes('admin') ? 'admin' : 'collaborateur',
      categorieCollaborateur: 'HC',
      firstName: 'Youness',
      lastName: 'AIT HADDOU',
      email,
      familleCharge: [],
      active: true,
      createdAt: '2020-01-15T00:00:00Z'
    };

    this.currentUser = mockUser;
    localStorage.setItem('auth-user', JSON.stringify(mockUser));
    return mockUser;
  }

  static async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('auth-user');
  }

  static getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('auth-user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    
    return null;
  }

  static hasRole(requiredRole: User['role']): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const roleHierarchy = {
      'admin': 5,
      'back-office': 4,
      'superviseur': 3,
      'delegue': 2,
      'collaborateur': 1
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }
}

// Role-based route protection
export const rolePermissions = {
  '/admin': ['admin'],
  '/admin/users': ['admin', 'back-office'],
  '/admin/roles': ['admin'],
  '/admin/activites': ['admin', 'back-office'],
  '/activites/create': ['admin', 'back-office'],
  '/dashboard': ['admin', 'back-office', 'superviseur'],
} as const;