import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Download, RefreshCw, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import {
  createBreadcrumbSchema,
  createSoftwareApplicationSchema,
  SEO,
} from "@/components/seo";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import {
  convertImage,
  downloadBlob,
  getFileExtension,
  getImageDimensions,
} from "@/utils/image-processing";

const formats = [
  { key: "image/jpeg", label: "JPEG", description: "Best for photos. Lossy compression with quality control." },
  { key: "image/png", label: "PNG", description: "Lossless. Best for graphics, screenshots, and transparency." },
  { key: "image/webp", label: "WebP", description: "Modern format. Smaller files with good quality for the web." },
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
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = async (file: File, imageUrl: string) => {
    setOriginalFile(file);
    setOriginalUrl(imageUrl);
    setConvertedUrl("");
    setConvertedBlob(null);
    setError(null);

    try {
      const dims = await getImageDimensions(file);
      setDimensions(dims);
    } catch (err) {
      console.error("Failed to get image dimensions:", err);
    }
  };

  const handleConvert = async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    setError(null);
    try {
      const blob = await convertImage(
        originalFile,
        targetFormat,
        quality / 100,
      );
      setConvertedBlob(blob);
      const url = URL.createObjectURL(blob);
      setConvertedUrl(url);
    } catch (err) {
      console.error("Conversion failed:", err);
      setError("Conversion failed. The image format may not be supported. Please try a different file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedBlob || !originalFile) return;
    const extension = getFileExtension(targetFormat);
    const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
    downloadBlob(convertedBlob, `${baseName}_converted.${extension}`);
  };

  const handleReset = useCallback(() => {
    setOriginalFile(null);
    setOriginalUrl("");
    setConvertedUrl("");
    setConvertedBlob(null);
    setDimensions(null);
    setError(null);
  }, []);

  const handleConvertCallback = useCallback(() => {
    handleConvert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalFile, targetFormat, quality]);

  const handleDownloadCallback = useCallback(() => {
    handleDownload();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convertedBlob, originalFile, targetFormat]);

  useKeyboardShortcut("Enter", handleConvertCallback, {
    meta: true,
    disabled: !originalFile || isProcessing,
  });
  useKeyboardShortcut("s", handleDownloadCallback, {
    meta: true,
    disabled: !convertedUrl,
  });
  useKeyboardShortcut("n", handleReset, {
    meta: true,
  });

  const supportsQuality =
    targetFormat === "image/jpeg" || targetFormat === "image/webp";

  return (
    <section className="py-8 md:py-10">
      <SEO
        title="Image Converter - Convert Images to JPEG, PNG, WebP | Image Tools"
        description="Free online image converter. Convert images between JPEG, PNG, and WebP formats with customizable quality settings. 100% browser-based, no uploads required."
        keywords="image converter, convert image format, jpeg to png, png to webp, webp converter, image format conversion, online image converter, svg converter, svg to png"
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
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-zinc-900 dark:text-zinc-50">
                Image Converter
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Convert between formats with quality control
              </p>
            </div>
          </div>
        </div>

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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Image Comparison */}
            <Card className="border border-zinc-200 dark:border-zinc-800">
              <CardBody className="p-5">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* Original */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
                        Original
                      </span>
                      <Chip size="sm" variant="flat">
                        {dimensions
                          ? `${dimensions.width} x ${dimensions.height}`
                          : ""}
                      </Chip>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
                      <img
                        src={originalUrl}
                        alt="Original"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="max-w-[200px] truncate">
                        {originalFile.name}
                      </span>
                      <span>{(originalFile.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>

                  {/* Converted */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
                        {convertedUrl ? "Converted" : "Output"}
                      </span>
                      {convertedUrl && convertedBlob && (
                        <Chip size="sm" variant="flat" color="success">
                          {(convertedBlob.size / 1024).toFixed(1)} KB
                        </Chip>
                      )}
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
                      {convertedUrl ? (
                        <img
                          src={convertedUrl}
                          alt="Converted"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-zinc-400">
                          <div className="text-center">
                            <RefreshCw className="mx-auto mb-2 h-8 w-8 opacity-40" />
                            <p className="text-sm">
                              Choose a format and convert
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {convertedUrl && convertedBlob ? (
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span>
                          converted.{getFileExtension(targetFormat)}
                        </span>
                        <span
                          className={
                            convertedBlob.size < originalFile.size
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-600 dark:text-amber-400"
                          }
                        >
                          {convertedBlob.size < originalFile.size ? "\u2193" : "\u2191"}{" "}
                          {Math.abs(
                            ((convertedBlob.size - originalFile.size) /
                              originalFile.size) *
                              100,
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    ) : (
                      <div className="h-4" />
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Success message */}
            {convertedUrl && convertedBlob && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
              >
                <Check className="h-4 w-4" />
                <span>Converted successfully</span>
              </motion.div>
            )}

            {/* Controls */}
            <Card className="border border-zinc-200 dark:border-zinc-800">
              <CardBody className="p-4">
                <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-end">
                  {/* Format */}
                  <div className="min-w-[200px] flex-1">
                    <Select
                      label="Target Format"
                      labelPlacement="outside"
                      size="sm"
                      selectedKeys={[targetFormat]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setTargetFormat(selected);
                      }}
                      description={formats.find((f) => f.key === targetFormat)?.description}
                    >
                      {formats.map((format) => (
                        <SelectItem key={format.key}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  {/* Quality */}
                  {supportsQuality && (
                    <div className="min-w-[200px] flex-1">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-600 dark:text-zinc-400">
                            Quality
                          </span>
                          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
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
                        />
                        <p className="text-[11px] text-zinc-400">
                          {quality >= 90 ? "High quality, larger file" : quality >= 60 ? "Balanced quality and size" : "Smaller file, visible compression"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 lg:min-w-fit">
                    <Button
                      size="lg"
                      variant="bordered"
                      onPress={handleReset}
                      startContent={<RotateCcw className="h-4 w-4" />}
                      className="flex-1 lg:flex-initial"
                    >
                      New
                      <kbd className="ml-1.5 hidden rounded bg-zinc-100 px-1 py-0.5 font-mono text-[10px] text-zinc-400 dark:bg-zinc-800 lg:inline-block">
                        ⌘N
                      </kbd>
                    </Button>
                    <Button
                      size="lg"
                      color="primary"
                      onPress={handleConvert}
                      isLoading={isProcessing}
                      className="flex-1 lg:flex-initial"
                      startContent={
                        !isProcessing ? (
                          <RefreshCw className="h-4 w-4" />
                        ) : undefined
                      }
                    >
                      {isProcessing ? "Converting..." : (
                        <>
                          Convert
                          <kbd className="ml-1.5 hidden rounded bg-zinc-100 px-1 py-0.5 font-mono text-[10px] text-zinc-400 dark:bg-zinc-800 lg:inline-block">
                            ⌘↵
                          </kbd>
                        </>
                      )}
                    </Button>
                    {convertedUrl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Button
                          size="lg"
                          color="success"
                          onPress={handleDownload}
                          startContent={<Download className="h-4 w-4" />}
                          className="flex-1 lg:flex-initial"
                        >
                          Download
                          <kbd className="ml-1.5 hidden rounded bg-zinc-100 px-1 py-0.5 font-mono text-[10px] text-zinc-400 dark:bg-zinc-800 lg:inline-block">
                            ⌘S
                          </kbd>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Inline error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export const Route = createFileRoute("/tools/converter")({
  component: ConverterPage,
});
