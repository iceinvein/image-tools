import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import React, { useCallback, useState } from "react";

import { ImageUpload } from "@/components/image-upload";
import {
  createBreadcrumbSchema,
  createSoftwareApplicationSchema,
  SEO,
} from "@/components/seo";
import { AnimatedPreview } from "@/components/tools/resizer/animated-preview";
import { ResizerActions } from "@/components/tools/resizer/resizer-actions";
import {
  type FitMethod,
  ResizerControls,
} from "@/components/tools/resizer/resizer-controls";
import {
  calculateDimensions,
  downloadBlob,
  getFileExtension,
  getImageDimensions,
  resizeImage,
} from "@/utils/image-processing";

function ResizerPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [resizedUrl, setResizedUrl] = useState<string>("");
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [newDimensions, setNewDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [fitMethod, setFitMethod] = useState<FitMethod>("scale");
  const [backgroundColor, setBackgroundColor] = useState<string>("transparent");
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");
  const [targetFormat, setTargetFormat] = useState<string>("image/png");
  const [isProcessing, setIsProcessing] = useState(false);
  const [scalePercentage, setScalePercentage] = useState<number>(100);
  const [resizeError, setResizeError] = useState<string>("");

  const handleImageSelect = useCallback(
    async (file: File, imageUrl: string) => {
      setOriginalFile(file);
      setOriginalUrl(imageUrl);
      setResizedUrl("");
      setResizedBlob(null);
      setResizeError("");

      // Default to PNG for SVGs, otherwise original type
      if (file.type === "image/svg+xml") {
        setTargetFormat("image/png");
      } else {
        setTargetFormat(file.type);
      }

      try {
        const dims = await getImageDimensions(file);
        setOriginalDimensions(dims);
        setTargetWidth(dims.width);
        setTargetHeight(dims.height);
      } catch (error) {
        console.error("Failed to get image dimensions:", error);
      }
    },
    [],
  );

  const handlePresetChange = useCallback((preset: string) => {
    setSelectedPreset(preset);
    if (preset !== "custom") {
      const [width, height] = preset.split("x").map(Number);
      setTargetWidth(width);
      setTargetHeight(height);
    }
  }, []);

  const handleScaleChange = useCallback(
    (percentage: number) => {
      if (!originalDimensions) return;
      setScalePercentage(percentage);
      const scale = percentage / 100;
      setTargetWidth(Math.round(originalDimensions.width * scale));
      setTargetHeight(Math.round(originalDimensions.height * scale));
    },
    [originalDimensions],
  );

  const handleWidthChange = useCallback(
    (width: number) => {
      setTargetWidth(width);
      if (maintainAspectRatio && originalDimensions) {
        const aspectRatio =
          originalDimensions.width / originalDimensions.height;
        setTargetHeight(Math.round(width / aspectRatio));
      }
      // Update scale percentage
      if (originalDimensions) {
        setScalePercentage(
          Math.round((width / originalDimensions.width) * 100),
        );
      }
    },
    [maintainAspectRatio, originalDimensions],
  );

  const handleHeightChange = useCallback(
    (height: number) => {
      setTargetHeight(height);
      if (maintainAspectRatio && originalDimensions) {
        const aspectRatio =
          originalDimensions.width / originalDimensions.height;
        setTargetWidth(Math.round(height * aspectRatio));
      }
      // Update scale percentage
      if (originalDimensions) {
        setScalePercentage(
          Math.round((height / originalDimensions.height) * 100),
        );
      }
    },
    [maintainAspectRatio, originalDimensions],
  );

  const updatePreviewDimensions = useCallback(() => {
    if (!originalDimensions) return;

    if (fitMethod === "scale") {
      const calculated = calculateDimensions(
        originalDimensions.width,
        originalDimensions.height,
        targetWidth,
        targetHeight,
        maintainAspectRatio,
      );
      setNewDimensions(calculated);
    } else {
      setNewDimensions({ width: targetWidth, height: targetHeight });
    }
  }, [
    originalDimensions,
    targetWidth,
    targetHeight,
    maintainAspectRatio,
    fitMethod,
  ]);

  const handleResize = useCallback(async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    setResizeError("");
    try {
      const blob = await resizeImage(
        originalFile,
        targetWidth,
        targetHeight,
        maintainAspectRatio,
        0.9,
        fitMethod,
        backgroundColor,
        targetFormat,
      );
      setResizedBlob(blob);

      const url = URL.createObjectURL(blob);
      setResizedUrl(url);
    } catch (error) {
      console.error("Resize failed:", error);
      setResizeError("Failed to resize image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [
    originalFile,
    targetWidth,
    targetHeight,
    maintainAspectRatio,
    fitMethod,
    backgroundColor,
    targetFormat,
  ]);

  const handleDownload = useCallback(() => {
    if (!resizedBlob || !originalFile) return;

    const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
    const extension = getFileExtension(targetFormat);
    const filename = `${baseName}_resized_${targetWidth}x${targetHeight}.${extension}`;

    downloadBlob(resizedBlob, filename);
  }, [resizedBlob, originalFile, targetFormat, targetWidth, targetHeight]);

  const handleReset = useCallback(() => {
    setOriginalFile(null);
    setOriginalUrl("");
    setResizedUrl("");
    setResizedBlob(null);
    setOriginalDimensions(null);
    setNewDimensions(null);
    setResizeError("");
  }, []);

  // Update preview dimensions when values change
  React.useEffect(() => {
    updatePreviewDimensions();
  }, [updatePreviewDimensions]);

  return (
    <section className="py-8 md:py-10">
      <SEO
        title="Image Resizer - Resize Images Online with Smart Presets | Image Tools"
        description="Free online image resizer. Resize images by pixels, percentage, or use smart presets. Maintain aspect ratio or customize dimensions. 100% browser-based."
        keywords="image resizer, image, scale image, image dimensions, resize photo, image size, aspect ratio, online image resizer, resize svg, svg resizer"
        canonicalUrl="https://image-utilities.netlify.app/tools/resizer"
        structuredData={{
          ...createSoftwareApplicationSchema(
            "Image Resizer",
            "Resize images by pixels, percentage, or use smart presets with aspect ratio control",
          ),
          ...createBreadcrumbSchema([
            { name: "Home", url: "https://image-utilities.netlify.app/" },
            {
              name: "Image Resizer",
              url: "https://image-utilities.netlify.app/tools/resizer",
            },
          ]),
        }}
      />
      <div className="">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <Maximize2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-zinc-900 dark:text-zinc-50">
                Image Resizer
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Scale your images to perfect dimensions with aspect ratio lock
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!originalFile ? (
          <div>
            <ImageUpload
              onImageSelect={handleImageSelect}
              acceptedFormats={[
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/gif",
                "image/svg+xml",
              ]}
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <Card className="border border-zinc-200 dark:border-zinc-800">
              <CardBody className="p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Left: Live Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">
                        Live Preview
                      </h3>
                      <div className="flex items-center gap-2">
                        <Chip size="sm" variant="flat">
                          {Math.round(newDimensions?.width || targetWidth)} x{" "}
                          {Math.round(newDimensions?.height || targetHeight)}
                        </Chip>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                      {originalDimensions && (
                        <AnimatedPreview
                          imageUrl={originalUrl}
                          originalDimensions={originalDimensions}
                          targetWidth={targetWidth}
                          targetHeight={targetHeight}
                          fitMethod={fitMethod}
                          backgroundColor={backgroundColor}
                        />
                      )}
                    </div>
                  </div>

                  {/* Right: Controls */}
                  <ResizerControls
                    maintainAspectRatio={maintainAspectRatio}
                    setMaintainAspectRatio={setMaintainAspectRatio}
                    scalePercentage={scalePercentage}
                    handleScaleChange={handleScaleChange}
                    fitMethod={fitMethod}
                    setFitMethod={setFitMethod}
                    backgroundColor={backgroundColor}
                    setBackgroundColor={setBackgroundColor}
                    targetWidth={targetWidth}
                    handleWidthChange={handleWidthChange}
                    targetHeight={targetHeight}
                    handleHeightChange={handleHeightChange}
                    selectedPreset={selectedPreset}
                    handlePresetChange={handlePresetChange}
                    targetFormat={targetFormat}
                    setTargetFormat={setTargetFormat}
                    originalDimensions={
                      originalDimensions || { width: 0, height: 0 }
                    }
                    newDimensions={newDimensions}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Inline error state */}
            {resizeError && (
              <p className="text-red-600 text-sm dark:text-red-400">
                {resizeError}
              </p>
            )}

            {/* Action Bar */}
            <ResizerActions
              resizedUrl={resizedUrl}
              isProcessing={isProcessing}
              handleReset={handleReset}
              handleResize={handleResize}
              handleDownload={handleDownload}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}

export const Route = createFileRoute("/tools/resizer")({
  component: ResizerPage,
});
