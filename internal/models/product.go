package models

import (
	"time"
)

type Product struct {
	ID          uint      `json:"id" gorm:"primary_key"`
	UserID      uint      `json:"user_id" gorm:"not null"`
	ProductName string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	Price       float64   `json:"price" gorm:"not null"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}
