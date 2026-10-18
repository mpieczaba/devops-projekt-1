SHELL := /bin/sh

FRONTEND_DIR := frontend/cinema-ticket-system-front
BACKEND_JAR := target/cinema-tickets-system-0.0.1-SNAPSHOT.jar
FRONTEND_DIST := $(FRONTEND_DIR)/dist/cinema-ticket-system-front/browser

.PHONY: build backend frontend verify clean test

build: backend frontend verify

backend:
	./mvnw -q package -DskipTests

frontend:
	npm --prefix $(FRONTEND_DIR) ci
	npm --prefix $(FRONTEND_DIR) run build -- --configuration production

verify:
	test -f "$(BACKEND_JAR)"
	test -f "$(FRONTEND_DIST)/index.html"

test:
	./mvnw test
	npm --prefix $(FRONTEND_DIR) test

clean:
	./mvnw clean
	rm -rf "$(FRONTEND_DIR)/dist"
