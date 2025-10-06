import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowDown, Download, FileArchive, RotateCcw } from "lucide-react";
import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { SEO } from "@/components/seo";
import {
  type CompressionOptions,
  type CompressionResult,
  compressImage,
  formatFileSize,
  getFileExtension,
  getRecommendedQuality,
} from "@/utils/image-compressor";

export const Route = createFileRoute("/tools/compressor")({
  component: CompressorPage,
});

function CompressorPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Compression options
  const [format, setFormat] =
    useState<CompressionOptions["format"]>("image/jpeg");
  const [quality, setQuality] = useState(85);
  const [resizeEnabled] = useState(false);
  const [maxWidth] = useState(1920);
  const [maxHeight] = useState(1080);

  const handleImageSelect = (file: File, imageUrl: string) => {
    setOriginalFile(file);
    setOriginalUrl(imageUrl);
    setResult(null);

    // Auto-compress with default settings
    handleCompress(file);
  };

  const handleCompress = async (file?: File) => {
    const fileToCompress = file || originalFile;
    if (!fileToCompress) return;

    setIsCompressing(true);
    try {
      const options: CompressionOptions = {
        quality: quality / 100,
        format,
        ...(resizeEnabled && {
          maxWidth,
          maxHeight,
          maintainAspectRatio: true,
        }),
      };

      const compressed = await compressImage(fileToCompress, options);
      setResult(compressed);
    } catch (error) {
      console.error("Compression failed:", error);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !originalFile) return;

    const link = document.createElement("a");
    link.href = result.url;
    const extension = getFileExtension(format);
    const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
    link.download = `${baseName}-compressed.${extension}`;
    link.click();
  };

  const handleFormatChange = (value: string) => {
    const newFormat = value as CompressionOptions["format"];
    setFormat(newFormat);
    setQuality(Math.round(getRecommendedQuality(newFormat) * 100));
  };

  return (
    <>
      <SEO
        title="Image Compressor - Reduce File Size Online"
        description="Compress images online with quality control. Reduce JPEG, PNG, and WebP file sizes while maintaining visual quality. Free browser-based image compression tool."
        canonicalUrl="https://image-utilities.netlify.app/tools/compressor"
      />
      <section className="min-h-screen py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4">
          {/* Hero Header */}
          <div className="relative mb-12 text-center">
            {/* Animated background gradient */}
            <div className="-z-10 absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-orange-500/10 blur-3xl" />
              <div className="absolute top-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-red-500/10 blur-3xl delay-1000" />
            </div>

            <div className="mb-6 inline-flex h-20 w-20 animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30">
              <FileArchive className="h-10 w-10 text-white" />
            </div>

            <h1 className="mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text pb-2 font-black text-4xl text-transparent leading-tight md:text-5xl dark:from-orange-400 dark:to-red-400">
              Image Compressor
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-gray-600 text-lg dark:text-gray-400">
              Reduce image file sizes while maintaining quality. Perfect for web
              optimization and faster loading times.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Chip color="warning" variant="flat" size="sm">
                Quality Control
              </Chip>
              <Chip color="danger" variant="flat" size="sm">
                Before/After
              </Chip>
              <Chip color="default" variant="flat" size="sm">
                Multiple Formats
              </Chip>
            </div>
          </div>

          {/* Main Content */}
          {!originalFile ? (
            <div className="mx-auto max-w-2xl">
              <ImageUpload
                onImageSelect={handleImageSelect}
                acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mx-auto max-w-6xl space-y-6"
            >
              {/* Compact Image Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card className="border-2 border-gray-200 dark:border-gray-700">
                  <CardBody className="p-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* Original Image */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-700 text-sm dark:text-gray-300">
                            Original
                          </h3>
                          <Chip size="sm" variant="flat" color="default">
                            {formatFileSize(originalFile.size)}
                          </Chip>
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                          <img
                            src={originalUrl}
                            alt="Original"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </div>

                      {/* Compressed Image */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-700 text-sm dark:text-gray-300">
                            {result ? "Compressed" : "Preview"}
                          </h3>
                          {result && (
                            <Chip size="sm" variant="flat" color="success">
                              {formatFileSize(result.compressedSize)}
                            </Chip>
                          )}
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-gray-300 border-dashed bg-gray-100 dark:border-gray-600 dark:bg-gray-800">
                          {result ? (
                            <motion.img
                              key={result.url}
                              src={result.url}
                              alt="Compressed"
                              className="h-full w-full object-contain"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                              <div className="text-center">
                                <FileArchive className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                <p className="text-sm">
                                  Adjust settings and compress
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        {result && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.1,
                              ease: "easeOut",
                            }}
                            className="flex items-center justify-center"
                          >
                            <Chip
                              size="sm"
                              variant="flat"
                              color="success"
                              startContent={<ArrowDown className="h-3 w-3" />}
                            >
                              Saved{" "}
                              {((1 - result.compressionRatio) * 100).toFixed(1)}
                              %
                            </Chip>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              {/* Compact Controls Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card className="border-2 border-gray-200 dark:border-gray-700">
                  <CardBody className="p-4">
                    <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-end">
                      {/* Format Selection */}
                      <div className="min-w-[200px] flex-1">
                        <Select
                          label="Output Format"
                          labelPlacement="outside"
                          size="sm"
                          selectedKeys={[format]}
                          onChange={(e) => handleFormatChange(e.target.value)}
                        >
                          <SelectItem key="image/jpeg">JPEG</SelectItem>
                          <SelectItem key="image/webp">WebP</SelectItem>
                          <SelectItem key="image/png">PNG</SelectItem>
                        </Select>
                      </div>

                      {/* Quality Slider */}
                      {format !== "image/png" && (
                        <div className="min-w-[200px] flex-1">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-700 text-xs dark:text-gray-300">
                                Quality
                              </span>
                              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text font-bold text-sm text-transparent">
                                {quality}%
                              </span>
                            </div>
                            <Slider
                              aria-label="Quality"
                              value={quality}
                              onChange={(value) => setQuality(value as number)}
                              minValue={1}
                              maxValue={100}
                              step={1}
                              size="sm"
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 lg:min-w-fit">
                        <Button
                          size="lg"
                          variant="bordered"
                          onPress={() => {
                            setOriginalFile(null);
                            setOriginalUrl("");
                            setResult(null);
                          }}
                          startContent={<RotateCcw className="h-4 w-4" />}
                          className="flex-1 lg:flex-initial"
                        >
                          New
                        </Button>
                        <Button
                          size="lg"
                          color="warning"
                          onPress={() => handleCompress()}
                          isLoading={isCompressing}
                          className="flex-1 font-bold lg:flex-initial"
                          startContent={
                            !isCompressing ? (
                              <FileArchive className="h-4 w-4" />
                            ) : undefined
                          }
                        >
                          {isCompressing ? "Compressing..." : "Compress"}
                        </Button>
                        {result && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: "easeOut",
                            }}
                            className="flex-1 lg:flex-initial"
                          >
                            <Button
                              size="lg"
                              color="success"
                              onPress={handleDownload}
                              startContent={<Download className="h-4 w-4" />}
                              className="w-full font-bold"
                            >
                              Download
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
