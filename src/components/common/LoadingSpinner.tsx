import { Box, CircularProgress } from '@mui/material';

export default function LoadingSpinner() {
  return (
    <Box className="flex min-h-[40vh] items-center justify-center">
      <CircularProgress color="primary" />
    </Box>
  );
}
