package controllers

import (
	"blogito/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

func Home(c echo.Context) (err error) {
	var posts []models.Post
	models.Query().Limit(25).Offset(25 * 1).Last(&posts)

	return c.JSON(http.StatusOK, posts)
}
