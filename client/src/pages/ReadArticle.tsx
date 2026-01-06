import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Rating from './components/Rating';
import '../css/ReadArticle.css';

type Work = {
  _id: string;
  title: string;
  content: string;
};

type RatingInfo = {
  average: number;
  count: number;
  userRating: number | null;
};

const ReadArticle = () => {
  const { id } = useParams<{ id: string }>();

  const [work, setWork] = useState<Work | null>(null);
  const [rating, setRating] = useState<RatingInfo | null>(null);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const loadArticle = async () => {
    try {
      const res = await axios.get(
        `/api/rentals/read/${id}`,
        { withCredentials: true }
      );

      setWork(res.data);
      setLocked(false);

      const ratingRes = await axios.get(
        `/review/${id}`,
        { withCredentials: true }
      );

      setRating({
        average: ratingRes.data.average,
        count: ratingRes.data.count,
        userRating: ratingRes.data.userRating ?? null,
      });
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
        err?.response?.data?.message || 'Rent failed'
      );
    } finally {
      setRenting(false);
    }
  };

  // 📄 PDF DOWNLOAD
  const downloadPdf = async () => {
    if (!id) return;

    try {
      setPdfLoading(true);
      setError(null);

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
      setError('PDF download failed');
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (locked) {
    return (
      <div className="paywall">
        <h2>This article is locked</h2>
        <p>You need to rent it to continue reading.</p>

        {error && (
          <p className="paywall-error">{error}</p>
        )}

        <div className="paywall-actions">
          <button disabled={renting} onClick={() => rent(1)}>
            Rent 1 day
          </button>
          <button disabled={renting} onClick={() => rent(7)}>
            Rent 7 days
          </button>
          <button disabled={renting} onClick={() => rent(30)}>
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

      {/* ⭐ OCENIANIE */}
      {rating && (
        <div style={{ marginBottom: 20 }}>
          <Rating
            workId={work._id}
            average={rating.average}
            count={rating.count}
            userRating={rating.userRating}
            onRated={loadArticle}
          />
        </div>
      )}

      {/* 📄 PDF */}
      <button
        className="pdf-btn"
        onClick={downloadPdf}
        disabled={pdfLoading}
      >
        {pdfLoading ? 'Generating PDF...' : 'Download PDF'}
      </button>

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
