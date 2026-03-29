import { Card, CardBody } from "@heroui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Custom hook for debounced state
function useDebouncedState<T>(value: T, duration: number = 0.3): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [value, duration]);

  return debouncedValue;
}

export interface AnimatedPreviewProps {
  imageUrl: string;
  originalDimensions: { width: number; height: number };
  targetWidth: number;
  targetHeight: number;
  fitMethod: "scale" | "contain" | "cover" | "stretch";
  backgroundColor: string;
}

export function AnimatedPreview({
  imageUrl,
  originalDimensions,
  targetWidth,
  targetHeight,
  fitMethod,
  backgroundColor,
}: AnimatedPreviewProps) {
  const debouncedWidth = useDebouncedState(targetWidth);
  const debouncedHeight = useDebouncedState(targetHeight);

  // Calculate display dimensions for the preview
  const maxPreviewWidth = 600;
  const maxPreviewHeight = 400;

  let containerWidth = debouncedWidth;
  let containerHeight = debouncedHeight;

  if (fitMethod === "scale") {
    const aspectRatio = originalDimensions.width / originalDimensions.height;
    if (debouncedWidth / debouncedHeight > aspectRatio) {
      containerWidth = Math.round(debouncedHeight * aspectRatio);
      containerHeight = debouncedHeight;
    } else {
      containerWidth = debouncedWidth;
      containerHeight = Math.round(debouncedWidth / aspectRatio);
    }
  }

  const scaleByWidth = maxPreviewWidth / containerWidth;
  const scaleByHeight = maxPreviewHeight / containerHeight;
  const scale = Math.min(scaleByWidth, scaleByHeight, 1);
  const displayWidth = containerWidth * scale;
  const displayHeight = containerHeight * scale;

  const getObjectFit = () => {
    switch (fitMethod) {
      case "contain":
        return "contain";
      case "cover":
        return "cover";
      case "stretch":
        return "fill";
      default:
        return "contain";
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview container */}
      <div className="relative flex min-h-[300px] w-full items-center justify-center overflow-hidden rounded-lg border border-zinc-200 border-dashed bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
        <motion.div
          layout
          className="relative overflow-hidden rounded-md border border-zinc-300 shadow-md dark:border-zinc-700"
          style={{
            width: displayWidth,
            height: displayHeight,
            backgroundColor:
              backgroundColor === "transparent" ? "white" : backgroundColor,
            backgroundImage:
              backgroundColor === "transparent"
                ? `linear-gradient(45deg, #ccc 25%, transparent 25%),
                 linear-gradient(-45deg, #ccc 25%, transparent 25%),
                 linear-gradient(45deg, transparent 75%, #ccc 75%),
                 linear-gradient(-45deg, transparent 75%, #ccc 75%)`
                : "none",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <img
            src={imageUrl}
            alt="Live Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: getObjectFit() as React.CSSProperties["objectFit"],
            }}
          />

          {/* Overlay with dimensions */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 hover:opacity-100">
            <div className="rounded-md bg-black/80 px-3 py-1.5 font-medium text-sm text-white">
              {Math.round(containerWidth)} x {Math.round(containerHeight)}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Info cards below preview */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border border-zinc-200 dark:border-zinc-800">
          <CardBody className="p-3 text-center">
            <div className="mb-0.5 font-medium text-xs text-zinc-500 dark:text-zinc-400">
              Original
            </div>
            <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
              {originalDimensions.width} x {originalDimensions.height}
            </div>
          </CardBody>
        </Card>

        <Card className="border border-zinc-200 dark:border-zinc-800">
          <CardBody className="p-3 text-center">
            <div className="mb-0.5 font-medium text-xs text-zinc-500 dark:text-zinc-400">
              Target
            </div>
            <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
              {Math.round(containerWidth)} x {Math.round(containerHeight)}
            </div>
          </CardBody>
        </Card>

        <Card className="border border-zinc-200 dark:border-zinc-800">
          <CardBody className="p-3 text-center">
            <div className="mb-0.5 font-medium text-xs text-zinc-500 dark:text-zinc-400">
              Scale
            </div>
            <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
              {Math.round((containerWidth / originalDimensions.width) * 100)}%
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
