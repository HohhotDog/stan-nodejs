#!/usr/bin/env node
var _args$interval, _args$file;
import { startServer } from './server.js';
function parseArgs(argv) {
  var out = {};
  for (var a of argv) {
    if (!a.startsWith('--')) continue;
    var [k, v] = a.slice(2).split('=');
    out[k] = v !== null && v !== void 0 ? v : 'true';
  }
  return out;
}
var args = parseArgs(process.argv.slice(2));
var interval = Number((_args$interval = args.interval) !== null && _args$interval !== void 0 ? _args$interval : 15) || 15;
var file = String((_args$file = args.file) !== null && _args$file !== void 0 ? _args$file : './data.json');
startServer(interval, file);