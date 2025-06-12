import React, { useState } from "react";
import { useBoard } from "../../context/BoardContext";
import { useAuth } from "../../context/AuthContext";
import { ref, set } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { FaStickyNote } from "react-icons/fa";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const colors = ["#ffc107", "#f28b82", "#ccff90", "#aecbfa", "#d7aefb", "#2196F3"];

const Sidebar: React.FC = () => {
  const { setActiveTool, setSelectedColor } = useBoard();
  const { user } = useAuth();
  const { boardId } = useParams<{ boardId: string }>();

  const [selectedColor, setColor] = useState(colors[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleToolClick = (tool: "note" | "rectangle" | "circle" | "line") => {
    if (!user || !boardId) return;

    const id = uuidv4();
    const common = {
      id,
      color: selectedColor,
      x: 50,
      y: 50,
      createdBy: user.uid,
    };

    if (tool === "note") {
      setSelectedColor(selectedColor);
      setActiveTool("note");
    } else {
      const shapeData = {
        ...common,
        type: tool,
        width: 100,
        height: 100,
      };
      set(ref(database, `boards/${boardId}/shapes/${id}`), shapeData);
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center p-2 bg-light"
      style={{ height: "100vh", width: "80px", borderRight: "1px solid #ddd" }}
    >
      {/* Color Picker Toggle */}
      <OverlayTrigger placement="right" overlay={<Tooltip>Select Color</Tooltip>}>
        <Button
          variant="outline-secondary"
          size="sm"
          className="mb-2"
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          🎨
        </Button>
      </OverlayTrigger>

      {/* Color Picker Palette */}
      {showColorPicker && (
        <div className="d-flex flex-column align-items-center mb-2">
          {colors.map((color) => (
            <div
              key={color}
              onClick={() => setColor(color)}
              style={{
                backgroundColor: color,
                width: 24,
                height: 24,
                marginBottom: 8,
                border: selectedColor === color ? "2px solid black" : "1px solid gray",
                cursor: "pointer",
                borderRadius: 4,
              }}
            />
          ))}
        </div>
      )}

      {/* Tool Buttons with Tooltips */}
      <OverlayTrigger placement="right" overlay={<Tooltip>Add Note</Tooltip>}>
        <button
          className="btn btn-outline-warning mb-2"
          onClick={() => handleToolClick("note")}
        >
          <FaStickyNote size={20} />
        </button>
      </OverlayTrigger>

      <OverlayTrigger placement="right" overlay={<Tooltip>Add Rectangle</Tooltip>}>
        <Button
          variant="outline-primary"
          size="sm"
          className="mb-2"
          onClick={() => handleToolClick("rectangle")}
        >
          ▭
        </Button>
      </OverlayTrigger>

      <OverlayTrigger placement="right" overlay={<Tooltip>Add Circle</Tooltip>}>
        <Button
          variant="outline-primary"
          size="sm"
          className="mb-2"
          onClick={() => handleToolClick("circle")}
        >
          ◯
        </Button>
      </OverlayTrigger>

      <OverlayTrigger placement="right" overlay={<Tooltip>Add Line</Tooltip>}>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleToolClick("line")}
        >
          /
        </Button>
      </OverlayTrigger>
    </div>
  );
};

export default Sidebar;
