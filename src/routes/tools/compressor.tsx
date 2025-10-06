import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { createFileRoute } from "@tanstack/react-router";
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
          {!originalFile ? (
            <div className="max-w-2xl mx-auto">
              <ImageUpload
                onImageSelect={handleImageSelect}
                acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
              />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Compact Image Comparison */}
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Original Image */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Original
                        </h3>
                        <Chip size="sm" variant="flat" color="default">
                          {formatFileSize(originalFile.size)}
                        </Chip>
                      </div>
                      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                        <img
                          src={originalUrl}
                          alt="Original"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Compressed Image */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {result ? "Compressed" : "Preview"}
                        </h3>
                        {result && (
                          <Chip size="sm" variant="flat" color="success">
                            {formatFileSize(result.compressedSize)}
                          </Chip>
                        )}
                      </div>
                      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                        {result ? (
                          <img
                            src={result.url}
                            alt="Compressed"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <FileArchive className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">
                                Adjust settings and compress
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      {result && (
                        <div className="flex items-center justify-center">
                          <Chip
                            size="sm"
                            variant="flat"
                            color="success"
                            startContent={<ArrowDown className="w-3 h-3" />}
                          >
                            Saved{" "}
                            {((1 - result.compressionRatio) * 100).toFixed(1)}%
                          </Chip>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Compact Controls Bar */}
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardBody className="p-4">
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
                    {/* Format Selection */}
                    <div className="flex-1 min-w-[200px]">
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
                      <div className="flex-1 min-w-[200px]">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Quality
                            </span>
                            <span className="text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
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
                        startContent={<RotateCcw className="w-4 h-4" />}
                        className="flex-1 lg:flex-initial"
                      >
                        New
                      </Button>
                      <Button
                        size="lg"
                        color="warning"
                        onPress={() => handleCompress()}
                        isLoading={isCompressing}
                        className="flex-1 lg:flex-initial font-bold"
                        startContent={
                          !isCompressing ? (
                            <FileArchive className="w-4 h-4" />
                          ) : undefined
                        }
                      >
                        {isCompressing ? "Compressing..." : "Compress"}
                      </Button>
                      {result && (
                        <Button
                          size="lg"
                          color="success"
                          onPress={handleDownload}
                          startContent={<Download className="w-4 h-4" />}
                          className="flex-1 lg:flex-initial font-bold"
                        >
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
