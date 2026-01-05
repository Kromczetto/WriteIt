import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/TopRented.css';

type TopWork = {
  _id: string;
  title: string;
  count: number;
};

const TopRented = () => {
  const [top, setTop] = useState<TopWork[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/rentals/top').then(res => setTop(res.data));
  }, []);

  return (
    <div className="top-container">
      <h1>🔥 Top rented articles</h1>

      <div className="top-list">
        {top.map((w, i) => (
          <div
            key={w._id}
            className="top-card"
            onClick={() => navigate(`/read/${w._id}`)}
          >
            <div className="rank">#{i + 1}</div>
            <div>
              <h3>{w.title}</h3>
              <p>{w.count} rentals</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRented;
