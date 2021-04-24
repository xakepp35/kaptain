package controllers

import (
	"net/http"

	"github.com/xakepp35/kaptain/errors"
	"github.com/xakepp35/kaptain/models"
)

//K8sServerVersion retreive k8s *version.Info
func K8sServerVersion() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			k8sInfo, err := models.K8sServerVersionQuery()
			if err != nil {
				InternalServerError(w, errors.APIFailed, "models.K8sServerVersionQuery()", err)
				return
			}
			RespondJSON(w, k8sInfo)
		default:
			MethodNotAllowed(w, r)
		}
	}
}
