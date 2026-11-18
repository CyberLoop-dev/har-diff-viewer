export type HarEntry = {
  request?: { method?: string; url?: string };
  response?: {
    status?: number;
    content?: { size?: number; mimeType?: string };
    headers?: Array<{ name: string; value: string }>;
  };
  time?: number;
};

export type HarFile = { log?: { entries?: HarEntry[] } };
export type ChangeKind = "added" | "removed" | "changed" | "unchanged";
export type DiffRow = {
  key: string;
  kind: ChangeKind;
  before?: HarEntry;
  after?: HarEntry;
};

function entriesOf(value: unknown): HarEntry[] {
  const entries = (value as HarFile)?.log?.entries;
  if (!Array.isArray(entries)) throw new Error("This file does not contain log.entries[].");
  return entries;
}

function requestKey(entry: HarEntry): string {
  const method = (entry.request?.method || "GET").toUpperCase();
  const url = entry.request?.url || "(missing URL)";
  return method + " " + url;
}

function headerMap(entry?: HarEntry): string {
  const headers = [...(entry?.response?.headers || [])]
    .map((h) => [h.name.toLowerCase(), h.value] as const)
    .sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(headers);
}

function signature(entry?: HarEntry): string {
  if (!entry) return "";
  return JSON.stringify({
    status: entry.response?.status ?? null,
    size: entry.response?.content?.size ?? null,
    mime: entry.response?.content?.mimeType ?? "",
    time: Math.round(entry.time ?? 0),
    headers: headerMap(entry)
  });
}

export function compareHar(beforeValue: unknown, afterValue: unknown): DiffRow[] {
  const before = entriesOf(beforeValue);
  const after = entriesOf(afterValue);
  const left = new Map<string, HarEntry[]>();
  const right = new Map<string, HarEntry[]>();
  for (const entry of before) {
    const key = requestKey(entry);
    left.set(key, [...(left.get(key) || []), entry]);
  }
  for (const entry of after) {
    const key = requestKey(entry);
    right.set(key, [...(right.get(key) || []), entry]);
  }
  const keys = [...new Set([...left.keys(), ...right.keys()])].sort();
  const rows: DiffRow[] = [];
  for (const key of keys) {
    const a = left.get(key) || [];
    const b = right.get(key) || [];
    const count = Math.max(a.length, b.length);
    for (let i = 0; i < count; i++) {
      const oldEntry = a[i];
      const newEntry = b[i];
      const kind: ChangeKind = !oldEntry ? "added" : !newEntry ? "removed"
        : signature(oldEntry) === signature(newEntry) ? "unchanged" : "changed";
      rows.push({ key: count > 1 ? key + " #" + (i + 1) : key, kind, before: oldEntry, after: newEntry });
    }
  }
  return rows;
}
