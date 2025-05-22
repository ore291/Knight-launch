import { Canvas, FabricImage, FabricText, IText } from "fabric";
import { useRef, useEffect, useState } from "react";
import type { layoutType } from "../types";

// Reusable Canvas Component
export const CanvasComponent: React.FC<{
    id: string;
    onCanvasReady: (id: string, canvas: Canvas) => void;
    width?: number,
    height?: number,
    bgColor?: string,
    items?: layoutType,
    // selectedCanvas?: Canvas | undefined;
}> = ({ id, onCanvasReady, width, height, bgColor, items, }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        if (canvasRef.current) {
            const fabricCanvas = new Canvas(canvasRef.current, {
                width: width || 322.5,
                height: height || 600,
                preserveObjectStacking: true,
            });
            fabricCanvas.backgroundColor = bgColor || "#1a1a1b";

            if (items?.text) {

                const text = new FabricText(items?.text.value, {
                    originX: "center",
                    left: fabricCanvas.getWidth() / 2,
                    top: items.text.top,
                    fontSize: items.text.fontSize,
                    fill: items.text.fill,
                });

                fabricCanvas.add(text);

            }
            if (items?.frame) {

                async function loadImg() {
                    const phoneImg = await FabricImage.fromURL(String(items?.frame.url));
                    const fitScale = Math.min(
                        fabricCanvas.width! / phoneImg?.width!,
                        fabricCanvas.height! / phoneImg.height!
                    );
                    const scale = fitScale * 0.75;
                    phoneImg.set({
                        originX: "center",
                        originY: "center",
                        left: Number(items?.frame.left),
                        top: Number(items?.frame.top) || 2,
                        scaleX: scale,
                        angle: Number(items?.frame.angle)||0,
                        scaleY: scale,
                        selectable: true,
                        hasControls: false,
                        hasBorders: false,
                        lockMovementX: true,      // Disables horizontal movement
                        lockMovementY: true,

                    });
                    fabricCanvas.add(phoneImg);
                    // fabricCanvas.setActiveObject(phoneImg);
                    fabricCanvas.requestRenderAll();
                }


                loadImg()

            }
            fabricCanvas.renderAll();
            onCanvasReady(id, fabricCanvas);
            return () => {
                fabricCanvas.dispose();
            };
        }
    }, [id, onCanvasReady]);

    return <canvas ref={canvasRef} />;
};