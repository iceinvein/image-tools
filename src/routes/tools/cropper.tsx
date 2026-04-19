import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { createFileRoute } from "@tanstack/react-router";
import { Crop, Download, Image as ImageIcon, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import {
  createBreadcrumbSchema,
  createSoftwareApplicationSchema,
  SEO,
} from "@/components/seo";
import { ToolOutputActions } from "@/components/tool-output-actions";
import type { CropRect } from "@/components/tools/cropper/crop-canvas";
import { CropCanvas } from "@/components/tools/cropper/crop-canvas";
import {
  cropImage,
  downloadBlob,
  getImageDimensions,
} from "@/utils/image-processing";

function CropperPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [cropRect, setCropRect] = useState<CropRect | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [cropError, setCropError] = useState<string | null>(null);

  const getCroppedFilename = useCallback(() => {
    if (!originalFile) return "cropped-image.png";

    const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
    const extension = originalFile.name.split(".").pop() || "jpg";
    return `${baseName}_cropped.${extension}`;
  }, [originalFile]);

  const createCroppedBlob = useCallback(async () => {
    if (!originalFile || !cropRect || !dimensions) {
      throw new Error("Crop selection is incomplete");
    }

    const imgEl = document.querySelector<HTMLImageElement>(
      "[alt='Crop preview']",
    );
    if (!imgEl) {
      throw new Error("Image element not found");
    }

    const displayWidth = imgEl.getBoundingClientRect().width;
    const scale = dimensions.width / displayWidth;

    return cropImage(
      originalFile,
      Math.round(cropRect.x * scale),
      Math.round(cropRect.y * scale),
      Math.round(cropRect.width * scale),
      Math.round(cropRect.height * scale),
    );
  }, [cropRect, dimensions, originalFile]);

  const handleImageSelect = async (file: File, imageUrl: string) => {
    setOriginalFile(file);
    setOriginalUrl(imageUrl);
    setCropRect(null);
    setCroppedBlob(null);
    setCropError(null);
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
    setCropError(null);
    try {
      const blob = await createCroppedBlob();
      setCroppedBlob(blob);
    } catch (error) {
      console.error("Crop failed:", error);
      setCropError("Failed to crop image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCropChange = useCallback((nextCropRect: CropRect | null) => {
    setCropRect(nextCropRect);
    setCroppedBlob(null);
    setCropError(null);
  }, []);

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl("");
    setDimensions(null);
    setCropRect(null);
    setCroppedBlob(null);
    setCropError(null);
  };

  const handleDownload = () => {
    if (!croppedBlob) return;
    downloadBlob(croppedBlob, getCroppedFilename());
  };

  return (
    <section className="py-8 md:py-10">
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
            {
              name: "Image Cropper",
              url: "https://image-utilities.netlify.app/tools/cropper",
            },
          ]),
        }}
      />
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <Crop className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-zinc-900 dark:text-zinc-50">
                Image Cropper
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Click and drag to select the area you want to keep.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!originalFile ? (
          <div>
            <ImageUpload onImageSelect={handleImageSelect} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Crop Canvas Card */}
            <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <CardHeader className="border-zinc-200 border-b bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex w-full items-center justify-between gap-4">
                  {/* Left: Image info */}
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <ImageIcon className="h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
                    {dimensions && (
                      <div className="flex items-center gap-3 truncate text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="truncate font-medium">
                          {originalFile.name}
                        </span>
                        <span className="text-zinc-400 dark:text-zinc-600">
                          •
                        </span>
                        <span className="whitespace-nowrap">
                          {dimensions.width} &times; {dimensions.height}
                        </span>
                        {cropRect && (
                          <>
                            <span className="text-zinc-400 dark:text-zinc-600">
                              •
                            </span>
                            <Chip
                              size="sm"
                              color="success"
                              variant="flat"
                              className="h-5"
                            >
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
                      color="primary"
                      onPress={handleCrop}
                      isDisabled={!cropRect}
                      isLoading={isProcessing}
                      startContent={
                        !isProcessing ? <Crop className="h-4 w-4" /> : undefined
                      }
                    >
                      {croppedBlob ? "Re-crop" : "Crop"}
                    </Button>
                    {croppedBlob && (
                      <>
                        <Button
                          size="sm"
                          color="success"
                          variant="flat"
                          onPress={handleDownload}
                          startContent={<Download className="h-4 w-4" />}
                        >
                          Download
                        </Button>
                        <ToolOutputActions
                          currentToolKey="cropper"
                          fileName={getCroppedFilename()}
                          mimeType={originalFile.type}
                          getBlob={async () => croppedBlob}
                          size="sm"
                          variant="flat"
                        />
                      </>
                    )}
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
                {cropError && (
                  <div className="border-zinc-200 border-b bg-red-50 px-4 py-2 text-red-700 text-sm dark:border-zinc-800 dark:bg-red-950/30 dark:text-red-400">
                    {cropError}
                  </div>
                )}
                <CropCanvas
                  imageUrl={originalUrl}
                  imageDimensions={dimensions ?? { width: 0, height: 0 }}
                  cropRect={cropRect}
                  onCropChange={handleCropChange}
                />
              </CardBody>
            </Card>

            {/* Action bar */}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="flat"
                color="default"
                isDisabled={!cropRect}
                onPress={() => handleCropChange(null)}
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
                startContent={
                  !isProcessing ? <Crop className="h-4 w-4" /> : undefined
                }
              >
                {croppedBlob ? "Re-crop" : "Crop"}
              </Button>
              {croppedBlob && (
                <>
                  <Button
                    color="success"
                    variant="flat"
                    onPress={handleDownload}
                    startContent={<Download className="h-4 w-4" />}
                  >
                    Download
                  </Button>
                  <ToolOutputActions
                    currentToolKey="cropper"
                    fileName={getCroppedFilename()}
                    mimeType={originalFile.type}
                    getBlob={async () => croppedBlob}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export const Route = createFileRoute("/tools/cropper")({
  component: CropperPage,
});
