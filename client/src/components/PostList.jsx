import { useEffect, useRef } from "react";
import { Newspaper } from "lucide-react";
import { useAppSelector } from "../store";
import { EmptyState, Spinner } from "./ui";
import PostCard from "./PostCard";

export function PostSkeleton() {
  return (
    <div className="card post" aria-hidden="true">
      <div className="post-head">
        <span className="skeleton" style={{ width: 44, height: 44, borderRadius: "50%" }} />
        <div className="grow stack" style={{ gap: 8 }}>
          <span className="skeleton" style={{ width: "40%", height: 12 }} />
          <span className="skeleton" style={{ width: "25%", height: 10 }} />
        </div>
      </div>
      <div className="stack" style={{ gap: 8, padding: "4px 16px 18px" }}>
        <span className="skeleton" style={{ width: "92%", height: 12 }} />
        <span className="skeleton" style={{ width: "70%", height: 12 }} />
      </div>
    </div>
  );
}

// Renders a paginated list of posts and loads the next page when you near the bottom.
export default function PostList({ list, onLoadMore, empty }) {
  const entities = useAppSelector((s) => s.posts.entities);
  const sentinel = useRef();
  const posts = (list?.ids || []).map((id) => entities[id]).filter(Boolean);

  useEffect(() => {
    if (!sentinel.current || !list?.hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !list.loading) onLoadMore();
      },
      { rootMargin: "600px" }
    );
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [list?.hasMore, list?.loading, onLoadMore]);

  if (!list?.loaded) {
    return (
      <>
        <PostSkeleton />
        <PostSkeleton />
      </>
    );
  }

  if (!posts.length) {
    return (
      <div className="card">
        {empty || (
          <EmptyState icon={Newspaper} title="No posts yet">
            Posts will show up here.
          </EmptyState>
        )}
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      {list.hasMore ? (
        <div ref={sentinel} className="center-pad">
          {list.loading && <Spinner />}
        </div>
      ) : (
        <p className="end-of-list">You're all caught up ✨</p>
      )}
    </>
  );
}
