// src/components/ScreenshotManager.tsx
import React, { useRef, useState } from 'react';
import type { Screenshot, DragEvent } from '../../types';

interface ScreenshotManagerProps {
  screenshots: Screenshot[];
  onUpload: (file: File) => void;
  onSelect: (screenshot: Screenshot) => void;
  currentScreenshot: Screenshot | null;
}

const ScreenshotManager: React.FC<ScreenshotManagerProps> = ({ 
  screenshots, 
  onUpload, 
  onSelect,
  currentScreenshot
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onUpload(file);
      }
    }
  };

  return (
    <div className="screenshot-manager">
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <div className="upload-prompt">
          <span>Drag & drop or click to upload screenshot</span>
        </div>
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
      
      {screenshots.length > 0 && (
        <div className="screenshots-gallery">
          <h3>Your Screenshots</h3>
          <div className="screenshots-grid">
            {screenshots.map((screenshot) => (
              <div 
                key={screenshot.id}
                className={`screenshot-item ${currentScreenshot?.id === screenshot.id ? 'active' : ''}`}
                onClick={() => onSelect(screenshot)}
              >
                <img 
                  src={screenshot.imageUrl} 
                  alt={screenshot.name} 
                  className="screenshot-thumbnail"
                />
                <span className="screenshot-name">
                  {screenshot.name.length > 15 
                    ? screenshot.name.substring(0, 12) + '...' 
                    : screenshot.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenshotManager;