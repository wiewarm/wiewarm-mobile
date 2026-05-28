import { z } from 'zod';

// Converts null/undefined to an empty string.
const stringClean = z
  .string()
  .nullable()
  .optional()
  .transform((value) => value ?? '');

// Converts null/undefined/empty strings to undefined for optional API fields.
const optionalClean = z
  .string()
  .nullable()
  .optional()
  .transform((value) => value || undefined);

const optionalNumber = z.preprocess(
  (value) => (value == null || value === '' ? undefined : value),
  z.coerce.number().optional(),
);

// Normalizes malformed API coordinates shifted by a factor of 1,000,000.
const apiCoordinate = optionalNumber.transform((value) =>
  value !== undefined && Math.abs(value) > 1000
    ? value / 1_000_000
    : value,
);

const badDetailPoolSchema = z.object({
  beckenid: z.coerce.number(),
  beckenname: z.string(),
  typ: z.string(),
  status: z.string(),
  date_pretty: z.string(),
  temp: z.coerce.number().nullable(),
});

const badImageSchema = z.object({
  image: z.string(),
  text: z.string().optional(),
});

const rawBadDetailSchema = z.object({
  badid: z.coerce.number(),
  badname: z.string(),
  plz: stringClean,
  ort: z.string(),
  adresse1: optionalClean,
  adresse2: optionalClean,
  telefon: optionalClean,
  email: optionalClean,
  www: optionalClean,
  zeiten: optionalClean,
  preise: optionalClean,
  info: optionalClean,
  lat: apiCoordinate,
  long: apiCoordinate,
  ortlat: optionalNumber,
  ortlong: optionalNumber,
  becken: z.record(z.string(), badDetailPoolSchema).optional(),
  bilder: z.array(badImageSchema).optional(),
});

// Apply the coordinate fallback directly during detail normalization.
export const badDetailSchema = rawBadDetailSchema.transform(({ lat, long, ...detail }) => ({
  ...detail,
  ortlat: detail.ortlat ?? lat,
  ortlong: detail.ortlong ?? long,
}));

export const badItemSchema = z.object({
  badid: z.coerce.number(),
  badid_text: z.string(),
  bad: z.string(),
  becken: z.string(),
  plz: stringClean,
  ort: stringClean,
  date: z.string(),
  date_pretty: z.string(),
  beckenid: z.coerce.number(),
  temp: z.coerce.number(),
  ortlat: z.coerce.number(),
  ortlong: z.coerce.number(),
  kanton: stringClean,
  dist: z.coerce.number().optional(),
});

export const badItemsSchema = z.array(badItemSchema);
