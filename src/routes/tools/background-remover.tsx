import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Eraser, Info, Sparkles } from "lucide-react";
import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { SEO } from "@/components/seo";
import {
  downloadBlob,
  getFileNameWithoutExtension,
  getFileExtension,
  type RemovalProgress,
  type RemovalResult,
  type BackgroundRemovalSettings,
  removeBg,
  defaultSettings,
} from "@/utils/background-remover";
import { BackgroundRemovalSettings as SettingsComponent } from "@/components/BackgroundRemovalSettings";

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
  const [settings, setSettings] = useState<BackgroundRemovalSettings>(defaultSettings);

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
      const removed = await removeBg(fileToProcess, settings, (prog: RemovalProgress) => {
        setProgress(prog);
      });
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
    const suffix = settings.outputType === 'foreground' ? 'no-bg' :
                   settings.outputType === 'background' ? 'bg-only' : 'mask';
    downloadBlob(result.blob, `${baseName}-${suffix}.${extension}`);
  };

  return (
    <>
      <SEO
        title="Background Remover - Remove Image Background Online"
        description="Remove image backgrounds automatically with AI. Free browser-based background removal tool. No upload required, works offline."
        canonicalUrl="https://image-utilities.netlify.app/tools/background-remover"
      />
      <section className="py-8 md:py-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Header */}
          <div className="text-center mb-12 relative">
            {/* Animated background gradient */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-6 shadow-lg shadow-purple-500/30 animate-float">
              <Eraser className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight pb-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Background Remover
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
              Remove image backgrounds automatically with AI. Runs entirely in
              your browser for complete privacy.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Chip
                color="secondary"
                variant="flat"
                size="sm"
                startContent={<Sparkles className="w-3 h-3" />}
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
          <div
            className={`grid grid-cols-1 gap-6 ${result ? "lg:grid-cols-2" : ""}`}
          >
            {/* Left Column - Upload & Original */}
            <div className="space-y-6">
              {!originalFile ? (
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
                />
              ) : (
                <Card className="border-2 border-gray-200 dark:border-gray-700">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-b border-gray-200 dark:border-gray-700">
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
                    <div className="flex gap-3">
                      <Button
                        color="primary"
                        size="md"
                        onPress={() => handleRemoveBackground()}
                        isDisabled={isProcessing}
                        isLoading={isProcessing}
                        className="flex-1"
                      >
                        {isProcessing ? "Removing Background..." : "Remove Background"}
                      </Button>
                      <Button
                        size="md"
                        variant="flat"
                        onPress={() => {
                          setOriginalFile(null);
                          setOriginalUrl("");
                          setResult(null);
                          setError(null);
                          setProgress(null);
                        }}
                      >
                        Change Image
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Processing Progress */}
              {isProcessing && progress && (
                <Card className="border-2 border-purple-200 dark:border-purple-800">
                  <CardBody className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {progress.message}
                        </span>
                      </div>
                      <Progress
                        value={progress.progress}
                        color="secondary"
                        size="md"
                        className="max-w-full"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        This may take a few moments on first use while the AI
                        model loads...
                      </p>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Error Message */}
              {error && (
                <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                  <CardBody className="p-4">
                    <p className="text-red-600 dark:text-red-400 font-medium">
                      {error}
                    </p>
                  </CardBody>
                </Card>
              )}

              {/* Info Card */}
              {!isProcessing && !result && originalFile && (
                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardBody className="p-4">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Ready to remove background
                        </p>
                        <p>
                          Click "Remove Background" to start processing. The AI model (~50MB) will be downloaded on first use and cached for faster subsequent processing.
                        </p>
                      </div>
                    </div>
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
            </div>

            {/* Right Column - Result */}
            {result && (
              <div className="space-y-6">
                <Card className="border-2 border-gray-200 dark:border-gray-700">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold">Background Removed</h3>
                  </CardHeader>
                  <CardBody className="p-6">
                    {/* Checkered background to show transparency */}
                    <div
                      className="relative aspect-video rounded-lg overflow-hidden mb-4"
                      style={{
                        backgroundImage: `
                          linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                          linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                          linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                          linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
                        `,
                        backgroundSize: "20px 20px",
                        backgroundPosition:
                          "0 0, 0 10px, 10px -10px, -10px 0px",
                      }}
                    >
                      <img
                        src={result.url}
                        alt="Background removed"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">Dimensions</span>
                        <span className="text-sm font-bold">
                          {result.width} × {result.height}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <span className="text-sm font-medium">Format</span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          PNG (Transparent)
                        </span>
                      </div>

                      <Button
                        color="success"
                        size="lg"
                        className="w-full font-bold"
                        startContent={<Download className="w-5 h-5" />}
                        onPress={handleDownload}
                      >
                        Download PNG
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                {/* Tips Card */}
                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardBody className="p-4">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Tips for best results
                        </p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>Use images with clear subject separation</li>
                          <li>Good lighting helps the AI detect edges</li>
                          <li>Works best with people, products, and objects</li>
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
