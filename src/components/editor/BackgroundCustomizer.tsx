// src/components/BackgroundCustomizer.tsx
import React, { useState, useRef } from 'react';
import type { Background, GradientBackground, DragEvent } from '../../types';

interface BackgroundCustomizerProps {
  background: Background;
  onChange: (background: Background) => void;
}

const BackgroundCustomizer: React.FC<BackgroundCustomizerProps> = ({ background, onChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      type: 'color',
      value: e.target.value
    });
  };

  const handleGradientChange = (field: keyof GradientBackground, value: string) => {
    const currentValue = background.type === 'gradient' 
      ? background.value as GradientBackground 
      : { color1: '#ffffff', color2: '#000000' };
    
    onChange({
      type: 'gradient',
      value: {
        ...currentValue,
        [field]: value
      }
    });
  };

  const handleImageUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange({
            type: 'image',
            value: event.target.result as string
          });
        }
      };
      
      reader.readAsDataURL(file);
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onChange({
              type: 'image',
              value: event.target.result as string
            });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="background-customizer">
      <div className="background-type-selector">
        <div className="radio-group">
          <label>
            <input 
              type="radio" 
              name="background-type" 
              checked={background.type === 'color'} 
              onChange={() => onChange({ type: 'color', value: '#f5f5f5' })}
            />
            Solid Color
          </label>
          
          <label>
            <input 
              type="radio" 
              name="background-type" 
              checked={background.type === 'gradient'} 
              onChange={() => onChange({ 
                type: 'gradient', 
                value: { color1: '#4776E6', color2: '#8E54E9' } 
              })}
            />
            Gradient
          </label>
          
          <label>
            <input 
              type="radio" 
              name="background-type" 
              checked={background.type === 'image'} 
              onChange={() => {
                if (background.type !== 'image') {
                  handleImageUploadClick();
                }
              }}
            />
            Image
          </label>
        </div>
      </div>

      {background.type === 'color' && (
        <div className="color-picker">
          <input 
            type="color" 
            value={background.value as string} 
            onChange={handleColorChange}
          />
          <span>{background.value as string}</span>
        </div>
      )}

      {background.type === 'gradient' && (
        <div className="gradient-picker">
          <div className="color-stop">
            <label>Color 1</label>
            <input 
              type="color" 
              value={(background.value as GradientBackground).color1} 
              onChange={(e) => handleGradientChange('color1', e.target.value)}
            />
          </div>
          <div className="color-stop">
            <label>Color 2</label>
            <input 
              type="color" 
              value={(background.value as GradientBackground).color2} 
              onChange={(e) => handleGradientChange('color2', e.target.value)}
            />
          </div>
          <div 
            className="gradient-preview" 
            style={{ 
              background: `linear-gradient(to right, ${(background.value as GradientBackground).color1}, ${(background.value as GradientBackground).color2})` 
            }}
          ></div>
        </div>
      )}

      {background.type === 'image' && (
        <div 
          className={`image-upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleImageUploadClick}
        >
          {background.value && typeof background.value === 'string' ? (
            <div className="image-preview">
              <img src={background.value} alt="Background" />
              <button 
                className="change-image-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageUploadClick();
                }}
              >
                Change Image
              </button>
            </div>
          ) : (
            <div className="upload-prompt">
              <span>Drag & drop an image or click to browse</span>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageFileChange}
          />
        </div>
      )}
    </div>
  );
};

export default BackgroundCustomizer;