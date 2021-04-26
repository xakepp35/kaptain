# kaptain

Kubernetes monitoring and control system

## Installation

1. Build frontend

 - Install `nodejs`

```
# Using Ubuntu
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

 - Install `yarn`

```
# Using Ubuntu
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn
```

 - Install frontend prequesites and build it

```
cd kaptain_front
yarn install
yarn build
```

2. Build backend

 - Install go

https://golang.org/doc/install

 - Build backend

```
go build
```

3. Set up environment

 - Make sure you  are logged in a kubernetes, have valid config with access token with proper RBAC rights

 - Following variables are to be set:

```
API_PORT":"8765",
KUBE_CONFIG_PATH: "/home/user/.kube/config"
KUBERNETES_SERVICE_HOST": "ocp.rct.co.il"
KUBERNETES_SERVICE_PORT": 8443
DEBUG_MODE: 1
LOGGER_LEVEL: "debug"
```

4. Run it

```
./kaptain
```

Navigate to http://localhost:8765