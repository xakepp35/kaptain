package config

import (
	"os"
	"strconv"
	"time"

	log "github.com/sirupsen/logrus"
)

const (
	EnvAPIEndpoint    = "API_ENDPOINT"
	EnvKubeConfigPath = "KUBE_CONFIG_PATH"
	EnvDebugMode      = "DEBUG_MODE"
	EnvPlatform       = "PLATFORM"
	EnvLoggerLevel    = "LOGGER_LEVEL"
)

type ConfigData struct {
	APIEndpoint    string
	KubeConfigPath string
	DebugMode      int
	LoggerLevel    log.Level
}

var (
	StartTime time.Time
	Data      ConfigData
)

func Initialize() {
	StartTime = time.Now()
	logLevel, _ := log.ParseLevel(GetEnvString(EnvLoggerLevel, "debug"))
	Data = ConfigData{
		APIEndpoint:    GetEnvString(EnvAPIEndpoint, ":8765"),
		KubeConfigPath: GetEnvString(EnvKubeConfigPath, "kube/config"),
		LoggerLevel:    logLevel,
	}
}

func GetEnvString(key string, def string) string {
	result := os.Getenv(key)
	if result == "" {
		return def
	}
	return result
}

func GetEnvInt(key string, def int) int {
	str := os.Getenv(key)
	result, err := strconv.Atoi(str)
	if err != nil {
		return def
	}
	return result
}
