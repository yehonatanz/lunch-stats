#!/bin/bash
python3 -m http.server --bind 127.0.0.1 --directory docs &
PYTHON_PID=$!
trap "kill $PYTHON_PID" EXIT
while sleep 1; do
    make -s
done
