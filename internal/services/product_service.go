package services

import (
	"amiTech/internal/models"
	"amiTech/internal/repos"
	"errors"
	"gorm.io/gorm"
)

type ProductService interface {
	CreateProduct(req *models.ProductCreateRequest, userID uint) (*models.Product, error)
	GetAllProducts() ([]models.Product, error)               // Получение всех товаров
	FindProductByName(name string) ([]models.Product, error) // Поиск по названию
	GetAllByUserID(userID uint) ([]models.Product, error)    // Все продукты конкретного юзера
}

type productService struct {
	productRepo repos.ProductRepository
}

func NewProductService(productRepo repos.ProductRepository) ProductService {
	return &productService{
		productRepo: productRepo,
	}
}

func (s *productService) CreateProduct(req *models.ProductCreateRequest, userID uint) (*models.Product, error) {
	product := &models.Product{
		UserID:      userID,
		ProductName: req.ProductName,
		Description: req.Description,
		Price:       req.Price,
	}

	if err := s.productRepo.CreateProduct(product); err != nil {
		return nil, errors.New("failed to create product")
	}

	return product, nil
}

func (s *productService) GetAllProducts() ([]models.Product, error) {
	products, err := s.productRepo.AllProducts()
	if err != nil {
		return nil, errors.New("failed to fetch products")
	}

	result := make([]models.Product, len(products))
	for i, product := range products {
		result[i] = *product
	}

	return result, nil
}

func (s *productService) FindProductByName(name string) ([]models.Product, error) {
	products, err := s.productRepo.FindProductByName(name)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return []models.Product{}, nil
		}
		return nil, errors.New("failed to search products")
	}

	result := make([]models.Product, len(products))
	for i, product := range products {
		result[i] = *product
	}

	return result, nil
}

func (s *productService) GetAllByUserID(userID uint) ([]models.Product, error) {
	products, err := s.productRepo.GetAllByUserID(userID)
	if err != nil {
		return nil, errors.New("failed to fetch products")
	}

	result := make([]models.Product, len(products))
	for i, product := range products {
		result[i] = *product
	}

	return result, nil
}
