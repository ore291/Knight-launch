import {
  Canvas,
  FabricImage,
  FabricObject,
  FabricText,
  Group,
  Rect,
} from "fabric";
import { useRef, useEffect, useState } from "react";

const TestPage = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState<Canvas>();

  // Phone frame image
  const phoneImageURL =
    "https://tool.launchmatic.app/api/resources/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdWFhIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--be634298ca50ed89fbc102efaf72d17cc366d55e/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9TY21WemFYcGxYM1J2WDJacGRGc0haZ3N5T1RRdU56Vm1DRFl5TWc9PSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--8ce0e7290e5a797639748286343a3d5f51bcca49/GooglePixel4_real_white.png";
  // Image to insert into the phone screen
  const userImageURL = "/testscreenshot.png";

  const addText = () => {
    if (canvas) {
      // Create a text object
      const text = new FabricText("Insert your text here", {
        originX: "center",
        left: canvas.getWidth() / 2,
        top: 30,
        fontSize: 24,
        fill: "white",
      });

      // Add text to canvas
      canvas.add(text);
    }
  };

  const addFrame = async () => {
    if (canvas) {
      const phoneImg = await FabricImage.fromURL(phoneImageURL);
      phoneImg.set({
        originX: "center",
        originY: "center",
        left: canvas.width / 2,
        top: canvas.height / 2,
        selectable: true,
        hasControls: true,
        hasBorders: true,
      });

      canvas.add(phoneImg);

      canvas.setActiveObject(phoneImg);
    }
  };

  /**
   * Adds an image to the currently selected frame
   * @param imageURL URL of the image to add
   * @param screenWidth Width of the screen area
   * @param screenHeight Height of the screen area
   * @param offsetX X offset for positioning the image
   * @param offsetY Y offset for positioning the image
   * @param canvas The Fabric.js canvas instance
   * @returns Promise that resolves when operation is complete
   */
  async function addImageToActiveFrame(
    imageURL: string,
    screenWidth: number = 294.75,
    screenHeight: number = 622.0,
    offsetX: number = 0,
    offsetY: number = 0
  ): Promise<void> {
    if (!canvas) return;
  
    const activeObject = canvas.getActiveObject();
    if (!activeObject || !(activeObject instanceof FabricImage)) {
      alert("Please select a phone frame image first.");
      return;
    }
  
    const innerImg = await FabricImage.fromURL(imageURL, {
      crossOrigin: "anonymous",
    });
  
    // Get frame's scaled dimensions
    const frameWidth = activeObject.width! * (activeObject.scaleX || 1);
    const frameHeight = activeObject.height! * (activeObject.scaleY || 1);
  
    // Calculate scaling to fill the screen area
    const scale = Math.max(screenWidth / innerImg.width!, screenHeight / innerImg.height!);
  
    // Calculate screen center relative to the frame
    const screenCenterX = activeObject.left! + (offsetX * frameWidth) / activeObject.width!;
    const screenCenterY = activeObject.top! + (offsetY * frameHeight) / activeObject.height!;
  
    // Set up the inner image
    innerImg.set({
      originX: "center",
      originY: "center",
      scaleX: scale,
      scaleY: scale,
      left: screenCenterX,
      top: screenCenterY,
      clipPath: new Rect({
        originX: "center",
        originY: "center",
        width: screenWidth,
        height: screenHeight,
        left: screenCenterX,
        top: screenCenterY,
      }),
      selectable: false, // Prevent user interaction with inner image
    });
  
    // Add inner image directly to canvas (behind frame)
    canvas.add(innerImg);
    canvas.sendObjectToBack(innerImg); // Ensure frame stays on top
    canvas.requestRenderAll();
  }



  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 350,
        height: 620,
        preserveObjectStacking: true,
      });

      initCanvas.backgroundColor = "#101010";
      initCanvas.renderAll();

      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  return (
    <div className="flex flex-col  w-full h-screen justify-center items-center">
      <div className="flex flex-row space-x-3 items-center">
        <button onClick={() => addText()}>add text</button>
        <button onClick={() => addFrame()}>add frame</button>
        <button
          onClick={() => addImageToActiveFrame(userImageURL)}
        >
          add innerImg
        </button>
      </div>
      <canvas id="canvas" ref={canvasRef} />
    </div>
  );
};

export default TestPage;
