package controllers

import (
	"net/http"

	"github.com/xakepp35/kaptain/processors"
)

func PodsList() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			podList := processors.PodsMapCopy()
			// if err != nil {
			// 	InternalServerError(w, errors.APIFailed, "models.PodsList()", err)
			// 	return
			// }
			RespondJSON(w, podList)
		default:
			MethodNotAllowed(w, r)
		}

	}
}
