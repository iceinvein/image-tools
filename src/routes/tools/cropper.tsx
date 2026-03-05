import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crop, Download, Image as ImageIcon, RotateCcw } from "lucide-react";
import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { createBreadcrumbSchema, createSoftwareApplicationSchema, SEO } from "@/components/seo";
import { CropCanvas } from "@/components/tools/cropper/crop-canvas";
import type { CropRect } from "@/components/tools/cropper/crop-canvas";
import { cropImage, downloadBlob, getImageDimensions } from "@/utils/image-processing";

function CropperPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [cropRect, setCropRect] = useState<CropRect | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelect = async (file: File, imageUrl: string) => {
    setOriginalFile(file);
    setOriginalUrl(imageUrl);
    setCropRect(null);
    try {
      const dims = await getImageDimensions(file);
      setDimensions(dims);
    } catch (error) {
      console.error("Failed to get image dimensions:", error);
    }
  };

  const handleCrop = async () => {
    if (!originalFile || !cropRect || !dimensions) return;
    setIsProcessing(true);
    try {
      // Get the displayed image element to compute scale
      const imgEl = document.querySelector<HTMLImageElement>("[alt='Crop preview']");
      if (!imgEl) throw new Error("Image element not found");
      const displayWidth = imgEl.getBoundingClientRect().width;
      const scale = dimensions.width / displayWidth;

      const blob = await cropImage(
        originalFile,
        Math.round(cropRect.x * scale),
        Math.round(cropRect.y * scale),
        Math.round(cropRect.width * scale),
        Math.round(cropRect.height * scale),
      );

      const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
      const extension = originalFile.name.split(".").pop() || "jpg";
      downloadBlob(blob, `${baseName}_cropped.${extension}`);
    } catch (error) {
      console.error("Crop failed:", error);
      alert("Failed to crop image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl("");
    setDimensions(null);
    setCropRect(null);
  };

  return (
    <section className="min-h-screen py-8 md:py-10">
      <SEO
        title="Image Cropper - Crop Images Online with Visual Selection | Image Tools"
        description="Free online image cropper. Select and crop any area of your image with an interactive visual tool. 100% browser-based."
        keywords="image cropper, crop image, crop photo, image crop tool, online image cropper, visual crop"
        canonicalUrl="https://image-utilities.netlify.app/tools/cropper"
        structuredData={{
          ...createSoftwareApplicationSchema(
            "Image Cropper",
            "Crop images with an interactive visual selection tool",
          ),
          ...createBreadcrumbSchema([
            { name: "Home", url: "https://image-utilities.netlify.app/" },
            { name: "Image Cropper", url: "https://image-utilities.netlify.app/tools/cropper" },
          ]),
        }}
      />
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero Header */}
        <div className="relative mb-12 text-center">
          {/* Animated background gradient */}
          <div className="-z-10 absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-teal-500/10 blur-3xl" />
            <div className="absolute top-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-500/10 blur-3xl delay-1000" />
          </div>

          <div className="mb-6 inline-flex h-20 w-20 animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg shadow-teal-500/30">
            <Crop className="h-10 w-10 text-white" />
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text pb-2 font-black text-4xl text-transparent leading-tight md:text-5xl dark:from-teal-400 dark:to-cyan-400">
            Image Cropper
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-gray-600 text-lg dark:text-gray-400">
            Crop your images with an interactive visual selection tool. Click and drag to select the
            area you want to keep.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Chip color="primary" variant="flat" size="sm">
              Interactive Selection
            </Chip>
            <Chip color="success" variant="flat" size="sm">
              Live Preview
            </Chip>
          </div>
        </div>

        {/* Main Content */}
        {!originalFile ? (
          <div className="mx-auto max-w-2xl">
            <ImageUpload onImageSelect={handleImageSelect} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Crop Canvas Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-xl dark:border-gray-700">
                <CardHeader className="border-gray-200 border-b bg-gradient-to-r from-teal-50 to-cyan-50 p-3 dark:border-gray-700 dark:from-teal-950/30 dark:to-cyan-950/30">
                  <div className="flex w-full items-center justify-between gap-4">
                    {/* Left: Image info */}
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <ImageIcon className="h-5 w-5 flex-shrink-0 text-teal-600 dark:text-teal-400" />
                      {dimensions && (
                        <div className="flex items-center gap-3 truncate text-gray-600 text-xs dark:text-gray-400">
                          <span className="truncate font-medium">{originalFile.name}</span>
                          <span className="text-gray-400">•</span>
                          <span className="whitespace-nowrap">
                            {dimensions.width} × {dimensions.height}
                          </span>
                          {cropRect && (
                            <>
                              <span className="text-gray-400">•</span>
                              <Chip size="sm" color="success" variant="flat" className="h-5">
                                Selection active
                              </Chip>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onPress={handleCrop}
                        isDisabled={!cropRect}
                        isLoading={isProcessing}
                        className="overflow-hidden bg-gradient-to-r from-teal-600 to-cyan-600 font-bold text-white shadow-lg transition-all duration-300 hover:scale-102"
                        startContent={
                          !isProcessing ? <Download className="h-4 w-4" /> : undefined
                        }
                      >
                        Crop & Download
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={handleReset}
                        isIconOnly
                        title="New Image"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-0">
                  <CropCanvas
                    imageUrl={originalUrl}
                    imageDimensions={dimensions ?? { width: 0, height: 0 }}
                    cropRect={cropRect}
                    onCropChange={setCropRect}
                  />
                </CardBody>
              </Card>
            </motion.div>

            {/* Action bar */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button
                variant="flat"
                color="default"
                isDisabled={!cropRect}
                onPress={() => setCropRect(null)}
              >
                Reset Selection
              </Button>
              <Button
                variant="flat"
                color="danger"
                startContent={<RotateCcw className="h-4 w-4" />}
                onPress={handleReset}
              >
                New Image
              </Button>
              <Button
                color="primary"
                isDisabled={!cropRect}
                isLoading={isProcessing}
                onPress={handleCrop}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 font-bold text-white shadow-lg"
                startContent={!isProcessing ? <Download className="h-4 w-4" /> : undefined}
              >
                Crop & Download
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export const Route = createFileRoute("/tools/cropper")({
  component: CropperPage,
});
