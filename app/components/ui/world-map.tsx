"use client";

import DottedMap from "dotted-map";
import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

export interface MapDot {
  start: { lat: number; lng: number; label?: string };
  end: { lat: number; lng: number; label?: string };
}

interface WorldMapProps {
  dots?: MapDot[];
  lineColor?: string;
  dotColor?: string;
  className?: string;
}

function projectPoint(lat: number, lng: number) {
  const x = (lng + 180) * (800 / 360);
  const y = (90 - lat) * (400 / 180);
  return { x, y };
}

function createCurvedPath(
  start: { x: number; y: number },
  end: { x: number; y: number },
) {
  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - 50;
  return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
}

export function WorldMap({
  dots = [],
  lineColor = "#0f2d52",
  dotColor = "#0f2d5226",
  className,
}: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const svgMap = useMemo(() => {
    const map = new DottedMap({ height: 100, grid: "diagonal" });
    return map.getSVG({
      radius: 0.22,
      color: dotColor,
      shape: "circle",
      backgroundColor: "transparent",
    });
  }, [dotColor]);

  const gradientId = "smartqr-map-path-gradient";

  return (
    <div
      ref={containerRef}
      className={cn("relative aspect-[2/1] w-full", className)}
    >
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="pointer-events-none h-full w-full select-none [mask-image:linear-gradient(to_bottom,transparent,white_8%,white_92%,transparent)]"
        alt="World map"
        height={495}
        width={1056}
        draggable={false}
      />
      <svg
        viewBox="0 0 800 400"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <motion.path
              key={`path-${i}`}
              d={createCurvedPath(startPoint, endPoint)}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isInView
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{
                pathLength: {
                  duration: 1.4,
                  delay: 0.22 * i,
                  ease: "easeOut",
                },
                opacity: { duration: 0.3, delay: 0.22 * i },
              }}
            />
          );
        })}

        {dots.map((dot, i) => (
          <g key={`points-${i}`}>
            {[dot.start, dot.end].map((point, j) => {
              const projected = projectPoint(point.lat, point.lng);
              const pointDelay = 0.22 * i + 0.15;
              return (
                <g key={j}>
                  <motion.circle
                    cx={projected.x}
                    cy={projected.y}
                    r="2"
                    fill={lineColor}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={
                      isInView
                        ? { scale: 1, opacity: 1 }
                        : { scale: 0, opacity: 0 }
                    }
                    transition={{
                      duration: 0.4,
                      delay: pointDelay,
                      ease: "easeOut",
                    }}
                  />
                  {isInView && (
                    <circle
                      cx={projected.x}
                      cy={projected.y}
                      r="2"
                      fill={lineColor}
                      opacity="0.5"
                    >
                      <animate
                        attributeName="r"
                        from="2"
                        to="8"
                        dur="1.5s"
                        begin={`${pointDelay}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.5"
                        to="0"
                        dur="1.5s"
                        begin={`${pointDelay}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
