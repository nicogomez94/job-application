import { Link } from 'react-router-dom';

export default function BackToDashboardButton({ to }) {
  return (
    <Link className="btn btn-outline" to={to} style={{ marginBottom: '0.9rem', display: 'inline-flex' }}>
      Back
    </Link>
  );
}
