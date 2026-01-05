import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/MyRentals.css';

type Rental = {
  _id: string;
  expiresAt: string | null;
  work: {
    _id: string;
    title: string;
  };
};

const getRemaining = (expiresAt: string | null) => {
  if (!expiresAt) return 'Unlimited access';

  const diff =
    new Date(expiresAt).getTime() - Date.now();

  if (diff <= 0) return 'Expired';

  const days = Math.ceil(diff / 86400000);
  return `${days} days left`;
};

const MyRentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const navigate = useNavigate();

  const load = () =>
    axios.get('/api/rentals/my').then(res => setRentals(res.data));

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    await axios.delete(`/api/rentals/${id}`);
    load();
  };

  return (
    <div className="rentals-container">
      <h1>My rented articles</h1>

      <div className="rentals-grid">
        {rentals.map(r => (
          <div key={r._id} className="rental-card">
            <h3
              onClick={() => navigate(`/read/${r.work._id}`)}
            >
              {r.work.title}
            </h3>

            <span className="rental-badge">
              {getRemaining(r.expiresAt)}
            </span>

            <button
              className="delete-btn"
              onClick={() => remove(r._id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRentals;
