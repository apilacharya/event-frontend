import { AppBar, Avatar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useToast } from '../common/ToastProvider';
import { useAuth } from '../../hooks/useAuth';
import { getApiErrorMessage } from '../../utils/apiError';

export default function Navbar() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, isAuthenticated, logoutMutation } = useAuth();

  const onLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        showToast('Logged out successfully.', 'success');
        navigate('/');
      },
      onError: (error) => {
        showToast(getApiErrorMessage(error, 'Logout failed.'), 'error');
      },
    });
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar className="mx-auto flex w-full max-w-6xl justify-between">
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          color="primary"
          sx={{ textDecoration: 'none' }}
        >
          Event Planner
        </Typography>

        <Box className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Box className="flex items-center gap-2">
                <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 14 }}>
                  {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                </Avatar>
                <Typography variant="body2">{user?.name}</Typography>
              </Box>
              <Button component={RouterLink} to="/events/new" variant="contained" color="primary">
                Create Event
              </Button>
              <Button variant="text" color="primary" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={RouterLink} to="/login" variant="outlined" color="primary">
                Login
              </Button>
              <Button component={RouterLink} to="/signup" variant="contained" color="primary">
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
