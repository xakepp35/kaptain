package processors

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/kataras/neffos"
	"github.com/xakepp35/kaptain/errors"
	"github.com/xakepp35/kaptain/models"
	"k8s.io/apimachinery/pkg/watch"

	log "github.com/sirupsen/logrus"
)

const (
	periodWatchRestart = 10 * time.Minute
	periodErrorTimeout = 1 * time.Second
)

func PodsListWatch(ctx context.Context, sio *neffos.Server) {
	for {
		select {
		case <-ctx.Done():
			return
		default:
			watchEntity, err := models.PodsWatch(ctx)
			if err != nil {
				log.Errorf(errors.APIFailed, "models.PodsWatch()", err)
				time.Sleep(periodErrorTimeout)
				continue
			}
			log.Debugf("Starting pods watch")
			PodsEventsWorker(ctx, sio, watchEntity.ResultChan())
		}
	}
}

func PodsEventsWorker(ctx context.Context, wsServer *neffos.Server, eventCh <-chan watch.Event) error {
	timerWatchRestart := time.NewTimer(periodWatchRestart)
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case event, ok := <-eventCh:
			if !ok {
				return fmt.Errorf("Watch channel closed")
			}
			log.Debugf("Event: %s, Entity: Pod", event.Type)
			switch event.Type {
			case watch.Added, watch.Modified:
				podEntity := models.PodsMapAdd(event.Object)
				jsPod, _ := json.Marshal(podEntity)
				wsServer.Broadcast(nil, neffos.Message{
					Namespace: "default",
					Room:      "pods",
					Event:     "add",
					Body:      jsPod,
				})
			case watch.Deleted:
				podEntity := models.PodsMapDel(event.Object)
				wsServer.Broadcast(nil, neffos.Message{
					Namespace: "default",
					Room:      "pods",
					Event:     "del",
					Body:      []byte(podEntity.UID),
				})
			case watch.Error:
				//log.Errorf
			}
		case <-timerWatchRestart.C:
			// deal with the issue where we get no events
			return fmt.Errorf("Timeout, restarting event watcher")
		}
	}
}
