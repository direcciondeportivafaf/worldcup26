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
  userAgent: string;
}

let logEntries: ApiLogEntry[] = [];
let nextId = 1;
let listeners: (() => void)[] = [];

const CLIENT_KEY = 'wc26_console_client';
const HEARTBEAT_KEY = 'wc26_console_heartbeat';
const CLIENTS_KEY = 'wc26_console_clients';
const CLIENT_ID = Math.random().toString(36).slice(2, 10);

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

// Client tracking
function updateClientHeartbeat() {
  const now = Date.now();
  const clients: Record<string, ClientInfo> = JSON.parse(localStorage.getItem(CLIENTS_KEY) || '{}');
  clients[CLIENT_ID] = { id: CLIENT_ID, lastSeen: now, userAgent: navigator.userAgent.slice(0, 80) };
  // Prune stale clients (older than 15s)
  Object.keys(clients).forEach(id => {
    if (now - clients[id].lastSeen > 15000) delete clients[id];
  });
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function getConnectedClients(): ClientInfo[] {
  const clients: Record<string, ClientInfo> = JSON.parse(localStorage.getItem(CLIENTS_KEY) || '{}');
  const now = Date.now();
  return Object.values(clients).filter(c => now - c.lastSeen < 15000);
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

  // Only log our API calls
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
