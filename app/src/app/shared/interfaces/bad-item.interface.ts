export interface BadItem {
  badid_text: string;
  bad: string;
  becken: string;
  plz: string;
  ort: string;
  date: string;
  date_pretty: string;
  beckenid: number;
  temp: number;
  ortlat: number;
  ortlong: number;
  dist?: number;
  [key: string]: string | number | undefined;
}
