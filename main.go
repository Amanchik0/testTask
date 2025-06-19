package main

import (
	"amiTech/internal/config"
	"amiTech/internal/handlers"
	"amiTech/internal/repos"
	"amiTech/internal/services"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
	"time"
)

func main() {
	cfg := config.Load()

	db := config.ConnectDatabase(cfg.DatabaseUrl)

	config.RunMigrations(db)

	// Инициализируем слои приложения
	// Repositories
	userRepo := repos.NewUserRepository(db)
	productRepo := repos.NewProductRepository(db)

	// Services
	authService := services.NewAuthService(userRepo, cfg.JwtSecret)
	productService := services.NewProductService(productRepo)

	// Handlers
	authHandler := handlers.NewAuthHandler(authService)
	productHandler := handlers.NewProductHandler(productService)

	// Создаем Gin приложение
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "Content-Length"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Маршруты аутентификации
	authRouter := router.Group("/auth")
	{
		authRouter.POST("/register", authHandler.Register)
		authRouter.POST("/login", authHandler.Login)
	}

	publicRouter := router.Group("/api/public")
	{
		publicRouter.GET("/products", productHandler.GetAllProducts)
		publicRouter.GET("/products/search", productHandler.SearchProductsByName)
	}

	apiRouter := router.Group("/api")
	apiRouter.Use(authService.AuthMiddleware())
	{
		apiRouter.POST("/products", productHandler.CreateProduct)
		apiRouter.GET("/my-products", productHandler.GetUserProducts)
	}

	// Корневой маршрут
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Product API",
			"version": "1.0.0",
			"endpoints": gin.H{
				"auth": gin.H{
					"register": "POST /auth/register",
					"login":    "POST /auth/login",
				},
				"public": gin.H{
					"all_products":    "GET /api/public/products",
					"search_products": "GET /api/public/products/search?name=<search_term>",
				},
				"protected": gin.H{
					"create_product": "POST /api/products",
					"my_products":    "GET /api/my-products",
				},
			},
		})
	})

	// Запускаем сервер
	log.Printf("Server starting on port %s", cfg.Port)
	router.Run(":" + cfg.Port)
}
