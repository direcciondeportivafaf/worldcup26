interface ApiLogEntry {
  id: number;
  timestamp: Date;
  url: string;
  method: string;
  status: number | null;
  duration: number;
  responseSize: number;
  success: boolean;
  error?: string;
}

interface ClientInfo {
  id: string;
  lastSeen: number;
  firstSeen: number;
  userAgent: string;
  visits: number;
}

let logEntries: ApiLogEntry[] = [];
let nextId = 1;
let listeners: (() => void)[] = [];

const ACTIVE_CLIENTS_KEY = 'wc26_console_clients';
const ALL_CLIENTS_KEY = 'wc26_console_all_clients';
const CLIENT_ID_KEY = 'wc26_console_client_id';

// Persistent client ID across reloads
function getOrCreateClientId(): string {
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2, 10);
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}
const CLIENT_ID = getOrCreateClientId();

function notifyListeners() {
  listeners.forEach(fn => fn());
}

export function subscribeLogs(fn: () => void): () => void {
  listeners.push(fn);
  return () => { listeners = listeners.filter(l => l !== fn); };
}

export function getLogEntries(): ApiLogEntry[] {
  return logEntries;
}

// Client tracking — active (last 15s) and all-time unique
function updateClientHeartbeat() {
  const now = Date.now();
  const ua = navigator.userAgent.slice(0, 100);

  // Active clients (pruned)
  const active: Record<string, ClientInfo> = JSON.parse(localStorage.getItem(ACTIVE_CLIENTS_KEY) || '{}');
  active[CLIENT_ID] = {
    id: CLIENT_ID,
    lastSeen: now,
    firstSeen: active[CLIENT_ID]?.firstSeen || now,
    userAgent: ua,
    visits: (active[CLIENT_ID]?.visits || 0) + 1,
  };
  Object.keys(active).forEach(id => {
    if (now - active[id].lastSeen > 15000) delete active[id];
  });
  localStorage.setItem(ACTIVE_CLIENTS_KEY, JSON.stringify(active));

  // All-time unique clients (never pruned)
  const all: Record<string, ClientInfo> = JSON.parse(localStorage.getItem(ALL_CLIENTS_KEY) || '{}');
  all[CLIENT_ID] = {
    id: CLIENT_ID,
    lastSeen: now,
    firstSeen: all[CLIENT_ID]?.firstSeen || now,
    userAgent: ua,
    visits: (all[CLIENT_ID]?.visits || 0) + 1,
  };
  localStorage.setItem(ALL_CLIENTS_KEY, JSON.stringify(all));
}

export function getConnectedClients(): ClientInfo[] {
  const active: Record<string, ClientInfo> = JSON.parse(localStorage.getItem(ACTIVE_CLIENTS_KEY) || '{}');
  const now = Date.now();
  return Object.values(active).filter(c => now - c.lastSeen < 15000);
}

export function getAllUniqueClients(): ClientInfo[] {
  const all: Record<string, ClientInfo> = JSON.parse(localStorage.getItem(ALL_CLIENTS_KEY) || '{}');
  return Object.values(all).sort((a, b) => b.lastSeen - a.lastSeen);
}

export function getClientId(): string {
  return CLIENT_ID;
}

// Stats
export function getRequestsPerMinute(): number {
  const oneMinAgo = Date.now() - 60000;
  return logEntries.filter(e => e.timestamp.getTime() > oneMinAgo).length;
}

export function getTotalRequests(): number {
  return logEntries.length;
}

export function getSuccessRate(): number {
  if (logEntries.length === 0) return 100;
  const success = logEntries.filter(e => e.success).length;
  return Math.round((success / logEntries.length) * 100);
}

export function getAvgResponseTime(): number {
  if (logEntries.length === 0) return 0;
  const total = logEntries.reduce((sum, e) => sum + e.duration, 0);
  return Math.round(total / logEntries.length);
}

// Intercept fetch
const originalFetch = window.fetch;

window.fetch = async function (...args: Parameters<typeof fetch>): Promise<Response> {
  const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
  const method = (args[1]?.method as string) || 'GET';

  if (!url.includes('/api/') && !url.includes('football-data.org') && !url.includes('site.api.espn.com')) {
    return originalFetch.apply(this, args);
  }

  const entry: ApiLogEntry = {
    id: nextId++,
    timestamp: new Date(),
    url,
    method,
    status: null,
    duration: 0,
    responseSize: 0,
    success: false,
  };

  const start = performance.now();

  try {
    const response = await originalFetch.apply(this, args);
    const duration = performance.now() - start;

    let responseSize = 0;
    try {
      const clone = response.clone();
      const text = await clone.text();
      responseSize = text.length;
    } catch {}

    entry.status = response.status;
    entry.duration = Math.round(duration);
    entry.responseSize = responseSize;
    entry.success = response.ok;

    logEntries = [entry, ...logEntries].slice(0, 200);
    notifyListeners();

    return response;
  } catch (err) {
    const duration = performance.now() - start;
    entry.duration = Math.round(duration);
    entry.error = err instanceof Error ? err.message : 'Network error';
    entry.success = false;

    logEntries = [entry, ...logEntries].slice(0, 200);
    notifyListeners();

    throw err;
  }
};

// Heartbeat interval
setInterval(updateClientHeartbeat, 5000);
updateClientHeartbeat();
