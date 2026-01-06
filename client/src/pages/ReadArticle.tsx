import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/ReadArticle.css';

type Work = {
  _id: string;
  title: string;
  content: string;
};

const ReadArticle = () => {
  const { id } = useParams<{ id: string }>();

  const [work, setWork] = useState<Work | null>(null);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArticle = async () => {
    try {
      const res = await axios.get(
        `/api/rentals/read/${id}`,
        { withCredentials: true }
      );

      setWork(res.data);
      setLocked(false);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setLocked(true);
      } else {
        setError('Failed to load article');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticle();
  }, [id]);

  const rent = async (days: number | null) => {
    try {
      setRenting(true);
      setError(null);

      await axios.post(
        `/api/rentals/${id}`,
        { days },
        { withCredentials: true }
      );

      await loadArticle();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Rent failed'
      );
    } finally {
      setRenting(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (locked) {
    return (
      <div className="paywall">
        <h2>This article is locked</h2>
        <p>You need to rent it to continue reading.</p>

        {error && (
          <p className="paywall-error">{error}</p>
        )}

        <div className="paywall-actions">
          <button
            disabled={renting}
            onClick={() => rent(1)}
          >
            Rent 1 day
          </button>
          <button
            disabled={renting}
            onClick={() => rent(7)}
          >
            Rent 7 days
          </button>
          <button
            disabled={renting}
            onClick={() => rent(30)}
          >
            Rent 30 days
          </button>
          <button
            disabled={renting}
            onClick={() => rent(null)}
          >
            Unlimited
          </button>
        </div>
      </div>
    );
  }

  if (!work) return null;

  return (
    <div className="article-container">
      <h1>{work.title}</h1>
      <div
        className="article-content"
        dangerouslySetInnerHTML={{
          __html: work.content,
        }}
      />
    </div>
  );
};

export default ReadArticle;
