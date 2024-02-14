package requests

import (
	"fmt"
	"net/http"

	"github.com/go-playground/locales/en"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"

	en_translations "github.com/go-playground/validator/v10/translations/en"
)

type (
	RegisterRequest struct {
		Name                 string `json:"name" validate:"required"`
		Email                string `json:"email" validate:"required,email"`
		Password             string `json:"password" validate:"required,min=8,max=32"`
		PasswordConfirmation string `json:"password_confirmation" validate:"required,min=8,max=32"`
	}

	CustomValidator struct {
		Uni       *ut.UniversalTranslator
		Validator *validator.Validate
	}
)

func (cv *CustomValidator) Validate(i interface{}) error {

	if err := cv.Validator.Struct(i); err != nil {
		en := en.New()
		cv.Uni = ut.New(en, en)
		trans, _ := cv.Uni.GetTranslator("en")
		en_translations.RegisterDefaultTranslations(cv.Validator, trans)

		// translate all error at once
		errs := err.(validator.ValidationErrors)

		// returns a map with key = namespace & value = translated error
		// NOTICE: 2 errors are returned and you'll see something surprising
		// translations are i18n aware!!!!
		// eg. '10 characters' vs '1 character'
		fmt.Println(errs.Translate(trans))

		return echo.NewHTTPError(http.StatusBadRequest, errs.Translate(trans))
	}
	return nil
}

func translateError(err error, trans ut.Translator) (errs []string) {
	if err == nil {
		return nil
	}
	validatorErrs := err.(validator.ValidationErrors)
	for _, e := range validatorErrs {
		translatedErr := fmt.Errorf(e.Translate(trans))
		errs = append(errs, translatedErr.Error())
	}
	return errs
}
