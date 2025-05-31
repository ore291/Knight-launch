import { Smartphone, Tablet, ChevronDown } from "lucide-react";
import {  useEffect, useState } from "react";
import type { DeviceType } from "../../../types";
import { useAppContext } from "../../../context/AppContext";

interface DeviceSelectorProps {
  onDeviceSelect?: (device: string) => void;
  selectedDevice?: string | null;
}

export const DeviceSelector = ({
  onDeviceSelect,
}: //   selectedDevice,
DeviceSelectorProps) => {
  const devices: DeviceType[] = [
    {
      id: "pixel-6",
      name: "Google Pixel 6",
      type: "android",
      category: "Phone",
      icon: Smartphone,
      width: 322,
      height: 670,
      popular: false,
      imageUrl: "/frames/pixel.png",
      rx: 55,
      ry: 55,
      dimensions: "1179 x 2556",
    },
    {
      id: "samsung-galaxy-s10",
      name: "Samsung Galaxy S10",
      type: "android",
      category: "Phone",
      icon: Smartphone,
      width: 360,
      height: 760,
      popular: false,
      rx: 55,
      ry: 55,
      dimensions: "1440 x 3040",
      imageUrl: "/frames/samsungS10.png",
    },
    {
      id: "iphone-11",
      name: "iphone 11",
      type: "iphone",
      category: "Phone",
      icon: Smartphone,
      width: 322,
      height: 670,
      popular: false,
      imageUrl: "/frames/iphone.png",
      rx: 55,
      ry: 55,
      dimensions: "828 x 1792",
    },
    {
      id: "samsung-galaxy-s21",
      name: "Samsung Galaxy S21",
      type: "android",
      category: "Phone",
      icon: Smartphone,
      width: 1080,
      height: 2390,
      rx: 55,
      ry: 55,
      popular: false,
      imageUrl: "/frames/samsung-galaxy-black.png",
      dimensions: "1080 x 2400",
    },
    // {
    //   id: "iphone-14",
    //   name: "iPhone 14 Pro",
    //   type: "iphone",
    //   category: "Phone",
    //   icon: Smartphone,
    //   popular: true,
    //   dimensions: "1179 x 2556",
    // },
    {
      id: "iphone-16",
      name: "Iphone 16 black",
      type: "iphone",
      category: "Phone",
      width: 1315,
      height: 2870,
      rx: 95,
      ry: 95,
      icon: Smartphone,
      popular: false,
      dimensions: "2556 x 1179",
      imageUrl: "/frames/iphone-16-black.png",
    },
    {
      name: "Ipad Air 4",
      type: "tab",
      category: "Tablet",
      icon: Tablet,
      width: 505,
      height: 352,
      rx: 0,
      ry: 0,
      imageUrl: "/frames/IpadAir4.png",
    },
    // {
    //   id: "samsung-s23",
    //   name: "Samsung Galaxy S23",
    //   category: "Phone",
    //   icon: Smartphone,
    //   popular: false,
    //   dimensions: "1080 x 2340",
    // },

    {
      name: "Tecno Pova neo",
      type: "android",
      category: "Phone",
      icon: Smartphone,
      width: 249,
      height: 559,
      rx: 55,
      ry: 55,
      popular: true,
      imageUrl: "/frames/android2.png",
      dimensions: "720 x 1640",
    },
  ];
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>(devices[0]);
  // saves current device to global context
  const { updateDevice } = useAppContext();

  const toggleCategory = (category: string) => {
    setOpenCategory((prev) => (prev === category ? null : category));
  };
  const categories = Array.from(new Set(devices.map((d) => d.category)));
  useEffect(() => {
    updateDevice(selectedDevice);
    return () => {};
  }, []);
  return (
    <div className="p-1 no-scrollbar">
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category} className=" border border-gray-200 rounded">
            <button
              className="w-full flex justify-between items-center px-4 py-3 text-sm font-medium"
              onClick={() => toggleCategory(category)}
            >
              <span>{category}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openCategory === category ? "rotate-180" : ""
                }`}
              />
            </button>

            {openCategory === category && (
              <div className="p-2 space-y-2">
                {devices
                  .filter((d) => d.category === category)
                  .map((device) => {
                    const Icon = device.icon;
                    return (
                      <button
                        key={device.id}
                        onClick={() => {
                          onDeviceSelect?.(device.imageUrl);
                          setSelectedDevice(device);
                          updateDevice(device);
                        }}
                        className={`flex items-start gap-3 w-full p-2 rounded border transition-all text-left ${
                          selectedDevice?.id === device.id
                            ? "bg-blue-50 border-blue-400"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <Icon className="w-5 h-5 mt-1" />
                        <div>
                          <div className="flex items-center gap-">
                            <span className="font-medium capitalize text-sm  text-ellipsis">
                              {device.name}
                            </span>
                            {device.popular && (
                              <span className="bg-blue-100 text-blue-700 text-[10px] ml-1  py-0.5 rounded">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {device.dimensions}
                          </p>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        ))}

        <p className="text-sm text-gray-500 text-center pt-4">
          More device frames coming soon!
        </p>
      </div>
    </div>
  );
};
