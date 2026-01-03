import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import LogoutButton from '../components/LogoutButton';
import { useNavigate } from 'react-router-dom';
import '../../css/Profile.css';

type Work = {
  _id: string;
  title: string;
  status: string;
};

const Profile = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const [works, setWorks] = useState<Work[]>([]);

  if (!context) return null;
  const { user } = context;
  if (!user) return null;

  useEffect(() => {
    axios.get('/api/works/my').then(res => setWorks(res.data));
  }, []);

  const deleteWork = async (id: string) => {
    await axios.delete(`/api/works/${id}`);
    setWorks(prev => prev.filter(w => w._id !== id));
  };

  return (
    <div className="profile-layout">
      <aside className="profile-card">
        <h1>Profile</h1>
        <p><strong>Email</strong><br />{user.email}</p>
        <LogoutButton />
      </aside>

      <section>
        <h2>My works</h2>

        <div className="profile-works">
          {works.map(work => (
            <div key={work._id} className="work-card">
              <h3>{work.title}</h3>
              <p>Status: <strong>{work.status}</strong></p>

              <div className="work-actions">
                <button onClick={() => navigate(`/edit/${work._id}`)}>
                  Edit
                </button>
                <button onClick={() => deleteWork(work._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;
