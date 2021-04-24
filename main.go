package main

import (
	"context"
	"net/http"
	"os"
	"time"

	"github.com/xakepp35/kaptain/config"
	"github.com/xakepp35/kaptain/controllers"
	"github.com/xakepp35/kaptain/errors"
	"github.com/xakepp35/kaptain/processors"

	log "github.com/sirupsen/logrus"
)

const (
	appVersion      = "release-0.1"
	appName         = "kaptain"
	assetsDirectory = "./kaptain_front/build"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	config.Initialize()
	initLogger()
	log.Infof("Starting %s version %s", appName, appVersion)

	go processors.PodsListWatch(ctx)

	http.Handle("/", controllers.FileServer(assetsDirectory))
	http.Handle("/api/ping", controllers.Ping())
	http.Handle("/api/k8s/server/version", controllers.K8sServerVersion())
	http.Handle("/api/k8s/pods/list", controllers.PodsList())
	http.Handle("/api/k8s/pods/delete", controllers.PodsDelete())

	log.Infof("Service %s is listening on %s", appName, config.Data.APIEndpoint)
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
		TimestampFormat:        time.RFC3339Nano,
		PadLevelText:           true,
	})
	log.SetLevel(config.Data.LoggerLevel)
}
