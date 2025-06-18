package models

import "time"

type User struct {
	ID        int64     `json:"id"  gorm:"primary_key"`
	Email     string    `json:"email" gorm:"uniqueIndex;not null"`
	FirstName string    `json:"first_name" gorm:"not null"`
	LastName  string    `json:"last_name" gorm:"not null"`
	Password  string    `json:"-" gorm:"not null"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Products []Product `json:"products,omitempty" gorm:"foreignKey:UserID"`
}

func (User) TableName() string {
	return "users"
}
