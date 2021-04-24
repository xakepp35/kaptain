package main

import (
	"context"
	"net/http"
	"os"

	"github.com/xakepp35/kaptain/config"
	"github.com/xakepp35/kaptain/controllers"
	"github.com/xakepp35/kaptain/errors"
	"github.com/xakepp35/kaptain/processors"

	log "github.com/sirupsen/logrus"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	config.Initialize()
	initLogger()

	go processors.PodsListWatch(ctx)

	http.Handle("/api/ping", controllers.Ping())
	http.Handle("/api/k8s/server/version", controllers.K8sServerVersion())
	http.Handle("/api/k8s/pods/list", controllers.PodsList())

	log.Infof("kaptain is listening on %s", config.Data.APIEndpoint)
	err := http.ListenAndServe(config.Data.APIEndpoint, nil)
	if err != nil {
		log.Errorf(errors.APIFailed, "http.ListenAndServe()", err)
	}
}

func initLogger() {
	log.SetOutput(os.Stdout)
	log.SetFormatter(&log.TextFormatter{
		FullTimestamp:          true,
		DisableLevelTruncation: true,
		TimestampFormat:        "2006-01-02T15:04:05",
		PadLevelText:           true,
	})
	log.SetLevel(config.Data.LoggerLevel)
}
