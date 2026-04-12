import type { BadImage } from './bad-image.interface';

export interface BadDetailPool {
  beckenid: number;
  beckenname: string;
  typ: string;
  status: string;
  date_pretty: string;
  temp: number | null;
}

export interface BadDetail {
  badid: number;
  badname: string;
  plz: string;
  ort: string;
  adresse1?: string;
  adresse2?: string;
  telefon?: string;
  email?: string;
  www?: string;
  zeiten?: string;
  preise?: string;
  info?: string;
  becken?: Record<string, BadDetailPool>;
  bilder?: BadImage[];
}

/** Numeric fields arrive as strings and are normalized in the service. */
export type RawBadDetailPool = Omit<BadDetailPool, 'beckenid' | 'temp'> & {
  beckenid: number | string;
  temp: number | string | null;
};

export type RawBadDetail = Omit<BadDetail, 'badid' | 'becken'> & {
  badid: number | string;
  becken?: Record<string, RawBadDetailPool>;
};
