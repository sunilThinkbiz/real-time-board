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
  onDragStop: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  onColorChange: (id: string, color: string) => void;
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
  onDragStop,
  onDelete,
  onTextChange
}) => {
  const [editText, setEditText] = useState(propText);

  useEffect(() => {
    setEditText(propText);
  }, [propText]);

  return (
    <Rnd
      default={{ x, y, width, height }}
      bounds="parent"
      onDragStop={(_, data) => onDragStop(id, data.x, data.y)}
    >
      <div
        className="p-2 rounded"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: color,
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
            onTextChange(id, newText);
          }}
          style={{
            width: "100%",
            height: "70%",
            resize: "none",
            background: "transparent",
            border: "none",
            fontSize: "14px",
          }}
        />
        <div className="d-flex justify-content-between align-items-center mt-2">
          <small>{createdBy === currentUser ? "You" : createdBy}</small>
          <Button variant="danger" size="sm" onClick={() => onDelete(id)}>
            &times;
          </Button>
        </div>
      </div>
    </Rnd>
  );
};

export default Note;
