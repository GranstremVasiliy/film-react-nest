import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('формирует JSON с уровнем, сообщением и дополнительными параметрами', () => {
      const logger = new JsonLogger();

      const result = logger.formatMessage(
        'log',
        'Сервис запущен',
        'Bootstrap',
        { port: 3000 },
      );

      const parsed: unknown = JSON.parse(result);

      expect(parsed).toEqual({
        level: 'log',
        message: 'Сервис запущен',
        optionalParams: ['Bootstrap', { port: 3000 }],
      });
    });

    it('формирует пустой массив optionalParams, если параметры не переданы', () => {
      const logger = new JsonLogger();

      const result = logger.formatMessage('warn', 'Нет дополнительных данных');

      const parsed: unknown = JSON.parse(result);

      expect(parsed).toEqual({
        level: 'warn',
        message: 'Нет дополнительных данных',
        optionalParams: [],
      });
    });
  });

  describe('log', () => {
    it('один раз передаёт JSON-строку уровня log в console.log', () => {
      const logger = new JsonLogger();

      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.log('Сервис запущен', 'Bootstrap');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'log',
          message: 'Сервис запущен',
          optionalParams: ['Bootstrap'],
        }),
      );
    });
  });
  describe('error', () => {
    it('один раз передаёт JSON-строку уровня error в console.error', () => {
      const logger = new JsonLogger();

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      logger.error('Не удалось создать заказ', 'OrderService');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'error',
          message: 'Не удалось создать заказ',
          optionalParams: ['OrderService'],
        }),
      );
    });
  });
  describe('warn', () => {
    it('один раз передаёт JSON-строку уровня warn в console.warn', () => {
      const logger = new JsonLogger();

      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      logger.warn('Осталось мало свободных мест', 'OrderService');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'warn',
          message: 'Осталось мало свободных мест',
          optionalParams: ['OrderService'],
        }),
      );
    });
  });

  describe('debug', () => {
    it('один раз передаёт JSON-строку уровня debug в console.debug', () => {
      const logger = new JsonLogger();

      const consoleSpy = jest
        .spyOn(console, 'debug')
        .mockImplementation(() => undefined);

      logger.debug('Получены параметры запроса', { filmId: 'film-1' });

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'debug',
          message: 'Получены параметры запроса',
          optionalParams: [{ filmId: 'film-1' }],
        }),
      );
    });
  });

  describe('verbose', () => {
    it('один раз передаёт JSON-строку уровня verbose в console.log', () => {
      const logger = new JsonLogger();

      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.verbose('Начало обработки запроса', 'FilmsService');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'verbose',
          message: 'Начало обработки запроса',
          optionalParams: ['FilmsService'],
        }),
      );
    });
  });

  describe('fatal', () => {
    it('один раз передаёт JSON-строку уровня fatal в console.error', () => {
      const logger = new JsonLogger();

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      logger.fatal('Невозможно запустить приложение', 'Bootstrap');

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'fatal',
          message: 'Невозможно запустить приложение',
          optionalParams: ['Bootstrap'],
        }),
      );
    });
  });
});
