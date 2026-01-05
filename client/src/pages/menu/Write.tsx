import { useState, useRef } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-hot-toast';
import '../../css/Write.css';

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
    handlers: {
      image: function () {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
          const file = input.files?.[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = () => {
            const quill = this.quill;
            const range = quill.getSelection(true);
            quill.insertEmbed(
              range.index,
              'image',
              reader.result
            );
          };
          reader.readAsDataURL(file);
        };
      }
    }
  }
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'list',
  'bullet',
  'blockquote',
  'code-block',
  'link',
  'image'
];

const Write = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] =
    useState<'draft' | 'published'>('draft');
  const [loading, setLoading] = useState(false);

  const saveWork = async () => {
    try {
      setLoading(true);

      await axios.post('/api/works', {
        title,
        content,
        status
      });

      toast.success('Saved successfully');
      setTitle('');
      setContent('');
      setStatus('draft');
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || 'Save failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-container">
      <h1>Write</h1>

      <input
        className="title-input"
        placeholder="Article title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <select
        value={status}
        onChange={e =>
          setStatus(e.target.value as any)
        }
      >
        <option value="draft">Draft</option>
        <option value="published">Publish</option>
      </select>

      <ReactQuill
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        placeholder="Start writing..."
      />

      <button onClick={saveWork} disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

export default Write;
