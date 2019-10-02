.PHONY: build build-all configure db-create db-migrate install
SHELL:=/bin/bash

build: install configure

build-all: build db-create db-migrate

configure:
	bash -l -c 'source ~/.nvm/nvm.sh && nvm use && npm run configure'

db-create:
	bash -l -c 'source ~/.nvm/nvm.sh && nvm use && npm run db:create || exit 0'

db-migrate:
	bash -l -c 'source ~/.nvm/nvm.sh && nvm use && npm run migrate:up'

db-populate:
	bash -l -c 'source ~/.nvm/nvm.sh && nvm use && npm run db:populate'

install:
	bash -l -c 'source ~/.nvm/nvm.sh && nvm install && nvm use && npm install'
