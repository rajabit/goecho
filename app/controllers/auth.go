package controllers

import (
	"net/http"
	"time"

	"blogito/app/requests"
	"blogito/models"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm/clause"
)

type JwtCustomClaims struct {
	UserId uint `json:"user_id"`
	jwt.RegisteredClaims
}

func Register(c echo.Context) (err error) {
	/** validation **/
	u := new(requests.RegisterRequest)
	if err = c.Bind(u); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err = c.Validate(u); err != nil {
		return err
	}

	var count int64
	models.Query().Model(&models.User{}).Where("email = ?", u.Email).Count(&count)

	if count > 0 {
		return echo.NewHTTPError(400, "email is already in use")
	}

	user := models.User{
		Name:     u.Name,
		Email:    u.Email,
		Password: HashPassword(u.Password),
	}

	models.Query().Create(&user)
	user.Token = GenerateToken(user)

	return c.JSON(http.StatusOK, user)
}

func Login(c echo.Context) (err error) {
	u := new(requests.LoginRequest)
	if err = c.Bind(u); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err = c.Validate(u); err != nil {
		return err
	}

	var user models.User
	res := models.Query().Where("email = ?", u.Email).First(&user)

	if res.RowsAffected == 0 || !CheckPasswordHash(u.Password, user.Password) {
		return echo.NewHTTPError(http.StatusUnauthorized)
	}

	user.Token = GenerateToken(user)
	return c.JSON(http.StatusOK, user)
}

func Accessible(c echo.Context) error {
	return c.String(http.StatusOK, "Hi")
}

func User(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*JwtCustomClaims)
	var model models.User

	res := models.Query().Preload(clause.Associations).Find(&model, claims.UserId)

	if res.RowsAffected == 0 {
		return echo.NewHTTPError(http.StatusUnauthorized)
	}

	return c.JSON(http.StatusOK, model)
}

func GenerateToken(user models.User) string {
	envFile, _ := godotenv.Read(".env")

	claims := &JwtCustomClaims{
		user.ID,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString([]byte(envFile["APP_KEY"]))
	if err != nil {
		println(err)
	}
	return t
}

func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		println(err.Error())
	}
	return string(bytes)
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
