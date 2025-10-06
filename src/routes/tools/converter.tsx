import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { createFileRoute } from "@tanstack/react-router";
import { Download, RefreshCw, RotateCcw } from "lucide-react";
import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import {
  createBreadcrumbSchema,
  createSoftwareApplicationSchema,
  SEO,
} from "@/components/seo";
import {
  convertImage,
  downloadBlob,
  getFileExtension,
  getImageDimensions,
} from "@/utils/image-processing";

const formats = [
  { key: "image/jpeg", label: "JPEG", extension: "jpg" },
  { key: "image/png", label: "PNG", extension: "png" },
  { key: "image/webp", label: "WebP", extension: "webp" },
];

function ConverterPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [convertedUrl, setConvertedUrl] = useState<string>("");
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("image/jpeg");
  const [quality, setQuality] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelect = async (file: File, imageUrl: string) => {
    setOriginalFile(file);
    setOriginalUrl(imageUrl);
    setConvertedUrl("");
    setConvertedBlob(null);

    try {
      const dims = await getImageDimensions(file);
      setDimensions(dims);
    } catch (error) {
      console.error("Failed to get image dimensions:", error);
    }
  };

  const handleConvert = async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    try {
      const blob = await convertImage(
        originalFile,
        targetFormat,
        quality / 100,
      );
      setConvertedBlob(blob);

      const url = URL.createObjectURL(blob);
      setConvertedUrl(url);
    } catch (error) {
      console.error("Conversion failed:", error);
      alert("Failed to convert image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedBlob || !originalFile) return;

    const extension = getFileExtension(targetFormat);
    const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
    const filename = `${baseName}_converted.${extension}`;

    downloadBlob(convertedBlob, filename);
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl("");
    setConvertedUrl("");
    setConvertedBlob(null);
    setDimensions(null);
  };

  const supportsQuality =
    targetFormat === "image/jpeg" || targetFormat === "image/webp";

  return (
    <section className="py-8 md:py-10 min-h-screen">
      <SEO
        title="Image Converter - Convert Images to JPEG, PNG, WebP | Image Tools"
        description="Free online image converter. Convert images between JPEG, PNG, and WebP formats with customizable quality settings. 100% browser-based, no uploads required."
        keywords="image converter, convert image format, jpeg to png, png to webp, webp converter, image format conversion, online image converter"
        canonicalUrl="https://image-utilities.netlify.app/tools/converter"
        structuredData={{
          ...createSoftwareApplicationSchema(
            "Image Converter",
            "Convert images between JPEG, PNG, and WebP formats with customizable quality settings",
          ),
          ...createBreadcrumbSchema([
            { name: "Home", url: "https://image-utilities.netlify.app/" },
            {
              name: "Image Converter",
              url: "https://image-utilities.netlify.app/tools/converter",
            },
          ]),
        }}
      />
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Header */}
        <div className="text-center mb-12 relative">
          {/* Animated background gradient */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg shadow-blue-500/30 animate-float">
            <RefreshCw className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight pb-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Image Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Transform your images between formats with zero quality loss.
            Professional-grade conversion with customizable settings.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Chip color="primary" variant="flat" size="sm">
              Privacy-first
            </Chip>
            <Chip color="secondary" variant="flat" size="sm">
              JPEG • PNG • WebP
            </Chip>
          </div>
        </div>

        {/* Main Content */}
        {!originalFile ? (
          <div className="max-w-2xl mx-auto">
            <ImageUpload onImageSelect={handleImageSelect} />
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
                        {dimensions
                          ? `${dimensions.width} × ${dimensions.height}`
                          : ""}
                      </Chip>
                    </div>
                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                      <img
                        src={originalUrl}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span className="truncate max-w-[200px]">
                        {originalFile.name}
                      </span>
                      <span className="font-medium">
                        {(originalFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>

                  {/* Converted Image */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {convertedUrl ? "Converted" : "Preview"}
                      </h3>
                      {convertedUrl && convertedBlob && (
                        <Chip size="sm" variant="flat" color="success">
                          {(convertedBlob.size / 1024).toFixed(1)} KB
                        </Chip>
                      )}
                    </div>
                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                      {convertedUrl ? (
                        <img
                          src={convertedUrl}
                          alt="Converted"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <RefreshCw className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">
                              Adjust settings and convert
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {convertedUrl && convertedBlob ? (
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span className="truncate max-w-[200px]">
                          converted.{getFileExtension(targetFormat)}
                        </span>
                        <span
                          className={`font-medium ${
                            convertedBlob.size < originalFile.size
                              ? "text-green-600 dark:text-green-400"
                              : "text-orange-600 dark:text-orange-400"
                          }`}
                        >
                          {convertedBlob.size < originalFile.size ? "↓" : "↑"}{" "}
                          {Math.abs(
                            ((convertedBlob.size - originalFile.size) /
                              originalFile.size) *
                              100,
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    ) : (
                      <div className="h-5" />
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
                      label="Target Format"
                      labelPlacement="outside"
                      size="sm"
                      selectedKeys={[targetFormat]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setTargetFormat(selected);
                      }}
                      classNames={{
                        trigger:
                          "border-2 hover:border-primary transition-colors",
                      }}
                    >
                      {formats.map((format) => (
                        <SelectItem key={format.key}>{format.label}</SelectItem>
                      ))}
                    </Select>
                  </div>

                  {/* Quality Slider */}
                  {supportsQuality && (
                    <div className="flex-1 min-w-[200px]">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Quality
                          </span>
                          <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {quality}%
                          </span>
                        </div>
                        <Slider
                          aria-label="Quality"
                          value={quality}
                          onChange={(value) => setQuality(value as number)}
                          minValue={10}
                          maxValue={100}
                          step={5}
                          size="sm"
                          className="w-full"
                          classNames={{
                            track:
                              "bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900",
                            filler:
                              "bg-gradient-to-r from-blue-500 to-purple-500",
                            thumb:
                              "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 lg:min-w-fit">
                    <Button
                      size="lg"
                      variant="bordered"
                      onPress={handleReset}
                      startContent={<RotateCcw className="w-4 h-4" />}
                      className="flex-1 lg:flex-initial"
                    >
                      New
                    </Button>
                    <Button
                      size="lg"
                      onPress={handleConvert}
                      isLoading={isProcessing}
                      className="flex-1 lg:flex-initial bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:scale-102 transition-all duration-300 font-bold overflow-hidden"
                      startContent={
                        !isProcessing ? (
                          <RefreshCw className="w-4 h-4" />
                        ) : undefined
                      }
                    >
                      {isProcessing ? "Converting..." : "Convert"}
                    </Button>
                    {convertedUrl && (
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
  );
}

export const Route = createFileRoute("/tools/converter")({
  component: ConverterPage,
});
