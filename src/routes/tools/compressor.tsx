import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Check,
  Download,
  FileArchive,
  RotateCcw,
} from "lucide-react";
import { useCallback, useId, useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { SEO } from "@/components/seo";
import { Shortcut } from "@/components/shortcut";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
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
  const outputFormatId = useId();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [format, setFormat] =
    useState<CompressionOptions["format"]>("image/jpeg");
  const [quality, setQuality] = useState(85);
  const [resizeEnabled] = useState(false);
  const [maxWidth] = useState(1920);
  const [maxHeight] = useState(1080);

  const handleCompress = useCallback(
    async (file?: File) => {
      const fileToCompress = file || originalFile;
      if (!fileToCompress) return;

      setIsCompressing(true);
      setError(null);
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
      } catch (err) {
        console.error("Compression failed:", err);
        setError(
          "Compression failed. Please try a different format or quality setting.",
        );
      } finally {
        setIsCompressing(false);
      }
    },
    [format, maxHeight, maxWidth, originalFile, quality, resizeEnabled],
  );

  const handleImageSelect = useCallback(
    (file: File, imageUrl: string) => {
      setOriginalFile(file);
      setOriginalUrl(imageUrl);
      setResult(null);
      setError(null);
      void handleCompress(file);
    },
    [handleCompress],
  );

  const handleDownload = useCallback(() => {
    if (!result || !originalFile) return;
    const link = document.createElement("a");
    link.href = result.url;
    const extension = getFileExtension(format);
    const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
    link.download = `${baseName}-compressed.${extension}`;
    link.click();
  }, [format, originalFile, result]);

  const handleFormatChange = (value: string) => {
    const newFormat = value as CompressionOptions["format"];
    setFormat(newFormat);
    setQuality(Math.round(getRecommendedQuality(newFormat) * 100));
  };

  const handleReset = useCallback(() => {
    setOriginalFile(null);
    setOriginalUrl("");
    setResult(null);
    setError(null);
  }, []);

  const handleCompressShortcut = useCallback(() => {
    void handleCompress();
  }, [handleCompress]);

  useKeyboardShortcut("Enter", handleCompressShortcut, {
    meta: true,
    disabled: !originalFile || isCompressing,
  });
  useKeyboardShortcut("s", handleDownload, {
    meta: true,
    disabled: !result,
  });
  useKeyboardShortcut("n", handleReset, {
    meta: true,
  });

  return (
    <>
      <SEO
        title="Image Compressor - Reduce File Size Online"
        description="Compress images online with quality control. Reduce JPEG, PNG, and WebP file sizes while maintaining visual quality. Free browser-based image compression tool."
        canonicalUrl="https://image-utilities.netlify.app/tools/compressor"
      />
      <section className="py-8 md:py-10">
        <div className="">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                <FileArchive className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-zinc-900 dark:text-zinc-50">
                  Image Compressor
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Reduce file sizes while preserving visual quality
                </p>
              </div>
            </div>
          </div>

          {!originalFile ? (
            <div>
              <ImageUpload
                onImageSelect={handleImageSelect}
                acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
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
                          {formatFileSize(originalFile.size)}
                        </Chip>
                      </div>
                      <div className="relative aspect-video overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
                        <img
                          src={originalUrl}
                          alt="Original"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Compressed */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
                          {result ? "Compressed" : "Output"}
                        </span>
                        {result && (
                          <Chip size="sm" variant="flat" color="success">
                            {formatFileSize(result.compressedSize)}
                          </Chip>
                        )}
                      </div>
                      <div className="relative aspect-video overflow-hidden rounded-lg border border-zinc-300 border-dashed bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
                        {result ? (
                          <img
                            src={result.url}
                            alt="Compressed"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-zinc-400">
                            <div className="text-center">
                              <FileArchive className="mx-auto mb-2 h-8 w-8 opacity-40" />
                              <p className="text-sm">Auto-compressing...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {result && (
                        <div className="flex justify-center">
                          <Chip
                            size="sm"
                            variant="flat"
                            color="success"
                            startContent={<ArrowDown className="h-3 w-3" />}
                          >
                            Saved {result.compressionRatio.toFixed(1)}%
                          </Chip>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Success message */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 text-emerald-600 text-sm dark:text-emerald-400"
                >
                  <Check className="h-4 w-4" />
                  <span>
                    Compressed, saved {result.compressionRatio.toFixed(1)}%
                  </span>
                </motion.div>
              )}

              {/* Controls */}
              <Card className="border border-zinc-200 dark:border-zinc-800">
                <CardBody className="p-4">
                  <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:flex-wrap lg:items-end">
                    {/* Format */}
                    <div className="min-w-[200px] flex-1">
                      <div className="space-y-2">
                        <label
                          htmlFor={outputFormatId}
                          className="block font-medium text-sm text-zinc-700 dark:text-zinc-300"
                        >
                          Output Format
                        </label>
                        <Select
                          id={outputFormatId}
                          size="sm"
                          selectedKeys={[format]}
                          onChange={(e) => handleFormatChange(e.target.value)}
                          description={
                            format === "image/jpeg"
                              ? "Best compression for photos"
                              : format === "image/webp"
                                ? "Modern format, smallest files"
                                : "Lossless, larger files"
                          }
                        >
                          <SelectItem key="image/jpeg">JPEG</SelectItem>
                          <SelectItem key="image/webp">WebP</SelectItem>
                          <SelectItem key="image/png">PNG</SelectItem>
                        </Select>
                      </div>
                    </div>

                    {/* Quality */}
                    {format !== "image/png" && (
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
                            minValue={1}
                            maxValue={100}
                            step={1}
                            size="sm"
                            className="w-full"
                          />
                          <p className="text-[11px] text-zinc-400">
                            {quality >= 85
                              ? "High quality, moderate compression"
                              : quality >= 50
                                ? "Good balance of quality and size"
                                : "Maximum compression, quality may degrade"}
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
                        <Shortcut keys={["⌘", "N"]} />
                      </Button>
                      <Button
                        size="lg"
                        color="primary"
                        onPress={() => handleCompress()}
                        isLoading={isCompressing}
                        className="flex-1 lg:flex-initial"
                        startContent={
                          !isCompressing ? (
                            <FileArchive className="h-4 w-4" />
                          ) : undefined
                        }
                      >
                        {isCompressing ? (
                          "Compressing..."
                        ) : (
                          <>
                            Compress
                            <Shortcut keys={["⌘", "↵"]} />
                          </>
                        )}
                      </Button>
                      {result && (
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
                            <Shortcut keys={["⌘", "S"]} />
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
