import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, Eraser, Info, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
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

  const handleImageSelect = async (file: File, imageUrl: string) => {
    setOriginalFile(file);
    setOriginalUrl(imageUrl);
    setResult(null);
    setError(null);
    setProgress(null);
  };

  const handleRemoveBackground = async (file?: File) => {
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
  };

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

  return (
    <>
      <SEO
        title="Background Remover - Remove Image Background Online"
        description="Remove image backgrounds automatically with AI. Free browser-based background removal tool. No upload required, works offline."
        canonicalUrl="https://image-utilities.netlify.app/tools/background-remover"
      />
      <section className="min-h-screen py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4">
          {/* Hero Header */}
          <div className="relative mb-12 text-center">
            {/* Animated background gradient */}
            <div className="-z-10 absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
              <div className="absolute top-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-500/10 blur-3xl delay-1000" />
            </div>

            <div className="mb-6 inline-flex h-20 w-20 animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30">
              <Eraser className="h-10 w-10 text-white" />
            </div>

            <h1 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text pb-2 font-black text-4xl text-transparent leading-tight md:text-5xl dark:from-purple-400 dark:to-pink-400">
              Background Remover
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-gray-600 text-lg dark:text-gray-400">
              Remove image backgrounds automatically with AI. Runs entirely in
              your browser for complete privacy.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Chip
                color="secondary"
                variant="flat"
                size="sm"
                startContent={<Sparkles className="h-3 w-3" />}
              >
                AI-Powered
              </Chip>
              <Chip color="success" variant="flat" size="sm">
                100% Private
              </Chip>
              <Chip color="default" variant="flat" size="sm">
                No Upload
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
                            With Background
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

                      {/* Result Image */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-700 text-sm dark:text-gray-300">
                            {result ? "Result" : "Preview"}
                          </h3>
                          {result && (
                            <Chip size="sm" variant="flat" color="success">
                              Background Removed
                            </Chip>
                          )}
                        </div>
                        <div
                          className="relative aspect-video overflow-hidden rounded-lg border-2 border-gray-300 border-dashed dark:border-gray-600"
                          style={
                            result
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
                            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800">
                              <div className="text-center">
                                <Sparkles className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                <p className="text-sm">
                                  Click remove to process
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              {/* Processing Progress */}
              {isProcessing && progress && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Card className="border-2 border-purple-200 dark:border-purple-800">
                    <CardBody className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Sparkles className="h-5 w-5 animate-pulse text-purple-500" />
                          <span className="font-semibold text-gray-900 text-sm dark:text-gray-100">
                            {progress.message}
                          </span>
                        </div>
                        <Progress
                          value={progress.progress}
                          color="secondary"
                          size="sm"
                          className="max-w-full"
                        />
                        <p className="text-gray-600 text-xs dark:text-gray-400">
                          This may take a few moments on first use while the AI
                          model loads...
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <Card className="border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
                  <CardBody className="p-3">
                    <p className="font-medium text-red-600 text-sm dark:text-red-400">
                      {error}
                    </p>
                  </CardBody>
                </Card>
              )}

              {/* Advanced Settings */}
              {originalFile && (
                <SettingsComponent
                  settings={settings}
                  onSettingsChange={setSettings}
                  isProcessing={isProcessing}
                />
              )}

              {/* Compact Action Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Card className="border-2 border-gray-200 dark:border-gray-700">
                  <CardBody className="p-4">
                    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                      <div className="flex-1 text-gray-600 text-sm dark:text-gray-400">
                        {!result && !isProcessing && (
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 flex-shrink-0 text-blue-500" />
                            <span>AI model (~50MB) downloads on first use</span>
                          </div>
                        )}
                        {result && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="font-medium text-green-600 dark:text-green-400"
                          >
                            ✓ Background removed successfully
                          </motion.span>
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
                          color="secondary"
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
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: "easeOut",
                            }}
                            className="flex-1 sm:flex-initial"
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
