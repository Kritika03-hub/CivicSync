import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string, role: string = 'citizen') => {
    // Mock authentication - in real app, this would call an API
    const mockUser: User = {
      id: role === 'admin' ? 'admin1' : '1',
      name: role === 'admin' ? 'Admin User' : 'Rahul Sharma',
      email,
      phone: '+91 9876543210',
      role: role as 'citizen' | 'admin',
      avatar: role === 'admin' ? undefined : 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      address: role === 'admin' ? 'Municipal Corporation Office' : 'Arera Colony, Bhopal',
      bio: role === 'admin' ? 'Municipal Administrator' : 'Active citizen committed to making Bhopal better',
      badgeCount: role === 'admin' ? 0 : 5,
      volunteerHours: role === 'admin' ? 0 : 24,
      createdAt: new Date('2024-01-15')
    };
    
    set({ user: mockUser, isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  register: async (userData: Partial<User>) => {
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone,
      role: 'citizen',
      avatar: userData.avatar,
      address: userData.address,
      bio: userData.bio,
      badgeCount: 0,
      volunteerHours: 0,
      createdAt: new Date()
    };
    
    set({ user: newUser, isAuthenticated: true });
  }
}));