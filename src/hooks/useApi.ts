import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock API service
class ApiService {
  private static delay(ms: number = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Users
  static async getUsers() {
    await this.delay();
    // TODO(api): Replace with real endpoint
    return [];
  }

  static async createUser(userData: any) {
    await this.delay();
    // TODO(api): Replace with real endpoint
    return { id: Date.now().toString(), ...userData };
  }

  static async updateUser(id: string, userData: any) {
    await this.delay();
    // TODO(api): Replace with real endpoint
    return { id, ...userData };
  }

  static async deleteUser(id: string) {
    await this.delay();
    // TODO(api): Replace with real endpoint
    return { success: true };
  }

  // Activities
  static async getActivites() {
    await this.delay();
    // TODO(api): Replace with real endpoint
    return [];
  }

  static async getActivite(id: string) {
    await this.delay();
    // TODO(api): Replace with real endpoint
    return null;
  }

  static async createActivite(activiteData: any) {
    await this.delay();
    // TODO(api): Replace with real endpoint
    return { id: Date.now().toString(), ...activiteData };
  }

  // Inscriptions
  static async getInscriptions(userId?: string) {
    await this.delay();
    // TODO(api): Replace with real endpoint
    return [];
  }

  static async createInscription(inscriptionData: any) {
    await this.delay();
    // TODO(api): Replace with real endpoint
    return { id: Date.now().toString(), ...inscriptionData };
  }
}

// Custom hooks for API operations
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: ApiService.getUsers
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ApiService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      ApiService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ApiService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

export function useActivites() {
  return useQuery({
    queryKey: ['activites'],
    queryFn: ApiService.getActivites
  });
}

export function useActivite(id: string) {
  return useQuery({
    queryKey: ['activites', id],
    queryFn: () => ApiService.getActivite(id),
    enabled: !!id
  });
}

export function useCreateActivite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ApiService.createActivite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activites'] });
    }
  });
}

export function useInscriptions(userId?: string) {
  return useQuery({
    queryKey: ['inscriptions', userId],
    queryFn: () => ApiService.getInscriptions(userId)
  });
}

export function useCreateInscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ApiService.createInscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
    }
  });
}