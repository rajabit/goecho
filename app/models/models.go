package models

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var (
	db *gorm.DB
)

type User struct {
	gorm.Model
	ID        uint   `gorm:"primaryKey"`
	Name      string `json:"Name" gorm:"type:varchar(255);not null"`
	Email     string `json:"Email" gorm:"type:varchar(255);unique_index;not null"`
	Status    string `json:"Status" gorm:"type:varchar(32);index;default:active;not null"`
	Type      string `json:"Type" gorm:"type:varchar(32);index;default:default;not null"`
	Password  string `json:"-" gorm:"type:varchar(255);not null"`
	Token     string `json:"Token" gorm:"-:all"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt
}

type Post struct {
	gorm.Model
	ID        uint `gorm:"primaryKey"`
	UserID    int
	User      User
	Title     string `gorm:"type:varchar(255)"`
	Subtitle  string `gorm:"type:varchar(255)"`
	Summary   string `gorm:"type:varchar(1024)"`
	Content   string `gorm:"type:longtext"`
	Status    string `gorm:"type:varchar(32);index"`
	Views     int64
	CreatedAt time.Time `gorm:"index"`
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt
}


type JwtCustomClaims struct {
	UserId uint   `json:"user_id"`
	Type   string `json:"type"`
	jwt.RegisteredClaims
}


func Query() *gorm.DB {
	if db == nil {
		envFile, _ := godotenv.Read(".env")
		res, err := gorm.Open(mysql.Open(envFile["MYSQL"]), &gorm.Config{})
		if err != nil {
			panic("failed to connect database")
		}
		res.AutoMigrate(&User{})
		res.AutoMigrate(&Post{})
		db = res
	}

	return db
}
