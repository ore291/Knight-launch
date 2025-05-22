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
import { saveAs } from "file-saver";
import { CanvasComponent } from "../components/CanvasComponent";
import type { CanvasItem, DeviceType } from "../types";





const TestPage = () => {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([{ id: "canvas-1" }]);
  const [selectedCanvasId, setSelectedCanvasId] = useState<string>("canvas-1");
  const [devIndex, setDevIndex] = useState<number>(0);

  const devices: DeviceType[] = [
    { name: "iphone 11", type: "iphone", width: 322, height: 670, imageUrl: "/frames/iphone.png" },
    { name: "Google pixel", type: "android", width: 277, height: 585, imageUrl: "/frames/pixel.png" },
    { name: "Nexus9", type: "tab", width: 390, height: 520, imageUrl: "/frames/nexus9.png" },
    { name: "Samsung Galaxy", type: "android", width: 360, height: 760, imageUrl: "/frames/samsungS10.png" },
    { name: "iphone 8", type: "iphone", width: 168, height: 340, imageUrl: "/frames/iPhone8.png" },
    { name: "iphone 16 pro", type: "iphone", width: 400, height: 870, imageUrl: "/frames/iPhone16Pro.png" },
    { name: "Samsung Galaxy A8", type: "android", width: 188, height: 377, imageUrl: "/frames/SamsungGalaxyA8.png" },
  ];

  const device = devices[devIndex];
  const phoneImageURL = device.imageUrl;
  const userImageURL = "/testscreenshot.png";
  // Get the currently selected canvas
  const selectedCanvas = canvasItems.find((item) => item.id === selectedCanvasId)?.canvas;

  // Callback to store the canvas instance when initialized
  const handleCanvasReady = useCallback((id: string, canvas: Canvas) => {
    setCanvasItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, canvas } : item))
    );
  }, []);

  const exportCanvas = () => {
    if (!selectedCanvas) {
      alert("No canvas selected!");
      return;
    }

    // Optional: Set export scale for higher resolution (e.g., 2x for retina)
    const scale = 3;

    // Generate data URL
    const dataURL = selectedCanvas.toDataURL({
      format: 'png',        // Use 'jpeg' for smaller file size
      quality: 1,           // Only applies to 'jpeg'
      multiplier: scale,    // Scales the output image
    });

    // Create download link
    const link = document.createElement('a');
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
    const scale = 3;
    let urls: { download: string; filename: string; }[] = []
    canvasItems.forEach((item, index) => {
      // Generate data URL
      const dataURL = item?.canvas?.toDataURL({
        format: 'png',        // Use 'jpeg' for smaller file size
        quality: 1,           // Only applies to 'jpeg'
        multiplier: scale,    // Scales the output image
      });
      urls.push({ download: String(dataURL), filename: `project-name-${index}.png` })

    })



    // Create download links
    urls.forEach(function (e) {
      fetch(encodeURI(e.download))
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {
          saveAs(blob, e.filename);
        });
    });
  };

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
      hasControls: true,
      hasBorders: true,

    });


    selectedCanvas.add(phoneImg);
    selectedCanvas.setActiveObject(phoneImg);
    selectedCanvas.requestRenderAll();
  };

  const loadMockUp = async () => {
    
    if (!selectedCanvas) {
      alert("Please select a canvas first.");
      return;
    }
       const screenshotImg = await FabricImage.fromURL(userImageURL, {
         crossOrigin: 'anonymous'
       })
       screenshotImg.scaleToHeight(805)
       screenshotImg.scaleToWidth(380)
       screenshotImg.set({
         left: 35,
         top: 85,
         selectable: false,
       });
       // Create rounded screen mask
       const screenMask = new Rect({
         left: 35,
         top: 85,
         rx: 55,
         ry: 55,
         width: 380,
         height: 805,
         absolutePositioned: true,
       });
       // Apply clipping mask
       screenshotImg.clipPath = screenMask;
 
       // Add clipped screenshot to canvas
       selectedCanvas.add(screenshotImg);
 
       const cutoutImg = await FabricImage.fromURL(phoneImageURL, {
         crossOrigin: 'anonymous'
       })
       cutoutImg.set({
         left: 0,
         top: 0,
         selectable: true,
       });
       selectedCanvas.add(cutoutImg);
       selectedCanvas.sendObjectToBack(screenshotImg);
     }




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

    innerImg.set({
      originX: "center",
      originY: "center",
      scaleX: scale * 1.025,
      scaleY: scale * 1.015,
      left: frame.left,
      top: frame.top,
      angle: frame.angle,
      selectable: false,
      // clipPath: clipRect
      // clipPath: device.type === "tab" ? clipRect : undefined,
    });
    const clipRect = new Rect({
      originX: "left",
      originY: "center",
      // width: frame.width*4,
      // height: frame.height,
      absolutePositioned: true,
      rx: 20,
      ry: 20,
      left: frame.left,
      top: frame.top,

    });

    selectedCanvas.sendObjectToBack(innerImg)

    innerImg.clipPath = clipRect

    selectedCanvas.on("object:scaling", () => {
      if (device.type === "tab") {
        const newScaleX = group.scaleX!;
        const newScaleY = group.scaleY!;
        clipRect.set({
          width: screenWidth * newScaleX,
          height: screenHeight * newScaleY,
          left: group.left! + (screenWidth * newScaleX) / 2,
          top: group.top! + (screenHeight * newScaleY) / 2,
        });
        innerImg.set({ clipPath: clipRect });
        selectedCanvas.renderAll();
      }
    });
    selectedCanvas.on("object:modified", () => {
      console.log(frame);
      console.log(innerImg);
      if (device.type === "tab") {
        // const scale = Math.max(
        //   (screenWidth * frameScaleX) / innerImg.width!,
        //   (screenHeight * frameScaleY) / innerImg.height!
        // );
        // const clipRect = new Rect({
        //   width: innerImg.width! * frameScaleX,
        //   height: frame.height! * frameScaleY + 1,
        //   originX: "center",
        //   originY: "center",
        //   absolutePositioned: true,
        //   left: screenCenterX,
        //   top: screenCenterY,
        // });
        // innerImg.set({ clipPath: clipRect });
        // innerImg.scale(scale);
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
      lockMovementX: true,      // Disables horizontal movement
      lockMovementY: true,
    });
    selectedCanvas.add(group);
    selectedCanvas.setActiveObject(group);
    selectedCanvas.requestRenderAll();
  }

  return (
    <div className="flex gap-4  w-full h-screen  no-scrollbar items-center">
      <Sidebar selectedCanvas={selectedCanvas} />
      <main>
        <div className="flex flex-row mt-26 space-x-3 items-center mb-4">
          <button
            onClick={addNewCanvas}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Add Canvas
          </button>
          <button
            onClick={deleteCanvas}
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
            onChange={(e) => setDevIndex(Number(e.target.value))}
            className="px-2 py-2 text-sm border rounded"
          >
            {devices.map((device, index: number) => (
              <option key={index} value={index}>{device.name}</option>
            ))}
          </select>
          <button
            onClick={addFrame}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Add Frame
          </button>
          <button
            onClick={() =>
              loadMockUp()
              // addNewImageToActiveFrame(userImageURL)
            }
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
        </div>
        <div className="flex flex-row space-x-4 overflow-x-auto no-scrollbar px-auto">
          {canvasItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedCanvasId(item.id)}
              className={`p-2 ${item.id === selectedCanvasId ? "border-2 border-blue-500" : ""}`}
            >
              <CanvasComponent height={90} width={450} id={item.id} onCanvasReady={handleCanvasReady} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TestPage;