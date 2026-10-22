import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Search, SearchX } from "lucide-react";
import api, { errorMessage } from "../api/client";
import { EmptyState, PageSpinner } from "../components/ui";
import { PersonCard } from "../components/FriendButton";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [input, setInput] = useState(q);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => setInput(q), [q]);

  useEffect(() => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    let cancelled = false;
    setResults(undefined);
    setError(null);
    api
      .get("/profiles/search", { params: { q } })
      .then(({ data }) => !cancelled && setResults(data))
      .catch((e) => !cancelled && setError(errorMessage(e)));
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <div className="friends-page">
      <header className="page-head">
        <h1>Search</h1>
      </header>
      <form
        className="input-icon search-page-input"
        onSubmit={(e) => {
          e.preventDefault();
          setParams(input.trim() ? { q: input.trim() } : {});
        }}
      >
        <Search />
        <input className="input" placeholder="Search for people" value={input} onChange={(e) => setInput(e.target.value)} autoFocus />
      </form>
      {error ? (
        <div className="card">
          <EmptyState icon={SearchX} title="Search failed">
            {error}
          </EmptyState>
        </div>
      ) : results === undefined ? (
        <PageSpinner />
      ) : results === null ? (
        <div className="card">
          <EmptyState icon={Search} title="Find people on Mingle">
            Search by name to find friends and send them a request.
          </EmptyState>
        </div>
      ) : results.length ? (
        <div className="people-grid">
          {results.map((p) => (
            <PersonCard key={p._id} person={p} fallback={p.relationship} />
          ))}
        </div>
      ) : (
        <div className="card">
          <EmptyState icon={SearchX} title={`No results for “${q}”`}>
            Check the spelling or try a different name.
          </EmptyState>
        </div>
      )}
    </div>
  );
}
