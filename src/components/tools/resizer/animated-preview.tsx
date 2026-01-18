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
    <div className="space-y-6">
      {/* Large animated preview container */}
      <div className="relative flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-gray-300 border-dashed bg-gradient-to-br from-gray-50 to-gray-100 dark:border-gray-600 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          layout
          className="relative overflow-hidden rounded-xl border-4 border-white shadow-2xl dark:border-gray-800"
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
            <div className="rounded-lg bg-black/90 px-4 py-2 font-bold text-lg text-white backdrop-blur-sm">
              {Math.round(containerWidth)} × {Math.round(containerHeight)}
            </div>
          </div>
        </motion.div>

        {/* Background grid pattern for better visual reference */}
        <div
          className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, #666 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Info cards below preview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:border-blue-800 dark:from-blue-950/30 dark:to-blue-900/30">
          <CardBody className="p-4 text-center">
            <div className="mb-1 font-medium text-blue-600 text-sm dark:text-blue-400">
              Original
            </div>
            <div className="font-bold text-blue-800 text-lg dark:text-blue-200">
              {originalDimensions.width} × {originalDimensions.height}
            </div>
          </CardBody>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:border-green-800 dark:from-green-950/30 dark:to-green-900/30">
          <CardBody className="p-4 text-center">
            <div className="mb-1 font-medium text-green-600 text-sm dark:text-green-400">
              Target
            </div>
            <div className="font-bold text-green-800 text-lg dark:text-green-200">
              {Math.round(containerWidth)} × {Math.round(containerHeight)}
            </div>
          </CardBody>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 dark:border-purple-800 dark:from-purple-950/30 dark:to-purple-900/30">
          <CardBody className="p-4 text-center">
            <div className="mb-1 font-medium text-purple-600 text-sm dark:text-purple-400">
              Scale
            </div>
            <div className="font-bold text-lg text-purple-800 dark:text-purple-200">
              {Math.round((containerWidth / originalDimensions.width) * 100)}%
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
