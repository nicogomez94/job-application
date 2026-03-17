import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './BackToDashboardButton.css';

export default function BackToDashboardButton({ to }) {
  return (
    <Link className="back-dashboard-btn" to={to}>
      <ArrowLeft size={16} />
      <span>Volver al dashboard</span>
    </Link>
  );
}
