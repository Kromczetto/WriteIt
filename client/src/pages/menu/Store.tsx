import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { createPortal } from 'react-dom';
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

type Friend = {
  _id: string;
  email: string;
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
  const [ratings, setRatings] = useState<Record<string, RatingInfo>>({});
  const [query, setQuery] = useState('');
  const [rentedIds, setRentedIds] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] =
    useState<Record<string, number | null>>({});
  const [rentingId, setRentingId] = useState<string | null>(null);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [shareWorkId, setShareWorkId] = useState<string | null>(null);

  const context = useContext(UserContext);
  if (!context || !context.user) return null;
  const { user } = context;

  useEffect(() => {
    axios.get('/api/works').then(res => setWorks(res.data));
    axios
      .get('/api/rentals/my/work-ids', { withCredentials: true })
      .then(res => setRentedIds(res.data));
    axios
      .get('/api/friends', { withCredentials: true })
      .then(res => setFriends(res.data));
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) return;

    const t = setTimeout(() => {
      axios
        .get(`/api/works/search?q=${query}`)
        .then(res => setWorks(res.data));
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (works.length === 0) return;

    Promise.all(
      works.map(w =>
        axios.get(`/review/${w._id}`).then(res => ({
          workId: w._id,
          average: res.data.average,
          count: res.data.count,
        }))
      )
    ).then(results => {
      const map: Record<string, RatingInfo> = {};
      results.forEach(r => {
        map[r.workId] = { average: r.average, count: r.count };
      });
      setRatings(map);
    });
  }, [works]);

  const rent = async (workId: string) => {
    setRentingId(workId);

    await axios.post(
      `/api/rentals/${workId}`,
      { days: selectedDuration[workId] ?? null },
      { withCredentials: true }
    );

    setRentedIds(prev => [...prev, workId]);
    setRentingId(null);
  };

  const sendArticleToFriend = async (friendId: string) => {
    if (!shareWorkId) return;

    await axios.post(
      `/api/chat/${friendId}`,
      { workId: shareWorkId },
      { withCredentials: true }
    );

    setShareWorkId(null);
  };

  const preview = (html: string) =>
    html.replace(/<[^>]+>/g, '').slice(0, 160) + '…';

  const renderStars = (avg: number) =>
    '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));

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
                      {rating.average.toFixed(1)} ({rating.count})
                    </span>
                  </>
                ) : (
                  <span className="rating-text muted">No ratings</span>
                )}
              </div>

              <p className="store-preview">{preview(work.content)}</p>

              {isOwn && (
                <p className="store-info">This is your article</p>
              )}

              {isRented && !isOwn && (
                <p className="store-info rented">
                  Already in your library
                </p>
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
                  disabled={isOwn}
                  onClick={() => rent(work._id)}
                >
                  Rent article
                </button>
              )}

              {isRented && !isOwn && (
                <button
                  className="send-article-btn"
                  onClick={() => setShareWorkId(work._id)}
                >
                  Send to friend
                </button>
              )}
            </div>
          );
        })}
      </div>

      {shareWorkId &&
        createPortal(
          <div className="popup-overlay">
            <div className="popup">
              <h3>Send article to</h3>

              {friends.map(f => (
                <button
                  key={f._id}
                  className="friend-option"
                  onClick={() => sendArticleToFriend(f._id)}
                >
                  {f.email}
                </button>
              ))}

              <button
                className="popup-cancel"
                onClick={() => setShareWorkId(null)}
              >
                Cancel
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Store;
