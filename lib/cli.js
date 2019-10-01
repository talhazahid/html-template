#!/usr/bin/env node
const apath = process.argv[2];
const fullPath = require('path').join(process.cwd(), apath);

const { parseFolder } = require('./parse-folder');

parseFolder(fullPath);
