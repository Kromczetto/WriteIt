import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import '../../css/Edit.css';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  useEffect(() => {
    axios.get(`/api/works/${id}`).then(res => {
      setTitle(res.data.title);
      setContent(res.data.content);
      setStatus(res.data.status);
    });
  }, [id]);

  const updateWork = async () => {
    await axios.put(`/api/works/${id}`, { title, content, status });
    navigate('/profile');
  };

  return (
    <div className="editor-container">
      <h1>Edit</h1>

      <input value={title} onChange={e => setTitle(e.target.value)} />

      <select value={status} onChange={e => setStatus(e.target.value as any)}>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>

      <ReactQuill value={content} onChange={setContent} />

      <button onClick={updateWork}>Update</button>
    </div>
  );
};

export default Edit;
