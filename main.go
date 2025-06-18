package main

import (
	"amiTech/internal/config"
	"amiTech/internal/handlers"
	"amiTech/internal/repos"
	"amiTech/internal/services"
	"log"

	"github.com/gin-gonic/gin"
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

	// Маршруты аутентификации
	authRouter := router.Group("/auth")
	{
		authRouter.POST("/register", authHandler.Register)
		authRouter.POST("/login", authHandler.Login)
	}

	// Защищенные маршруты для продуктов
	apiRouter := router.Group("/api")
	apiRouter.Use(authService.AuthMiddleware())
	{
		apiRouter.GET("/products", productHandler.GetProducts)
		apiRouter.POST("/products", productHandler.CreateProduct)
		apiRouter.GET("/products/:id", productHandler.GetProduct)
		apiRouter.PUT("/products/:id", productHandler.UpdateProduct)
		apiRouter.DELETE("/products/:id", productHandler.DeleteProduct)
	}

	// Корневой маршрут
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": " Test API",
			"version": "1.0.0",
			"endpoints": gin.H{
				"auth": gin.H{
					"register": "POST /auth/register",
					"login":    "POST /auth/login",
				},
				"products": gin.H{
					"list":   "GET /api/products",
					"create": "POST /api/products",
					"get":    "GET /api/products/:id",
					"update": "PUT /api/products/:id",
					"delete": "DELETE /api/products/:id",
				},
				"news": "GET /news",
			},
		})
	})

	// Запускаем сервер
	log.Printf("Server starting on port %s", cfg.Port)
	router.Run(":" + cfg.Port)
}
