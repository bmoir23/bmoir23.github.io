import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
  type MotionValue,
} from "framer-motion";
import { cn } from "../../lib/utils";

const GRID_SIZE = 40;
const SCROLL_SPEED = 0.5;
const SPOTLIGHT_RADIUS = 300;

function GridPattern({
  offsetX,
  offsetY,
  size,
  className,
}: {
  offsetX: MotionValue<number>;
  offsetY: MotionValue<number>;
  size: number;
  className?: string;
}) {
  return (
    <svg className={cn("h-full w-full", className)} aria-hidden="true">
      <defs>
        <motion.pattern
          id="infinite-grid-pattern"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#infinite-grid-pattern)" />
    </svg>
  );
}

export default function InfiniteGridBackground() {
  const reduceMotionRef = useRef(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotionRef.current = media.matches;

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reduceMotionRef.current = event.matches;
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    media.addEventListener("change", handleMotionChange);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      media.removeEventListener("change", handleMotionChange);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  useAnimationFrame(() => {
    if (reduceMotionRef.current) return;

    gridOffsetX.set((gridOffsetX.get() + SCROLL_SPEED) % GRID_SIZE);
    gridOffsetY.set((gridOffsetY.get() + SCROLL_SPEED) % GRID_SIZE);
  });

  const maskImage = useMotionTemplate`radial-gradient(${SPOTLIGHT_RADIUS}px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-white transition-colors duration-300 dark:bg-gray-950" />

      <div className="absolute inset-0 text-gray-900 opacity-[0.045] dark:text-gray-100 dark:opacity-[0.07]">
        <GridPattern
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          size={GRID_SIZE}
        />
      </div>

      <motion.div
        className="absolute inset-0 text-gray-700 opacity-25 dark:text-gray-300 dark:opacity-30"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          size={GRID_SIZE}
        />
      </motion.div>

      <div className="absolute inset-0">
        <div className="absolute right-[-20%] top-[-20%] h-[40%] w-[40%] rounded-full bg-orange-400/35 blur-[120px] dark:bg-orange-600/20" />
        <div className="absolute right-[10%] top-[-10%] h-[20%] w-[20%] rounded-full bg-cyan-400/25 blur-[100px] dark:bg-cyan-500/15" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-400/35 blur-[120px] dark:bg-blue-600/20" />
      </div>
    </div>
  );
}
