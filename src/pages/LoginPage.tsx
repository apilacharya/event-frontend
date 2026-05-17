import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../components/common/ToastProvider';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { LoginFormValues, loginSchema } from '../schemas/auth.schema';
import { getApiErrorMessage } from '../utils/apiError';

export default function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated, isCheckingAuth, loginMutation } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <PageWrapper>
      <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
        <Stack spacing={3}>
          <Typography variant="h4">Welcome back</Typography>
          <Typography color="text.secondary">Login to create and manage events.</Typography>

          <form
            className="grid gap-4"
            onSubmit={handleSubmit((data) =>
              loginMutation.mutate(data, {
                onSuccess: () => {
                  showToast('Logged in successfully.', 'success');
                  navigate('/');
                },
                onError: (error) => {
                  showToast(getApiErrorMessage(error, 'Login failed.'), 'error');
                },
              }),
            )}
          >
            <TextField
              label="Email"
              type="email"
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              {...register('password')}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
            <Button type="submit" variant="contained" color="primary" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <Typography variant="body2">
            Don&apos;t have an account? <RouterLink to="/signup">Sign up</RouterLink>
          </Typography>
        </Stack>

      </div>
    </PageWrapper>
  );
}
