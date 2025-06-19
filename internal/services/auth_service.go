package services

import (
	"amiTech/internal/models"
	"amiTech/internal/repos"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
	"strings"
	"time"
)

type AuthService interface {
	Register(req *models.RegisterRequest) (*models.AuthResponse, error)
	Login(req *models.LoginRequest) (*models.AuthResponse, error)
	GenerateToken(userID uint) (string, error)
	AuthMiddleware() gin.HandlerFunc
}
type authService struct {
	userRepo  repos.UserRepository
	jwtSecret []byte
}

func NewAuthService(userRepo repos.UserRepository, jwtSecret string) AuthService {
	return &authService{
		userRepo:  userRepo,
		jwtSecret: []byte(jwtSecret),
	}
}

func (s *authService) Register(req *models.RegisterRequest) (*models.AuthResponse, error) {
	_, err := s.userRepo.GetByEmail(req.Email)
	if err == nil {
		return nil, errors.New("uzhe est takoi email")
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	user := &models.User{
		Email:     req.Email,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Password:  string(hashedPassword),
	}
	if err := s.userRepo.Create(user); err != nil {
		return nil, errors.New("fail to create")
	}
	token, err := s.GenerateToken(user.ID)
	if err != nil {
		return nil, errors.New("fail to create token")
	}
	return &models.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}
func (s *authService) Login(req *models.LoginRequest) (*models.AuthResponse, error) {
	user, err := s.userRepo.GetByEmail(req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("net takoi email ili password incorrect")
		}
		return nil, err
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, errors.New("net takoi email ili password incorrect")
	}

	token, err := s.GenerateToken(user.ID)
	if err != nil {
		return nil, errors.New("fail to create token")
	}
	return &models.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}
func (s *authService) AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Требуется заголовок Authorization"})
			ctx.Abort()
			return
		}

		tokenString := authHeader
		if strings.HasPrefix(tokenString, "Bearer ") {
			tokenString = tokenString[7:]
		}

		// Используем MapClaims напрямую
		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return s.jwtSecret, nil
		})

		if err != nil || !token.Valid {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Недействительный токен"})
			ctx.Abort()
			return
		}

		// Теперь просто используем claims напрямую
		if userID, ok := claims["user_id"].(float64); ok {
			ctx.Set("user_id", uint(userID))
			ctx.Next()
			return
		}

		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Недействительные данные токена"})
		ctx.Abort()
	}
}

func (s *authService) GenerateToken(userID uint) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
		"iat":     time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtSecret)
}
