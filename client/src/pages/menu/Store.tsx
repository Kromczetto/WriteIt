import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import '../../css/Store.css';

type Work = {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    email: string;
  };
};

type DurationOption = {
  label: string;
  days: number | null;
};

type RatingInfo = {
  average: number;
  count: number;
};

const DURATION_OPTIONS: DurationOption[] = [
  { label: '1 day', days: 1 },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: 'Unlimited', days: null },
];

const Store = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [ratings, setRatings] = useState<
    Record<string, RatingInfo>
  >({});
  const [query, setQuery] = useState('');
  const [rentedIds, setRentedIds] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] =
    useState<Record<string, number | null>>({});
  const [rentingId, setRentingId] = useState<string | null>(null);

  const context = useContext(UserContext);
  if (!context || !context.user) return null;
  const { user } = context;

  useEffect(() => {
    if (query.trim().length < 2) {
      axios.get('/api/works').then(res => setWorks(res.data));
    } else {
      const t = setTimeout(() => {
        axios
          .get(`/api/works/search?q=${query}`)
          .then(res => setWorks(res.data));
      }, 300);

      return () => clearTimeout(t);
    }
  }, [query]);

  useEffect(() => {
    axios
      .get('/api/rentals/my/work-ids')
      .then(res => setRentedIds(res.data));
  }, []);

  useEffect(() => {
    if (works.length === 0) return;

    const fetchRatings = async () => {
      try {
        const results = await Promise.all(
          works.map(w =>
            axios.get(`/review/${w._id}`).then(res => ({
              workId: w._id,
              average: res.data.average,
              count: res.data.count,
            }))
          )
        );

        const map: Record<string, RatingInfo> = {};
        results.forEach(r => {
          map[r.workId] = {
            average: r.average,
            count: r.count,
          };
        });

        setRatings(map);
      } catch (err) {
        console.error('Failed to load ratings');
      }
    };

    fetchRatings();
  }, [works]);

  const rent = async (workId: string) => {
    try {
      setRentingId(workId);

      await axios.post(`/api/rentals/${workId}`, {
        days: selectedDuration[workId] ?? null,
      });

      setRentedIds(prev => [...prev, workId]);

      setSelectedDuration(prev => {
        const copy = { ...prev };
        delete copy[workId];
        return copy;
      });
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Rent failed');
    } finally {
      setRentingId(null);
    }
  };

  const preview = (html: string) =>
    html.replace(/<[^>]+>/g, '').slice(0, 160) + '…';

  const renderStars = (avg: number) => {
    const rounded = Math.round(avg);
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  };

  return (
    <div className="store-container">
      <div className="store-header">
        <h1>Store</h1>

        <input
          className="search-input"
          placeholder="Search articles..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="store-grid">
        {works.map(work => {
          const isOwn = work.author._id === user.id;
          const isRented = rentedIds.includes(work._id);
          const hasDuration =
            selectedDuration[work._id] !== undefined;

          const rating = ratings[work._id];

          return (
            <div key={work._id} className="store-card">
              <h3>{work.title}</h3>

              <div className="store-rating">
                {rating ? (
                  <>
                    <span className="stars">
                      {renderStars(rating.average)}
                    </span>
                    <span className="rating-text">
                      {rating.average.toFixed(1)} (
                      {rating.count})
                    </span>
                  </>
                ) : (
                  <span className="rating-text muted">
                    No ratings
                  </span>
                )}
              </div>

              <p className="store-preview">
                {preview(work.content)}
              </p>

              {isOwn && (
                <p className="store-info">
                  This is your article
                </p>
              )}

              {isRented && !isOwn && (
                <p className="store-info rented">
                  Already in your library
                </p>
              )}

              {!isOwn && !isRented && (
                <div className="duration-options">
                  {DURATION_OPTIONS.map(opt => (
                    <button
                      key={opt.label}
                      className={
                        selectedDuration[work._id] === opt.days
                          ? 'duration active'
                          : 'duration'
                      }
                      onClick={() =>
                        setSelectedDuration(prev => ({
                          ...prev,
                          [work._id]: opt.days,
                        }))
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {isRented ? (
                <a
                  href={`/read/${work._id}`}
                  className="rent-btn read-btn"
                >
                  Read article
                </a>
              ) : (
                <button
                  className="rent-btn"
                  disabled={
                    isOwn ||
                    !hasDuration ||
                    rentingId === work._id
                  }
                  onClick={() => rent(work._id)}
                >
                  {rentingId === work._id
                    ? 'Renting...'
                    : 'Rent article'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Store;
