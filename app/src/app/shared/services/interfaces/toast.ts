export interface Toast {
  id: number;
  message: string;
  type: 'error' | 'success' | 'info';
}