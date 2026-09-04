import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AthleteProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: AthleteProfile | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  quickDemoLogin: (role: 'ATHLETE' | 'COACH' | 'ADMIN') => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo Fallback Accounts for instant testing
const DEMO_USERS: Record<string, { user: User; profile: AthleteProfile }> = {
  ATHLETE: {
    user: {
      id: 'demo-athlete-1',
      email: 'athlete@sportstalent.ai',
      fullName: 'Rahul Sharma',
      role: 'ATHLETE',
      age: 17,
      gender: 'Male',
      location: 'Mumbai, MH',
      preferredSport: 'Cricket'
    },
    profile: {
      userId: 'demo-athlete-1',
      heightCm: 178,
      weightKg: 70,
      institution: 'National Cricket Academy',
      primaryPosition: 'Fast Bowling All-Rounder',
      bio: 'Aspiring national cricket player focusing on bowling speed and endurance.',
      overallScore: 84,
      performanceLevel: 'Advanced'
    }
  },
  COACH: {
    user: {
      id: 'demo-coach-1',
      email: 'coach@sportstalent.ai',
      fullName: 'Coach Vikram Dravid',
      role: 'COACH',
      age: 42,
      gender: 'Male',
      location: 'Delhi, India',
      preferredSport: 'Cricket'
    },
    profile: {
      userId: 'demo-coach-1',
      heightCm: 175,
      weightKg: 75,
      institution: 'State Sports Authority',
      primaryPosition: 'Head Scout',
      bio: 'Professional sports scout with 15+ years in youth talent discovery.',
      overallScore: 90,
      performanceLevel: 'Elite'
    }
  },
  ADMIN: {
    user: {
      id: 'demo-admin-1',
      email: 'admin@sportstalent.ai',
      fullName: 'Platform Admin',
      role: 'ADMIN',
      age: 35,
      gender: 'Male',
      location: 'National HQ',
      preferredSport: 'Athletics'
    },
    profile: {
      userId: 'demo-admin-1',
      heightCm: 180,
      weightKg: 78,
      institution: 'SportsTalent AI HQ',
      primaryPosition: 'System Director',
      bio: 'Managing platform governance and national scouting pipelines.',
      overallScore: 95,
      performanceLevel: 'Elite'
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('st_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      if (token) {
        if (token.startsWith('demo-token-')) {
          const roleKey = token.replace('demo-token-', '').toUpperCase();
          const demoObj = DEMO_USERS[roleKey] || DEMO_USERS.ATHLETE;
          setUser(demoObj.user);
          setProfile(demoObj.profile);
        } else {
          const res = await api.getMe();
          setUser(res.user);
          setProfile(res.profile);
        }
      } else {
        // Default to Demo Athlete if no token set initially for smooth exploration
        const demo = DEMO_USERS.ATHLETE;
        setUser(demo.user);
        setProfile(demo.profile);
        setToken('demo-token-athlete');
        localStorage.setItem('st_token', 'demo-token-athlete');
      }
    } catch (error) {
      console.warn('Auth fetch error, falling back to demo athlete');
      const demo = DEMO_USERS.ATHLETE;
      setUser(demo.user);
      setProfile(demo.profile);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('st_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('st_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const quickDemoLogin = async (role: 'ATHLETE' | 'COACH' | 'ADMIN') => {
    const demoToken = `demo-token-${role.toLowerCase()}`;
    localStorage.setItem('st_token', demoToken);
    setToken(demoToken);
    const demo = DEMO_USERS[role];
    setUser(demo.user);
    setProfile(demo.profile);
  };

  const refreshProfile = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        login,
        logout,
        quickDemoLogin,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
