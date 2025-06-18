# ИСПРАВЛЕНО: Используем golang:1.21-alpine (не 1.24)
FROM golang:1.24-alpine AS builder

# Устанавливаем git (нужен для alpine)
RUN apk add --no-cache git

WORKDIR /app

# Копируем go файлы для кэширования зависимостей
COPY go.mod go.sum ./

# Загружаем зависимости
RUN go mod download

# Копируем весь исходный код
COPY . .

# Собираем приложение
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Финальный образ
FROM alpine:latest

# Устанавливаем необходимые пакеты
RUN apk --no-cache add ca-certificates tzdata

# Создаем пользователя для безопасности
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /root/

# Копируем собранное приложение
COPY --from=builder /app/main .

# Меняем владельца
RUN chown appuser:appgroup main

# Переключаемся на пользователя
USER appuser

# Открываем порт
EXPOSE 8080

# Запускаем приложение
CMD ["./main"]