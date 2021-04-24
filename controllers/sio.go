package controllers

import (
	"encoding/json"

	socketio "github.com/googollee/go-socket.io"
	"github.com/xakepp35/kaptain/models"

	log "github.com/sirupsen/logrus"
)

type onConnectFunc func(s socketio.Conn) error
type onDisonnectFunc func(s socketio.Conn, reason string)
type onEventFunc func(s socketio.Conn, msg string) error
type onErrorFunc func(s socketio.Conn, err error)

func SIOConnect() onConnectFunc {
	return func(s socketio.Conn) error {
		s.SetContext("")
		s.Join("bcast")
		log.Debugf("SIO[%s]: Socket connected: %s", s.ID())
		podsMap := models.PodsMapCopy()
		for _, podEntity := range podsMap {
			jsPod, _ := json.Marshal(podEntity)
			s.Emit("pod_add", string(jsPod))
		}
		return nil
	}
}

func SIODisconnect() onDisonnectFunc {
	return func(s socketio.Conn, reason string) {
		log.Debugf("SIO[%s]: Socket disconnected: %s", s.ID(), reason)
	}
}

func SIOError() onErrorFunc {
	return func(s socketio.Conn, err error) {
		log.Debugf("SIO[%s]: Error happened: %s", s.ID(), err)
	}
}

func SIOPodsDelete() onEventFunc {
	return func(s socketio.Conn, msg string) error {
		log.Debugf("SIO: SIOPodsDelete: %s", msg)
		//s.Emit("reply", "have "+msg)
		return nil
	}
}
