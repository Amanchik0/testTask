package repos

import (
	"amiTech/internal/models"
	"gorm.io/gorm"
)

// ProductRepository - интерфейс для работы с продуктами
type ProductRepository interface {
	CreateProduct(product *models.Product) error
	UpdateProduct(product *models.Product) error
	DeleteProduct(product *models.Product) error
	GetByID(id uint, userID uint) (*models.Product, error)  // просто по айди ищет
	FindProductByName(name string) (*models.Product, error) // по тайтлу
	AllProducts() ([]*models.Product, error)                // все
	GetAllByUserID(userID uint) ([]*models.Product, error)  //все продукты одного юзера
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
func (r *productRepository) UpdateProduct(product *models.Product) error {
	return r.db.Save(product).Error
}
func (r *productRepository) DeleteProduct(product *models.Product) error {
	return r.db.Delete(product).Error
}
func (r *productRepository) GetByID(id uint, userID uint) (*models.Product, error) {
	var product models.Product
	err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&product).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}
func (r *productRepository) FindProductByName(name string) (*models.Product, error) {
	var product models.Product
	err := r.db.Where("product_name = ?", name).First(&product).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
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
