import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { eventFormSchema, EventFormValues } from '../../schemas/event.schema';

interface EventFormProps {
  defaultValues?: EventFormValues;
  availableTags: string[];
  onSubmit: (data: EventFormValues) => void;
  isLoading: boolean;
  minDateTime?: string;
}

const defaultFormValues: EventFormValues = {
  title: '',
  description: '',
  dateTime: '',
  location: '',
  type: 'PUBLIC',
  tags: [],
};

export default function EventForm({
  defaultValues,
  availableTags,
  onSubmit,
  isLoading,
  minDateTime,
}: EventFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultValues ?? defaultFormValues,
  });

  return (
    <Box component="form" className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Title"
        {...register('title')}
        error={Boolean(errors.title)}
        helperText={errors.title?.message}
      />

      <TextField
        label="Description"
        multiline
        minRows={3}
        {...register('description')}
        error={Boolean(errors.description)}
        helperText={errors.description?.message}
      />

      <TextField
        label="Date and time"
        type="datetime-local"
        InputLabelProps={{ shrink: true }}
        inputProps={minDateTime ? { min: minDateTime } : undefined}
        {...register('dateTime')}
        error={Boolean(errors.dateTime)}
        helperText={errors.dateTime?.message}
      />

      <TextField
        label="Location"
        {...register('location')}
        error={Boolean(errors.location)}
        helperText={errors.location?.message}
      />

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={Boolean(errors.type)}>
            <InputLabel id="event-form-type-label">Type</InputLabel>
            <Select {...field} labelId="event-form-type-label" label="Type">
              <MenuItem value="PUBLIC">Public</MenuItem>
              <MenuItem value="PRIVATE">Private</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <Autocomplete
            multiple
            options={availableTags}
            value={field.value ?? []}
            onChange={(_, values) =>
              field.onChange(
                values.map((value) => value.trim().toLowerCase()).filter(Boolean),
              )
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                error={Boolean(errors.tags)}
                helperText={errors.tags?.message as string | undefined}
              />
            )}
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
      >
        {isLoading ? 'Saving...' : 'Save Event'}
      </Button>
    </Box>
  );
}
