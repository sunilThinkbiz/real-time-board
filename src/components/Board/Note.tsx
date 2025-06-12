import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Button } from "react-bootstrap";

interface NoteProps {
  id: string;
  text: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  createdBy: string;
  currentUser: string;
  selected: boolean;
  onSelect: (id: string | null) => void;
  onDragStop: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onDelete: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
}

const Note: React.FC<NoteProps> = ({
  id,
  text: propText,
  x,
  y,
  width = 200,
  height = 100,
  color = "#ffc107",
  createdBy,
  currentUser,
  selected,
  onSelect,
  onDragStop,
  onResize,
  onDelete,
  onTextChange
}) => {
  const [editText, setEditText] = useState(propText);
  const isOwner = currentUser === createdBy;

  useEffect(() => {
    setEditText(propText);
  }, [propText]);

  return (
    <Rnd
      position={{ x, y }}
      size={{ width, height }}
      bounds="parent"
      disableDragging={!isOwner}
      enableResizing={isOwner}
      onClick={() => onSelect(id)}
      onDragStop={(_, data) => isOwner && onDragStop(id, data.x, data.y)}
      onResizeStop={(_, __, ref, ____, position) => {
        if (!isOwner) return;
        const newWidth = ref.offsetWidth;
        const newHeight = ref.offsetHeight;
        onResize(id, newWidth, newHeight);
        onDragStop(id, position.x, position.y);
      }}
    >
      <div
        className="p-2 rounded"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: color,
          border: selected ? "2px solid #333" : "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <textarea
          className="form-control"
          value={editText}
          onChange={(e) => {
            const newText = e.target.value;
            setEditText(newText);
            if (isOwner) onTextChange(id, newText);
          }}
          disabled={!isOwner}
          style={{
            width: "100%",
            height: "70%",
            resize: "none",
            background: "transparent",
            border: "none",
            fontSize: "14px",
            cursor: isOwner ? "text" : "not-allowed"
          }}
        />
        <div className="d-flex justify-content-between align-items-center mt-2">
          <small>{isOwner ? "You" : createdBy}</small>
          {isOwner && (
            <Button variant="danger" size="sm" onClick={() => onDelete(id)}>
              &times;
            </Button>
          )}
        </div>
      </div>
    </Rnd>
  );
};

export default Note;
