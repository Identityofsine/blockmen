VITE_BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
VITE_BUILD_ID=$(git rev-parse --short HEAD)
VITE_BRANCH=dev

python ./src/blockmen/__init__.py

