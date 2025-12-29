import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ display: 'flex', gap: '1rem' }}>
      <Link to="/write">Write</Link>
      <Link to="/store">Store</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  );
};

export default Navbar;
