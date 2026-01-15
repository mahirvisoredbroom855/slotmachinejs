import { auth } from "./firebase";

// ✅ Firebase Functions base URL (function name is "api")
// IMPORTANT: no trailing slash
const API_BASE_URL = "https://us-central1-slotlab-4bc1e.cloudfunctions.net/api";

async function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return await user.getIdToken();
}

// Normalize endpoint to always start with "/"
function normalizeEndpoint(endpoint: string): string {
  if (!endpoint) return "/";
  return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  const path = normalizeEndpoint(endpoint);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  // ✅ Robust error parsing: functions sometimes return HTML/text on errors
  if (!response.ok) {
    const text = await response.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json.error || json.message || "API request failed");
    } catch {
      throw new Error(text || `API request failed (${response.status})`);
    }
  }

  // ✅ Some endpoints might return empty body (204, etc.)
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

async function downloadFile(path: string, filename: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}${normalizeEndpoint(path)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const text = await response.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json.error || json.message || "Download failed");
    } catch {
      throw new Error(text || `Download failed (${response.status})`);
    }
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  // Cleanup
  window.URL.revokeObjectURL(url);
}

export const api = {
  // ✅ endpoints are "/init" NOT "/api/init"
  init: () => apiRequest("/init", { method: "POST" }),

  spin: (lines: number, betPerLine: number) =>
    apiRequest("/spin", {
      method: "POST",
      body: JSON.stringify({ lines, betPerLine }),
    }),

  getStats: () => apiRequest("/stats"),

  simulate: (trials: number, lines: number, betPerLine: number) =>
    apiRequest("/simulate", {
      method: "POST",
      body: JSON.stringify({ trials, lines, betPerLine }),
    }),

  exportJSON: () => downloadFile("/export/json", `slotlab-export-${Date.now()}.json`),

  exportXML: () => downloadFile("/export/xml", `slotlab-export-${Date.now()}.xml`),
};
