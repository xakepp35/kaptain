package models

import (
	"context"
	"sync"

	"github.com/xakepp35/kaptain/config"
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/watch"
)

var PodsMap sync.Map

func PodsMapCopy() map[types.UID]*v1.Pod {
	podsMap := make(map[types.UID]*v1.Pod)
	PodsMap.Range(func(k, v interface{}) bool {
		podsMap[k.(types.UID)] = v.(*v1.Pod)
		return true
	})
	return podsMap
}

func PodsMapEvent(event watch.Event) *v1.Pod {
	podEntity := event.Object.(*v1.Pod)
	switch event.Type {
	case watch.Added, watch.Modified:
		PodsMap.Store(podEntity.UID, podEntity)
	case watch.Deleted:
		PodsMap.Delete(podEntity.UID)
	}
	return podEntity
}

//PodsList return the Pods from k8s
func PodsList(ctx context.Context) (*v1.PodList, error) {
	clientset, err := K8sClientset(config.Data.KubeConfigPath)
	if err != nil {
		return nil, err
	}
	podsList, err := clientset.
		CoreV1().
		Pods("").
		List(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}
	return podsList, nil
}

//PodsWatch return the watch pods events interface from k8s
func PodsWatch(ctx context.Context) (watch.Interface, error) {
	clientset, err := K8sClientset(config.Data.KubeConfigPath)
	if err != nil {
		return nil, err
	}
	podsWatch, err := clientset.
		CoreV1().
		Pods("").
		Watch(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}
	return podsWatch, nil
}

//PodsDelete func
func PodsDelete(ctx context.Context, podNamespace, podName string) error {
	clientset, err := K8sClientset(config.Data.KubeConfigPath)
	if err != nil {
		return err
	}
	return clientset.
		CoreV1().
		Pods(podNamespace).
		Delete(ctx, podName, metav1.DeleteOptions{})
}
