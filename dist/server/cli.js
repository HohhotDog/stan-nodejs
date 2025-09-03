#!/usr/bin/env node
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import { startServer } from './server.js';
function parseArgs(argv) {
  var out = {};
  for (var i = 2; i < argv.length; i++) {
    var a = argv[i];
    if (a.startsWith('--')) {
      var [k, v] = a.slice(2).split('=');
      if (k) out[k] = v !== null && v !== void 0 ? v : '1';
    }
  }
  return out;
}
function main() {
  return _main.apply(this, arguments);
}
function _main() {
  _main = _asyncToGenerator(function* () {
    var _args$interval, _args$file, _args$port;
    var args = parseArgs(process.argv);
    var interval = Number((_args$interval = args.interval) !== null && _args$interval !== void 0 ? _args$interval : '15');
    var file = (_args$file = args.file) !== null && _args$file !== void 0 ? _args$file : './data.json';
    var port = Number((_args$port = args.port) !== null && _args$port !== void 0 ? _args$port : '8081');
    console.log("Client Application URL http://localhost:8080");
    yield startServer({
      port,
      intervalSec: interval,
      filePath: file
    });
  });
  return _main.apply(this, arguments);
}
main().catch(e => {
  console.error(e);
  process.exit(1);
});