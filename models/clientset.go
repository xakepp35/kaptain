package models

import (
	"github.com/xakepp35/kaptain/config"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

//K8sClientset return the client of k8s
func K8sClientset(kubeConfPath string) (*kubernetes.Clientset, error) {
	var conf *rest.Config
	var err error
	if config.Data.DebugMode == 0 {
		conf, err = clientcmd.BuildConfigFromFlags("", kubeConfPath)
	} else {
		conf, err = rest.InClusterConfig()
	}
	if err != nil {
		//log.Errorf(errors.GettingConfig, err)
		return nil, err
	}
	clientset, err := kubernetes.NewForConfig(conf)
	if err != nil {
		//log.Errorf(errors.NewForConfig, err)
		return nil, err
	}

	return clientset, nil
}
