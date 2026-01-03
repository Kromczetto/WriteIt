import { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-hot-toast';

const Write = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [loading, setLoading] = useState(false);

  const saveWork = async () => {
    try {
      setLoading(true);

      await axios.post('/api/works', {
        title,
        content,
        status,
      });

      toast.success('Saved');
      setTitle('');
      setContent('');
      setStatus('draft');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1>Write</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <select
        value={status}
        onChange={e => setStatus(e.target.value as any)}
        style={{ marginBottom: '1rem' }}
      >
        <option value="draft">Draft</option>
        <option value="published">Publish</option>
      </select>

      <ReactQuill value={content} onChange={setContent} />

      <button onClick={saveWork} disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

export default Write;
