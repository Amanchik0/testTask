package handlers

import (
	"amiTech/internal/models"
	"amiTech/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	productService services.ProductService
}

func NewProductHandler(productService services.ProductService) *ProductHandler {
	return &ProductHandler{
		productService: productService,
	}
}

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

func (h *ProductHandler) GetAllProducts(c *gin.Context) {
	products, err := h.productService.GetAllProducts()
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

func (h *ProductHandler) SearchProductsByName(c *gin.Context) {
	name := c.Query("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name parameter is required"})
		return
	}

	products, err := h.productService.FindProductByName(name)
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

func (h *ProductHandler) GetUserProducts(c *gin.Context) {
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
