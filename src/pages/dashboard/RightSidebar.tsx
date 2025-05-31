import { Layout, ImageIcon } from "lucide-react";
import React, { useState } from "react";
import { TextEditor } from "./components/TextEditor";
import type { CanvasItem } from "../../types";
import type { Canvas } from "fabric";
interface RightSidebarProps {
//   addFrame: (imageUrl: string) => void;
//   addCanvas: () => void;
//   canvasItems: CanvasItem[];
  selectedCanvas: Canvas | undefined;
//   setSelectedCanvas: (id: string) => void;
}

export default function RightSidebar({ selectedCanvas }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<"design" | "assets">("design");
  return (
    <div className="h-screen  w-full bg-white ">
      {/* Tabs */}
      <div className="flex w-full">
        <button
          onClick={() => setActiveTab("design")}
          className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === "design"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
        >
          <Layout className="inline-block w-4 h-4 mr-1" />
          Design
        </button>
        <button
          onClick={() => setActiveTab("assets")}
          className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === "assets"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
        >
          <ImageIcon className="inline-block w-4 h-4 mr-1" />
          Assets
        </button>
      </div>
      {/* Tab Content */}
      <div className="overflow-y-auto h-full p-2 no-scrollbar">
        {activeTab === "design" && (
          <TextEditor selectedCanvas={selectedCanvas} />
        )}
      </div>
    </div>
  );
}
