.PHONY: install dev build preview check shots clean

# BASE_URL points the screenshot rig at a running aether-ops instance.
BASE_URL ?= http://localhost:8186

install:
	npm ci

dev:
	npm run dev

# astro check + astro build; the build fails on broken internal links.
build:
	npm run build

preview: build
	npm run preview

check:
	npm run check

# Regenerates the GUI screenshots under src/assets/screenshots/gui from a live
# instance. Never run in CI; the PNGs are committed.
shots:
	BASE_URL=$(BASE_URL) npm run shots

clean:
	rm -rf dist .astro tools/screenshots/.artifacts tools/screenshots/test-results
