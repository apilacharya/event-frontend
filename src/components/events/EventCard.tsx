import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Event } from '../../types';
import TagChip from '../common/TagChip';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ borderLeft: '4px solid', borderColor: 'primary.main' }}>
      <CardActionArea onClick={() => navigate(`/events/${event.id}`)}>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">{event.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(event.dateTime).toLocaleString()}
            </Typography>
            <Typography variant="body2">{event.location}</Typography>
            <Chip label={event.type} color="primary" size="small" sx={{ width: 'fit-content' }} />
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {event.tags.slice(0, 3).map((tag) => (
                <TagChip key={tag} label={tag} />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
