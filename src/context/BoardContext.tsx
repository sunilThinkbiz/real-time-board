// src/context/BoardContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { database } from '../firebase/firebaseConfig';
import { ref, onValue, push, set, remove, update, off } from 'firebase/database';

export type NoteType = {
  id: string;
  text: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  createdBy: string;
  color: string;
};

type ToolType = 'note' | 'move' | null;

interface BoardContextType {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  notes: NoteType[];
  addNote: (note: Partial<Omit<NoteType, 'id' | 'createdBy'>> & { createdBy: string }) => void;
  updateNotePosition: (id: string, x: number, y: number) => void;
  updateNoteText: (id: string, text: string) => void;
  updateNoteColor: (id: string, color: string) => void;
  deleteNote: (id: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#FFEB3B');
  const [notes, setNotes] = useState<NoteType[]>([]);

  useEffect(() => {
    const notesRef = ref(database, 'notes');
    onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedNotes: NoteType[] = data
        ? Object.entries(data).map(([key, val]: [string, any]) => ({
            id: key,
            text: val.text || '',
            x: val.x || 0,
            y: val.y || 0,
            width: val.width || 200,
            height: val.height || 100,
            createdBy: val.createdBy || 'Unknown',
            color: val.color || '#FFEB3B',
          }))
        : [];
      setNotes(loadedNotes);
    });

    return () => {
      off(notesRef);
    };
  }, []);

  const addNote = (note: Partial<Omit<NoteType, 'id' | 'createdBy'>> & { createdBy: string }) => {
    const notesRef = ref(database, 'notes');
    const newNoteRef = push(notesRef);
    const defaultNote = {
      text: '',
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      color: selectedColor,
    };

    set(newNoteRef, { ...defaultNote, ...note });
  };

  const updateNotePosition = (id: string, x: number, y: number) => {
    update(ref(database, `notes/${id}`), { x, y });
  };

  const updateNoteText = (id: string, text: string) => {
    update(ref(database, `notes/${id}`), { text });
  };

  const updateNoteColor = (id: string, color: string) => {
    update(ref(database, `notes/${id}`), { color });
  };

  const deleteNote = (id: string) => {
    remove(ref(database, `notes/${id}`));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  return (
    <BoardContext.Provider
      value={{
        activeTool,
        setActiveTool,
        selectedElementId,
        setSelectedElementId,
        selectedColor,
        setSelectedColor,
        notes,
        addNote,
        updateNotePosition,
        updateNoteText,
        updateNoteColor,
        deleteNote,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = (): BoardContextType => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};
