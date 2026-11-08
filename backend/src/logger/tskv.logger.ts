import { Injectable, LoggerService } from '@nestjs/common';

type TskvLogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';

@Injectable()
export class TSKVLogger implements LoggerService {
  private escapeValue(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\0/g, '\\0');
  }

  private stringifyValue(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }

    return JSON.stringify(value) ?? String(value);
  }

  formatMessage(
    level: TskvLogLevel,
    message: unknown,
    ...optionalParams: unknown[]
  ): string {
    const fields: Record<string, string> = {
      level,
      message: this.stringifyValue(message),
      optionalParams: this.stringifyValue(optionalParams),
    };

    return Object.entries(fields)
      .map(([key, value]) => `${key}=${this.escapeValue(value)}`)
      .join('\t');
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    console.error(this.formatMessage('fatal', message, ...optionalParams));
  }
}
