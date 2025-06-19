package repos

import (
	"amiTech/internal/models"
	"gorm.io/gorm"
)

// ProductRepository - интерфейс для работы с продуктами
type ProductRepository interface {
	CreateProduct(product *models.Product) error
	FindProductByName(name string) ([]*models.Product, error) // Поиск по частичному названию (LIKE)
	AllProducts() ([]*models.Product, error)                  // Все продукты
	GetAllByUserID(userID uint) ([]*models.Product, error)    // Все продукты одного юзера
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepository{db: db}
}

func (r *productRepository) CreateProduct(product *models.Product) error {
	return r.db.Create(product).Error
}

func (r *productRepository) FindProductByName(name string) ([]*models.Product, error) {
	var products []*models.Product
	// Используем LIKE для поиска по частичному совпадению названия
	err := r.db.Where("product_name ILIKE ?", "%"+name+"%").Find(&products).Error
	if err != nil {
		return nil, err
	}
	return products, nil
}

func (r *productRepository) AllProducts() ([]*models.Product, error) {
	var products []*models.Product
	err := r.db.Find(&products).Error
	return products, err
}

func (r *productRepository) GetAllByUserID(userID uint) ([]*models.Product, error) {
	var products []*models.Product
	err := r.db.Where("user_id = ?", userID).Find(&products).Error
	return products, err
}
