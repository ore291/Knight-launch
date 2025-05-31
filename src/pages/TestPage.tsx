import { Canvas, FabricImage, IText, Group, Rect } from "fabric";
import { useState, useCallback, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { saveAs } from "file-saver";
import { CanvasComponent } from "../components/CanvasComponent";
import type { CanvasItem, DeviceType } from "../types";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { useAppContext } from "../context/AppContext";
import { Smartphone } from "lucide-react";
const TestPage = () => {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([
    { id: "canvas-1" },
  ]);
  const [sortedCanvasItems, setSortedCanvasItems] = useState<CanvasItem[]>([
    { id: "canvas-1" },
  ]);
  const [selectedCanvasId, setSelectedCanvasId] = useState<string>("canvas-1");
  const [devIndex, setDevIndex] = useState<number>(0);

  var canvasWidth = 322.5;

  var canvasHeight = 500;

  const devices: DeviceType[] = [
    // {
    //   name: "iphone 11",
    //   type: "iphone",
    //   width: 322,
    //   height: 670,
    //   imageUrl: "/frames/iphone.png",
    //   rx: 55,
    //   ry: 55,
    // },
    // {
    //   name: "Google pixel",
    //   type: "android",
    //   width: 277,
    //   height: 585,
    //   imageUrl: "/frames/pixel.png",
    //   rx: 55,
    //   ry: 55,
    // },
    // {
    //   name: "Nexus9",
    //   type: "tab",
    //   width: 390,
    //   height: 520,
    //   imageUrl: "/frames/nexus9.png",
    // },
    // {
    //   name: "Samsung Galaxy",
    //   type: "android",
    //   width: 360,
    //   height: 760,
    //   imageUrl: "/frames/samsungS10.png",
    // },
    // {
    //   name: "iphone 8",
    //   type: "iphone",
    //   width: 168,
    //   height: 340,
    //   imageUrl: "/frames/iPhone8.png",
    // },
    // {
    //   name: "iphone 16 pro",
    //   type: "iphone",
    //   width: 395,
    //   height: 874,
    //   rx: 95,
    //   ry: 95,
    //   imageUrl: "/frames/iPhone16Pro.png",
    // },
    // {
    //   name: "Samsung Galaxy S21",
    //   type: "android",
    //   width: 1080,
    //   height: 2390,
    //   rx: 55,
    //   ry: 55,
    //   imageUrl: "/frames/samsung-galaxy-black.png",
    // },
    // {
    //   name: "Tecno Pova neo",
    //   type: "android",
    //   width: 249,
    //   height: 559,
    //   rx: 55,
    //   ry: 55,
    //   imageUrl: "/frames/android2.png",
    // },
    // {
    //   name: "Ipad Air 4",
    //   type: "tab",
    //   width: 505,
    //   height: 352,
    //   rx: 0,
    //   ry: 0,
    //   imageUrl: "/frames/IpadAir4.png",
    // },
    {
      name: "Iphone 16 black",
      type: "iphone",
      width: 1315,
      height: 2870,
      category: "Phone",
      icon: Smartphone,
      rx: 95,
      ry: 95,
      
      imageUrl: "/frames/iphone-16-black.png",
    },
  ];

  const device = devices[devIndex];
  const phoneImageURL = device.imageUrl;
  const userImageURL = "/testscreenshot.png";
  // Get the currently selected canvas
  const selectedCanvas = canvasItems.find(
    (item) => item.id === selectedCanvasId
  )?.canvas;

  // saves current device to global context
  const { updateDevice } = useAppContext();
  useEffect(() => {
    updateDevice(device);
    return () => {};
  }, [devIndex]);

  // Callback to store the canvas instance when initialized
  const handleCanvasReady = useCallback((id: string, canvas: Canvas) => {
    setCanvasItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, canvas } : item))
    );
    setSortedCanvasItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, canvas } : item))
    );
  }, []);

  const exportCanvas = () => {
    if (!selectedCanvas) {
      alert("No canvas selected!");
      return;
    }

    // Optional: Set export scale for higher resolution (e.g., 2x for retina)
    const scale = 6;

    // Generate data URL
    const dataURL = selectedCanvas.toDataURL({
      format: "png", // Use 'jpeg' for smaller file size
      quality: 1, // Only applies to 'jpeg'
      multiplier: scale, // Scales the output image
    });

    // Create download link
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `app-screenshot-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportAllCanvas = () => {
    if (!selectedCanvas) {
      alert("No canvas selected!");
      return;
    }

    // Optional: Set export scale for higher resolution (e.g., 2x for retina)
    const scale = 6;
    let urls: { download: string; filename: string }[] = [];
    sortedCanvasItems.forEach((item, index) => {
      // Generate data URL
      const dataURL = item?.canvas?.toDataURL({
        format: "png", // Use 'jpeg' for smaller file size
        quality: 1, // Only applies to 'jpeg'
        multiplier: scale, // Scales the output image
      });
      urls.push({
        download: String(dataURL),
        filename: `project-name-${index}.png`,
      });
    });

    // Create download links
    urls.forEach(function (e) {
      fetch(encodeURI(e.download))
        .then((res) => res.blob()) // Gets the response and returns it as a blob
        .then((blob) => {
          saveAs(blob, e.filename);
        });
    });
  };

  // Add a new canvas
  const addNewCanvas = () => {
    const newId = `canvas-${canvasItems.length + 1}`;
    setCanvasItems((prev) => [...prev, { id: newId }]);
    setSortedCanvasItems((prev) => [...prev, { id: newId }]);
    setSelectedCanvasId(newId);
  };
  const deleteCanvas = (id: string) => {
    const newCanvasItems = canvasItems.filter((canvas) => canvas.id !== id);
    const newSortedCanvasItems = sortedCanvasItems.filter(
      (canvas) => canvas.id !== id
    );
    setCanvasItems(newCanvasItems);
    setSortedCanvasItems(newSortedCanvasItems);
    setSelectedCanvasId(newCanvasItems[0].id);
  };

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
    // Get screen dimensions from the frame image

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
      hasControls: false,
      lockScalingX: true,
      lockScalingY: true,
      lockMovementX: true, // Disables horizontal movement
      lockMovementY: true,
      hasBorders: true,
    });

    selectedCanvas.add(phoneImg);
    selectedCanvas.setActiveObject(phoneImg);
    selectedCanvas.requestRenderAll();
  };

  async function addNewImageToActiveFrame(
    imageURL: string,
    screenWidth: number = device.width,
    screenHeight: number = device.height
    // screenOffsetX: number = 0,
    // screenOffsetY: number = 0
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

    // const screenCenterX = frame.left! + screenOffsetX * frameScaleX;
    // const screenCenterY = frame.top! + screenOffsetY * frameScaleY;
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

    innerImg.set({
      originX: "center",
      originY: "center",
      scaleX: scale * 1.025,
      scaleY: scale * 1.015,
      left: frame.left,
      top: frame.top,
      angle: frame.angle,
      selectable: false,
      absolutePositioned: true,
      // clipPath: clipRect
      // clipPath: device.type === "tab" ? clipRect : undefined,
    });
    const clipRect = new Rect({
      originX: "center",
      originY: "center",
      width: innerImg.width,
      height: innerImg.height,
      scaleX: innerImg.scaleX,
      scaleY: innerImg.scaleY,
      angle: frame.angle,
      absolutePositioned: true,
      rx: device.rx || 0,
      ry: device.ry || 0,
      left: frame.left,
      top: frame.top,
    });

    innerImg.clipPath = clipRect;

    const clonedFrame = await frame.clone();
    selectedCanvas.remove(frame);
    const group = new Group([innerImg, clonedFrame], {
      originX: "center",
      originY: "center",
      left: frame.left,
      top: frame.top,
      selectable: true,
      angle: frame.angle,
      hasControls: false,
      lockScalingX: true,
      lockScalingY: true,
      lockMovementX: true, // Disables horizontal movement
      lockMovementY: true,
      lockRotation: true,
    });
    selectedCanvas.add(group);
    selectedCanvas.sendObjectToBack(innerImg);

    selectedCanvas.setActiveObject(group);
    selectedCanvas.requestRenderAll();
  }

  return (
    <div className="flex gap-4  w-full h-screen  no-scrollbar items-center">
      <Sidebar selectedCanvas={selectedCanvas} />
      <main className="max-h-screen relative overflow-auto no-scrollbar">
        <header className="flex  top-0 w-full flex-row mb-1 space-x-3 items-center ">
          <button
            onClick={addNewCanvas}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Add Canvas
          </button>
          <button
            onClick={()=>deleteCanvas(selectedCanvasId)}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Delete Active Canvas
          </button>
          <button
            onClick={addText}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Add Text
          </button>
          <select
            onChange={(e) => {
              setDevIndex(Number(e.target.value));
              updateDevice(devices[devIndex]);
            }}
            className="px-2 py-2 text-sm border rounded"
          >
            {devices.map((device, index: number) => (
              <option key={index} value={index}>
                {device.name}
              </option>
            ))}
          </select>
          <button
            onClick={addFrame}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Add Frame
          </button>
          <button
            onClick={() => addNewImageToActiveFrame(userImageURL)}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Add Inner Image
          </button>
          <div className="flex flex-col gap-1">
            <button
              onClick={exportCanvas}
              className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              Export Canvas
            </button>
            <button
              onClick={exportAllCanvas}
              className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              Export All
            </button>
          </div>
        </header>
        <DragDropProvider
          onDragEnd={(event) => {
            setSortedCanvasItems((items) => move(items, event));
          }}
        >
          <div className="!flex overflow-auto no-scrollbar flex-row max-w-screen">
            {canvasItems.map((item, index) => (
              <CanvasComponent
                key={index}
                width={canvasWidth}
                height={canvasHeight}
                deleteCanvas={deleteCanvas}
                onClick={() => setSelectedCanvasId(item.id)}
                isActive={item.id === selectedCanvasId}
                className={`p-2  `}
                id={item.id}
                index={index}
                onCanvasReady={handleCanvasReady}
              />
            ))}
          </div>
        </DragDropProvider>
      </main>
    </div>
  );
};

export default TestPage;
