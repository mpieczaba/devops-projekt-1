SHELL := /bin/sh

FRONTEND_DIR := frontend/cinema-ticket-system-front
BACKEND_JAR := target/cinema-tickets-system-0.0.1-SNAPSHOT.jar
FRONTEND_DIST := $(FRONTEND_DIR)/dist/cinema-ticket-system-front/browser

PACKER_DIR := packer
BASE_BOX := bento/ubuntu-24.04
BASE_BOX_VERSION := 202510.26.0
BOX_NAME := cinema/ubuntu-24.04-base
BOX_FILE := $(PACKER_DIR)/output/package.box

VAGRANT_INVENTORY := .vagrant/provisioners/ansible/inventory

.PHONY: build backend frontend verify-artifacts clean test box up verify

build: backend frontend verify-artifacts

backend:
	./mvnw -q package -DskipTests

frontend:
	npm --prefix $(FRONTEND_DIR) ci
	npm --prefix $(FRONTEND_DIR) run build -- --configuration production

verify-artifacts:
	test -f "$(BACKEND_JAR)"
	test -f "$(FRONTEND_DIST)/index.html"

test:
	./mvnw test
	npm --prefix $(FRONTEND_DIR) test

# VM base image added to Vagrant via $(BOX_NAME)
box:
	@vagrant box list | grep -q "^$(BASE_BOX) .*$(BASE_BOX_VERSION)" || \
		vagrant box add $(BASE_BOX) --box-version $(BASE_BOX_VERSION) --provider virtualbox
	packer init $(PACKER_DIR)
	packer validate -var source_box_version=$(BASE_BOX_VERSION) $(PACKER_DIR)
	packer build -force -var source_box_version=$(BASE_BOX_VERSION) $(PACKER_DIR)
	vagrant box add --force --name $(BOX_NAME) $(BOX_FILE)

# Full environment
up: build
	vagrant up --provider=virtualbox

# Safety tests and accessibility tests
verify:
	ANSIBLE_CONFIG=ansible/ansible.cfg ansible-playbook -i $(VAGRANT_INVENTORY) ansible/tests/verify.yml

clean:
	./mvnw clean
	rm -rf "$(FRONTEND_DIR)/dist"
	rm -rf "$(PACKER_DIR)/output"
