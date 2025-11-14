declare function gtag(
  command: 'js',
  date: Date
): void;
declare function gtag(
  command: 'config',
  targetId: string,
  config?: Record<string, unknown>
): void;
declare function gtag(
  command: 'event',
  eventName: string,
  eventParams?: Record<string, unknown>
): void;
