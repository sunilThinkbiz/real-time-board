import React, { useState, useEffect, useRef } from "react";
import Note from "./Note";
import Shape from "./Shape";
import { useAuth } from "../../context/AuthContext";
import { useBoard } from "../../context/BoardContext";
import { database } from "../../firebase/firebaseConfig";
import { ref, set } from "firebase/database";

interface CanvasProps {
  boardId: string;
}

const Canvas: React.FC<CanvasProps> = ({ boardId }) => {
  const { user } = useAuth();
  const {
    activeTool,
    selectedColor,
    notes,
    shapes,
    userNames,
    createNote,
    createShape,
    cursors,
    trackCursor,
    updateNote,
    updateShape,
    deleteNote,
    deleteShape,
  } = useBoard();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  // cursor pointer indicator
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollX = container.scrollLeft;
      const scrollY = container.scrollTop;

      const x = (e.clientX - rect.left + scrollX) / scale;
      const y = (e.clientY - rect.top + scrollY) / scale;

      trackCursor(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (user && boardId) {
        set(ref(database, `boards/${boardId}/cursors/${user.uid}`), null);
      }
    };
  }, [trackCursor, scale, boardId, user]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault(); // Prevent zoom scroll
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.min(Math.max(prev + delta, 0.1), 4));
    }
  };

  const handleCanvasClick = async (e: React.MouseEvent) => {
    if (!activeTool || !user || !boardId) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scrollX = container.scrollLeft;
    const scrollY = container.scrollTop;

    const x = (e.clientX - rect.left + scrollX) / scale;
    const y = (e.clientY - rect.top + scrollY) / scale;

    try {
      if (activeTool === "note") {
        await createNote(x, y);
      } else {
        await createShape(activeTool, x, y);
      }
    } catch (error) {
      console.error("Error creating element:", error);
    }
  };

  const handleNoteUpdate = async (id: string, updates: Partial<any>) => {
    try {
      await updateNote(id, updates);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleShapeUpdate = async (id: string, updates: Partial<any>) => {
    try {
      await updateShape(id, updates);
    } catch (error) {
      console.error("Error updating shape:", error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setSelectedId(null);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleDeleteShape = async (id: string) => {
    try {
      await deleteShape(id);
      setSelectedId(null);
    } catch (error) {
      console.error("Error deleting shape:", error);
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      onClick={handleCanvasClick}
      onWheel={handleWheel}
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        background: "#f5f5f5",
        position: "relative",
      }}
    >
      <div
        style={{
          width: 3000,
          height: 3000,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
          backgroundImage:
            "linear-gradient(0deg, #e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          position: "relative",
        }}
      >
        {notes.map((note) => (
          <Note
            key={note.id}
            {...note}
            scale={scale}
            currentUser={user?.uid || ""}
            selected={selectedId === note.id}
            userNames={userNames}
            onSelect={(id) => setSelectedId(id)}
            onDragStop={(id, x, y) => handleNoteUpdate(id, { x, y })}
            onResize={(id, w, h) =>
              handleNoteUpdate(id, { width: w, height: h })
            }
            onDelete={handleDeleteNote}
            onTextChange={(id, text) => handleNoteUpdate(id, { text })}
          />
        ))}

        {shapes.map((shape) => (
          <Shape
            key={shape.id}
            {...shape}
            scale={scale}
            currentUser={user?.uid || ""}
            selected={selectedId === shape.id}
            onSelect={(id) => setSelectedId(id)}
            onMove={(id, x, y) => handleShapeUpdate(id, { x, y })}
            onResize={(id, w, h) =>
              handleShapeUpdate(id, { width: w, height: h })
            }
            onDelete={handleDeleteShape}
            onTextUpdate={(id, text) => handleShapeUpdate(id, { text })}
          />
        ))}
        {Object.entries(cursors).map(([uid, cursor]) => {
          if (uid === user?.uid) return null;
          return (
            <div
              key={uid}
              style={{
                position: "absolute",
                left: cursor.x * scale,
                top: cursor.y * scale,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: cursor.color || "#007bff",
                  borderRadius: "50%",
                  border: "2px solid white",
                }}
              />
              <div
                style={{
                  fontSize: 12,
                  color: "#333",
                  background: "#fff",
                  padding: "2px 4px",
                  borderRadius: 4,
                  marginTop: 2,
                  textAlign: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }}
              >
                {cursor.displayName || "User"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Canvas;
