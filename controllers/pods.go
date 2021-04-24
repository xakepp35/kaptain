package controllers

import (
	"net/http"

	"github.com/xakepp35/kaptain/errors"
	"github.com/xakepp35/kaptain/models"
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

func PodsDelete() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			urlQuery := r.URL.Query()
			podNamespace, ok := urlQuery["namespace"]
			if !ok {
				BadRequest(w, errors.FieldIsMissing, "namespace")
				return
			}
			podName, ok := urlQuery["name"]
			if !ok {
				BadRequest(w, errors.FieldIsMissing, "name")
				return
			}
			err := models.PodsDelete(r.Context(), podNamespace[0], podName[0])
			if err != nil {
				InternalServerError(w, errors.APIFailed, "models.PodsDelete()", err)
				return
			}
			RequestProcessed(w, r)
		default:
			MethodNotAllowed(w, r)
		}
	}
}
