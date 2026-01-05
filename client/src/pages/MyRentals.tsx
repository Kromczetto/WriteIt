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
  } | null;
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

  useEffect(() => {
    axios.get('/api/rentals/my').then(res => {
      // 🔒 filtrujemy wypożyczenia bez artykułu
      setRentals(res.data.filter((r: Rental) => r.work));
    });
  }, []);

  const readArticle = (workId: string) => {
    navigate(`/read/${workId}`);
  };

  return (
    <div className="rentals-container">
      <h1>My rented articles</h1>

      {rentals.length === 0 && (
        <p>No active rentals</p>
      )}

      <div className="rentals-grid">
        {rentals.map(rental => (
          <div key={rental._id} className="rental-card">
            <h3>{rental.work!.title}</h3>

            <span className="rental-badge">
              {getRemaining(rental.expiresAt)}
            </span>

            <button
              className="read-btn"
              onClick={() =>
                readArticle(rental.work!._id)
              }
            >
              Read article
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRentals;
