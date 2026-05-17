import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';

interface EventFiltersProps {
  tagsOptions: string[];
}

export default function EventFilters({ tagsOptions }: EventFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedType = searchParams.get('type') ?? '';
  const selectedTags = (searchParams.get('tags') ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tagsOptions.includes(tag));

  const selectedRange = (() => {
    const upcoming = searchParams.get('upcoming');
    if (upcoming === 'true') return 'upcoming';
    if (upcoming === 'false') {
      return 'past';
    }
    return 'all';
  })();

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const onTypeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setParam('type', value === '' ? null : value);
  };

  const onTagsChange = (_: unknown, values: string[]) => {
    const normalized = values
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
      .join(',');
    setParam('tags', normalized.length > 0 ? normalized : null);
  };

  const onRangeChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (!value) {
      return;
    }
    if (value === 'all') {
      setParam('upcoming', null);
      return;
    }
    if (value === 'upcoming') {
      setParam('upcoming', 'true');
      return;
    }
    setParam('upcoming', 'false');
  };

  return (
    <div className="grid grid-cols-1 gap-4 rounded-lg bg-white p-4 md:grid-cols-3">
      <FormControl fullWidth size="small">
        <InputLabel id="event-type-label">Type</InputLabel>
        <Select
          labelId="event-type-label"
          label="Type"
          value={selectedType}
          onChange={onTypeChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="PUBLIC">Public</MenuItem>
          <MenuItem value="PRIVATE">Private</MenuItem>
        </Select>
      </FormControl>

      <Autocomplete
        multiple
        options={tagsOptions}
        value={selectedTags}
        onChange={onTagsChange}
        renderInput={(params) => <TextField {...params} size="small" label="Tags" />}
      />

      <ToggleButtonGroup
        exclusive
        value={selectedRange}
        onChange={onRangeChange}
        size="small"
        color="primary"
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="upcoming">Upcoming</ToggleButton>
        <ToggleButton value="past">Past</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
