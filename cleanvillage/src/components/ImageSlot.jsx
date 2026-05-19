import { useState, useRef, useEffect } from 'react';
import { Icon } from './ui.jsx';

export function setImageSlot(id, dataUrl) {
  try {
    if (dataUrl) localStorage.setItem(`imgslot:${id}`, dataUrl);
    else localStorage.removeItem(`imgslot:${id}`);
  } catch (e) { /* quota */ }
  try { window.dispatchEvent(new CustomEvent('imgslot:change', { detail: { id } })); } catch { /* */ }
}

export function getImageSlot(id) {
  try { return localStorage.getItem(`imgslot:${id}`) || null; } catch { return null; }
}

const IMGSLOT_EVENT = 'imgslot:change';

export function ImageSlot({ id, placeholder = 'Drop an image here', children, style }) {
  const [image, setImage] = useState(() => {
    try { return localStorage.getItem(`imgslot:${id}`) || null; } catch { return null; }
  });
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    const sync = (e) => {
      if (e.key && e.key !== `imgslot:${id}`) return;
      if (e.detail && e.detail.id && e.detail.id !== id) return;
      try { setImage(localStorage.getItem(`imgslot:${id}`) || null); } catch { /* */ }
    };
    window.addEventListener('storage', sync);
    window.addEventListener(IMGSLOT_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(IMGSLOT_EVENT, sync);
    };
  }, [id]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setImage(dataUrl);
      setImageSlot(id, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleClick = () => inputRef.current?.click();

  const handleClear = (e) => {
    e.stopPropagation();
    setImage(null);
    setImageSlot(id, null);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={!image ? handleClick : undefined}
      style={{
        position: 'absolute', inset: 0,
        cursor: image ? 'default' : 'pointer',
        zIndex: 2,
        ...style,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {image ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src={image}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <button
            onClick={handleClear}
            style={{
              position: 'absolute', top: 8, right: 8,
              width: 28, height: 28,
              background: 'rgba(0,0,0,0.6)', color: '#fff',
              border: 'none', borderRadius: '50%',
              cursor: 'pointer', display: 'grid', placeItems: 'center',
              fontSize: 14, zIndex: 5,
            }}
            title="Rimuovi immagine"
          >×</button>
        </div>
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 8,
          background: dragging ? 'rgba(10,77,104,0.08)' : 'transparent',
          border: dragging ? '2px dashed var(--color-teal-500)' : '2px dashed transparent',
          borderRadius: 'var(--radius-md)',
          transition: 'all var(--motion-fast)',
          pointerEvents: 'none',
          zIndex: 3,
        }}>
          <Icon name="image" size={20} color="rgba(10,77,104,0.35)" />
          <span style={{ fontSize: 11, color: 'rgba(10,77,104,0.45)', fontFamily: 'var(--font-body)', fontWeight: 500, textAlign: 'center', maxWidth: '80%', lineHeight: 1.4 }}>
            {placeholder}
          </span>
        </div>
      )}

      {children}
    </div>
  );
}
