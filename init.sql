-- Файл для инициализации базы данных PostgreSQL
-- Выполняется автоматически при первом запуске контейнера

-- Создание базы данных (если нужно дополнительные настройки)
-- CREATE DATABASE testdb;

-- Создание дополнительных пользователей (если нужно)
-- CREATE USER appuser WITH PASSWORD 'apppassword';
-- GRANT ALL PRIVILEGES ON DATABASE testdb TO appuser;

-- Можно добавить создание таблиц, индексов, начальных данных и т.д.
-- Но в нашем случае GORM сделает AutoMigrate

-- Установка часового пояса
SET timezone = 'UTC';

-- Включение расширений PostgreSQL (если нужно)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

SELECT 'Database initialized successfully' as message;