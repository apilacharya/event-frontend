import { Alert, CircularProgress, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { eventsApi } from '../api/events.api';
import EventFilters from '../components/events/EventFilters';
import EventList from '../components/events/EventList';
import PageWrapper from '../components/layout/PageWrapper';
import { predefinedEventTags } from '../constants/eventTags';

export default function HomePage() {
  const [searchParams] = useSearchParams();

  const type = searchParams.get('type');
  const tags = searchParams.get('tags');
  const upcoming = searchParams.get('upcoming');

  const eventParams: Record<string, string> = {};
  if (upcoming === 'true' || upcoming === 'false') {
    eventParams.upcoming = upcoming;
  }
  if (type) {
    eventParams.type = type;
  }
  if (tags) {
    eventParams.tags = tags;
  }

  const eventsQuery = useQuery({
    queryKey: ['events', { type: type ?? null, tags: tags ?? null, upcoming: upcoming ?? null }],
    queryFn: () => eventsApi.list(eventParams),
    placeholderData: (previousData) => previousData,
  });

  return (
    <PageWrapper>
      <Stack spacing={3}>
        <div className="bg-gray-200 h-64 w-full overflow-hidden rounded-lg">
          <img
            src="/hero.jpg"
            alt="Hero"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <Typography variant="h4">Discover Events</Typography>

        {eventsQuery.isError ? (
          <Alert severity="error">
            {(eventsQuery.error as { response?: { data?: { message?: string } } }).response?.data?.message ??
              (eventsQuery.error as { message?: string }).message ??
              'Failed to load events'}
          </Alert>
        ) : null}

        <EventFilters tagsOptions={[...predefinedEventTags]} />
        {eventsQuery.isLoading || eventsQuery.isFetching ? (
          <div className="flex min-h-[260px] items-center justify-center rounded-lg bg-white">
            <CircularProgress color="primary" />
          </div>
        ) : (
          <EventList events={eventsQuery.data ?? []} />
        )}
      </Stack>
    </PageWrapper>
  );
}
