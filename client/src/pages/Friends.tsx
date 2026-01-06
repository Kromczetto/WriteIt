import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Friends.css';

type Friend = {
  _id: string;
  email: string;
};

type FriendRequest = {
  _id: string;
  from: {
    _id: string;
    email: string;
  };
};

const Friends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loadFriends = async () => {
    const res = await axios.get('/api/friends', {
      withCredentials: true,
    });
    setFriends(res.data);
  };

  const loadRequests = async () => {
    const res = await axios.get('/api/friends/requests', {
      withCredentials: true,
    });
    setRequests(res.data);
  };

  useEffect(() => {
    loadFriends();
    loadRequests();
  }, []);

  const sendRequest = async () => {
    if (!searchEmail.trim()) return;

    try {
      setLoading(true);
      await axios.post(
        '/api/friends/request',
        { email: searchEmail },
        { withCredentials: true }
      );
      setSearchEmail('');
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (id: string) => {
    await axios.post(
      `/api/friends/accept/${id}`,
      {},
      { withCredentials: true }
    );
    loadFriends();
    loadRequests();
  };

  const rejectRequest = async (id: string) => {
    await axios.delete(
      `/api/friends/reject/${id}`,
      { withCredentials: true }
    );
    loadRequests();
  };

  return (
    <div className="friends-container">
      <h1 className="friends-title">Friends</h1>

      <div className="section">
        <h3>Add friend</h3>
        <div className="add-friend">
          <input
            placeholder="User email"
            value={searchEmail}
            onChange={e => setSearchEmail(e.target.value)}
          />
          <button onClick={sendRequest} disabled={loading}>
            Send
          </button>
        </div>
      </div>

      {requests.length > 0 && (
        <div className="section">
          <h3>Friend requests</h3>
          <ul className="list">
            {requests.map(r => (
              <li key={r._id} className="list-item">
                <span>{r.from.email}</span>
                <div className="list-actions">
                  <button
                    className="accept-btn"
                    onClick={() => acceptRequest(r._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => rejectRequest(r._id)}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="section">
        <h3>Your friends</h3>

        {friends.length === 0 && (
          <p className="empty">No friends yet</p>
        )}

        <ul className="list">
          {friends.map(friend => (
            <li key={friend._id} className="list-item">
              <span>{friend.email}</span>
              <div className="list-actions">
                <button
                  className="chat-btn"
                  onClick={() =>
                    navigate(`/chat/${friend._id}`)
                  }
                >
                  Open chat
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Friends;
