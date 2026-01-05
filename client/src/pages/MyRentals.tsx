import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/MyRentals.css';

type Rental = {
  _id: string;
  expiresAt?: string;
  work: {
    _id: string;
    title: string;
  };
};

const getRemainingTime = (expiresAt?: string) => {
  if (!expiresAt) return 'Unlimited access';

  const diff =
    new Date(expiresAt).getTime() - Date.now();

  if (diff <= 0) return 'Expired';

  const days = Math.ceil(diff / 86400000);
  return days === 1 ? 'Expires today' : `${days} days left`;
};

const MyRentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/rentals/my').then(res => setRentals(res.data));
  }, []);

  return (
    <div className="rentals-container">
      <h1>My rented articles</h1>

      <div className="rentals-grid">
        {rentals.map(r => {
          const status = getRemainingTime(r.expiresAt);
          const expired = status === 'Expired';

          return (
            <div
              key={r._id}
              className={`rental-card ${expired ? 'expired' : ''}`}
              onClick={() =>
                !expired && navigate(`/read/${r.work._id}`)
              }
            >
              <h3>{r.work.title}</h3>
              <span className="rental-badge">{status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRentals;
