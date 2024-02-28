package controllers

import (
	"net/http"
	"strconv"

	"blogito/app/models"
	"blogito/app/requests"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func AdminPostIndex(c echo.Context) (err error) {
	var total int64
	var posts []models.Post

	page, err := strconv.Atoi(c.QueryParam("page"))
	if err != nil {
		page = 1
	}

	models.Query().Limit(25).Offset(25 * (page - 1)).Preload("User").Order("created_at desc").Find(&posts)
	models.Query().Model(&models.Post{}).Count(&total)

	return c.JSON(http.StatusOK, models.Pagination{
		Data:        posts,
		CurrentPage: page,
		Total:       total,
		LastPage:    (total / 25) + 1,
		FirstPage:   1,
	})
}

func AdminPostStore(c echo.Context) (err error) {
	u := new(requests.PostRequest)
	if err = c.Bind(u); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err = c.Validate(u); err != nil {
		return err
	}

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*models.JwtCustomClaims)

	post := models.Post{
		UserID:    claims.UserId,
		Title:     u.Title,
		Subtitle:  u.Subtitle,
		Summary:   u.Summary,
		Content:   u.Content,
		VideoLink: u.VideoLink,
	}
	models.Query().Create(&post)
	models.Query().Preload("User").Find(&post, post.ID)

	return c.JSON(http.StatusOK, post)
}
