import type { badItemSchema } from '../schemas/bad.schema';
import type { z } from 'zod';

export type BadItem = z.infer<typeof badItemSchema>;
