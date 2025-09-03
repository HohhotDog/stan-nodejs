function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import { sha256Hex } from './hash.js';
var WS_URL = 'ws://localhost:8081';
var logo = document.getElementById('logo');
var images = document.getElementById('images');
var hashBtn = document.getElementById('hashBtn');
var hashing = true;
var ws = null;
var seen = new Set();
function resetUI() {
  logo.classList.remove('shrink');
  images.innerHTML = '';
  images.classList.add('hidden');
  seen.clear();
}
function connect() {
  ws = new WebSocket(WS_URL);
  ws.onopen = () => console.log('Connected to server');
  ws.onmessage = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (evt) {
      var _ws;
      var msg = JSON.parse(String(evt.data));
      if (seen.has(msg.id)) return;
      seen.add(msg.id);
      var proxied = "/proxy?u=".concat(encodeURIComponent(msg.image));
      var res = yield fetch(proxied, {
        cache: 'force-cache'
      });
      if (!res.ok) {
        console.warn('proxy fetch failed', msg.id, res.status);
        return;
      }
      var blob = yield res.blob();
      var url = URL.createObjectURL(blob);
      var img = document.createElement('img');
      img.src = url;
      img.alt = String(msg.id);
      img.dataset.id = String(msg.id);
      images.appendChild(img);
      if (!logo.classList.contains('shrink')) {
        logo.classList.add('shrink');
        images.classList.remove('hidden');
      }
      var payload = {
        id: msg.id,
        hash: null
      };
      if (hashing) {
        try {
          payload.hash = yield sha256Hex(blob);
        } catch (_unused) {
          payload.hash = null;
        }
      }
      (_ws = ws) === null || _ws === void 0 || _ws.send(JSON.stringify(payload));
    });
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
  ws.onclose = () => {
    console.log('Disconnected from server');
    resetUI();
    setTimeout(connect, 1500);
  };
  ws.onerror = () => {
    var _ws2;
    return (_ws2 = ws) === null || _ws2 === void 0 ? void 0 : _ws2.close();
  };
}
hashBtn.addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();
  hashing = !hashing;
  hashBtn.textContent = "Hashing: ".concat(hashing ? 'ON' : 'OFF');
  hashBtn.setAttribute('aria-pressed', hashing ? 'true' : 'false');
});
connect();