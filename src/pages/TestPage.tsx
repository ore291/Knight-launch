import {
  Canvas,
  FabricImage,
  IText,
  FabricObject,
  FabricText,
  Group,
  Rect,
} from "fabric";
import { useRef, useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";

interface DeviceType {
  name: string;
  type: "iphone" | "android" | "tab";
  width: number;
  height: number;
  imageUrl: string;
}

interface CanvasItem {
  id: string;
  canvas?: Canvas;
}

// Reusable Canvas Component
const CanvasComponent: React.FC<{
  id: string;
  onCanvasReady: (id: string, canvas: Canvas) => void;
}> = ({ id, onCanvasReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new Canvas(canvasRef.current, {
        width: 322.5,
        height: 500,
        preserveObjectStacking: true,
      });
      fabricCanvas.backgroundColor = "#1a1a1b";
      fabricCanvas.renderAll();
      onCanvasReady(id, fabricCanvas);
      return () => {
        fabricCanvas.dispose();
      };
    }
  }, [id, onCanvasReady]);

  return <canvas ref={canvasRef} />;
};

const TestPage = () => {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([{ id: "canvas-1" }]);
  const [selectedCanvasId, setSelectedCanvasId] = useState<string>("canvas-1");
  const [devIndex, setDevIndex] = useState<number>(0);

  const devices: DeviceType[] = [
    { name: "iphone 11", type: "iphone", width: 322, height: 670, imageUrl: "/frames/iphone.png" },
    { name: "Google pixel", type: "android", width: 277, height: 585, imageUrl: "/frames/pixel.png" },
    { name: "Nexus9", type: "tab", width: 390, height: 520, imageUrl: "/frames/nexus9.png" },
    { name: "Samsung Galaxy", type: "android", width: 360, height: 760, imageUrl: "/frames/samsungS10.png" },
  ];

  const device = devices[devIndex];
  const phoneImageURL = device.imageUrl;
  const userImageURL = "/testscreenshot.png";

  // Callback to store the canvas instance when initialized
  const handleCanvasReady = useCallback((id: string, canvas: Canvas) => {
    setCanvasItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, canvas } : item))
    );
  }, []);

  // Add a new canvas
  const addNewCanvas = () => {
    const newId = `canvas-${Date.now()}`;
    setCanvasItems((prev) => [...prev, { id: newId }]);
    setSelectedCanvasId(newId);
  };
  const deleteCanvas = () => {
    const newCanvasItems = canvasItems.filter((canvas) => canvas.id !== selectedCanvasId)
    setCanvasItems(newCanvasItems)
    setSelectedCanvasId(newCanvasItems[0].id)

  }

  // Get the currently selected canvas
  const selectedCanvas = canvasItems.find((item) => item.id === selectedCanvasId)?.canvas;

  const addText = () => {
    if (!selectedCanvas) {
      alert("Please select a canvas first.");
      return;
    }
    const text = new IText("Insert your text here", {
      originX: "center",
      left: selectedCanvas.getWidth() / 2,
      top: 30,
      fontSize: 24,
      fill: "#FFFFFF",
    });
    selectedCanvas.add(text);
  };

  const addFrame = async () => {
    if (!selectedCanvas) {
      alert("Please select a canvas first.");
      return;
    }
    const phoneImg = await FabricImage.fromURL(phoneImageURL);
    const fitScale = Math.min(
      selectedCanvas.width! / phoneImg.width!,
      selectedCanvas.height! / phoneImg.height!
    );
    const scale = fitScale * 0.75;
    phoneImg.set({
      originX: "center",
      originY: "center",
      left: selectedCanvas.width! / 2,
      top: selectedCanvas.height! / 2,
      scaleX: scale,
      scaleY: scale,
      selectable: true,
      hasControls: true,
      hasBorders: true,
    });
    selectedCanvas.add(phoneImg);
    selectedCanvas.setActiveObject(phoneImg);
    selectedCanvas.requestRenderAll();
  };

  async function addNewImageToActiveFrame(
    imageURL: string,
    screenWidth: number = device.width,
    screenHeight: number = device.height,
    screenOffsetX: number = 0,
    screenOffsetY: number = 0
  ): Promise<void> {
    if (!selectedCanvas) {
      alert("Please select a canvas first.");
      return;
    }
    const frame = selectedCanvas.getActiveObject();
    if (!frame || !(frame instanceof FabricImage)) {
      alert("Please select a phone frame image first.");
      return;
    }

    const innerImg = await FabricImage.fromURL(imageURL, {
      crossOrigin: "anonymous",
    });
    const frameScaleX = frame.scaleX || 1;
    const frameScaleY = frame.scaleY || 1;
    const screenCenterX = frame.left! + screenOffsetX * frameScaleX;
    const screenCenterY = frame.top! + screenOffsetY * frameScaleY;
    let scale;
    switch (device.type) {
      case "tab":
        scale = Math.max(
          (screenWidth * frameScaleX) / innerImg.width!,
          (screenHeight * frameScaleY) / innerImg.height!
        );
        break;
      default:
        scale = Math.min(
          (screenWidth * frameScaleX) / innerImg.width!,
          (screenHeight * frameScaleY) / innerImg.height!
        );
        break;
    }
    const clipRect = new Rect({
      width: screenWidth * frameScaleX,
      height: screenHeight * frameScaleY,
      originX: "center",
      originY: "center",
      absolutePositioned: true,
      left: screenCenterX,
      top: screenCenterY,
    });
    innerImg.set({
      originX: "center",
      originY: "center",
      scaleX: scale * 1.025,
      scaleY: scale * 1.01,
      left: screenCenterX,
      top: screenCenterY,
      selectable: false,
      clipPath: device.type === "tab" ? clipRect : undefined,
    });

    selectedCanvas.on("object:scaling", (e) => {
      if (device.type === "tab") {
        const scale = Math.min(
          (screenWidth * frameScaleX) / innerImg.width!,
          (screenHeight * frameScaleY) / innerImg.height!
        );
        innerImg.set({ clipPath: null });
        innerImg.scale(scale);
      }
    });
    selectedCanvas.on("object:modified", (e) => {
      if (device.type === "tab") {
        const scale = Math.max(
          (screenWidth * frameScaleX) / innerImg.width!,
          (screenHeight * frameScaleY) / innerImg.height!
        );
        const clipRect = new Rect({
          width: innerImg.width! * frameScaleX,
          height: frame.height! * frameScaleY + 1,
          originX: "center",
          originY: "center",
          absolutePositioned: true,
          left: screenCenterX,
          top: screenCenterY,
        });
        innerImg.set({ clipPath: clipRect });
        innerImg.scale(scale);
      }
    });

    const clonedFrame = await frame.clone();
    selectedCanvas.remove(frame);
    const group = new Group([innerImg, clonedFrame], {
      originX: "center",
      originY: "center",
      left: frame.left,
      top: frame.top,
      selectable: true,
    });
    selectedCanvas.add(group);
    selectedCanvas.setActiveObject(group);
    selectedCanvas.requestRenderAll();
  }

  return (
    <div className="flex gap-4  w-full h-screen  no-scrollbar items-center">
      <Sidebar selectedCanvas={selectedCanvas}/>
      <main>
        <div className="flex flex-row mt-6 space-x-3 items-center mb-4">
        <button
          onClick={addNewCanvas}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Add Canvas
        </button>
        <button
          onClick={deleteCanvas}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Delete Active Canvas
        </button>
        <button
          onClick={addText}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Add Text
        </button>
        <select
          onChange={(e) => setDevIndex(Number(e.target.value))}
          className="px-2 py-2 border rounded"
        >
          {devices.map((device, index: number) => (
            <option key={index} value={index}>{device.name}</option>
          ))}
        </select>
        <button
          onClick={addFrame}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Add Frame
        </button>
        <button
          onClick={() => addNewImageToActiveFrame(userImageURL)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Add Inner Image
        </button>
      </div>
      <div className="flex flex-row space-x-4 overflow-x-auto no-scrollbar px-auto">
        {canvasItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedCanvasId(item.id)}
            className={`p-2 ${item.id === selectedCanvasId ? "border-2 border-blue-500" : ""}`}
          >
            <CanvasComponent id={item.id} onCanvasReady={handleCanvasReady} />
          </div>
        ))}
      </div>
      </main>
    </div>
  );
};

export default TestPage;