#!/bin/bash
VERSION=$1
if [ -z $VERSION ]; then
  echo "version is empty"
  exit 1
fi

echo "version is $VERSION"
pnpm run lint && echo 'lint success' || exit 1
pnpm run test run && echo 'test success' || exit 1
pnpm run clear && echo 'clear success'
pnpm run build && echo 'build success'|| exit 1

echo $VERSION
npm version $VERSION

sh ./tag-current-version.sh
# npm publish --access public