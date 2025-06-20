import React, { useState } from "react";
import { useBoard } from "../../context/BoardContext";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import {
  PiNoteBold,
  PiSquareBold,
  PiCircleBold,
  PiPencilSimpleBold,
  PiArrowBendUpLeftBold,
  PiArrowBendUpRightBold,
  PiPaletteBold,
} from "react-icons/pi";
import { CiText } from "react-icons/ci";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const colors = [
  "#000000",
  "#ffc107",
  "#f28b82",
  "#ccff90",
  "#aecbfa",
  "#d7aefb",
  "#2196F3",
];

const Sidebar: React.FC = () => {
  const {
    activeTool,
    setActiveTool,
    selectedColor,
    setSelectedColor,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useBoard();
  const { user } = useAuth();
  const { boardId } = useParams<{ boardId: string }>();

  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleToolClick = (tool: "note" | "rectangle" | "circle" | "line" | "simpleText") => {
    if (!user || !boardId) return;
    setActiveTool(tool);
  };

  return (
    <div
      className="position-relative d-flex flex-column justify-content-between align-items-center"
      style={{
        height: "100vh",
        width: "60px",
        borderRight: "1px solid #ddd",
        margin: "5px",
        borderRadius: "20px",
        position: "sticky",
        top: 0,
        padding: "10px 0",
      }}
    >
      {/* Tools + Undo/Redo */}
      <div className="d-flex flex-column align-items-center gap-3">
        {/* Color Picker */}
        <OverlayTrigger placement="right" overlay={<Tooltip>Color</Tooltip>}>
          <Button
            variant="light"
            className="p-2 d-flex align-items-center justify-content-center"
            style={{ borderRadius: "8px" }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <PiPaletteBold size={20} />
          </Button>
        </OverlayTrigger>

        {/* Color Picker Dropdown */}
        {showColorPicker && (
          <div
            className="position-absolute bg-white p-2 shadow rounded"
            style={{
              left: "60px",
              top: "10px",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {colors.map((color) => (
              <div
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  setShowColorPicker(false);
                }}
                style={{
                  backgroundColor: color,
                  width: 24,
                  height: 24,
                  marginBottom: 8,
                  border:
                    selectedColor === color
                      ? "2px solid black"
                      : "1px solid gray",
                  cursor: "pointer",
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        )}

        {/* Tools */}
        <OverlayTrigger placement="right" overlay={<Tooltip>Note</Tooltip>}>
          <Button
            variant={activeTool === "note" ? "primary" : "light"}
            className="p-2"
            style={{ borderRadius: "8px" }}
            onClick={() => handleToolClick("note")}
          >
            <PiNoteBold size={20} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          overlay={<Tooltip>Rectangle</Tooltip>}
        >
          <Button
            variant={activeTool === "rectangle" ? "primary" : "light"}
            className="p-2"
            style={{ borderRadius: "8px" }}
            onClick={() => handleToolClick("rectangle")}
          >
            <PiSquareBold size={20} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger placement="right" overlay={<Tooltip>Circle</Tooltip>}>
          <Button
            variant={activeTool === "circle" ? "primary" : "light"}
            className="p-2"
            style={{ borderRadius: "8px" }}
            onClick={() => handleToolClick("circle")}
          >
            <PiCircleBold size={20} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger placement="right" overlay={<Tooltip>Line</Tooltip>}>
          <Button
            variant={activeTool === "line" ? "primary" : "light"}
            className="p-2"
            style={{ borderRadius: "8px" }}
            onClick={() => handleToolClick("line")}
          >
            <PiPencilSimpleBold size={20} />
          </Button>
        </OverlayTrigger>
        {/* simple text  */}

        <OverlayTrigger
          placement="right"
          overlay={<Tooltip>Simple Text</Tooltip>}
        >
          <Button
            variant={activeTool === "simpleText" ? "primary" : "light"}
            className="p-2"
            style={{ borderRadius: "8px" }}
            onClick={() => handleToolClick("simpleText")}
          >
            <CiText size={20} />
          </Button>
        </OverlayTrigger>

        {/* Undo */}
        <OverlayTrigger placement="right" overlay={<Tooltip>Undo</Tooltip>}>
          <Button
            variant="light"
            className="p-2"
            style={{
              borderRadius: "8px",
              opacity: canUndo ? 1 : 0.5,
            }}
            onClick={undo}
            disabled={!canUndo}
          >
            <PiArrowBendUpLeftBold size={20} />
          </Button>
        </OverlayTrigger>

        {/* Redo */}
        <OverlayTrigger placement="right" overlay={<Tooltip>Redo</Tooltip>}>
          <Button
            variant="light"
            className="p-2"
            style={{
              borderRadius: "8px",
              opacity: canRedo ? 1 : 0.5,
            }}
            onClick={redo}
            disabled={!canRedo}
          >
            <PiArrowBendUpRightBold size={20} />
          </Button>
        </OverlayTrigger>
      </div>
    </div>
  );
};

export default Sidebar;
