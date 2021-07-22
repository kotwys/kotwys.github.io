#!/usr/bin/env sh

set -e

if [[ -n $(git status -s) ]]
then
  echo "Dirty git tree."
  exit 1
fi

REPO=ssh://git@github.com/kotwys/kotwys.github.io.git
commit=$(git rev-parse --short HEAD)

[[ -d dist/ ]] && rm -r dist/
yarn build
cd ./build

git init
git add -A
git commit -m "Deploy from @ $commit"

git push -f $REPO main

cd -