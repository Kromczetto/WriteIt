import { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/MyRentals.css';

type Rental = {
  _id: string;
  expiresAt?: string;
  work: {
    title: string;
  };
};

const getRemainingTime = (expiresAt?: string) => {
  if (!expiresAt) return 'Unlimited access';

  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();

  if (diffMs <= 0) return 'Expired';

  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Expires today';
  if (diffDays <= 7) return `${diffDays} days left`;

  return `${diffDays} days remaining`;
};

const MyRentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    axios.get('/api/rentals/my').then(res => setRentals(res.data));
  }, []);

  return (
    <div className="rentals-container">
      <h1>My rented articles</h1>

      {rentals.length === 0 && (
        <p className="empty-text">You have no rented articles</p>
      )}

      <div className="rentals-grid">
        {rentals.map(rental => {
          const statusText = getRemainingTime(rental.expiresAt);
          const expired = statusText === 'Expired';

          return (
            <div
              key={rental._id}
              className={`rental-card ${expired ? 'expired' : ''}`}
            >
              <h3>{rental.work.title}</h3>

              <span
                className={`rental-badge ${
                  expired ? 'badge-expired' : 'badge-active'
                }`}
              >
                {statusText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRentals;
