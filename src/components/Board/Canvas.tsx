import React, { useEffect, useRef, useState } from "react";
import { ref, onValue, set, push, remove, update } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";
import Note from "./Note";
import Shape from "./Shape";
import { useAuth } from "../../context/AuthContext";
import { useBoard } from "../../context/BoardContext";

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
  const [shapes, setShapes] = useState<Record<string, any>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shapeRef = ref(database, `boards/${boardId}/shapes`);
    return onValue(shapeRef, (snapshot) => {
      setShapes(snapshot.val() || {});
    });
  }, [boardId]);

  useEffect(() => {
    const notesRef = ref(database, `boards/${boardId}/notes`);
    return onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      const parsed: NoteData[] = data
        ? Object.entries(data).map(([id, val]) => ({
            ...(val as Omit<NoteData, "id">),
            id,
          }))
        : [];
      setNotes(parsed);
    });
  }, [boardId]);

  const addNote = async (x: number, y: number) => {
    const newNote = {
      text: "",
      x,
      y,
      width: 200,
      height: 100,
      color: selectedColor || "#ffc107",
      createdBy: user?.displayName || "Unknown",
    };
    const noteRef = push(ref(database, `boards/${boardId}/notes`));
    await set(noteRef, newNote);
  };

  const updateNotePosition = (id: string, x: number, y: number) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    set(ref(database, `boards/${boardId}/notes/${id}`), { ...note, x, y });
  };

  const updateNoteSize = (id: string, width: number, height: number) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    set(ref(database, `boards/${boardId}/notes/${id}`), {
      ...note,
      width,
      height,
    });
  };

  const updateNoteText = (id: string, text: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    set(ref(database, `boards/${boardId}/notes/${id}`), { ...note, text });
  };

  const deleteNote = (id: string) => {
    remove(ref(database, `boards/${boardId}/notes/${id}`));
  };

  const handleMove = (id: string, x: number, y: number) => {
    update(ref(database, `boards/${boardId}/shapes/${id}`), { x, y });
  };

  const handleResize = (id: string, width: number, height: number) => {
    update(ref(database, `boards/${boardId}/shapes/${id}`), { width, height });
  };

  const handleTextUpdate = (id: string, text: string) => {
    update(ref(database, `boards/${boardId}/shapes/${id}`), { text });
  };

  const handleDelete = (id: string) => {
    remove(ref(database, `boards/${boardId}/shapes/${id}`));
  };

  const handleCanvasClick = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (activeTool !== "note") {
      setSelectedId(null);
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX = 0;
    let clientY = 0;

    if ("changedTouches" in e && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else if ("clientX" in e) {
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
      className="board-background"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {Object.entries(shapes).map(([id, shape]) => (
        <Shape
          key={id}
          {...shape}
          currentUser={user?.uid}
          onMove={handleMove}
          onResize={handleResize}
          onDelete={handleDelete}
          onTextUpdate={handleTextUpdate}
          selected={selectedId === id}
          onSelect={setSelectedId}
        />
      ))}

      {notes.map((note) => (
        <Note
          key={note.id}
          {...note}
          currentUser={user?.displayName || ""}
          selected={selectedId === note.id}
          onSelect={setSelectedId}
          onDragStop={updateNotePosition}
          onDelete={deleteNote}
          onTextChange={updateNoteText}
          onResize={updateNoteSize}
        />
      ))}
    </div>
  );
};

export default Canvas;
