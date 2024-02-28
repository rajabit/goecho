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
	Post      []Post
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt
}

type Post struct {
	gorm.Model
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `json:"UserId"`
	User      User      `json:"User" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Title     string    `json:"Title" gorm:"type:varchar(255);not null"`
	Subtitle  string    `json:"Subtitle" gorm:"type:varchar(255);not null"`
	Summary   string    `json:"Summary" gorm:"type:varchar(1024);not null"`
	Content   string    `json:"Content" gorm:"type:longtext;not null"`
	Status    string    `json:"Status" gorm:"type:enum('active','inactive');index;not null;default:inactive"`
	VideoLink string    `json:"VideoLink" gorm:"type:varchar(255);"`
	Views     int64     `json:"Views" gorm:"default:0"`
	CreatedAt time.Time `gorm:"index"`
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt
}

type Pagination struct {
	FirstPage   int64
	CurrentPage int
	Data        interface{}
	Total       int64
	LastPage    int64
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
