import { Alert, Stack, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsApi } from '../api/events.api';
import { useToast } from '../components/common/ToastProvider';
import { predefinedEventTags, PredefinedEventTag } from '../constants/eventTags';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EventForm from '../components/events/EventForm';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { EventFormValues } from '../schemas/event.schema';
import { getApiErrorMessage } from '../utils/apiError';

function toLocalDateTimeInputValue(isoValue: string): string {
  const date = new Date(isoValue);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

const predefinedTagSet = new Set(predefinedEventTags);

function isPredefinedTag(value: string): value is PredefinedEventTag {
  return predefinedTagSet.has(value as PredefinedEventTag);
}

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { user } = useAuth();
  const eventId = Number(id);

  const eventQuery = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventsApi.getOne(eventId),
    enabled: Number.isFinite(eventId),
  });

  const updateMutation = useMutation({
    mutationFn: (data: EventFormValues) => eventsApi.update(eventId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      showToast('Event updated successfully.', 'success');
      navigate(`/events/${eventId}`);
    },
    onError: (error) => {
      showToast(getApiErrorMessage(error, 'Unable to update event.'), 'error');
    },
  });

  if (eventQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (eventQuery.isError || !eventQuery.data) {
    return (
      <PageWrapper>
        <Alert severity="error">Failed to load event.</Alert>
      </PageWrapper>
    );
  }

  if (user && user.id !== eventQuery.data.creatorId) {
    return (
      <PageWrapper>
        <Alert severity="error">You are not allowed to edit this event.</Alert>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Stack spacing={3}>
        <Typography variant="h4">Edit Event</Typography>

        <EventForm
          defaultValues={{
            title: eventQuery.data.title,
            description: eventQuery.data.description ?? '',
            dateTime: toLocalDateTimeInputValue(eventQuery.data.dateTime),
            location: eventQuery.data.location,
            type: eventQuery.data.type,
            tags: eventQuery.data.tags.filter(isPredefinedTag),
          }}
          availableTags={[...predefinedEventTags]}
          onSubmit={(data) => updateMutation.mutate(data)}
          isLoading={updateMutation.isPending}
        />
      </Stack>
    </PageWrapper>
  );
}
