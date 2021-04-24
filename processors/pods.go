package processors

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/xakepp35/kaptain/models"
	v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/watch"

	log "github.com/sirupsen/logrus"
)

var PodsMap sync.Map

const periodWatchRestart = 10 * time.Minute

func PodsMapCopy() map[types.UID]*v1.Pod {
	podsMap := make(map[types.UID]*v1.Pod)
	PodsMap.Range(func(k, v interface{}) bool {
		podsMap[k.(types.UID)] = v.(*v1.Pod)
		return true
	})
	return podsMap
}

func PodsListWatch(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		default:
			/*log.Debugf("Fetching pods list")
			podsList, err := models.PodsList(ctx)
			if err != nil {
				time.Sleep(1 * time.Second)
				continue
			}
			log.Debugf("Fetched pods list with %d pods", len(podsList.Items))
			for i := range podsList.Items {
				PodsMap.Store(podsList.Items[i].UID, &podsList.Items[i])
			}*/
			watchEntity, err := models.PodsWatch(ctx)
			if err != nil {
				time.Sleep(1 * time.Second)
				continue
			}
			log.Debugf("Starting pods watch")
			PodsEventsWorker(ctx, watchEntity.ResultChan())
		}
	}
}

func PodsEventsWorker(ctx context.Context, eventCh <-chan watch.Event) error {
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case event, ok := <-eventCh:
			if !ok {
				// the channel got closed
				return fmt.Errorf("Kubernetes hung up on us, restarting event watcher")
			}
			podEntity := event.Object.(*v1.Pod)
			log.Debugf("Event: %s, Entity: Pod", event.Type)
			switch event.Type {
			case watch.Added, watch.Modified:
				PodsMap.Store(podEntity.UID, podEntity)
			case watch.Deleted:
				PodsMap.Delete(podEntity.UID)
			}
		case <-time.After(periodWatchRestart):
			// deal with the issue where we get no events
			return fmt.Errorf("Timeout, restarting event watcher")
		}
	}
}
