#!/bin/bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $DIR/app
DEST=/home/wiewarmmobile/public_html/
npm run-script build
scp -r build/* m.wiewarm.ch:$DEST
