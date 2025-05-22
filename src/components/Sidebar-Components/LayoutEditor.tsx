import { Canvas, FabricImage, FabricText, IText } from 'fabric';
import React, { useCallback, useEffect, useState } from 'react'
import { CanvasComponent } from '../CanvasComponent';
import type { CanvasItem, layoutType } from '../../types';

interface LayoutEditorProps {
    selectedCanvas: Canvas;
}
export const LayoutEditor: React.FC<LayoutEditorProps> = ({ selectedCanvas }) => {
    const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
    const [selectedCanvasId, setSelectedCanvasId] = useState<string>("canvas-1");


    const add = async (items: layoutType) => {

        const text = new IText(items.text.value, {
            originX: "center",
            left: selectedCanvas?.getWidth() / 2,
            top: 1,
            fontSize: 24,
            fill: '#FFFFFF',
        });
        const phoneImg = await FabricImage.fromURL(items.frame.url);
        // Get screen dimensions from the frame image


        const fitScale = Math.min(
            selectedCanvas.width! / phoneImg.width!,
            selectedCanvas.height! / phoneImg.height!
        );
        const scale = fitScale * 0.75;
        phoneImg.set({
            originX: "center",
            originY: "center",
            left: (items.frame.left * 3.2) || selectedCanvas.width! / 2,
            top: (items.frame.top * 3.5) || selectedCanvas.height! / 2,
            angle:items.frame.angle,
            scaleX: scale,
            scaleY: scale,
            selectable: true,
            hasControls: false,
            hasBorders: false,
            lockMovementX: true,      // Disables horizontal movement
            lockMovementY: true,

        });


        selectedCanvas?.add(phoneImg);
        selectedCanvas.setActiveObject(phoneImg);
        selectedCanvas?.add(text)
    }

    const layouts: layoutType[] = [{
        id: 1,
        text: {
            value: "Insert your text here",
            left: 0,
            top: 3,
            originX: "center",
            fontSize: 7,
            fill: "#FFFFFF",
        },
        frame: {
            url: "/frames/iphone.png",
            originX: "center",
            originY: "center",
            left: 50,
            top: 2,
            scaleX: 1,
            scaleY: 1,
            
        },

    },
    {
        id: 2,
        text: {
            value: "Insert your text here",
            left: 0,
            top: 3,
            originX: "center",
            fontSize: 7,
            fill: "#FFFFFF",
        },
        frame: {
            url: "/frames/iphone.png",
            originX: "center",
            originY: "center",
            left: 90,
            top: 70,
            scaleX: 1,
            scaleY: 1,
        },

    },
 {
        id: 3,
        text: {
            value: "Insert your text here",
            left: 0,
            top: 3,
            originX: "center",
            fontSize: 7,
            fill: "#FFFFFF",
        },
        frame: {
            url: "/frames/iphone.png",
            originX: "center",
            originY: "center",
            left: 90,
            top: 90,
            scaleX: 1,
            scaleY: 1,
            angle:45,
        },

    }]
    // Callback to store the canvas instance when initialized
    const handleCanvasReady = useCallback((id: string, canvas: Canvas) => {


    }, []);
    useEffect(() => {
        const setLayouts = () => {

            layouts.map((layout => {
                const newId = `canvas-${layout.id}`;
                setCanvasItems([{ id: newId }])
            }))
        }
        setLayouts()

        return () => {

        }
    }, [])


    return (
        <div>
            {layouts.map((item) => (
                <div
                    key={item.id}
                    onClick={() => add(item)}
                    className={`p-2 ${`canvas-${item.id}` === selectedCanvasId ? "border-2 border-blue-500" : ""}`}
                >
                    <CanvasComponent height={140} items={item} width={100} id={`canvas-${item.id}`} onCanvasReady={handleCanvasReady} />
                </div>
            ))}
        </div>
    )
}
