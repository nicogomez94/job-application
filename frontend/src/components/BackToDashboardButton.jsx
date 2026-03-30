import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { scrollToTopInstant } from '../utils/scrollToTop';
import './BackToDashboardButton.css';

export default function BackToDashboardButton({ to }) {
  return (
    <Link className="back-dashboard-btn" to={to} onClick={scrollToTopInstant}>
      <ArrowLeft size={16} />
      <span>Volver al panel</span>
    </Link>
  );
}
