import { Link } from 'react-router-dom';
import '../../css/Navbar.css';


const Navbar = () => {
  return (
    <nav style={{ display: 'flex', gap: '1rem' }}>
      <Link to="/write">Write</Link>
      <Link to="/store">Store</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/top">Top</Link>
    </nav>
  );
};

export default Navbar;
