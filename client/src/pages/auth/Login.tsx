import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import '../../css/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const context = useContext(UserContext);

  if (!context) {
    return null;
  }

  const { setUser } = context;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });
      
      const response = await axios.get('/auth/me');
      setUser(response.data);

      toast.success('Login successful');
      navigate('/profile', { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Login...' : 'Login'}
      </button>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Don’t have an account?{' '}
        <Link to="/register" style={{ color: '#407bff', fontWeight: 500 }}>
          Register
        </Link>
      </p>
    </form>
  );
};

export default Login;
