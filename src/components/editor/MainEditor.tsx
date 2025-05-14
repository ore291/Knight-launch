// src/App.tsx
import React, { useState } from 'react';
import { Canvas, FabricImage, Textbox } from 'fabric';
import DeviceFrameSelector from './DeviceFrameSelector';
import BackgroundCustomizer from './BackgroundCustomizer';
import TextEditor from './TextEditor';
import ScreenshotManager from './ScreenshotManager';
import CanvasContainer from './CanvasContainer';
import './app.css';
import type { DeviceFrame, Screenshot, TextOverlay, Background } from '../../types';


const MainEditor: React.FC = () => {
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const [selectedDeviceFrame, setSelectedDeviceFrame] = useState<DeviceFrame | null>(null);
    const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
    const [currentScreenshot, setCurrentScreenshot] = useState<Screenshot | null>(null);
    const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
    const [background, setBackground] = useState<Background>({
        type: 'color',
        value: '#f5f5f5',
    });

    const handleDeviceFrameSelect = async (deviceFrame: DeviceFrame) => {
        setSelectedDeviceFrame(deviceFrame);

        if (canvas) {
            // Clear existing device frame
            const existingDeviceFrame = canvas.getObjects().find(obj => obj.data?.type === 'deviceFrame');
            if (existingDeviceFrame) {
                canvas.remove(existingDeviceFrame);
            }

            // Add new device frame
            const img = await FabricImage.fromURL(deviceFrame.imageUrl);
            img.scaleToWidth(deviceFrame.width);
            img.set({
                left: (canvas.width || 0) / 2 - deviceFrame.width / 2,
                top: (canvas.height || 0) / 2 - deviceFrame.height / 2,
                selectable: false,
                data: { type: 'deviceFrame' }
            });
            canvas.add(img);
            canvas.sendObjectToBack(img);
            canvas.renderAll();
        }
    };

    const handleBackgroundChange = (newBackground: Background) => {
        setBackground(newBackground);

        if (canvas) {
            // Update canvas background
            if (newBackground.type === 'color') {
                canvas.backgroundColor = newBackground.value
              //  canvas.setBackgroundColor(newBackground.value, canvas.renderAll.bind(canvas));
            } else if (newBackground.type === 'gradient') {
                // const gradient = new fabric.Gradient({
                //     type: 'linear',
                //     coords: { x1: 0, y1: 0, x2: canvas.width || 0, y2: canvas.height || 0 },
                //     colorStops: [
                //         { offset: 0, color: newBackground.value.color1 },
                //         { offset: 1, color: newBackground.value.color2 }
                //     ]
                // });
                // canvas.setBackgroundColor(gradient, canvas.renderAll.bind(canvas));
            } else if (newBackground.type === 'image' && newBackground.value) {
                // FabricImage.fromURL(newBackground.value, (img) => {
                //     canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                //         scaleX: canvas.width! / img.width!,
                //         scaleY: canvas.height! / img.height!
                //     });
                // });
            }
        }
    };

    const handleAddTextOverlay = (textOverlay: TextOverlay) => {
        setTextOverlays([...textOverlays, textOverlay]);

        if (canvas) {
            const fabricText = new Textbox(textOverlay.text, {
                left: 100,
                top: 100,
                fontFamily: textOverlay.fontFamily,
                fontSize: textOverlay.fontSize,
                fill: textOverlay.color,
                width: 300,
                data: { type: 'textOverlay', id: Date.now() }
            });

            canvas.add(fabricText);
            canvas.setActiveObject(fabricText);
            canvas.renderAll();
        }
    };

    const handleUploadScreenshot = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newScreenshot: Screenshot = {
                id: Date.now(),
                name: file.name,
                imageUrl: e.target?.result as string
            };

            setScreenshots([...screenshots, newScreenshot]);
            handleSelectScreenshot(newScreenshot);
        };
        reader.readAsDataURL(file);
    };

    const handleSelectScreenshot = async (screenshot: Screenshot) => {
        setCurrentScreenshot(screenshot);

        if (canvas && selectedDeviceFrame) {
            // Find the screen area in the device frame
            const deviceFrameObj = canvas.getObjects().find(obj => obj.data?.type === 'deviceFrame');
            if (!deviceFrameObj) return;

            // Remove existing screenshot
            const existingScreenshot = canvas.getObjects().find(obj => obj.data?.type === 'screenshot');
            if (existingScreenshot) {
                canvas.remove(existingScreenshot);
            }

            const img = await FabricImage.fromURL(screenshot.imageUrl)
            // Adjust these values based on your device frame's screen area
                const screenAreaOffset = {
                    x: selectedDeviceFrame.screenX || 0,
                    y: selectedDeviceFrame.screenY || 0,
                    width: selectedDeviceFrame.screenWidth || selectedDeviceFrame.width * 0.8,
                    height: selectedDeviceFrame.screenHeight || selectedDeviceFrame.height * 0.8
                };

                img.scaleToWidth(screenAreaOffset.width);
                img.set({
                    left: ((canvas.width || 0) / 2 - selectedDeviceFrame.width / 2) + screenAreaOffset.x,
                    top: ((canvas.height || 0) / 2 - selectedDeviceFrame.height / 2) + screenAreaOffset.y,
                    selectable: true,
                    data: { type: 'screenshot' }
                });

                canvas.add(img);
                canvas.bringObjectToFront(img);

                // Bring all text overlays to front
                canvas.getObjects().forEach(obj => {
                    if (obj.data?.type === 'textOverlay') {
                        canvas.bringObjectToFront(obj);
                    }
                });

                canvas.renderAll();
        }
    };

    const handleExportImage = () => {
        if (canvas) {
            const dataUrl = canvas.toDataURL({
                format: 'png',
                quality: 1,
                multiplier: 0
            });

            const link = document.createElement('a');
            link.download = 'screenshot-mockup.png';
            link.href = dataUrl;
            link.click();
        }
    };

    return (
        <div className="app">
            <div className="sidebar">
                <h2>Device Frames</h2>
                <DeviceFrameSelector onSelect={handleDeviceFrameSelect} />

                <h2>Background</h2>
                <BackgroundCustomizer
                    background={background}
                    onChange={handleBackgroundChange}
                />

                <h2>Text Overlays</h2>
                <TextEditor onAddText={handleAddTextOverlay} />

                <h2>Screenshots</h2>
                <ScreenshotManager
                    screenshots={screenshots}
                    onUpload={handleUploadScreenshot}
                    onSelect={handleSelectScreenshot}
                    currentScreenshot={currentScreenshot}
                />

                <button onClick={handleExportImage} className="export-button">
                    Export as Image
                </button>
            </div>

            <div className="canvas-container">
                <CanvasContainer
                    setCanvas={setCanvas}
                    width={1200}
                    height={800}
                />
            </div>
        </div>
    );
};

export default MainEditor;