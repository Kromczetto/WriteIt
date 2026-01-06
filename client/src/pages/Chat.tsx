import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import '../css/Chat.css';

type Message = {
  _id: string;
  text?: string;
  from: string;
  work?: {
    _id: string;
    title: string;
  };
};

const Chat = () => {
  const { friendId } = useParams<{ friendId: string }>();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [myId, setMyId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    axios
      .get('/auth/me', { withCredentials: true })
      .then(res => setMyId(res.data.id));
  }, []);

  useEffect(() => {
    if (!friendId || !myId) return;

    const room = [myId, friendId].sort().join('_');

    socketRef.current = io('http://localhost:8000', {
      withCredentials: true,
    });

    socketRef.current.emit('join', room);

    socketRef.current.on('new-message', (msg: Message) => {
      setMessages(prev => {
        if (prev.some(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    axios
      .get(`/api/chat/${friendId}`, { withCredentials: true })
      .then(res => setMessages(res.data));

    return () => {
      socketRef.current?.disconnect();
    };
  }, [friendId, myId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendText = async () => {
    if (!friendId || !myId || !text.trim()) return;

    const room = [myId, friendId].sort().join('_');

    const res = await axios.post(
      `/api/chat/${friendId}`,
      { text },
      { withCredentials: true }
    );

    socketRef.current?.emit('send-message', {
      ...res.data,
      room,
    });

    setText('');
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">Chat</h1>

      <div className="chat-messages">
        {messages.map(m => (
          <div
            key={m._id}
            className={`chat-message ${
              m.from === myId ? 'my-message' : 'their-message'
            }`}
          >
            {m.text && <p>{m.text}</p>}

            {m.work && (
              <div
                className="chat-article"
                onClick={() => navigate(`/read/${m.work!._id}`)}
              >
                📘 {m.work.title}
              </div>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type message"
        />

        <button className="chat-send-btn" onClick={sendText}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
