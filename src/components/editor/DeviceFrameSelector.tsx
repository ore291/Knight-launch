// src/components/DeviceFrameSelector.tsx
import React from 'react';
import type { DeviceFrame } from '../../types';

interface DeviceFrameSelectorProps {
  onSelect: (deviceFrame: DeviceFrame) => void;
}

const DeviceFrameSelector: React.FC<DeviceFrameSelectorProps> = ({ onSelect }) => {
  // Sample device frames - you would likely load these from a data source
  const deviceFrames: DeviceFrame[] = [
    {
      id: 'iphone-12',
      name: 'iPhone 12',
      type: 'phone',
      imageUrl: '/device-frames/iphone12.png', // You'll need to add these images
      width: 300,
      height: 612,
      screenX: 18,
      screenY: 18,
      screenWidth: 264,
      screenHeight: 576
    },
    {
      id: 'iphone-13',
      name: 'iPhone 13',
      type: 'phone',
      imageUrl: '/device-frames/iphone13.png',
      width: 300,
      height: 612,
      screenX: 18,
      screenY: 18,
      screenWidth: 264,
      screenHeight: 576
    },
    {
      id: 'ipad-air',
      name: 'iPad Air',
      type: 'tablet',
      imageUrl: '/device-frames/ipad-air.png',
      width: 500,
      height: 680,
      screenX: 25,
      screenY: 25,
      screenWidth: 450,
      screenHeight: 630
    },
    {
      id: 'samsung-galaxy-s21',
      name: 'Samsung Galaxy S21',
      type: 'phone',
      imageUrl: '/device-frames/galaxy-s21.png',
      width: 280,
      height: 600,
      screenX: 14,
      screenY: 14,
      screenWidth: 252,
      screenHeight: 572
    }
  ];

  // Group devices by type
  const phoneFrames = deviceFrames.filter(frame => frame.type === 'phone');
  const tabletFrames = deviceFrames.filter(frame => frame.type === 'tablet');

  return (
    <div className="device-frame-selector">
      <div className="device-category">
        <h3>Phones</h3>
        <div className="device-grid">
          {phoneFrames.map((frame) => (
            <div 
              key={frame.id}
              className="device-frame-item"
              onClick={() => onSelect(frame)}
            >
              <img 
                src={frame.imageUrl} 
                alt={frame.name}
                className="device-thumbnail" 
                onError={(e) => {
                  // Fallback for missing images during development
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x200?text=Phone';
                }}
              />
              <span>{frame.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="device-category">
        <h3>Tablets</h3>
        <div className="device-grid">
          {tabletFrames.map((frame) => (
            <div 
              key={frame.id}
              className="device-frame-item"
              onClick={() => onSelect(frame)}
            >
              <img 
                src={frame.imageUrl} 
                alt={frame.name}
                className="device-thumbnail"
                onError={(e) => {
                  // Fallback for missing images during development
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x200?text=Tablet';
                }}
              />
              <span>{frame.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeviceFrameSelector;