package controllers

import (
	"net/http"
)

func Ping() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		Pong(w, r)
	}
}
