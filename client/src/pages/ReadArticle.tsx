import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/ReadArticle.css';

type Work = {
  title: string;
  content: string;
};

const ReadArticle = () => {
  const { id } = useParams();
  const [work, setWork] = useState<Work | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`/api/rentals/read/${id}`)
      .then(res => setWork(res.data))
      .catch(() => setError('Access denied'));
  }, [id]);

  if (error) {
    return <p className="read-error">{error}</p>;
  }

  if (!work) return <p>Loading...</p>;

  return (
    <div className="read-container">
      <h1>{work.title}</h1>
      <div
        className="read-content"
        dangerouslySetInnerHTML={{ __html: work.content }}
      />
    </div>
  );
};

export default ReadArticle;
