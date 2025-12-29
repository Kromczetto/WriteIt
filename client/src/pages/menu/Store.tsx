import { useEffect, useState } from 'react';
import axios from 'axios';

type Work = {
  _id: string;
  title: string;
  content: string;
  status: string;
  author?: {
    email: string;
  };
};

const Store = () => {
  const [works, setWorks] = useState<Work[]>([]);

  useEffect(() => {
    axios
      .get('/api/works')
      .then((res) => setWorks(res.data))
      .catch((err) => console.error(err));
  }, []);  

  return (
    <div>
      <h1>Store</h1>

      {works.map((work) => (
        <div key={work._id} style={{ marginBottom: '1rem' }}>
          <h2>{work.title}</h2>
          <p>Author: {work.author?.email}</p>
          <p>Status: {work.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Store;
