declare function gtag(
  command: 'js',
  date: Date
): void;
declare function gtag(
  command: 'config',
  targetId: string,
  config?: object
): void;
declare function gtag(
  command: 'event',
  eventName: string,
  eventParams?: object
): void;