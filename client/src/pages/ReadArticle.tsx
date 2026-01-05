import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Rating from './components/Rating';
import { useReview } from '../hooks/useReview';
import '../css/ReadArticle.css';

type Work = {
  title: string;
  content: string;
};

const ReadArticle = () => {
  const { id } = useParams<{ id: string }>();
  const [work, setWork] = useState<Work | null>(null);
  const [error, setError] = useState('');

  if (!id) return null;

  const {
    average,
    count,
    myRating,
    rate,
    loading: ratingLoading,
  } = useReview(id);

  useEffect(() => {
    axios
      .get(`/api/rentals/read/${id}`, {
        withCredentials: true,
      })
      .then(res => setWork(res.data))
      .catch(() => setError('Access denied'));
  }, [id]);

  const downloadPdf = async () => {
    try {
      const res = await axios.get(
        `/pdf/rentals/pdf/${id}`,
        {
          responseType: 'blob',
          withCredentials: true,
        }
      );

      const blob = new Blob([res.data], {
        type: 'application/pdf',
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${work?.title || 'article'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('PDF download failed');
    }
  };

  if (error) {
    return <p className="read-error">{error}</p>;
  }

  if (!work) return <p>Loading...</p>;

  return (
    <div className="read-container">
      <h1>{work.title}</h1>

      <div className="rating-section">
        <p>
          Rating:{' '}
          {average !== null
            ? `${average} / 5 (${count} votes)`
            : 'No ratings yet'}
        </p>

        {!ratingLoading && (
          <Rating value={myRating} onChange={rate} />
        )}
      </div>

      <button className="pdf-btn" onClick={downloadPdf}>
        Download PDF
      </button>

      <div
        className="read-content"
        dangerouslySetInnerHTML={{
          __html: work.content,
        }}
      />
    </div>
  );
};

export default ReadArticle;
