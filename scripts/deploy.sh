#!/bin/bash -ex

git status
current_branch=$(git rev-parse --abbrev-ref HEAD)
npm run build
tmpdir=$(mktemp -d)
mv build $tmpdir
git fetch
git checkout origin/master
rm -rf *
rm -rf .gitignore
cp -R $tmpdir/build/* .
git add *
#git commit -am "Site published at $(date)"
#git push origin HEAD:master
#git checkout $current_branch
