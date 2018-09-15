# Rio/OS UI - CommandCenter

This README outlines the details of collaborating on this Ember application.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)

### Install Node 10

[Why Node 10](https://github.com/nodejs/Release#release-schedule) The release of Node 10 is `Oct
2018`. So its safe to get in now. 

* Download [Node.js 10.7+](https://nodejs.org/dist/v10.7.0/node-v10.7.0-linux-x64.tar.xz)

Either way in prod we run behind a nginx  proxy, and are not dependent on service side node.

```

wget https://nodejs.org/dist/v10.7.0/node-v10.7.0-linux-x64.tar.xz

```

* Unzip downloaded tar to ~/software

```

tar -xvf node-*.tar.xz

```

* Export PATH and NODE_HOME on ~/.bashrc

```
nano ~/.bashrc

export NODE_HOME=~/software/node

export PATH="$PATH:$NODE_HOME/bin"

```

Close your terminal window  and open it back.

###* Install [Yarn](https://yarnpkg.com/en/)

```

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update && sudo apt-get install yarn

```

* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)
* [Rio/OS API Gateway](https://gitlab.com/rioos/api_gateway)

## RIOOS__HOME

```

mkdir -p ~/code/rioos/home

nano ~/.bashrc

export RIOOS_HOME=~/code/rioos/home

```

## Develop ( Web )
 
### 1. Clone commandcenter

* `git clone <forked-commandcenter-repository-url> -b 2-0-stable` this repository
* change into the new directory


### 2. Run in development

```

make dev

```

Visit your app at [https://localhost:8000](https://localhost:8000).

This runs in headless mode. Needs an api to start chugging. 

### 3. Edit configuration file 
 
The file needs to be in $RIOOS_HOME/config (or) <projectdir>/config.

```

cd commandcenter_v2/config/config

ls 

# You'll see ui.toml

nano ui.toml

# Change the http_api to 

http_api="https://console.rioos.xyz:7443"

```

```
##############################################
# This is a TOML UI Configuration for Rio/OS
# Command Center
##############################################
title = "CommandCenter Configuration for Rio/OS"

## API server endpoint that the commandcenter will connect to
http_api = "https://console.rioos.xyz:7443"

## uwatch_server is a host that the commandcenter will connect to for 
## real time triggers on updating resources.
uwatch_server = "ws://localhost:9443"

## vnc server that we connect to using insecure mode.
## replace it to wss if we wish to connect via secure mode.
vnc_server = "wss://localhost:444"

## Ninja port for connecting to console of containers
container_console_port = "10250"

## The analytics server for marketing. count.ly is used. 
## The url of the  count.ly server.
countly_server = "http://countly.rioos.xyz"

## The api key to connect to the count.ly
app_key = "9653325d8d0f5fe63c3491c93259bf4ff77821ca"

```

###* 4. optional:  Upgrade ember-api-store.

When you wish to upgrade `ember-api-store` from git, 



```
yarn remove ember-api-store

```

* Above command removes the ember-api-store package from package.json

* Add "ember-api-store": "git+https://gitlab.com/rioadvancement/ember-api-store.git#master" in package.json under "devDependencies".

* Install ember-api-store

```
make dev

```

##  Production 


```

make clean 

make build

make ship

```

* Visit your app at [https://localhost:8000](https://localhost:8000).


## Develop ( Desktop App )

```

ember electron

```


## How does SSL work  

The ssl certificated are automatically pulled by `ember serve` from the `commandcenter/ssl/`  directory.

This is due t the property `ssl: true` being turned on.in `.ember-cli` file.

```
{
  /**
    Ember CLI sends analytics information by default. The data is completely
    anonymous, but there are times when you might want to disable this behavior.

    Setting `disableAnalytics` to true will prevent any data from being sent.
  */
  "disableAnalytics" : true,
  "port"             : 8000,
  "host"             : "0.0.0.0",
  "usePods"          : true,
  "ssl"              : true
}

```


### Troubleshooting (dev)

1. Error: ENOSPC.

Ubuntu
```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

Arch Linux
```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.d/99-sysctl.conf
sysctl --system
```

2. SCSS compiler error

```

line 78 of tmp/sass_compiler-input_base_path-FxbFVHBM.tmp/app/styles/dashboard.scss
>>                 @include user-select(none);

```

Do a clean all.

```
make clean
```

3. Disable eslint during test 

 eslint can be disable while doing `yarn test`. 
 
 It can be done by set property in `ember-cli-build.js` 
 
 (enable this line `"hinting: !isTesting"`)

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
