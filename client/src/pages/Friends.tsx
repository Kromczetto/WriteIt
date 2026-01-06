import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Friend = {
  _id: string;
  email: string;
};

const Friends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/friends').then(res => setFriends(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Friends</h1>

      {friends.length === 0 && <p>No friends yet</p>}

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
