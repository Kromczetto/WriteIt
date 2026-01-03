import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import LogoutButton from '../components/LogoutButton';
import { useNavigate } from 'react-router-dom';

type Work = {
  _id: string;
  title: string;
  status: string;
};

const Profile = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const [works, setWorks] = useState<Work[]>([]);

  if (!context) return <p>Context not available</p>;
  const { user } = context;
  if (!user) return <p>Not logged in</p>;

  useEffect(() => {
    axios.get('/api/works/my').then(res => setWorks(res.data));
  }, []);

  const deleteWork = async (id: string) => {
    await axios.delete(`/api/works/${id}`);
    setWorks(prev => prev.filter(w => w._id !== id));
  };

  return (
    <div>
      <h1>Profile</h1>

      <p><strong>User ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h2>My works</h2>

      {works.length === 0 && <p>No works yet</p>}

      {works.map(work => (
        <div key={work._id} style={{ marginBottom: '1rem' }}>
          <h3>{work.title}</h3>
          <p>Status: {work.status}</p>

          <button onClick={() => navigate(`/edit/${work._id}`)}>
            Edit
          </button>

          <button onClick={() => deleteWork(work._id)}>
            Delete
          </button>
        </div>
      ))}

      <LogoutButton />
    </div>
  );
};

export default Profile;
