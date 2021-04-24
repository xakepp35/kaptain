package processors

import (
	"context"
	"fmt"
	"time"

	"github.com/xakepp35/kaptain/models"
	"k8s.io/apimachinery/pkg/watch"

	socketio "github.com/googollee/go-socket.io"
	log "github.com/sirupsen/logrus"
)

const (
	periodWatchRestart = 10 * time.Minute
	periodErrorTimeout = 1 * time.Second
)

func PodsListWatch(ctx context.Context, sio *socketio.Server) {
	for {
		select {
		case <-ctx.Done():
			return
		default:
			watchEntity, err := models.PodsWatch(ctx)
			if err != nil {
				time.Sleep(periodErrorTimeout)
				continue
			}
			log.Debugf("Starting pods watch")
			PodsEventsWorker(ctx, sio, watchEntity.ResultChan())
		}
	}
}

func PodsEventsWorker(ctx context.Context, sio *socketio.Server, eventCh <-chan watch.Event) error {
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
			models.PodsMapEvent(event)
		case <-timerWatchRestart.C:
			// deal with the issue where we get no events
			return fmt.Errorf("Timeout, restarting event watcher")
		}
	}
}
