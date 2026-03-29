import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, Eraser, Info, RotateCcw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackgroundRemovalSettings as SettingsComponent } from "@/components/BackgroundRemovalSettings";
import { ImageUpload } from "@/components/image-upload";
import { SEO } from "@/components/seo";
import {
  type BackgroundRemovalSettings,
  defaultSettings,
  downloadBlob,
  getFileExtension,
  getFileNameWithoutExtension,
  type RemovalProgress,
  type RemovalResult,
  removeBg,
} from "@/utils/background-remover";

export const Route = createFileRoute("/tools/background-remover")({
  component: BackgroundRemoverPage,
});

function BackgroundRemoverPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [result, setResult] = useState<RemovalResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<RemovalProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] =
    useState<BackgroundRemovalSettings>(defaultSettings);
  const prevOutputTypeRef = useRef<string>(defaultSettings.outputType);

  const handleImageSelect = async (file: File, imageUrl: string) => {
    setOriginalFile(file);
    setOriginalUrl(imageUrl);
    setResult(null);
    setError(null);
    setProgress(null);
  };

  const handleRemoveBackground = useCallback(
    async (file?: File) => {
      const fileToProcess = file || originalFile;
      if (!fileToProcess) return;

      setIsProcessing(true);
      setError(null);
      setProgress({
        stage: "loading",
        progress: 0,
        message: "Initializing...",
      });

      try {
        const removed = await removeBg(
          fileToProcess,
          settings,
          (prog: RemovalProgress) => {
            setProgress(prog);
          },
        );
        setResult(removed);
      } catch (err) {
        console.error("Background removal failed:", err);
        setError(
          err instanceof Error ? err.message : "Failed to remove background",
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [originalFile, settings],
  );

  const handleDownload = () => {
    if (!result || !originalFile) return;

    const baseName = getFileNameWithoutExtension(originalFile.name);
    const extension = getFileExtension(settings.outputFormat);
    const suffix =
      settings.outputType === "foreground"
        ? "no-bg"
        : settings.outputType === "background"
          ? "bg-only"
          : "mask";
    downloadBlob(result.blob, `${baseName}-${suffix}.${extension}`);
  };

  // Auto re-process when output type changes (if we already have a result)
  useEffect(() => {
    if (
      prevOutputTypeRef.current !== settings.outputType &&
      result &&
      originalFile &&
      !isProcessing
    ) {
      prevOutputTypeRef.current = settings.outputType;
      handleRemoveBackground();
    }
  }, [
    settings.outputType,
    result,
    originalFile,
    isProcessing,
    handleRemoveBackground,
  ]);

  return (
    <>
      <SEO
        title="Background Remover - Remove Image Background Online"
        description="Remove image backgrounds automatically with AI. Free browser-based background removal tool. No upload required, works offline."
        canonicalUrl="https://image-utilities.netlify.app/tools/background-remover"
      />
      <section className="py-8 md:py-10">
        <div className="">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                <Eraser className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-zinc-900 dark:text-zinc-50">
                  Background Remover
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Remove image backgrounds automatically with AI, entirely in your browser
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {!originalFile ? (
            <div>
              <ImageUpload
                onImageSelect={handleImageSelect}
                acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Comparison */}
              <Card className="border border-zinc-200 dark:border-zinc-800">
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Original Image */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">
                          Original
                        </h3>
                        <Chip size="sm" variant="flat" color="default">
                          With Background
                        </Chip>
                      </div>
                      <div className="relative aspect-video overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                        <img
                          src={originalUrl}
                          alt="Original"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Result Image */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">
                          {result ? "Result" : "Preview"}
                        </h3>
                        {result && (
                          <Chip size="sm" variant="flat" color="success">
                            {settings.outputType === "foreground"
                              ? "Background Removed"
                              : settings.outputType === "background"
                                ? "Background Only"
                                : "B&W Mask"}
                          </Chip>
                        )}
                      </div>
                      <div
                        className="relative aspect-video overflow-hidden rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700"
                        style={
                          result && settings.outputType !== "mask"
                            ? {
                                backgroundImage: `
                                linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                                linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                                linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                                linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
                              `,
                                backgroundSize: "20px 20px",
                                backgroundPosition:
                                  "0 0, 0 10px, 10px -10px, -10px 0px",
                              }
                            : result && settings.outputType === "mask"
                              ? {
                                  backgroundColor: "#ffffff",
                                }
                              : undefined
                        }
                      >
                        {result ? (
                          <motion.img
                            key={result.url}
                            src={result.url}
                            alt="Result"
                            className="h-full w-full object-contain"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-zinc-400 dark:bg-zinc-900">
                            <div className="text-center">
                              <Sparkles className="mx-auto mb-2 h-12 w-12 opacity-50" />
                              <p className="text-sm">Click remove to process</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Processing Progress */}
              {isProcessing && progress && (
                <Card className="border border-zinc-200 dark:border-zinc-800">
                  <CardBody className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                          {progress.message}
                        </span>
                      </div>
                      <Progress
                        value={progress.progress}
                        color="primary"
                        size="sm"
                        className="max-w-full"
                      />
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        This may take a few moments on first use while the AI
                        model loads...
                      </p>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
                  <p className="font-medium text-red-600 text-sm dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* Advanced Settings */}
              {originalFile && (
                <SettingsComponent
                  settings={settings}
                  onSettingsChange={setSettings}
                  isProcessing={isProcessing}
                />
              )}

              {/* Action Bar */}
              <Card className="border border-zinc-200 dark:border-zinc-800">
                <CardBody className="p-4">
                  <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                    <div className="flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {!result && !isProcessing && (
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 flex-shrink-0 text-blue-500" />
                          <span>AI model (~50MB) downloads on first use</span>
                        </div>
                      )}
                      {result && (
                        <span className="font-medium text-green-600 dark:text-green-400">
                          Background removed successfully
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="lg"
                        variant="bordered"
                        onPress={() => {
                          setOriginalFile(null);
                          setOriginalUrl("");
                          setResult(null);
                          setError(null);
                          setProgress(null);
                        }}
                        startContent={<RotateCcw className="h-4 w-4" />}
                        className="flex-1 sm:flex-initial"
                      >
                        New
                      </Button>
                      <Button
                        size="lg"
                        color="primary"
                        onPress={() => handleRemoveBackground()}
                        isDisabled={isProcessing}
                        isLoading={isProcessing}
                        className="flex-1 font-bold sm:flex-initial"
                        startContent={
                          !isProcessing ? (
                            <Sparkles className="h-4 w-4" />
                          ) : undefined
                        }
                      >
                        {isProcessing ? "Processing..." : "Remove BG"}
                      </Button>
                      {result && (
                        <Button
                          size="lg"
                          color="success"
                          onPress={handleDownload}
                          startContent={<Download className="h-4 w-4" />}
                          className="flex-1 font-bold sm:flex-initial"
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
