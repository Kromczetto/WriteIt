import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/Store.css';

type Work = {
  _id: string;
  title: string;
  author?: { email: string };
};

const Store = () => {
  const [works, setWorks] = useState<Work[]>([]);

  useEffect(() => {
    axios.get('/api/works').then(res => setWorks(res.data));
  }, []);

  return (
    <div>
      <h1>Store</h1>

      <div className="store-grid">
        {works.map(work => (
          <div key={work._id} className="store-card">
            <h2>{work.title}</h2>
            <p>{work.author?.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
