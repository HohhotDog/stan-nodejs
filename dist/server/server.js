function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import { WebSocketServer } from 'ws';
import { readDataFile, fetchBufferWithFallback, sha256Hex, color } from './helpers.js';
export function startServer(_x) {
  return _startServer.apply(this, arguments);
}
function _startServer() {
  _startServer = _asyncToGenerator(function* (_ref) {
    var {
      port,
      intervalSec,
      filePath
    } = _ref;
    var wss = new WebSocketServer({
      port
    });
    console.log("Server Application URL ws://localhost:".concat(port));
    var data = yield readDataFile(filePath);
    var idx = 0;
    var clients = new Set();
    var broadcastCurrent = () => {
      var item = data[idx];
      var payload = {
        id: item.id,
        image: item.image
      };
      var text = JSON.stringify(payload);
      for (var ws of clients) {
        if (ws.readyState === ws.OPEN) ws.send(text);
      }
    };
    var advance = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(function* () {
        idx++;
        if (idx >= data.length) {
          try {
            data = yield readDataFile(filePath);
            idx = 0;
            broadcastCurrent();
          } catch (e) {
            console.error(color.red("Re-parse failed: ".concat(String(e))));
            idx = 0;
          }
          return;
        }
        broadcastCurrent();
      });
      return function advance() {
        return _ref2.apply(this, arguments);
      };
    }();
    var timer = setInterval(() => {
      advance().catch(() => {});
    }, intervalSec * 1000);
    wss.on('connection', ws => {
      clients.add(ws);
      broadcastCurrent();
      ws.on('message', /*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator(function* (raw) {
          var msg = null;
          try {
            msg = JSON.parse(String(raw));
          } catch (_unused) {/* ignore */}
          if (!msg || typeof msg.id !== 'number') return;
          var item = data.find(d => d.id === msg.id);
          var imageUrl = item === null || item === void 0 ? void 0 : item.image;
          if (!imageUrl) return;
          try {
            var _msg$hash;
            var buf = yield fetchBufferWithFallback(imageUrl);
            var serverHash = sha256Hex(buf);
            var line = "{ id: ".concat(msg.id, ", hash: ").concat((_msg$hash = msg.hash) !== null && _msg$hash !== void 0 ? _msg$hash : 'null', ", image: '").concat(imageUrl, "' }");
            if (msg.hash && msg.hash.toLowerCase() === serverHash.toLowerCase()) {
              console.log(color.green(line));
            } else {
              console.log(color.red(line));
            }
          } catch (e) {
            var _msg$hash2;
            console.log(color.red("{ id: ".concat(msg.id, ", hash: ").concat((_msg$hash2 = msg.hash) !== null && _msg$hash2 !== void 0 ? _msg$hash2 : 'null', ", image: '").concat(imageUrl, "' }")));
            console.error(color.dim("  fetch/hash error: ".concat(String(e))));
          }
        });
        return function (_x2) {
          return _ref3.apply(this, arguments);
        };
      }());
      ws.on('close', () => {
        clients.delete(ws);
      });
      ws.on('error', () => {/* swallow */});
    });
    wss.on('close', () => clearInterval(timer));
    return wss;
  });
  return _startServer.apply(this, arguments);
}