import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading: isCheckingAuth } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    retry: false,
  });

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data, setUser]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (result) => setUser(result.user),
  });

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (result) => setUser(result.user),
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearUser();
      queryClient.clear();
    },
  });

  return {
    user,
    isAuthenticated,
    isCheckingAuth,
    loginMutation,
    signupMutation,
    logoutMutation,
  };
}
