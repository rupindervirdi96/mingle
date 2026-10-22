import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, FileX } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchPost } from "../store/postsSlice";
import { EmptyState } from "../components/ui";
import PostCard from "../components/PostCard";
import { PostSkeleton } from "../components/PostList";

export default function PostPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const post = useAppSelector((s) => s.posts.entities[id]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    dispatch(fetchPost(id))
      .unwrap()
      .catch((message) => setError(message));
  }, [id, dispatch]);

  return (
    <div className="narrow stack">
      <button className="btn btn-ghost sm back-btn" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}>
        <ArrowLeft /> Back
      </button>
      {post ? (
        <PostCard post={post} expanded />
      ) : error ? (
        <div className="card">
          <EmptyState icon={FileX} title="Post not available" action={<Link to="/" className="btn btn-primary">Go to feed</Link>}>
            {error}
          </EmptyState>
        </div>
      ) : (
        <PostSkeleton />
      )}
    </div>
  );
}
