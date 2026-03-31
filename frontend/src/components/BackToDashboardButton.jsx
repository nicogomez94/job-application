import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { scrollToTopInstant } from '../utils/scrollToTop';
import './BackToDashboardButton.css';

export default function BackToDashboardButton({ to, label = 'Volver al panel', icon = 'back' }) {
  const Icon = icon === 'home' ? Home : ArrowLeft;

  return (
    <Link className="back-dashboard-btn" to={to} onClick={scrollToTopInstant}>
      <Icon size={16} />
      <span>{label}</span>
    </Link>
  );
}
