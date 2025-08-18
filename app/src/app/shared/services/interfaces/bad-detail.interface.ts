export interface BadDetailPool {
  beckenid: number;
  beckenname: string;
  typ: string;
  status: string;
  date_pretty: string;
  temp: number | null;
}

export interface BadDetail {
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
  // Allow additional properties
  [key: string]: unknown;
}
