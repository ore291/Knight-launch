import { type ReactElement } from "react";
import Tippy from "@tippyjs/react";
interface TooltipProps {
  text: string;
  children: ReactElement;
  placement?:
    | "top"
    | "top-end"
    | "top-start"
    | "bottom"
    | "bottom-end"
    | "bottom-start";
}
export const Tooltip = ({
  text,
  children,
  placement = "top",
}: TooltipProps) => {
  return (
    <Tippy
      placement={placement}
      content={text}
      className="bg-black text-white p-2 rounded text-xs"
    >
      {children}
    </Tippy>
  );
};
