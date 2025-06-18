package handlers

import (
	"amiTech/internal/models"
	"amiTech/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// ProductHandler структура для обработчиков продуктов
type ProductHandler struct {
	productService services.ProductService
}

// NewProductHandler создает новый экземпляр ProductHandler
func NewProductHandler(productService services.ProductService) *ProductHandler {
	return &ProductHandler{
		productService: productService,
	}
}

// GetProducts получает все продукты текущего пользователя
func (h *ProductHandler) GetProducts(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	products, err := h.productService.GetAllByUserID(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := models.ProductListResponse{
		Products: products,
		Count:    len(products),
		Message:  "success",
	}
	c.JSON(http.StatusOK, response)
}

// CreateProduct создает новый продукт
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	var req models.ProductCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	product, err := h.productService.CreateProduct(&req, userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := models.ProductResponse{
		Message: "Product created successfully",
		Product: *product,
	}
	c.JSON(http.StatusCreated, response)
}

// GetProduct получает конкретный продукт по ID
func (h *ProductHandler) GetProduct(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	productID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	product, err := h.productService.GetProduct(uint(productID), userID.(uint))
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "product not found" {
			status = http.StatusNotFound
		}
		c.JSON(status, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"product": product})
}

// UpdateProduct обновляет существующий продукт
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	productID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var req models.ProductCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	product, err := h.productService.UpdateProduct(uint(productID), &req, userID.(uint))
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "product not found" {
			status = http.StatusNotFound
		}
		c.JSON(status, gin.H{"error": err.Error()})
		return
	}

	response := models.ProductResponse{
		Message: "Product updated successfully",
		Product: *product,
	}
	c.JSON(http.StatusOK, response)
}

// DeleteProduct удаляет продукт
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	productID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	err = h.productService.DeleteProduct(uint(productID), userID.(uint))
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "product not found" {
			status = http.StatusNotFound
		}
		c.JSON(status, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}
