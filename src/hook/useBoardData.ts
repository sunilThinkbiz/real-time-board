import { useEffect, useState } from "react";
import { database, auth } from "../firebase/firebaseConfig";
import { ref, onValue, push, remove, update, set } from "firebase/database";

interface Note {
  id: string;
  text: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  createdBy: string;
  color?: string;
}

export const useBoardData = (boardId: string) => {
  const [notes, setNotes] = useState<Record<string, Note>>({});

  useEffect(() => {
    if (!boardId) return;

    const notesRef = ref(database, `boards/${boardId}/notes`);
    const unsubscribe = onValue(notesRef, (snapshot) => {
      setNotes(snapshot.val() || {});
    });

    return () => unsubscribe();
  }, [boardId]);

  const addNote = async (noteData: Omit<Note, 'id' | 'createdBy'>) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const notesRef = ref(database, `boards/${boardId}/notes`);
    const newNoteRef = push(notesRef);

    await set(newNoteRef, {
      ...noteData,
      createdBy: uid,
    });
  };

  const updateNote = (id: string, updatedFields: Partial<Note>) => {
    const noteRef = ref(database, `boards/${boardId}/notes/${id}`);
    return update(noteRef, updatedFields);
  };

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
