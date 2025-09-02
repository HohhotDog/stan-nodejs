import type { ServerToClient, ClientToServer } from '../shared/types';
import { sha256Hex } from './hash.js';

const WS_URL = 'ws://localhost:8081';
const logo = document.getElementById('logo') as HTMLImageElement;
const images = document.getElementById('images') as HTMLDivElement;
const hashBtn = document.getElementById('hashBtn') as HTMLButtonElement;

let hashing = true;
let ws: WebSocket | null = null;
const seen = new Set<number>();

function resetUI() {
  logo.classList.remove('shrink');
  images.innerHTML = '';
  images.classList.add('hidden');
  seen.clear();
}

function connect() {
  ws = new WebSocket(WS_URL);

  ws.onopen = () => console.log('Connected to server');

  ws.onmessage = async (evt) => {
    const msg: ServerToClient = JSON.parse(String(evt.data));
    if (seen.has(msg.id)) return;
    seen.add(msg.id);

    const proxied = `/proxy?u=${encodeURIComponent(msg.image)}`;
    const res = await fetch(proxied, { cache: 'force-cache' });
    if (!res.ok) { console.warn('proxy fetch failed', msg.id, res.status); return; }
    const blob = await res.blob();

    const url = URL.createObjectURL(blob);
    const img = document.createElement('img');
    img.src = url;
    img.alt = String(msg.id);
    img.dataset.id = String(msg.id);
    images.appendChild(img);

    if (!logo.classList.contains('shrink')) {
      logo.classList.add('shrink');
      images.classList.remove('hidden');
    }


    const payload: ClientToServer = { id: msg.id, hash: null };
    if (hashing) {
      try { payload.hash = await sha256Hex(blob); }
      catch { payload.hash = null; }
    }
    ws?.send(JSON.stringify(payload));
  };

  ws.onclose = () => {
    console.log('Disconnected from server');
    resetUI();
    setTimeout(connect, 1500);
  };

  ws.onerror = () => ws?.close();
}

hashBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  hashing = !hashing;
  hashBtn.textContent = `Hashing: ${hashing ? 'ON' : 'OFF'}`;
  hashBtn.setAttribute('aria-pressed', hashing ? 'true' : 'false');
});

connect();