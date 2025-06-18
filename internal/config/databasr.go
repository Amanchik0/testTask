package config

import (
	"amiTech/internal/models"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func ConnectDatabase(databaseUrl string) *gorm.DB {
	var db *gorm.DB
	var err error

	log.Printf("Connecting to database...")

	// Пытаемся подключиться с повторными попытками
	maxRetries := 15
	retryDelay := 3 * time.Second

	for attempt := 1; attempt <= maxRetries; attempt++ {
		log.Printf("Database connection attempt %d/%d", attempt, maxRetries)

		db, err = gorm.Open(postgres.Open(databaseUrl), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})

		if err == nil {
			// Проверяем подключение
			sqlDB, pingErr := db.DB()
			if pingErr == nil {
				if pingErr = sqlDB.Ping(); pingErr == nil {
					log.Println("✅ Database connected successfully!")
					return db
				}
			}
			log.Printf("❌ Database ping failed: %v", pingErr)
		} else {
			log.Printf("❌ Connection failed: %v", err)
		}

		if attempt < maxRetries {
			log.Printf("⏳ Retrying in %v...", retryDelay)
			time.Sleep(retryDelay)
		}
	}

	log.Fatal("💀 Failed to connect to database after all retries:", err)
	return nil
}

func RunMigrations(db *gorm.DB) {
	log.Println("🔄 Running database migrations...")

	err := db.AutoMigrate(
		&models.User{},
		&models.Product{},
	)

	if err != nil {
		log.Fatal("💀 Migration failed:", err)
	}

	log.Println("✅ Database migrations completed successfully!")
}
