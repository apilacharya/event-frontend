import { z } from 'zod';
import { predefinedEventTags } from '../constants/eventTags';

const predefinedEventTagSchema = z.enum(predefinedEventTags);

export const eventFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  dateTime: z.string().min(1, 'Date and time are required'),
  location: z.string().min(2, 'Location is required'),
  type: z.enum(['PUBLIC', 'PRIVATE']),
  tags: z.array(predefinedEventTagSchema).optional().default([]),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
