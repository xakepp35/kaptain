package models

import (
	"fmt"

	"github.com/xakepp35/kaptain/config"
	"k8s.io/apimachinery/pkg/version"
)

//K8sServerVersionQuery query the kubernetes api retrive the k8s info
func K8sServerVersionQuery() (*version.Info, error) {
	clientSet, err := K8sClientset(config.Data.KubeConfigPath)
	if err != nil {
		return nil, fmt.Errorf("Error K8sClientset() failed: %v", err)
	}
	kubernetesInfo, err := clientSet.ServerVersion()
	if err != nil {
		return nil, fmt.Errorf("Error clientSet.ServerVersion() failed: %v", err)
	}
	return kubernetesInfo, nil
}
