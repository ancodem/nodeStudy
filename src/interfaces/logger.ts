export interface ILogger {
  log(...args: unknown[]): void;
  error(...args: unknown[]): void;
  wart(...args: unknown[]): void;
}
