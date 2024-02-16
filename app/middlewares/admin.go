package middlewares

import (
	"blogito/app/models"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm/clause"
)

func AdminMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		user := c.Get("user").(*jwt.Token)
		claims := user.Claims.(*models.JwtCustomClaims)
		var model models.User

		res := models.Query().Preload(clause.Associations).Find(&model, claims.UserId)

		if res.RowsAffected == 0 || model.Type != "superuser" || claims.Type != "superuser" {
			return echo.NewHTTPError(http.StatusForbidden)
		}

		return next(c)
	}
}
