import React, { useEffect, useRef } from 'react';
import type { DragEvent } from '../../types';
import { Canvas } from 'fabric';


interface CanvasContainerProps {
  setCanvas: (canvas: Canvas) => void;
  width: number;
  height: number;
}

const CanvasContainer: React.FC<CanvasContainerProps> = ({ setCanvas, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#f5f5f5',
        preserveObjectStacking: true,
      });
      
      setCanvas(canvas);
      
      return () => {
        canvas.dispose();
      };
    }
  }, [setCanvas, width, height]);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            alert('Image dropped! Implement handling for dropped images.');
            // You would typically call a parent component function here
            // to handle the image data
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

return (
  
  <div 
    className="canvas-wrapper"
    ref={canvasContainerRef}
    onDragOver={handleDragOver}
    onDrop={handleDrop}
  >
    <canvas ref={canvasRef} />
  </div>
);

   
};

export default CanvasContainer;