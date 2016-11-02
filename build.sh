#!/usr/bin/env bash
npm run start
rm -rf ./require && mkdir require && cp ./build/require.js ./require/index.js