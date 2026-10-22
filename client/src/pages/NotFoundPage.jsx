import { Link } from "react-router";
import { Compass } from "lucide-react";
import { EmptyState } from "../components/ui";

export default function NotFoundPage() {
  return (
    <div className="narrow">
      <div className="card">
        <EmptyState icon={Compass} title="Page not found" action={<Link to="/" className="btn btn-primary">Back to your feed</Link>}>
          The link may be broken, or the page may have been removed.
        </EmptyState>
      </div>
    </div>
  );
}
