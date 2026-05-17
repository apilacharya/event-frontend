import { Stack, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { eventsApi } from '../api/events.api';
import { useToast } from '../components/common/ToastProvider';
import EventForm from '../components/events/EventForm';
import PageWrapper from '../components/layout/PageWrapper';
import { predefinedEventTags } from '../constants/eventTags';
import { EventFormValues } from '../schemas/event.schema';
import { getApiErrorMessage } from '../utils/apiError';

function getStartOfTodayLocalDateTime(): string {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const offsetMs = startOfToday.getTimezoneOffset() * 60_000;
  return new Date(startOfToday.getTime() - offsetMs).toISOString().slice(0, 16);
}

export default function CreateEventPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: EventFormValues) => eventsApi.create(data),
    onSuccess: async (event) => {
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      showToast('Event created successfully.', 'success');
      navigate(`/events/${event.id}`);
    },
    onError: (error) => {
      showToast(getApiErrorMessage(error, 'Unable to create event.'), 'error');
    },
  });

  return (
    <PageWrapper>
      <Stack spacing={3}>
        <Typography variant="h4">Create Event</Typography>

        <EventForm
          availableTags={[...predefinedEventTags]}
          minDateTime={getStartOfTodayLocalDateTime()}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />
      </Stack>
    </PageWrapper>
  );
}
