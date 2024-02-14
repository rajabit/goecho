// main.go
package main

import (
	"blogito/app/controllers"
	"blogito/app/requests"
	"blogito/database"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	/** init database **/
	database.Sql()

	/** init database **/
	database.Sql()
	e := echo.New()

	e.Validator = &requests.CustomValidator{Validator: validator.New()}

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Login route
	e.POST("/login", controllers.Login)

	// Unauthenticated route
	e.GET("/", controllers.Accessible)
	e.GET("/auth/register", controllers.Register)

	// Restricted group
	r := e.Group("/restricted")

	// Configure middleware with the custom claims type
	config := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(controllers.JwtCustomClaims)
		},
		SigningKey: []byte("secret"),
	}
	r.Use(echojwt.WithConfig(config))
	r.GET("", controllers.Restricted)

	e.Logger.Fatal(e.Start(":1323"))
}
