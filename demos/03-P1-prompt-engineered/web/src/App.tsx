import { useEffect, useRef, useState } from 'react';
import { api } from './api';
import type { RequestDetail, RequestSummary } from './types';

export default function App() {
  const [requests, setRequests] = useState<RequestSummary[]>([]);
  const [query, setQuery] = useState('');
  const searchInput = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState('');
  const [detail, setDetail] = useState<RequestDetail | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    api.list().then(rows => { if (active) setRequests(rows); })
      .catch(error => { if (active) setError(error instanceof Error ? error.message : 'Loading failed.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!selectedId) return;
    const controller = new AbortController();
    setDetail(null); setDetailLoading(true); setError('');
    api.detail(selectedId, controller.signal).then(setDetail)
      .catch(error => { if (!controller.signal.aborted) setError(error instanceof Error ? error.message : 'Loading failed.'); })
      .finally(() => { if (!controller.signal.aborted) setDetailLoading(false); });
    return () => controller.abort();
  }, [selectedId]);
  function updateSummary(updated: RequestDetail) {
    setRequests(rows => rows.map(row => row.id === updated.id ? updated : row));
  }

  const searchTerm = query.trim().toLowerCase();
  const visibleRequests = searchTerm ? requests.filter(({ municipality, projectTitle }) =>
    municipality.toLowerCase().includes(searchTerm) || projectTitle.toLowerCase().includes(searchTerm)
  ) : requests;
  const selectedRequestHidden = selectedId !== '' && !visibleRequests.some(row => row.id === selectedId);

  function clearSearch() {
    setQuery('');
    searchInput.current?.focus();
  }

  return <main className="workspace"><header className="page-header"><div>
    <p className="eyebrow">MUNICIPAL REQUESTS</p><h1>Request Workbench</h1>
    <p className="muted">See what is missing. Keep the work moving.</p></div></header>
    {error && <p role="alert" className="error">{error}</p>}
    <div className="layout"><aside className="card inbox" aria-label="Requests"><h2>Requests</h2>
      <div className="request-search">
        <label htmlFor="request-search">Search requests</label>
        <input id="request-search" type="search" ref={searchInput} value={query}
          onChange={event => setQuery(event.target.value)} />
        <button type="button" className="secondary" disabled={query === ''} onClick={clearSearch}>Clear search</button>
      </div>
      {loading && <p role="status">Loading requests…</p>}
      {!loading && !error && requests.length === 0 && <p>No requests yet.</p>}
      {!loading && requests.length > 0 && visibleRequests.length === 0 && <p role="status">No requests match your search.</p>}
      <ul>{visibleRequests.map(row => <li key={row.id}><button className={`request-item ${selectedId === row.id ? 'selected' : ''}`}
        disabled={busy} aria-pressed={selectedId === row.id} onClick={() => setSelectedId(row.id)}>
        <strong>{row.municipality || 'Municipality missing'}</strong>
        <span>{row.projectTitle || 'Project title missing'}</span><small>{row.status}</small>
      </button></li>)}</ul></aside>
    <article className="card detail" aria-label="Request details">
      {selectedRequestHidden && <p className="muted" role="status">The open request is outside the current search results.</p>}
      {detailLoading && <p role="status">Loading request…</p>}
      {!detail && !detailLoading && <div className="empty"><h2>Select a request</h2><p>Its details will appear here.</p></div>}
      {detail && <><div className="detail-heading"><h2>{detail.projectTitle || 'Project title missing'}</h2>
        <span className={`badge ${detail.status.toLowerCase()}`}>{detail.status}</span></div>
        <dl><div><dt>Municipality</dt><dd>{detail.municipality || 'Missing'}</dd></div>
        <div><dt>Description</dt><dd>{detail.description || 'No description provided.'}</dd></div>
        <div><dt>Budget attached</dt><dd>{detail.budgetAttached ? 'Yes' : 'No'}</dd></div></dl>
                      {/* TODO BUILD 2: display the server readiness result here. */}

                      {/* TODO BUILD 3: add an editor for the four existing fields. */}

                      {/* TODO BUILD 4: mark reviewed and show its activity entry. */}

      </>}
    </article></div><footer>Request Workbench</footer>
  </main>;
}
