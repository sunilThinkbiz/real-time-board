import React, { useEffect, useRef, useState } from 'react';
import { ref, onValue, set, push, remove } from 'firebase/database';
import { database } from '../../firebase/firebaseConfig';
import Note from './Note';
import { useAuth } from '../../context/AuthContext';
import { useBoard } from '../../context/BoardContext';

interface NoteData {
  id: string;
  text: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  createdBy: string;
}

interface CanvasProps {
  boardId: string;
}

const Canvas: React.FC<CanvasProps> = ({ boardId }) => {
  const { user } = useAuth();
  const { activeTool, setActiveTool, selectedColor } = useBoard();
  const [notes, setNotes] = useState<NoteData[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const notesRef = ref(database, `boards/${boardId}/notes`);
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      const parsed: NoteData[] = data
        ? Object.entries(data).map(([id, val]) => ({ ...(val as Omit<NoteData, 'id'>), id }))
        : [];
      setNotes(parsed);
    });
    return () => unsubscribe();
  }, [boardId]);

  const addNote = async (x: number, y: number) => {
    const newNote = {
      text: '',
      x,
      y,
      width: 200,
      height: 100,
      color: selectedColor || '#ffc107',
      createdBy: user?.displayName || 'Unknown',
    };
    const noteRef = push(ref(database, `boards/${boardId}/notes`));
    await set(noteRef, newNote);
  };

  const updateNotePosition = (id: string, x: number, y: number) => {
    const noteRef = ref(database, `boards/${boardId}/notes/${id}`);
    const existing = notes.find(n => n.id === id);
    if (!existing) return;
    set(noteRef, { ...existing, x, y });
  };

  const updateNoteText = (id: string, text: string) => {
    const noteRef = ref(database, `boards/${boardId}/notes/${id}`);
    const existing = notes.find(n => n.id === id);
    if (!existing) return;
    set(noteRef, { ...existing, text });
  };

  const deleteNote = (id: string) => {
    const noteRef = ref(database, `boards/${boardId}/notes/${id}`);
    remove(noteRef);
  };

  const handleCanvasClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (activeTool !== 'note') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX = 0;
    let clientY = 0;

    if ('changedTouches' in e && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    addNote(x, y);
    setActiveTool(null);
  };

  return (
    <div
      ref={canvasRef}
      onClick={handleCanvasClick}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleCanvasClick(e);
      }}
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'auto',
        background: '#f4f4f4',
        touchAction: 'manipulation',
      }}
    >
      {notes.map(note => (
        <Note
          key={note.id}
          {...note}
          currentUser={user?.displayName || ''}
          onDragStop={updateNotePosition}
          onDelete={deleteNote}
          onTextChange={updateNoteText}
          onColorChange={() => {}} // Removed color picker usage
        />
      ))}
    </div>
  );
};

export default Canvas;
