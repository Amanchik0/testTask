package config

import (
	"github.com/joho/godotenv"
	"log"
	"os"
)

type Config struct {
	DatabaseUrl string
	JwtSecret   string
	Port        string
	//NewsApiKey  string
}

func Load() *Config {
	if err := godotenv.Load(".env"); err != nil {
		log.Println("No .env file found, using environment variables and defaults")
	} else {
		log.Println(".env file loaded successfully")
	}
	config := &Config{
		DatabaseUrl: getEnv("DATABASE_URL", "host=localhost user=postgres password=postgres dbname=testdb port=5432 sslmode=disable"),
		JwtSecret:   getEnv("JWT_SECRET", "your-very-secret-jwt-key-change-this-in-production"),
		Port:        getEnv("PORT", "8080"),
		//NewsAPIKey:  getEnv("NEWS_API_KEY", ""),
	}
	return config
}
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
