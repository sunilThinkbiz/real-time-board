import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { FaStickyNote } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const { setActiveTool, setSelectedColor } = useBoard();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colors = ['#ffc107', '#f28b82', '#ccff90', '#aecbfa', '#d7aefb'];

  const handleNoteClick = () => {
    setShowColorPicker(!showColorPicker); // toggle color picker
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setActiveTool('note');
    setShowColorPicker(false); // hide picker after selection
  };

  return (
    <div className="d-flex flex-column align-items-center p-2 bg-light" style={{ height: '100vh' }}>
      <button className="btn btn-outline-primary mb-2" onClick={handleNoteClick}>
        <FaStickyNote />
      </button>

      {showColorPicker && (
        <div className="d-flex flex-column align-items-center">
          {colors.map((color) => (
            <div
              key={color}
              onClick={() => handleColorSelect(color)}
              style={{
                backgroundColor: color,
                width: 24,
                height: 24,
                marginBottom: 8,
                border: '1px solid gray',
                cursor: 'pointer',
                borderRadius: 4,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
