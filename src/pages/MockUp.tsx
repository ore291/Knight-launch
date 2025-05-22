import React, { useEffect, useRef, useState } from "react";
import { Canvas, FabricImage, Rect } from "fabric";

const iPhoneCutout = "/frames/iPhone16Pro.png";
const screenshot = "/testscreenshot.png";

/**
 * Detects the bounding box of the non-transparent (visible) area in a PNG.
 * @param {string} imageUrl - The URL or path to the image.
 * @returns {Promise<{ x: number, y: number, width: number, height: number }>} Screen bounds
 */
async function getScreenBoundsFromPNG(imageUrl: string) {
  return new Promise<{ x: number, y: number, width: number, height: number }>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Important for CORS-safe loading
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height).data;

        let minX = img.width, minY = img.height;
        let maxX = 0, maxY = 0;
        let found = false;

        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            const index = (y * img.width + x) * 4;
            const alpha = imageData[index +3];

            // if (alpha < 220) continue; // Consider only nearly-opaque pixels
ctx.fillStyle = "red";
if (alpha > 250) {
  ctx.fillRect(x, y, 1, 1);
}
            if (alpha > 250) {
              minX = Math.min(minX, x);
              maxX = Math.max(maxX, x);
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
              found = true;
            }
          }
        }

        if (!found) {
          return reject(new Error("No non-transparent pixels found"));
        }

        resolve({
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
        });
      }
    };

    img.onerror = () => reject(new Error("Failed to load image."));
  });
}



export const PhoneMockup = () => {
  const canvasRef = useRef<any>(null);
  const [screenBounds, setScreenBounds] = useState<{ x: number, y: number, width: number, height: number }>()
  useEffect(() => {


 


    const canvas = new Canvas(canvasRef.current, {
      width: 450,
      height: 920,
      preserveObjectStacking: true,
    });


    const loadMockUp = async () => {
      const screenshotImg = await FabricImage.fromURL(screenshot, {
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
      canvas.add(screenshotImg);

      const cutoutImg = await FabricImage.fromURL(iPhoneCutout, {
        crossOrigin: 'anonymous'
      })
      cutoutImg.set({
        left: 0,
        top: 0,
        selectable: true,
      });
      canvas.add(cutoutImg);
      canvas.sendObjectToBack(screenshotImg);
    }
    loadMockUp()

    canvas.renderAll();

    return () => {
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

;
