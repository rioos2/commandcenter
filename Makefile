WWW_PATH=$(RIOOS_HOME)/www

UNAME_S := $(shell uname -s)

define NOT_SET_RIOOS_HOME
FATAL: you must set RIOOS_HOME, eg: 'mkdir ~/code/rioos/home; export RIOOS_HOME=~/code/rioos/home'.
	   Export the RIOOS_HOME variable in ~/.bashrc to make it permanent
endef

define NOT_FOUND_EMBER
FATAL: you must setup ember globally, (or) ./node_modules/.bin/ember
	   Run 'make dev' to fix the problem.
endef


define NOT_FOUND_ESLINT
FATAL: you must setup eslint globally, (or) ./node_modules/.bin/eslint
	   Run 'make dev' to fix the problem.
endef

define NOT_FOUND_JSHINT
FATAL: you must setup jshint globally, (or) ./node_modules/.bin/jshint
	   Run 'make dev' to fix the problem.
endef

ifndef RIOOS_HOME
 $(error $(NOT_SET_RIOOS_HOME))
endif

.DEFAULT_GOAL := build

setup:
	  @echo "» $(RIOOS_HOME)"
ifeq ("$(wildcard $(RIOOS_HOME)/www)","")
	mkdir -p $(RIOOS_HOME)/www  > /dev/null
endif
ifeq (,$(wildcard ./node_modules/.bin/ember))
	$(error $(NOT_FOUND_EMBER))
endif
ifeq (,$(wildcard ./node_modules/.bin/eslint))
	$(error $(NOT_FOUND_ESLINT))
endif
ifeq (,$(wildcard ./node_modules/.bin/jshint))
	$(error $(NOT_FOUND_JSHINT))
endif

initialize: setup

build: initialize buildbin ## builds for prod
.PHONY: build

buildbin:
	yarn build --prod  ## builds the prod binary components
.PHONY: builbin

# We are not ready with lint and scramble,
# So just comment it for now.
#ship: build lint scramble sync
.PHONY: ship sync scramble
ship: build sync scramble
sync:
	rsync -avze "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --delete --progress $(PWD)/node_modules/ $(WWW_PATH)
	rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --delete --progress $(PWD)/dist/ $(WWW_PATH)
	sudo mkdir -p /etc/nginx/sites-available/commandcenter.rioos.sh
	sudo cp $(PWD)/commandcenter_rioos_sh /etc/nginx/sites-available/commandcenter.rioos.sh
	sudo ln -s /etc/nginx/sites-available/commandcenter.rioos.sh /etc.nginx/sites-enabled/commandcenter.rioos.sh
	@systemctl stop nginx
	@systemctl start nginx
	@echo "» Deployed in nginx. Make sure you have an entry for commandcenter.rioos.sh in /etc/hosts"
	@echo "  Watch the asciicast to  add an entry in /etc/hosts https://asciinema.org/a/6KMGPGzyv5lRWRu5woDwDEfjZ"
scramble:
	  yarn scramble

.PHONY: lint eslint
lint:  eslint  ## executes all components' lints
eslint:
	yarn eslint

functional: functional-bin ## executes all the components' functional test suites
functional-bin:
	yarn test
.PHONY: functional functional-bin

clean:
	yarn cache clean
	rm -rf node_modules
	rm -rf tmp
	rm -rf dist
.PHONY: clean

dev:
	@echo "» DEV: yarn install"
	yarn install
	@echo "» DEV: yarn start"
	yarn start
.PHONY: dev

