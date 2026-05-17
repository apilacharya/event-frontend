import { Chip } from '@mui/material';

interface TagChipProps {
  label: string;
}

export default function TagChip({ label }: TagChipProps) {
  return <Chip label={label} variant="outlined" color="primary" size="small" />;
}
