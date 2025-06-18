package handlers

import (
	"amiTech/internal/models"
	"amiTech/internal/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AuthHandler struct {
	authService services.AuthService
}

func NewAuthHandler(authService services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Register(ctx gin.Context) {
	var req models.RegisterRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	response, err := h.authService.Register(&req)
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "User already exists" {
			status = http.StatusConflict
		}
		ctx.JSON(status, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, response)

}
func (h *AuthHandler) Login(ctx gin.Context) {
	var req models.LoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return
	}
	response, err := h.authService.Login(&req)
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "invalid credentials" {
			status = http.StatusUnauthorized
		}
		ctx.JSON(status, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, response)

}
