import { useMemo, useState } from "react";
import { compareHar, type DiffRow, type ChangeKind } from "./diff";

type Loaded = { name: string; value: unknown };

export default function App() {
  const [before, setBefore] = useState<Loaded | null>(null);
  const [after, setAfter] = useState<Loaded | null>(null);
  const [filter, setFilter] = useState<"all" | ChangeKind>("all");
  const [error, setError] = useState("");

  async function load(file: File, side: "before" | "after") {
    try {
      const value: unknown = JSON.parse(await file.text());
      if (!(value as any)?.log || !Array.isArray((value as any).log.entries)) {
        throw new Error("Expected a HAR file with log.entries[].");
      }
      (side === "before" ? setBefore : setAfter)({ name: file.name, value });
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read this HAR file.");
    }
  }

  const rows = useMemo<DiffRow[]>(() => {
    if (!before || !after) return [];
    try { return compareHar(before.value, after.value); }
    catch { return []; }
  }, [before, after]);

  const visible = rows.filter((row) => filter === "all" || row.kind === filter);
  const counts = rows.reduce<Record<ChangeKind, number>>((acc, row) => {
    acc[row.kind]++; return acc;
  }, { added: 0, removed: 0, changed: 0, unchanged: 0 });

  return <main className="shell">
    <header className="hero">
      <div className="eyebrow">LOCAL NETWORK TOOL</div>
      <h1>HAR <span>Diff</span> Viewer</h1>
      <p>Compare two browser network captures. Your files stay in this tab.</p>
    </header>
    <section className="upload-grid">
      <label className="upload-card">
        <span className="step">01 / BASELINE</span><strong>{before?.name || "Choose the first HAR file"}</strong>
        <input type="file" accept=".har,application/json" onChange={(e) => e.target.files?.[0] && load(e.target.files[0], "before")} />
      </label>
      <label className="upload-card">
        <span className="step">02 / NEW CAPTURE</span><strong>{after?.name || "Choose the second HAR file"}</strong>
        <input type="file" accept=".har,application/json" onChange={(e) => e.target.files?.[0] && load(e.target.files[0], "after")} />
      </label>
    </section>
    {error && <p className="error">{error}</p>}
    {rows.length > 0 && <>
      <section className="stats">
        {(["added", "removed", "changed", "unchanged"] as ChangeKind[]).map((kind) =>
          <button key={kind} className={"stat " + kind} onClick={() => setFilter(filter === kind ? "all" : kind)}>
            <strong>{counts[kind]}</strong><span>{kind}</span>
          </button>
        )}
      </section>
      <div className="toolbar">
        <h2>Request changes</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
          <option value="all">All requests</option><option value="added">Added</option>
          <option value="removed">Removed</option><option value="changed">Changed</option><option value="unchanged">Unchanged</option>
        </select>
      </div>
      <div className="table-wrap"><table>
        <thead><tr><th>Request</th><th>Change</th><th>Status</th><th>Time</th><th>Size</th></tr></thead>
        <tbody>{visible.map((row) => <tr key={row.key}>
          <td className="endpoint">{row.key}</td><td><span className={"pill " + row.kind}>{row.kind}</span></td>
          <td>{row.before?.response?.status ?? "—"} → {row.after?.response?.status ?? "—"}</td>
          <td>{Math.round(row.before?.time ?? 0)} → {Math.round(row.after?.time ?? 0)} ms</td>
          <td>{row.before?.response?.content?.size ?? "—"} → {row.after?.response?.content?.size ?? "—"} B</td>
        </tr>)}</tbody>
      </table></div>
    </>}
    <footer>Processed locally · No account · No upload · HAR data is cleared when this tab is closed</footer>
  </main>;
}
