import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { createFileRoute } from "@tanstack/react-router";
import { Download, RefreshCw, RotateCcw } from "lucide-react";
import { useState } from "react";
import { ImagePreview } from "@/components/image-preview";
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
        <div
          className={`grid grid-cols-1 gap-6 ${convertedUrl ? "lg:grid-cols-2" : ""}`}
        >
          <div className="space-y-6">
            {!originalFile ? (
              <div className="max-w-2xl mx-auto">
                <ImageUpload onImageSelect={handleImageSelect} />
              </div>
            ) : (
              <>
                <ImagePreview
                  imageUrl={originalUrl}
                  title="Original Image"
                  fileName={originalFile.name}
                  fileSize={originalFile.size}
                  dimensions={dimensions ?? undefined}
                  onRemove={handleReset}
                />

                <Card className="border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight pb-0.5">
                      ⚙️ Conversion Settings
                    </h3>
                  </CardHeader>
                  <CardBody className="space-y-6 p-6">
                    <div className="space-y-2">
                      <Select
                        label="Target Format"
                        labelPlacement="outside"
                        placeholder="Select format"
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
                          <SelectItem key={format.key}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    {supportsQuality && (
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            Quality
                          </span>
                          <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {quality}%
                          </span>
                        </div>
                        <Slider
                          value={quality}
                          onChange={(value) => setQuality(value as number)}
                          minValue={10}
                          maxValue={100}
                          step={5}
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
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <span>Lower size</span>
                          <span>Higher quality</span>
                        </div>
                      </div>
                    )}

                    <Button
                      color="primary"
                      size="lg"
                      onPress={handleConvert}
                      isLoading={isProcessing}
                      className="w-full font-bold text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover-scale-102 transition-all duration-300 overflow-hidden"
                      startContent={
                        !isProcessing ? (
                          <RefreshCw className="w-5 h-5" />
                        ) : undefined
                      }
                    >
                      {isProcessing ? "Converting..." : "Convert Image"}
                    </Button>
                  </CardBody>
                </Card>
              </>
            )}
          </div>

          {convertedUrl && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-full">
                  <span className="text-2xl">✅</span>
                  <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Conversion Complete!
                  </span>
                </div>
              </div>

              <ImagePreview
                imageUrl={convertedUrl}
                title="✨ Converted Image"
                fileName={`converted.${getFileExtension(targetFormat)}`}
                fileSize={convertedBlob?.size}
                dimensions={dimensions ?? undefined}
              />

              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onPress={handleDownload}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold overflow-hidden"
                  startContent={<Download className="w-5 h-5" />}
                >
                  Download Image
                </Button>
                <Button
                  variant="bordered"
                  size="lg"
                  onPress={handleReset}
                  className="font-semibold border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                  startContent={<RotateCcw className="w-5 h-5" />}
                >
                  Convert Another
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/tools/converter")({
  component: ConverterPage,
});
