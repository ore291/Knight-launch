import { useEffect, useState } from "react";
import { Canvas, FabricText, type TFiller } from "fabric";
import ScreenshotManager from "../editor/ScreenshotManager";

interface BackgroundEditorProps {
  selectedCanvas: Canvas | undefined;
}
export const BackgroundEditor: React.FC<BackgroundEditorProps> = ({ selectedCanvas }) => {
  const [backgroundColor, setBackgroundColor] = useState<string | TFiller>('#1a1a1a')
  useEffect(() => {
    if (!selectedCanvas) return;
    setBackgroundColor(selectedCanvas.backgroundColor)
    const handleSelection = (e: any) => {
      if (selectedCanvas) {
        setBackgroundColor(selectedCanvas.backgroundColor)
      } else {
        // setSelectedText(null);
      }
    };

    selectedCanvas.on("selection:created", handleSelection);
    selectedCanvas.on("selection:updated", handleSelection);
    // selectedCanvas.on("selection:cleared", () => setSelectedText(null));

    return () => {
      selectedCanvas.off("selection:created", handleSelection);
      selectedCanvas.off("selection:updated", handleSelection);
      //   selectedCanvas.off("selection:cleared");
    };
  }, [selectedCanvas]);

  if (!selectedCanvas) {
    return <div className="p-4">Select a canvas to edit text.</div>;
  }
  const updateCanvasProperty = (property: string, value: any) => {
    if (selectedCanvas) {
      selectedCanvas.set(property as keyof FabricText, value);
      selectedCanvas.renderAll();
    }
  };
  return (
    <div className="mt-6">
      <div className="mb-2">
        <label className="block text-sm font-medium mb-2">Background Color</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={String(backgroundColor) || String(selectedCanvas.backgroundColor)}
            onChange={(e) => {
              updateCanvasProperty("backgroundColor", e.target.value);
              setBackgroundColor(e.target.value);
            }}
            className="w-10 h-10 border rounded"
          />
          <span>
            {String(backgroundColor)}
          </span>
        </div>

      </div>
      
    </div>
  )
}
