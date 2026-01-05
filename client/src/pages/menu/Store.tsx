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

const DURATION_OPTIONS: DurationOption[] = [
  { label: '1 day', days: 1 },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: 'Unlimited', days: null }
];

const Store = () => {
  const [works, setWorks] = useState<Work[]>([]);
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

  const rent = async (workId: string) => {
    try {
      setRentingId(workId);

      await axios.post(`/api/rentals/${workId}`, {
        days: selectedDuration[workId] ?? null
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

          return (
            <div key={work._id} className="store-card">
              <h3>{work.title}</h3>

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
                          [work._id]: opt.days
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
