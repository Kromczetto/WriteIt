import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      alert('Friend request sent');
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          'Failed to send request'
      );
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

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>Friends</h1>

      {/* 🔍 SEARCH */}
      <div style={{ marginBottom: 20 }}>
        <h3>Add friend</h3>
        <input
          placeholder="User email"
          value={searchEmail}
          onChange={e => setSearchEmail(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button
          onClick={sendRequest}
          disabled={loading}
        >
          Send request
        </button>
      </div>

      {/* 📥 REQUESTS */}
      {requests.length > 0 && (
        <div style={{ marginBottom: 30 }}>
          <h3>Friend requests</h3>
          <ul>
            {requests.map(r => (
              <li key={r._id}>
                {r.from.email}{' '}
                <button
                  onClick={() => acceptRequest(r._id)}
                >
                  Accept
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 👥 FRIENDS */}
      <h3>Your friends</h3>

      {friends.length === 0 && (
        <p>No friends yet</p>
      )}

      <ul>
        {friends.map(friend => (
          <li key={friend._id}>
            {friend.email}{' '}
            <button
              onClick={() =>
                navigate(`/chat/${friend._id}`)
              }
            >
              Open chat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;
