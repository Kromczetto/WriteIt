import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

const LogoutButton = () => {
  const navigate = useNavigate();
  const context = useContext(UserContext);

  if (!context) return null;

  const { setUser } = context;

  const logout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return <button onClick={logout}>Logout</button>;
};

export default LogoutButton;
