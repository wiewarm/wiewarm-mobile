import type { badDetailSchema } from '../schemas/bad.schema';
import type { z } from 'zod';

export type BadDetail = z.infer<typeof badDetailSchema>;
export type BadDetailPool = BadDetail['becken'] extends Record<string, infer P> | undefined ? P : never;
