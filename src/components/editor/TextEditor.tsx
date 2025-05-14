// src/components/TextEditor.tsx
import React, { useState } from 'react';
import type { TextOverlay }  from '../../types';

interface TextEditorProps {
  onAddText: (textOverlay: TextOverlay) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ onAddText }) => {
  const [text, setText] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState('#000000');

  const fontOptions = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Helvetica',
    'Tahoma',
    'Trebuchet MS',
    'Impact',
    'Comic Sans MS'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim()) {
      onAddText({
        text,
        fontFamily,
        fontSize,
        color
      });
      
      // Reset form
      setText('');
    }
  };

  return (
    <div className="text-editor">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            className="text-input"
          />
        </div>
        
        <div className="form-group">
          <label>Font Family</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="font-family-select"
          >
            {fontOptions.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Font Size</label>
          <div className="font-size-control">
            <button 
              type="button"
              onClick={() => setFontSize(prev => Math.max(8, prev - 2))}
              className="size-button"
            >
              -
            </button>
            <span className="font-size-display">{fontSize}px</span>
            <button 
              type="button"
              onClick={() => setFontSize(prev => Math.min(72, prev + 2))}
              className="size-button"
            >
              +
            </button>
          </div>
        </div>
        
        <div className="form-group">
          <label>Color</label>
          <div className="color-picker">
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="color-input"
            />
            <span className="color-value">{color}</span>
          </div>
        </div>
        
        <button type="submit" className="add-text-button">
          Add Text
        </button>
      </form>
      
      <div className="text-preview" style={{ fontFamily, fontSize, color }}>
        {text || 'Text Preview'}
      </div>
    </div>
  );
};

export default TextEditor;