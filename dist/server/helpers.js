function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import { createHash } from 'crypto';
export function sha256Hex(buf) {
  return createHash('sha256').update(buf).digest('hex');
}
export function readDataFile(_x) {
  return _readDataFile.apply(this, arguments);
}
function _readDataFile() {
  _readDataFile = _asyncToGenerator(function* (filePath) {
    var fs = yield import('fs/promises');
    var raw = yield fs.readFile(filePath, 'utf-8');
    var data = JSON.parse(raw);
    var norm = data.filter(Boolean).map(d => ({
      id: Number(d.id),
      image: String(d.image)
    })).filter(d => Number.isFinite(d.id) && d.image);
    if (norm.length === 0) throw new Error('data.json empty or invalid');
    return norm;
  });
  return _readDataFile.apply(this, arguments);
}
export function fetchBufferWithFallback(_x2) {
  return _fetchBufferWithFallback.apply(this, arguments);
}
function _fetchBufferWithFallback() {
  _fetchBufferWithFallback = _asyncToGenerator(function* (url) {
    var tryFetch = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* (u) {
        var r = yield fetch(u, {
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });
        if (!r.ok) throw new Error(String(r.status));
        var ab = yield r.arrayBuffer();
        return Buffer.from(ab);
      });
      return function tryFetch(_x3) {
        return _ref.apply(this, arguments);
      };
    }();
    try {
      return yield tryFetch(url);
    } catch (_unused) {
      var proxied = "http://localhost:8080/proxy?u=".concat(encodeURIComponent(url));
      return yield tryFetch(proxied);
    }
  });
  return _fetchBufferWithFallback.apply(this, arguments);
}
export var color = {
  green: s => "\x1B[32m".concat(s, "\x1B[0m"),
  red: s => "\x1B[31m".concat(s, "\x1B[0m"),
  dim: s => "\x1B[2m".concat(s, "\x1B[0m")
};