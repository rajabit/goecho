// main.go
package main

import (
	"blogito/app/controllers"
	"blogito/app/middlewares"
	"blogito/app/models"
	"blogito/app/requests"
	"encoding/json"
	"os"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"

	"github.com/labstack/echo/v4/middleware"
)

func main() {
	envFile, _ := godotenv.Read(".env")
	secret := envFile["APP_KEY"]

	/** init database **/
	models.Query()
	e := echo.New()

	e.Validator = &requests.CustomValidator{Validator: validator.New()}

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())
	// e.Use(middleware.CSRF())
	e.Use(middleware.Secure())
	e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(20)))

	e.Static("/", "/public")

	// Basic Routes
	e.GET("/", controllers.Home)
	e.POST("/auth/register", controllers.Register)
	e.POST("/auth/login", controllers.Login)

	// Auth Routes
	r := e.Group("")
	r.Use(echojwt.WithConfig(echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(models.JwtCustomClaims)
		},
		SigningKey: []byte(secret),
	}))
	r.GET("/auth/user", controllers.User)

	// Admin Routes
	g := r.Group("/admin")
	g.Use(middlewares.AdminMiddleware)
	g.GET("/posts", controllers.AdminPostIndex)

	data, err := json.MarshalIndent(e.Routes(), "", "  ")
	if err != nil {
		println(err)
	}
	os.WriteFile("routes.json", data, 0644)

	e.Logger.Fatal(e.Start(":1323"))
}
