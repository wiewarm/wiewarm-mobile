import { z } from 'zod';

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

export const badDetailSchema = z.object({
  badid: z.coerce.number(),
  badname: z.string(),
  plz: z.string(),
  ort: z.string(),
  adresse1: z.string().optional(),
  adresse2: z.string().optional(),
  telefon: z.string().optional(),
  email: z.string().optional(),
  www: z.string().optional(),
  zeiten: z.string().optional(),
  preise: z.string().optional(),
  info: z.string().optional(),
  becken: z.record(z.string(), badDetailPoolSchema).optional(),
  bilder: z.array(badImageSchema).optional(),
});

const nullToEmpty = z.string().nullable().catch('').transform((v) => v ?? '');

export const badItemSchema = z.object({
  badid: z.coerce.number(),
  badid_text: z.string(),
  bad: z.string(),
  becken: z.string(),
  plz: nullToEmpty,
  ort: nullToEmpty,
  date: z.string(),
  date_pretty: z.string(),
  beckenid: z.coerce.number(),
  temp: z.coerce.number(),
  ortlat: z.coerce.number(),
  ortlong: z.coerce.number(),
  kanton: nullToEmpty,
  dist: z.coerce.number().optional(),
});

export const badItemsSchema = z.array(badItemSchema);
