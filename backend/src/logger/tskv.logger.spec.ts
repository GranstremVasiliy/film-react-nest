import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { TSKVLogger } from './tskv.logger';

describe('TSKVLogger', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('formatMessage', () => {
    it('формирует поля key=value, разделённые табуляцией', () => {
      const logger = new TSKVLogger();

      const result = logger.formatMessage('log', 'Сервис запущен', 'Bootstrap');

      expect(result).toBe(
        'level=log\tmessage=Сервис запущен\toptionalParams=["Bootstrap"]',
      );
    });

    it('экранирует табуляцию и перенос строки внутри сообщения', () => {
      const logger = new TSKVLogger();

      const result = logger.formatMessage(
        'warn',
        'Первая строка\nВторая\tчасть',
      );

      expect(result).toBe(
        'level=warn\tmessage=Первая строка\\nВторая\\tчасть\toptionalParams=[]',
      );
    });

    it('экранирует обратную косую черту внутри сообщения', () => {
      const logger = new TSKVLogger();

      const result = logger.formatMessage('log', 'C:\\logs\\app');

      expect(result).toBe(
        'level=log\tmessage=C:\\\\logs\\\\app\toptionalParams=[]',
      );
    });

    it('преобразует сообщение-объект в JSON-текст внутри поля message', () => {
      const logger = new TSKVLogger();

      const result = logger.formatMessage('debug', {
        filmId: 'film-1',
        count: 2,
      });

      expect(result).toBe(
        'level=debug\tmessage={"filmId":"film-1","count":2}\toptionalParams=[]',
      );
    });
  });
  describe('методы вывода', () => {
    const cases = [
      { level: 'log', consoleMethod: 'log' },
      { level: 'error', consoleMethod: 'error' },
      { level: 'warn', consoleMethod: 'warn' },
      { level: 'debug', consoleMethod: 'debug' },
      { level: 'verbose', consoleMethod: 'log' },
      { level: 'fatal', consoleMethod: 'error' },
    ] as const;

    it.each(cases)(
      '$level: один раз передаёт TSKV-строку в console.$consoleMethod',
      ({ level, consoleMethod }) => {
        const logger = new TSKVLogger();

        const consoleSpy = jest
          .spyOn(console, consoleMethod)
          .mockImplementation(() => undefined);

        logger[level]('Тестовое сообщение', 'TestContext');

        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith(
          `level=${level}\tmessage=Тестовое сообщение\toptionalParams=["TestContext"]`,
        );
      },
    );
  });
});
