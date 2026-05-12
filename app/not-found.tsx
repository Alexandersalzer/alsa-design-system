export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>404 — Page not found</h1>
      <a href="/docs">Back to docs</a>
    </div>
  );
}
