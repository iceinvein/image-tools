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

  const handleImageSelect = useCallback(
    async (file: File, imageUrl: string) => {
      setOriginalFile(file);
      setOriginalUrl(imageUrl);
      setResizedUrl("");
      setResizedBlob(null);

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
      alert("Failed to resize image. Please try again.");
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
  }, []);

  // Update preview dimensions when values change
  React.useEffect(() => {
    updatePreviewDimensions();
  }, [updatePreviewDimensions]);

  return (
    <section className="min-h-screen py-8 md:py-10">
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
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero Header */}
        <div className="relative mb-12 text-center">
          {/* Animated background gradient */}
          <div className="-z-10 absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-green-500/10 blur-3xl" />
            <div className="absolute top-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-emerald-500/10 blur-3xl delay-1000" />
          </div>

          <div className="mb-6 inline-flex h-20 w-20 animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30 shadow-lg">
            <Maximize2 className="h-10 w-10 text-white" />
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text pb-2 font-black text-4xl text-transparent leading-tight md:text-5xl dark:from-green-400 dark:to-emerald-400">
            Image Resizer
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-gray-600 text-lg dark:text-gray-400">
            Scale your images to perfect dimensions. Smart presets and custom
            sizing with aspect ratio lock.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Chip color="success" variant="flat" size="sm">
              Precision control
            </Chip>
            <Chip color="primary" variant="flat" size="sm">
              Aspect ratio lock
            </Chip>
          </div>
        </div>

        {/* Main Content */}
        {!originalFile ? (
          <div className="mx-auto max-w-2xl">
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
            className="mx-auto max-w-7xl space-y-6"
          >
            {/* Compact Side-by-Side Layout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left: Live Preview */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-700 text-sm dark:text-gray-300">
                          Live Preview
                        </h3>
                        <div className="flex items-center gap-2">
                          <Chip size="sm" variant="flat" color="success">
                            {Math.round(newDimensions?.width || targetWidth)} ×{" "}
                            {Math.round(newDimensions?.height || targetHeight)}
                          </Chip>
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
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

              {/* Compact Action Bar */}
              <ResizerActions
                resizedUrl={resizedUrl}
                isProcessing={isProcessing}
                handleReset={handleReset}
                handleResize={handleResize}
                handleDownload={handleDownload}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export const Route = createFileRoute("/tools/resizer")({
  component: ResizerPage,
});
