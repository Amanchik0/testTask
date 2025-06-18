package config

import (
	"amiTech/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
)

func ConnectDatabase(databaseUrl string) *gorm.DB {
	db, err := gorm.Open(postgres.Open(databaseUrl), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	},
	)
	if err != nil {
		log.Fatal("failed to con", err)
	}
	log.Println("successsss")
	return db

}

func RunMigrations(db *gorm.DB) {
	err := db.AutoMigrate(

		&models.User{},
		&models.Product{},
	)
	if err != nil {
		log.Fatal("fatal err fail", err)
	}
	log.Println("migration worked")

}
