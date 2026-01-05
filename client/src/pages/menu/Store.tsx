import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import '../../css/Store.css';

type Work = {
  _id: string;
  title: string;
  author?: {
    email: string;
  };
};

const Store = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [rentingId, setRentingId] = useState<string | null>(null);
  const context = useContext(UserContext);

  useEffect(() => {
    axios.get('/api/works').then(res => setWorks(res.data));
  }, []);

  const rentWork = async (workId: string) => {
    try {
      setRentingId(workId);
      await axios.post(`/api/rentals/${workId}`);
      alert('Article rented successfully');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Rent failed');
    } finally {
      setRentingId(null);
    }
  };

  return (
    <div className="store-container">
      <h1>Store</h1>

      <div className="store-grid">
        {works.map(work => (
          <div key={work._id} className="store-card">
            <h2>{work.title}</h2>
            <p>{work.author?.email}</p>

            {context?.user ? (
              <button
                disabled={rentingId === work._id}
                onClick={() => rentWork(work._id)}
              >
                {rentingId === work._id ? 'Renting...' : 'Rent article'}
              </button>
            ) : (
              <p style={{ color: '#999' }}>Login to rent</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
