import type { Canvas, TFiller } from "fabric";

export interface DeviceFrame {
  id: string;
  name: string;
  type: 'phone' | 'tablet';
  imageUrl: string;
  width: number;
  height: number;
  screenX?: number;
  screenY?: number;
  screenWidth?: number;
  screenHeight?: number;
}

export interface Screenshot {
  id: number;
  name: string;
  imageUrl: string;
}

export interface TextOverlay {
  id?: number;
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
}

export interface GradientBackground {
  color1: string;
  color2: string;
}

export interface Background {
  type: 'color' | 'gradient' | 'image';
  value: string | TFiller;
}

export interface DragEvent extends React.DragEvent<HTMLDivElement> {
  dataTransfer: DataTransfer;
}

export interface DeviceType {
  name: string;
  type: "iphone" | "android" | "tab";
  width: number;
  height: number;
  imageUrl: string;
}

export interface CanvasItem {
  id: string;
  canvas?: Canvas;
}

export  interface layoutType {
        id: number;
        text: {
            value: string;
            left?: number;
            top?: number;
            originX?: string;
            fontSize?: number;
            fill?: string;
        };
        frame: {
            url: string;
            originX?: string;
            originY?: string;
            left: number;
            top: number;
            scaleX?: number;
            scaleY?: number;
            angle?:number
        };
    }