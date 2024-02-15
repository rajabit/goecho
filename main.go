// main.go
package main

import (
	"blogito/app/controllers"
	"blogito/app/requests"
	"blogito/models"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"

	"github.com/labstack/echo/v4/middleware"
)

func main() {
	/** init database **/
	models.Query()
	e := echo.New()

	e.Validator = &requests.CustomValidator{Validator: validator.New()}

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Basic Routes
	e.GET("/", controllers.Home)
	e.POST("/auth/register", controllers.Register)
	e.POST("/auth/login", controllers.Login)

	// Auth Routes
	r := e.Group("")
	envFile, _ := godotenv.Read(".env")
	secret := envFile["APP_KEY"]
	config := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(controllers.JwtCustomClaims)
		},
		SigningKey: []byte(secret),
	}
	r.Use(echojwt.WithConfig(config))
	r.GET("/auth/user", controllers.User)

	e.Logger.Fatal(e.Start(":1323"))
}
