package controllers

import (
	"encoding/json"

	"github.com/kataras/neffos"
	"github.com/xakepp35/kaptain/models"

	log "github.com/sirupsen/logrus"
)

type onConnectFunc func(s *neffos.Conn) error
type onDisonnectFunc func(s *neffos.Conn)
type onUpgradeErrorFunc func(err error)

func SIOConnect() onConnectFunc {
	return func(s *neffos.Conn) error {
		log.Debugf("SIO[%s]: Socket connected: %s", s.ID())
		// podsMap := models.PodsMapCopy()
		// for _, podEntity := range podsMap {
		// 	jsPod, _ := json.Marshal(podEntity)
		// 	sEmit("pod_add", string(jsPod))
		// }
		return nil
	}
}

func SIODisconnect() onDisonnectFunc {
	return func(s *neffos.Conn) {
		log.Debugf("SIO[%s]: Socket disconnected", s.ID())
	}
}

func SIOUpgradeError() onUpgradeErrorFunc {
	return func(err error) {
		log.Debugf("SIO UpgradeError: %v", err)
	}
}

// func SIOError() onErrorFunc {
// 	return func(s socketio.Conn, err error) {
// 		log.Debugf("SIO[%s]: Error happened: %s", s.ID(), err)
// 	}
// }

// func SIOPodsDelete() onEventFunc {
// 	return func(s socketio.Conn, msg string) error {
// 		log.Debugf("SIO: SIOPodsDelete: %s", msg)
// 		//s.Emit("reply", "have "+msg)
// 		return nil
// 	}
// }

func SIONamespaceConnect(c *neffos.NSConn, msg neffos.Message) error {
	log.Debugf("[%s] connected to namespace [%s].", c, msg.Namespace)
	c.JoinRoom(nil, "pods")
	//return
	// if !c.Conn.IsClient() && serverJoinRoom {
	// 	c.JoinRoom(nil, "pods")
	// }

	return nil
}

func SIONamespaceDisconnect(c *neffos.NSConn, msg neffos.Message) error {
	log.Debugf("[%s] disconnected from namespace [%s].", c, msg.Namespace)
	return nil
}

func SIORoomJoined(c *neffos.NSConn, msg neffos.Message) error {
	log.Debugf("[%s] joined to room [%s].", c.Conn.ID(), msg.Room)
	switch msg.Room {
	case "pods":
		podsMap := models.PodsMapCopy()
		for _, podEntity := range podsMap {
			jsPod, _ := json.Marshal(podEntity)
			c.Conn.Write(neffos.Message{
				Namespace: msg.Namespace,
				Room:      "pods",
				Event:     "add",
				Body:      jsPod,
			})
		}
	}
	return nil
}

func SIORoomLeft(c *neffos.NSConn, msg neffos.Message) error {
	log.Debugf("[%s] left from room [%s].", c.Conn.ID(), msg.Room)
	// notify others.
	// if !c.Conn.IsClient() {
	// 	c.Conn.Server().Broadcast(c, neffos.Message{
	// 		Namespace: msg.Namespace,
	// 		Room:      msg.Room,
	// 		Event:     "notify",
	// 		Body:      []byte(text),
	// 	})
	// }
	return nil
}

func SIOPodDelete(c *neffos.NSConn, msg neffos.Message) error {
	// if !c.Conn.IsClient() {
	// 	c.Conn.Server().Broadcast(c, msg)
	// } else {
	// 	var userMsg userMessage
	// 	err := msg.Unmarshal(&userMsg)
	// 	if err != nil {
	// 		log.Fatal(err)
	// 	}
	// 	fmt.Printf("%s >> [%s] says: %s\n", msg.Room, userMsg.From, userMsg.Text)
	// }
	return nil
}
