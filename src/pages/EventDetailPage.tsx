import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { eventsApi } from "../api/events.api";
import { useToast } from "../components/common/ToastProvider";
import TagChip from "../components/common/TagChip";
import LoadingSpinner from "../components/common/LoadingSpinner";
import PageWrapper from "../components/layout/PageWrapper";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/apiError";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const eventId = Number(id);

  const eventQuery = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventsApi.getOne(eventId),
    enabled: Number.isFinite(eventId),
  });

  const deleteMutation = useMutation({
    mutationFn: () => eventsApi.remove(eventId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      await queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      showToast("Event deleted successfully.", "success");
      navigate("/");
    },
    onError: (error) => {
      showToast(
        getApiErrorMessage(error, "Unable to delete this event."),
        "error",
      );
    },
  });

  if (eventQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (eventQuery.isError || !eventQuery.data) {
    return (
      <PageWrapper>
        <Alert severity="error">Failed to load event details.</Alert>
      </PageWrapper>
    );
  }

  const event = eventQuery.data;
  const canManage = user?.id === event.creatorId;

  return (
    <PageWrapper>
      <Stack spacing={3}>
        <div className="bg-gray-200 h-64 w-full overflow-hidden rounded-lg">
          <img
            src="../../public/detail.png"
            alt="Event placeholder"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-5 lg:col-span-2">
            <Stack spacing={2.5}>
              <Typography variant="h4">{event.title}</Typography>

              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography sx={{ mt: 0.5 }}>
                  {event.description || "No description provided."}
                </Typography>
              </div>

              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  Tags
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mt: 1 }}
                >
                  {event.tags.map((tag) => (
                    <TagChip key={tag} label={tag} />
                  ))}
                </Stack>
              </div>
            </Stack>
          </div>

          <div className="rounded-lg bg-white p-5">
            <Stack spacing={2}>
              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography>
                  {new Date(event.dateTime).toLocaleString()}
                </Typography>
              </div>

              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography>{event.location}</Typography>
              </div>

              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  Event Type
                </Typography>
                <Chip
                  label={event.type}
                  color="primary"
                  sx={{ width: "fit-content", mt: 0.5 }}
                />
              </div>

              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  Host
                </Typography>
                <Typography>{event.creatorName}</Typography>
              </div>
            </Stack>
          </div>
        </div>

        {canManage ? (
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              component={RouterLink}
              to={`/events/${event.id}/edit`}
              variant="outlined"
              color="primary"
            >
              Edit
            </Button>
            <Button color="error" onClick={() => setIsDeleteOpen(true)}>
              Delete
            </Button>
          </Stack>
        ) : null}
      </Stack>

      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <DialogTitle>Delete event?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. This event will be permanently
            removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              deleteMutation.mutate();
              setIsDeleteOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
}
