import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, Download, FileArchive, Info } from "lucide-react";
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
      <section className="py-8 md:py-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Header */}
          <div className="text-center mb-12 relative">
            {/* Animated background gradient */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-lg shadow-orange-500/30 animate-float">
              <FileArchive className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight pb-2 bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
              Image Compressor
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
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
          <div
            className={`grid grid-cols-1 gap-6 ${result ? "lg:grid-cols-2" : ""}`}
          >
            {/* Left Column - Upload & Controls */}
            <div className="space-y-6">
              {!originalFile ? (
                <div className="max-w-2xl mx-auto">
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
                  />
                </div>
              ) : (
                <Card className="border-2 border-gray-200 dark:border-gray-700">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold">Original Image</h3>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
                      <img
                        src={originalUrl}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Size: {formatFileSize(originalFile.size)}
                      </span>
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={() => {
                          setOriginalFile(null);
                          setOriginalUrl("");
                          setResult(null);
                        }}
                      >
                        Change Image
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Compression Controls */}
              {originalFile && (
                <Card className="border-2 border-gray-200 dark:border-gray-700">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold">Compression Settings</h3>
                  </CardHeader>
                  <CardBody className="p-6 space-y-6">
                    {/* Format Selection */}
                    <div>
                      <Select
                        label="Output Format"
                        selectedKeys={[format]}
                        onChange={(e) => handleFormatChange(e.target.value)}
                        className="max-w-full"
                      >
                        <SelectItem key="image/jpeg">
                          JPEG - Best for photos
                        </SelectItem>
                        <SelectItem key="image/webp">
                          WebP - Modern format, smaller size
                        </SelectItem>
                        <SelectItem key="image/png">
                          PNG - Lossless, larger size
                        </SelectItem>
                      </Select>
                    </div>

                    {/* Quality Slider */}
                    {format !== "image/png" && (
                      <div>
                        <Slider
                          label="Quality"
                          value={quality}
                          onChange={(value) => setQuality(value as number)}
                          minValue={1}
                          maxValue={100}
                          step={1}
                          className="max-w-full"
                          getValue={(value) => `${value}%`}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Higher quality = larger file size
                        </p>
                      </div>
                    )}

                    {/* Compress Button */}
                    <Button
                      color="warning"
                      size="lg"
                      className="w-full font-bold"
                      onPress={() => handleCompress()}
                      isLoading={isCompressing}
                    >
                      {isCompressing ? "Compressing..." : "Compress Image"}
                    </Button>
                  </CardBody>
                </Card>
              )}
            </div>

            {/* Right Column - Result */}
            {result && (
              <div className="space-y-6">
                <Card className="border-2 border-gray-200 dark:border-gray-700">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold">Compressed Image</h3>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
                      <img
                        src={result.url}
                        alt="Compressed"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Stats */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">
                          Original Size
                        </span>
                        <span className="text-sm font-bold">
                          {formatFileSize(result.originalSize)}
                        </span>
                      </div>

                      <div className="flex items-center justify-center">
                        <ArrowDown className="w-6 h-6 text-green-500" />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <span className="text-sm font-medium">
                          Compressed Size
                        </span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          {formatFileSize(result.compressedSize)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-lg">
                        <span className="text-sm font-medium">Saved</span>
                        <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                          {result.compressionRatio.toFixed(1)}% (
                          {formatFileSize(
                            result.originalSize - result.compressedSize,
                          )}
                          )
                        </span>
                      </div>
                    </div>

                    <Button
                      color="success"
                      size="lg"
                      className="w-full font-bold"
                      startContent={<Download className="w-5 h-5" />}
                      onPress={handleDownload}
                    >
                      Download Compressed Image
                    </Button>
                  </CardBody>
                </Card>

                {/* Info Card */}
                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardBody className="p-4">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Compression Tips
                        </p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>
                            JPEG: Best for photos (80-90% quality recommended)
                          </li>
                          <li>WebP: Modern format with better compression</li>
                          <li>PNG: Use for graphics with transparency</li>
                        </ul>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
