import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { COLORS } from "@/styles/colors";

interface KPICardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change: number;
  timeframe: string;
}

export const KPICard = ({
  icon,
  label,
  value,
  change,
  timeframe,
}: KPICardProps) => {
  const isPositive = change >= 0;

  return (
    <div
      className="rounded-3xl overflow-hidden flex flex-col"
      style={{ minHeight: "100px" }}
    >
      {/* Top half — WHITE background, dark text */}
      <div
        className="flex-1 relative p-5"
        style={{ backgroundColor: COLORS.WHITE }}
      >
        {/* Label + Icon — same row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">            
            <p
              className="text-sm font-medium"
              style={{ color: COLORS.TEXT_SECONDARY }}
            >
              {label}
            </p>
            {/* Value */}
            <p
              className="text-3xl font-bold"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              {value}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: COLORS.DARK }}
          >
            {icon}
          </div>
        </div>
      </div>

      {/* Bottom half — LIGHTER background */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ backgroundColor: COLORS.LIGHTER }}
      >
        {/* Arrow icon in circle */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
        >
          {isPositive ? (
            <TrendingUp
              size={14}
              color="white"
              style={{ transform: "rotate(-45deg)" }}
            />
          ) : (
            <TrendingDown
              size={14}
              color="white"
              style={{ transform: "rotate(45deg)" }}
            />
          )}
        </div>

        {/* Change text */}
        <span
          className="text-sm font-semibold"
          style={{ color: COLORS.BUTTON_CHOSEN }}
        >
          {isPositive ? "+" : ""}
          {change}%{" "}
          <span
            className="font-normal"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            {timeframe}
          </span>
        </span>
      </div>
    </div>
  );
};
