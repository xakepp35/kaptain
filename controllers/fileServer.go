package controllers

import (
	"net/http"
	"os"
	"path"
)

func FileServer(dir string) http.HandlerFunc {
	fs := http.FileServer(http.Dir(dir))
	return func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			fullPath := dir + path.Clean(r.URL.Path)
			_, err := os.Stat(fullPath)
			if err != nil {
				r.URL.Path = "/"
			}
		}
		fs.ServeHTTP(w, r)
	}
}
