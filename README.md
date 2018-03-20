# Rio/OS UI - Nilavu

This README outlines the details of collaborating on this Ember application.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)

* Download [Node.js 8.9.4](https://nodejs.org/dist/v8.9.4/node-v8.9.4-linux-x64.tar.xz)

```
wget https://nodejs.org/dist/v8.9.4/node-v8.9.4-linux-x64.tar.xz
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

* Install [Yarn](https://yarnpkg.com/en/)

```

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update && sudo apt-get install yarn

```

* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)
* [Rio/OS API servr](https://gitlab.com/rioos/aran)


## Installation

* `git clone <forked-nilavu-repository-url>` this repository
* change into the new directory

```
cd nilavu
yarn install
```

## Running / Development

* `yarn start`
* Visit your app at [https://localhost:8000](https://localhost:8000).

## How does SSL work  

The ssl certificated are automatically pulled by `ember serve` from the `nilavu/ssl/`  directory.

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
## Configuration config/ui.toml

The file needs to be in $RIOOS_HOME/config (or) projectdir/config

```
##############################################
# This is a TOML UI Configuration for Rio/OS.
# Boom.
##############################################
title = "UI Configuration for Rio/OS"

## api host that nilavu will connect to
http_api = "localhost:9636"

## auth_server that nilavu will connect to
auth_server = "localhost:9636"

## watch_server is a host that the nilavu will connect to for real time triggers on
## update to resources.
watch_server = "https://localhost:7000"

## vnc server that we connect to using insecure mode.
## replace it to wss if we wish to connect via secure mode.
vnc_server = "ws://localhost:9000"

```

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

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
yarn cache clean
rm -rf dist
rm -rf node_modules
yarn install
```

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
