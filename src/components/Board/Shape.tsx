import React from "react";
import { Rnd } from "react-rnd";
import { FaTimes } from "react-icons/fa";

interface ShapeProps {
  id: string;
  type: "rectangle" | "circle" | "line";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation?: number;
  text?: string;
  scale?: number;
  createdBy: string;
  currentUser: string;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (
    id: string,
    width: number,
    height: number,
    rotation?: number
  ) => void;
  onDelete: (id: string) => void;
  onTextUpdate?: (id: string, text: string) => void;
  selected: boolean;
  onSelect: (id: string) => void;
}

const Shape: React.FC<ShapeProps> = ({
  id,
  type,
  x,
  y,
  width,
  height,
  color,
  rotation = 0,
  text = "",
  createdBy,
  currentUser,
  scale,
  onMove,
  onResize,
  onDelete,
  onTextUpdate = () => {},
  selected,
  onSelect,
}) => {
  const renderShapeContent = () => {
    const baseStyle: React.CSSProperties = {
      width: "100%",
      height: "100%",
      backgroundColor: color,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      wordBreak: "break-word",
      position: "relative",
      textAlign: "center",
      whiteSpace: "pre-wrap",
    };

    const editableText = (
      <textarea
        value={text}
        onChange={(e) => onTextUpdate(id, e.target.value)}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          border: "none",
          outline: "none",
          resize: "none",
          color: "#000",
          textAlign: "center",
          fontWeight: "bold",
        }}
      />
    );

    const staticText = (
      <div style={{ fontWeight: "bold", color: "#000" }}>{text}</div>
    );

    switch (type) {
      case "rectangle":
        return (
          <div style={{ ...baseStyle, borderRadius: 4,boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", }}>
            {selected ? editableText : staticText}
          </div>
        );
      case "circle":
        return (
          <div style={{ ...baseStyle, borderRadius: "50%",boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", }}>
            {selected ? editableText : staticText}
          </div>
        );
      case "line":
        return (
          <svg width="100%" height="100%">
            <line
              x1="0"
              y1="0"
              x2={width}
              y2={height}
              stroke={color}
              strokeWidth={4}
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Rnd
      size={{ width, height }}
      position={{ x, y }}
      disableDragging={false}
      scale={scale}
      enableResizing={true}
      onDragStop={(e, d) => onMove(id, d.x, d.y)}
      onResizeStop={(e, direction, ref, delta, position) => {
        onResize(id, ref.offsetWidth, ref.offsetHeight, rotation);
        onMove(id, position.x, position.y);
      }}
      bounds="parent"
      style={{
        transform: type === "line" ? `rotate(${rotation}deg)` : "none",
        zIndex: selected ? 10 : 1,
        cursor: "move",
      }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          border: selected ? "2px solid #3f51b5" : "none",
          boxSizing: "border-box",
          padding: selected ? 4 : 0,
          borderRadius: type === "circle" ? "50%" : 4,
          // backgroundColor: "white", // helps show border clearly
        }}
      >
        {renderShapeContent()}

        {selected && type !== "line" && (
          <FaTimes
            onClick={() => onDelete(id)}
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 20,
            }}
          />
        )}

        {selected && type === "line" && (
          <div
            onClick={() => onDelete(id)}
            style={{
              position: "absolute",
              left: width - 10,
              top: height - 10,
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 20,
            }}
          >
            <FaTimes size={12} />
          </div>
        )}
      </div>
    </Rnd>
  );
};

export default Shape;
