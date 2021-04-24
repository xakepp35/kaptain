package main

import (
	"context"
	"net/http"
	"os"
	"time"

	socketio "github.com/googollee/go-socket.io"

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

	sio, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatalf(errors.APIFailed, "socketio.NewServer()", err)
	}

	// socket.io handlers
	sio.OnConnect("/", controllers.SIOConnect())
	sio.OnDisconnect("/", controllers.SIODisconnect())
	sio.OnError("/", controllers.SIOError())
	sio.OnEvent("/pods", "delete", controllers.SIOPodsDelete())

	// htto handlers
	http.Handle("/", controllers.FileServer(assetsDirectory))
	http.Handle("/socket.io/", sio)
	http.Handle("/api/ping", controllers.Ping())
	http.Handle("/api/k8s/server/version", controllers.K8sServerVersion())
	http.Handle("/api/k8s/pods/list", controllers.PodsList())
	http.Handle("/api/k8s/pods/delete", controllers.PodsDelete())

	// start processors
	go processors.PodsListWatch(ctx, sio)

	log.Infof("Service %s is listening on %s", appName, config.Data.APIEndpoint)
	err = http.ListenAndServe(config.Data.APIEndpoint, nil)
	if err != nil {
		log.Fatalf(errors.APIFailed, "http.ListenAndServe()", err)
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
