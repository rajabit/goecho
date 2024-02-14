package database

import (
	"database/sql"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var (
	db *gorm.DB
)

type User struct {
	gorm.Model
	ID              uint   `gorm:"primaryKey"`
	Name            string `gorm:"type:varchar(255)"`
	Email           string `gorm:"type:varchar(255);unique_index"`
	EmailVerifiedAt sql.NullTime
	Status          string `gorm:"varchar(32);index"`
	Password        string `gorm:"type:varchar(255)"`
	CreatedAt       time.Time
	UpdatedAt       time.Time
	DeletedAt       gorm.DeletedAt
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
	Status    string `gorm:"varchar(32);index"`
	Views     int64
	CreatedAt time.Time `gorm:"index"`
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt
}

func Sql() *gorm.DB {
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
