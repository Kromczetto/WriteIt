import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    axios.get(`/api/chat/${friendId}`).then(res =>
      setMessages(res.data)
    );
  }, [friendId]);

  const send = async () => {
    if (!text.trim()) return;

    const res = await axios.post(
      `/api/chat/${friendId}`,
      { text }
    );

    setMessages(prev => [...prev, res.data]);
    setText('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Chat</h1>

      <div
        style={{
          border: '1px solid #ccc',
          padding: 10,
          height: 300,
          overflowY: 'auto',
          marginBottom: 10,
        }}
      >
        {messages.map(m => (
          <div key={m._id}>
            <p>{m.text}</p>

            {m.work && (
              <a href={`/read/${m.work._id}`}>
                📘 {m.work.title}
              </a>
            )}
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={send}>Send</button>
    </div>
  );
};

export default Chat;
