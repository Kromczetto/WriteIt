import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import '../../css/Auth.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/auth/register', {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      toast.success('Registration successful');

      // 🔴 AUTOMATYCZNE PRZEJŚCIE DO LOGIN
      navigate('/login', { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Register</h2>

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
        {loading ? 'Registering...' : 'Register'}
      </button>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#407bff', fontWeight: 500 }}>
          Login
        </Link>
      </p>
    </form>
  );
};

export default Register;
