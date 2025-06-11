import { useEffect, useState } from "react";
import { database } from "../firebase/firebaseConfig";
import { ref, onValue, push, remove, update,set  } from "firebase/database";

interface Note {
  id: string;
  text: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  createdBy: string;
}

export const useBoardData = (boardId: string) => {
  const [notes, setNotes] = useState<Record<string, Note>>({});

  useEffect(() => {
    const notesRef = ref(database, `boards/${boardId}/notes`);
    // Listen for any change to notes in this board
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setNotes(data);
    });

    return () => {
      unsubscribe();
    };
  }, [boardId]);

  // Add a note
  const addNote = async (noteData: Omit<Note, 'id'>) => {
  const notesRef = ref(database, `boards/${boardId}/notes`);
  const newNoteRef = push(notesRef); // get new child ref
  await set(newNoteRef, noteData);   // set data at new child location
};

  // Update note position or text
  const updateNote = (id: string, updatedFields: Partial<Note>) => {
    const noteRef = ref(database, `boards/${boardId}/notes/${id}`);
    return update(noteRef, updatedFields);
  };

  // Delete a note
  const deleteNote = (id: string) => {
    const noteRef = ref(database, `boards/${boardId}/notes/${id}`);
    return remove(noteRef);
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
  };
};
