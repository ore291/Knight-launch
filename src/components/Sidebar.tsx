
import { useState } from "react";
import { Canvas } from "fabric";
import { TextEditor } from "./Sidebar-Components/TextEditor";
import { BackgroundEditor } from "./Sidebar-Components/BackgroundEditor";
import { LayoutEditor } from "./Sidebar-Components/LayoutEditor";



interface SidebarProps {
  selectedCanvas: Canvas | undefined;
}

export default function Sidebar({ selectedCanvas }: SidebarProps) {
  const [tab, setTab] = useState(1);

  const toggleTab = (index: number) => {
    setTab(index);
  };
  const getActiveClass = (index: number, className: string) =>
    tab === index ? className : "";

  let active
  switch (tab) {
    case 1:
      active = <div>
        <TextEditor selectedCanvas={selectedCanvas} />
      </div>
      break;
    case 2:
      active = <div>
        <BackgroundEditor selectedCanvas={selectedCanvas} />
      </div>
      break;
    case 3:
      active = <div>
        <LayoutEditor selectedCanvas={selectedCanvas} />
      </div>
      break;
    default:
      break;
  }
  return (
    <aside className="w-70 min-w-70 bg-gray-100 h-screen  border-r overflow-y-auto py-4 ">
      <div className="w-full">
        <ul className="flex  justify-around max-w-full bg-gray-300  py-2">
          <li
            className={`opacity-50 cursor-pointer px-3 py-2 text-xs whitespace-nowrap ${getActiveClass(1, 'bg-[#eeeded] !opacity-100')}`}
            onClick={() => toggleTab(1)}
          >
            Text
          </li>
          <li
            className={`opacity-50 cursor-pointer px-3 py-2 text-xs whitespace-nowrap ${getActiveClass(2, 'bg-[#eeeded] !opacity-100')}`}
            onClick={() => toggleTab(2)}
          >
            Canvas
          </li>
          <li
            className={`opacity-50 cursor-pointer px-3 py-2 text-xs whitespace-nowrap ${getActiveClass(3, 'bg-[#eeeded] !opacity-100')}`}
            onClick={() => toggleTab(3)}
          >
            layout
          </li>
          <li
            className={`opacity-50 cursor-pointer px-3 py-2 text-xs whitespace-nowrap ${getActiveClass(4, 'bg-[#eeeded] !opacity-100')}`}
            onClick={() => toggleTab(4)}
          >
            Tab 2
          </li>
          <li
            className={`opacity-50 cursor-pointer px-3 py-2 text-xs whitespace-nowrap ${getActiveClass(5, 'bg-[#eeeded] !opacity-100')}`}
            onClick={() => toggleTab(5)}
          >
            Tab 3
          </li>
        </ul>
        <main>
          {active}

        </main>
      </div>

    </aside>
  )
}
