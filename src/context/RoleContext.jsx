// src/contexts/RoleContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchUserRole = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) {
          if (mounted) {
            setUser(null);
            setRole(null);
            setLoading(false);
          }
          return;
        }

        // Fetch role from profiles
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, username')
          .eq('id', currentUser.id)
          .single();

        if (mounted) {
          setUser({ ...currentUser, username: profile?.username });
          setRole(profile?.role || 'user');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching role:', err);
        if (mounted) {
          setUser(null);
          setRole(null);
          setLoading(false);
        }
      }
    };

    fetchUserRole();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole();
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // ==================== HELPER METHODS ====================
  
  const canAddNotes = role === 'subs' || role === 'admin';
  const canManageContent = role === 'admin';
  const hasAccess = role === 'subs' || role === 'admin';
  const isGuest = !user;

  const value = {
    user,
    role,
    loading,
    // Role checks
    isUser: role === 'user',
    isSubs: role === 'subs',
    isAdmin: role === 'admin',
    // Feature access
    hasAccess,
    canAddNotes,
    canManageContent,
    isGuest,
    // Helper methods
    requiresUpgrade: role === 'user',
    requiresLogin: !user
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
}