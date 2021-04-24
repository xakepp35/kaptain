package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/xakepp35/kaptain/errors"
)

func Pong(w http.ResponseWriter, r *http.Request) error {
	w.Header().Set(headerContentType, r.Header.Get(headerContentType))
	w.WriteHeader(http.StatusOK)
	_, err := io.Copy(w, r.Body)
	return err
}

func RespondJSON(w http.ResponseWriter, responseObject interface{}) error {
	return RespondWithJSON(w, http.StatusOK, responseObject)
}

func RespondWithJSON(w http.ResponseWriter, statusCode int, responseObject interface{}) error {
	w.Header().Set(headerContentType, applicationJSON)
	w.WriteHeader(statusCode)
	return json.NewEncoder(w).Encode(responseObject)
}

func RequestProcessed(w http.ResponseWriter, r *http.Request) {
	http.Error(w, fmt.Sprintf(errors.RequestProcessed, r.URL), http.StatusOK)
}

func MethodNotAllowed(w http.ResponseWriter, r *http.Request) {
	http.Error(w, fmt.Sprintf(errors.MethodNotAllowed, r.Method), http.StatusMethodNotAllowed)
}

func NotImplemented(w http.ResponseWriter, r *http.Request) {
	http.Error(w, fmt.Sprintf(errors.MethodNotImplemented, r.Method), http.StatusNotImplemented)
}

func BadRequest(w http.ResponseWriter, format string, args ...interface{}) {
	http.Error(w, fmt.Sprintf(format, args...), http.StatusBadRequest)
}

func InternalServerError(w http.ResponseWriter, format string, args ...interface{}) {
	http.Error(w, fmt.Sprintf(format, args...), http.StatusInternalServerError)
}
