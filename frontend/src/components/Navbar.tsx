import { useNavigate } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

function Navbar({ user, onLogout }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          📈 AI Trading App
        </div>
        <ul className="navbar-menu">
          <li><a onClick={() => navigate('/')}>Dashboard</a></li>
          <li><a onClick={() => navigate('/portfolio')}>Portfolio</a></li>
          <li><a onClick={() => navigate('/profile')}>Profile</a></li>
          <li><a onClick={handleLogout} className="logout">Logout</a></li>
        </ul>
        {user && <div className="navbar-user">👤 {user.firstName} {user.lastName}</div>}
      </div>
    </nav>
  );
}

export default Navbar;