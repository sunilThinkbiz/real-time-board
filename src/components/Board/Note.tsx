import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Button } from "react-bootstrap";

export interface NoteProps {
  id: string;
  text: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  createdBy: string;
  currentUser: string;
  userNames?: Record<string, string>;
  selected: boolean;
  onSelect: (id: string | null) => void;
  onDragStop: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onDelete: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  scale?: number;
}

const Note: React.FC<NoteProps> = ({
  id,
  text: propText,
  x,
  y,
  width = 200,
  height = 120,
  color = "#ffc107",
  createdBy,
  currentUser,
  userNames,
  selected,
  onSelect,
  onDragStop,
  onResize,
  onDelete,
  onTextChange,
  scale = 1,
}) => {
  const [editText, setEditText] = useState(propText);

  useEffect(() => {
    setEditText(propText);
  }, [propText]);

  const getOwnerDisplayName = () => {
    if (currentUser === createdBy) return "You";
    const userName = userNames?.[createdBy];
    if (userName) return userName;
    if (createdBy.includes("@")) return createdBy.split("@")[0];
    return createdBy || "Unknown User";
  };

  return (
    <Rnd
      position={{ x, y }}
      size={{ width, height }}
      bounds="parent"
      scale={scale}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onDragStop={(_, data) => onDragStop(id, data.x, data.y)}
      onResizeStop={(_, __, ref, ____, position) => {
        onResize(id, ref.offsetWidth, ref.offsetHeight);
        onDragStop(id, position.x, position.y);
      }}
      style={{ zIndex: selected ? 1000 : 1 }}
    >
      {/* Outer wrapper for spacing and glow */}
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "6px",
          border: selected ? "2px solid #007bff" : "2px solid transparent",
          // borderRadius: "16px",
          boxShadow: selected
            ? "0 0 10px rgba(0,123,255,0.6)"
            : "0 2px 8px rgba(0,0,0,0.05)",
          background: "transparent",
          boxSizing: "border-box",
        }}
      >
        {/* Inner note card */}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: color,
            // borderRadius: "12px",
            
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            cursor: "move",
            boxSizing: "border-box",
          }}
        >
          {/* Header with owner and delete */}
          <div
            style={{
              padding: "6px 10px",
              backgroundColor: "rgba(0,0,0,0.05)",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: "28px",
            }}
          >
            <small
              style={{
                fontSize: "11px",
                color: "#444",
                fontWeight: "500",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "calc(100% - 30px)",
              }}
            >
              {getOwnerDisplayName()}
            </small>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              style={{
                padding: "2px 6px",
                fontSize: "12px",
                lineHeight: "1",
                border: "none",
                backgroundColor: "transparent",
                color: "#dc3545",
                minWidth: "20px",
                height: "20px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#dc3545";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#dc3545";
              }}
            >
              ×
            </Button>
          </div>

          {/* Text area body */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <textarea
              value={editText}
              onChange={(e) => {
                const newText = e.target.value;
                setEditText(newText);
                onTextChange(id, newText);
              }}
              placeholder="Type your note here..."
              style={{
                width: "100%",
                height: "100%",
                resize: "none",
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "13px",
                lineHeight: "1.4",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                color: "#333",
                cursor: "text",
                padding: "0",
              }}
            />
          </div>
        </div>
      </div>
    </Rnd>
  );
};

export default Note;
