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
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const loadAll = async () => {
    const [friendsRes, requestsRes] = await Promise.all([
      axios.get('/api/friends'),
      axios.get('/api/friends/requests'),
    ]);

    setFriends(friendsRes.data);
    setRequests(requestsRes.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const sendRequest = async () => {
    if (!email.trim()) return;

    try {
      await axios.post('/api/friends/request', { email });
      setEmail('');
      alert('Friend request sent');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error');
    }
  };

  const acceptRequest = async (id: string) => {
    await axios.post(`/api/friends/accept/${id}`);
    loadAll();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Friends</h1>

      {/* ADD FRIEND */}
      <section style={{ marginBottom: 30 }}>
        <h3>Add friend</h3>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="User email"
        />
        <button onClick={sendRequest}>Send request</button>
      </section>

      {/* REQUESTS */}
      <section style={{ marginBottom: 30 }}>
        <h3>Friend requests</h3>

        {requests.length === 0 && <p>No requests</p>}

        <ul>
          {requests.map(r => (
            <li key={r._id}>
              {r.from.email}{' '}
              <button onClick={() => acceptRequest(r._id)}>
                Accept
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* FRIENDS */}
      <section>
        <h3>My friends</h3>

        {friends.length === 0 && <p>No friends yet</p>}

        <ul>
          {friends.map(f => (
            <li key={f._id}>
              {f.email}{' '}
              <button
                onClick={() =>
                  navigate(`/chat/${f._id}`)
                }
              >
                Open chat
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Friends;
