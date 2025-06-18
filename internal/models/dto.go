package models

type ProductCreateRequest struct {
	ProductName string  `json:"name" binding:"required"`
	Description string  `json:"description" binding:"required"`
	Price       float64 `json:"price" binding:"required, gt=0"`
}

type RegisterRequest struct {
	Email     string `json:"email" binding:"required,email"`
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Password  string `json:"password" binding:"required,min=6"`
}
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// response

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
type ProductResponse struct {
	Product Product `json:"product"`
	Message string  `json:"message"`
}

type ProductListResponse struct {
	Products []Product `json:"products"`
	Message  string    `json:"message"`
	Count    int       `json:"count"`
}
