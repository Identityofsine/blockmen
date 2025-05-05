BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
BUILD_ID=$(git rev-parse --short HEAD)
BRANCH=$(git rev-parse --abbrev-ref HEAD)

nodemon src/blockmen/__init__.py
