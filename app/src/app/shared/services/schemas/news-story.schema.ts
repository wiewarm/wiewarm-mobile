import { z } from 'zod';

const newsItemSchema = z.object({
  badid: z.number(),
  badname: z.string(),
  ort: z.string(),
  kanton: z.string(),
  plz: z.string(),
  infoid: z.number(),
  date: z.string(),
  info: z.string(),
  date_pretty: z.string(),
});

const imageItemSchema = z.object({
  image: z.string(),
  thumbnail: z.string().optional(),
  original: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  date_pretty: z.string().optional(),
  badid: z.string(),
  badname: z.string(),
  ort: z.string(),
  plz: z.string(),
  kanton: z.string(),
});

export const newsItemsSchema = z.array(newsItemSchema);
export const imageItemsSchema = z.array(imageItemSchema);

export type NewsItem = z.infer<typeof newsItemSchema>;
export type ImageItem = z.infer<typeof imageItemSchema>;
