# FILM!

Веб-приложение для просмотра афиши кинотеатра, выбора сеансов и мест, оформления заказа билетов.

## Адреса

- Сайт: http://film-nest.duckdns.org
- API: http://film-nest.duckdns.org/api/afisha

## Стек

React, TypeScript, Vite, NestJS, TypeORM, PostgreSQL, Docker Compose, nginx, pgAdmin.

## Структура проекта

- `frontend/` — клиентское приложение.
- `backend/` — серверное приложение.
- `nginx/` — конфигурация и образ nginx.
- `docker-compose.yml` — конфигурация сервисов.
- `film.yml` — спецификация OpenAPI.
- `film.postman.json` — коллекция Postman.

## Запуск

Необходимы Git, Docker и Docker Compose.

```bash
git clone --branch review-2 [https://github.com/GranstremVasiliy/film-react-nest.git](https://github.com/GranstremVasiliy/film-react-nest.git)
cd film-react-nest
```

Создайте `.env` в корне проекта и задайте переменные:

| Переменная          | Назначение                |
| ------------------- | ------------------------- |
| `POSTGRES_PASSWORD` | Пароль PostgreSQL         |
| `PGADMIN_EMAIL`     | Email для входа в pgAdmin |
| `PGADMIN_PASSWORD`  | Пароль pgAdmin            |

Не добавляйте `.env` с секретами в репозиторий.

```bash
chmod 600 .env
docker compose config --quiet
docker compose pull
docker compose up -d --no-build
```

Локально сайт доступен по адресу http://localhost, на сервере — по его IP или домену.

### Сборка из исходников

```bash
docker compose up -d --build
```

## Сервисы

| Сервис     | Назначение                                 |
| ---------- | ------------------------------------------ |
| `postgres` | База данных PostgreSQL 16                  |
| `backend`  | API на NestJS                              |
| `frontend` | Подготовка статических файлов              |
| `nginx`    | Раздача фронтенда и проксирование запросов |
| `pgadmin`  | Администрирование PostgreSQL               |

nginx использует порт `80`. pgAdmin доступен на сервере по адресу `127.0.0.1:8080`.

Контейнер `frontend` завершает работу после подготовки файлов. Статус `Exited (0)` является штатным.

## База данных

База данных и пользователь — `prac`.

При первом запуске с пустым томом выполняются:

1. `backend/test/prac.init.sql` — создание схемы.
2. `backend/test/prac.films.sql` — загрузка фильмов.
3. `backend/test/prac.shedules.sql` — загрузка расписания.

Начальный набор содержит 6 фильмов и 54 сеанса.

Данные PostgreSQL сохраняются в томе `postgres_data_seeded`.

## API

Базовый путь: `/api/afisha`.

| Метод | Путь                   | Назначение        |
| ----- | ---------------------- | ----------------- |
| GET   | `/films`               | Список фильмов    |
| GET   | `/films/{id}/schedule` | Расписание фильма |
| POST  | `/order`               | Оформление заказа |

## Управление

### Состояние контейнеров

```bash
docker compose ps -a
```

### Логи

```bash
docker compose logs --tail=100
```

### Обновление

```bash
docker compose pull
docker compose up -d --no-build
```

### Остановка

```bash
docker compose stop
```

### Удаление контейнеров без удаления данных

```bash
docker compose down
```

Команда `docker compose down -v` удаляет именованные тома, включая данные PostgreSQL.
