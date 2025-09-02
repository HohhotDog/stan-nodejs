function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
export function sha256Hex(_x) {
  return _sha256Hex.apply(this, arguments);
}
function _sha256Hex() {
  _sha256Hex = _asyncToGenerator(function* (blob) {
    var arr = yield blob.arrayBuffer();
    var digest = yield crypto.subtle.digest('SHA-256', arr);
    return toHex(new Uint8Array(digest));
  });
  return _sha256Hex.apply(this, arguments);
}
export function toHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}