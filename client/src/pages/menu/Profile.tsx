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

  if (!context || !context.user) return null;
  const { user } = context;

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
        <div className="profile-header">
          <h1>Profile</h1>
          <p className="profile-email">{user.email}</p>
        </div>

        <nav className="profile-nav">
          <button
            className="nav-btn"
            onClick={() => navigate('/my-rentals')}
          >
            My rentals
          </button>

          <button
            className="nav-btn secondary"
            onClick={() => navigate('/store')}
          >
            Store
          </button>
        </nav>

        <div className="profile-footer">
          <LogoutButton />
        </div>
      </aside>

      <section className="profile-content">
        <div className="content-header">
          <h2>My works</h2>
          <button
            className="primary-btn"
            onClick={() => navigate('/write')}
          >
            + New article
          </button>
        </div>

        <div className="profile-works">
          {works.length === 0 && (
            <p className="empty-text">
              You haven’t created any articles yet.
            </p>
          )}

          {works.map(work => (
            <div key={work._id} className="work-card">
              <div>
                <h3>{work.title}</h3>
                <span
                  className={`status ${
                    work.status === 'published'
                      ? 'published'
                      : 'draft'
                  }`}
                >
                  {work.status}
                </span>
              </div>

              <div className="work-actions">
                <button
                  className="link-btn"
                  onClick={() => navigate(`/edit/${work._id}`)}
                >
                  Edit
                </button>
                <button
                  className="link-btn danger"
                  onClick={() => deleteWork(work._id)}
                >
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
