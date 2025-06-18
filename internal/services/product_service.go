package services

import (
	"amiTech/internal/models"
	"amiTech/internal/repos"
	"errors"
	"gorm.io/gorm"
)

type ProductService interface {
	CreateProduct(req *models.ProductCreateRequest, userID uint) (*models.Product, error)
	GetProduct(id uint, userID uint) (*models.Product, error)
	GetAllByUserID(userID uint) ([]models.Product, error)
	UpdateProduct(id uint, req *models.ProductCreateRequest, userID uint) (*models.Product, error)
	DeleteProduct(id uint, userID uint) error
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

func (s *productService) GetProduct(id uint, userID uint) (*models.Product, error) {
	product, err := s.productRepo.GetByID(id, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("product not found")
		}
		return nil, err
	}

	return product, nil
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

func (s *productService) FindProductByName(name string) (*models.Product, error) {
	product, err := s.productRepo.FindProductByName(name)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("product not found")

		}
	}
	return product, nil
}

func (s *productService) AllProducts() ([]*models.Product, error) {
	products, err := s.productRepo.AllProducts()
	if err != nil {
		return nil, errors.New("failed to fetch products")

	}
	return products, nil
}

func (s *productService) UpdateProduct(id uint, req *models.ProductCreateRequest, userID uint) (*models.Product, error) {
	product, err := s.productRepo.GetByID(id, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("product not found")
		}
		return nil, err
	}

	product.ProductName = req.ProductName
	product.Description = req.Description
	product.Price = req.Price

	if err := s.productRepo.UpdateProduct(product); err != nil {
		return nil, errors.New("failed to update product")
	}

	return product, nil
}

func (s *productService) DeleteProduct(id uint, userID uint) error {
	product, err := s.productRepo.GetByID(id, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("product not found")
		}
		return err
	}

	if err := s.productRepo.DeleteProduct(product); err != nil {
		return errors.New("failed to delete product")
	}

	return nil
}
