function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import { WebSocketServer } from 'ws';
import { loadData, sha256HexBuffer, green, red } from './helpers.js';
export function startServer(intervalSec, filePath) {
  var port = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 8081;
  var data = loadData(filePath);
  var idx = 0;
  var wss = new WebSocketServer({
    port
  });
  console.log("Server Application URL ws://localhost:".concat(port));
  function sendNext() {
    if (wss.clients.size === 0) return;
    if (idx >= data.length) {
      // Reparse & reset
      data = loadData(filePath);
      idx = 0;
    }
    var payload = data[idx];
    var text = JSON.stringify(payload);
    for (var ws of wss.clients) {
      if (ws.readyState === ws.OPEN) ws.send(text);
    }
    idx++;
  }
  wss.on('connection', ws => {
    // Send the first item immediately
    sendNext();
    ws.on('message', /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* (raw) {
        try {
          var _data$find, _data$find2;
          var msg = JSON.parse(String(raw));
          // Fetch the image and hash
          var res = yield fetch(((_data$find = data.find(d => d.id === msg.id)) === null || _data$find === void 0 ? void 0 : _data$find.image) || '', {
            cache: 'no-store'
          });
          var arrayBuf = yield res.arrayBuffer();
          var buf = Buffer.from(arrayBuf);
          var serverHash = sha256HexBuffer(buf);
          var imageUrl = (_data$find2 = data.find(d => d.id === msg.id)) === null || _data$find2 === void 0 ? void 0 : _data$find2.image;
          var out = {
            id: msg.id,
            hash: msg.hash,
            image: imageUrl
          };
          if (msg.hash && serverHash === msg.hash) {
            console.log(green(JSON.stringify(out)));
          } else {
            console.log(red(JSON.stringify(out)));
          }
        } catch (e) {
          console.error('Error handling message', e);
        }
      });
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  });
  var h = setInterval(sendNext, intervalSec * 1000);
  return () => {
    clearInterval(h);
    wss.close();
  };
}