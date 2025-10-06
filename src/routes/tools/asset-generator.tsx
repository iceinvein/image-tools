import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Tab, Tabs } from "@heroui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Download, Loader2, Package } from "lucide-react";
import { useState } from "react";

import { ImageUpload } from "@/components/image-upload";
import {
  createBreadcrumbSchema,
  createSoftwareApplicationSchema,
  SEO,
} from "@/components/seo";
import {
  ASSET_PACKS,
  type AssetPack,
  type GeneratedAsset,
  generateAssetPack,
} from "@/utils/asset-generator";
import { downloadBlob } from "@/utils/image-processing";

function AssetGeneratorPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [selectedPack, setSelectedPack] = useState<AssetPack>(ASSET_PACKS[0]);
  const [prevPack, setPrevPack] = useState<AssetPack>(ASSET_PACKS[0]);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleImageSelect = (file: File) => {
    setOriginalFile(file);
    setGeneratedAssets([]);
  };

  const handleGenerate = async () => {
    if (!originalFile) return;

    setIsGenerating(true);
    setGeneratedAssets([]);

    try {
      const assets = await generateAssetPack(
        originalFile,
        selectedPack,
        (current, total) => {
          setProgress({ current, total });
        },
      );

      setGeneratedAssets(assets);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate assets. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (asset: GeneratedAsset) => {
    downloadBlob(asset.blob, asset.name);
  };

  const handleDownloadAll = () => {
    generatedAssets.forEach((asset) => {
      setTimeout(() => downloadBlob(asset.blob, asset.name), 100);
    });
  };

  const handleReset = () => {
    setOriginalFile(null);
    setGeneratedAssets([]);
    setProgress({ current: 0, total: 0 });
  };

  const progressPercent =
    progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <section className="min-h-screen py-8 md:py-10">
      <SEO
        title="Free Asset Generator - Generate Web & App Icons | Image Tools"
        description="Free online asset generator. Generate all required image assets for web and mobile app development from a single 1024x1024 image. Create favicons, PWA icons, iOS app icons, Android icons, and social media images. 100% browser-based, no uploads required."
        keywords="free asset generator, favicon generator, app icon generator, pwa icons, ios app icons, android icons, web development, app development"
        canonicalUrl="https://image-utilities.netlify.app/tools/asset-generator"
        structuredData={{
          ...createSoftwareApplicationSchema(
            "Asset Generator",
            "Generate all required image assets for web and mobile app development",
          ),
          ...createBreadcrumbSchema([
            { name: "Home", url: "https://image-utilities.netlify.app/" },
            {
              name: "Asset Generator",
              url: "https://image-utilities.netlify.app/tools/asset-generator",
            },
          ]),
        }}
      />
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero Header */}
        <div className="relative mb-12 text-center">
          {/* Animated background gradient */}
          <div className="-z-10 absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-orange-500/10 blur-3xl" />
            <div className="absolute top-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-500/10 blur-3xl delay-1000" />
          </div>

          <div className="mb-6 inline-flex h-20 w-20 animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg shadow-orange-500/30">
            <Package className="h-10 w-10 text-white" />
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text pb-2 font-black text-4xl text-transparent leading-tight md:text-5xl dark:from-orange-400 dark:to-pink-400">
            Asset Generator
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-gray-600 text-lg dark:text-gray-400">
            Upload a 1024×1024 image and generate all required assets for web
            and mobile app development in one click.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Chip color="warning" variant="flat" size="sm">
              Web Assets
            </Chip>
            <Chip color="secondary" variant="flat" size="sm">
              iOS & Android
            </Chip>
            <Chip color="success" variant="flat" size="sm">
              One-Stop Shop
            </Chip>
          </div>
        </div>

        {/* Main Content */}
        {!originalFile ? (
          <div className="mx-auto max-w-2xl">
            <ImageUpload
              onImageSelect={handleImageSelect}
              acceptedFormats={["image/png", "image/jpeg", "image/webp"]}
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`mt-8 grid gap-8 ${generatedAssets.length > 0 ? "lg:grid-cols-2" : ""}`}
          >
            {/* Pack Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader className="border-gray-200 border-b bg-gradient-to-r from-orange-50 to-pink-50 dark:border-gray-700 dark:from-orange-950/30 dark:to-pink-950/30">
                  <h2 className="font-bold text-xl">Select Asset Pack</h2>
                </CardHeader>
                <CardBody className="p-6">
                  <Tabs
                    selectedKey={selectedPack.id}
                    onSelectionChange={(key) => {
                      const pack = ASSET_PACKS.find((p) => p.id === key);
                      if (pack) {
                        setPrevPack(selectedPack);
                        setSelectedPack(pack);
                      }
                    }}
                    classNames={{
                      tabList: "w-full",
                      tab: "flex-1",
                    }}
                  >
                    {ASSET_PACKS.map((pack) => (
                      <Tab key={pack.id} title={pack.name} />
                    ))}
                  </Tabs>

                  {/* Animated Tab Content with Two-Layer Crossover */}
                  <div className="relative mt-4 min-h-[120px] overflow-hidden">
                    <div className="relative">
                      <AnimatePresence initial={false}>
                        {/* Outgoing layer */}
                        {prevPack.id !== selectedPack.id && (
                          <motion.div
                            key={`out-${prevPack.id}`}
                            className="absolute inset-0"
                            custom={
                              ASSET_PACKS.findIndex(
                                (p) => p.id === selectedPack.id,
                              ) >=
                              ASSET_PACKS.findIndex((p) => p.id === prevPack.id)
                                ? 1
                                : -1
                            }
                            variants={{
                              initial: { x: 0, opacity: 1 },
                              animate: (direction: number) => ({
                                x: -200 * direction,
                                opacity: 0,
                              }),
                            }}
                            initial="initial"
                            animate="animate"
                            transition={{
                              x: {
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                              },
                              opacity: { duration: 0.2 },
                            }}
                          >
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                              <p className="mb-3 text-gray-600 text-sm dark:text-gray-300">
                                {prevPack.description}
                              </p>
                              <p className="mb-3 text-gray-500 text-xs dark:text-gray-400">
                                Generates {prevPack.sizes.length} images
                                {prevPack.includeIco && " + 1 ICO file"}
                              </p>
                              {(prevPack.id === "web" ||
                                prevPack.id === "complete") && (
                                <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
                                  <p className="text-gray-600 text-xs dark:text-gray-400">
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                                      Note:
                                    </span>{" "}
                                    Social media images (Open Graph, Twitter
                                    Card) will feature your icon on the left
                                    with a blue-to-purple gradient background,
                                    creating a professional card design.
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Incoming layer (always on top) */}
                      <motion.div
                        key={`in-${selectedPack.id}`}
                        custom={
                          ASSET_PACKS.findIndex(
                            (p) => p.id === selectedPack.id,
                          ) >=
                          ASSET_PACKS.findIndex((p) => p.id === prevPack.id)
                            ? 1
                            : -1
                        }
                        variants={{
                          initial: (direction: number) => ({
                            x: 200 * direction,
                            opacity: 0,
                          }),
                          animate: { x: 0, opacity: 1 },
                        }}
                        initial="initial"
                        animate="animate"
                        transition={{
                          x: { type: "spring", stiffness: 300, damping: 20 },
                          opacity: { duration: 0.25 },
                        }}
                      >
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                          <p className="mb-3 text-gray-600 text-sm dark:text-gray-300">
                            {selectedPack.description}
                          </p>
                          <p className="mb-3 text-gray-500 text-xs dark:text-gray-400">
                            Generates {selectedPack.sizes.length} images
                            {selectedPack.includeIco && " + 1 ICO file"}
                          </p>
                          {(selectedPack.id === "web" ||
                            selectedPack.id === "complete") && (
                            <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
                              <p className="text-gray-600 text-xs dark:text-gray-400">
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                  Note:
                                </span>{" "}
                                Social media images (Open Graph, Twitter Card)
                                will feature your icon on the left with a
                                blue-to-purple gradient background, creating a
                                professional card design.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button
                      color="primary"
                      size="lg"
                      onPress={handleGenerate}
                      isDisabled={isGenerating}
                      startContent={
                        isGenerating ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Package className="h-5 w-5" />
                        )
                      }
                      className="flex-1"
                    >
                      {isGenerating ? "Generating..." : "Generate Assets"}
                    </Button>
                    <Button
                      color="default"
                      variant="bordered"
                      size="lg"
                      onPress={handleReset}
                    >
                      Reset
                    </Button>
                  </div>

                  {isGenerating && (
                    <div className="mt-4">
                      <Progress
                        value={progressPercent}
                        className="w-full"
                        color="primary"
                        label={`Generating ${progress.current} of ${progress.total}...`}
                        showValueLabel
                        classNames={{
                          track: "bg-gray-200 dark:bg-gray-700",
                          indicator:
                            "bg-gradient-to-r from-blue-500 to-purple-500",
                        }}
                      />
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.div>

            {/* Generated Assets */}
            {generatedAssets.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card className="border-2 border-green-200 dark:border-green-800">
                  <CardHeader className="flex items-center justify-between border-green-200 border-b bg-gradient-to-r from-green-50 to-emerald-50 dark:border-green-700 dark:from-green-950/30 dark:to-emerald-950/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h2 className="font-bold text-xl">
                        Generated Assets ({generatedAssets.length})
                      </h2>
                    </div>
                    <Button
                      color="success"
                      size="sm"
                      onPress={handleDownloadAll}
                      startContent={<Download className="h-4 w-4" />}
                    >
                      Download All
                    </Button>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {generatedAssets.map((asset, index) => (
                        <motion.div
                          key={asset.name}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05,
                            ease: "easeOut",
                          }}
                          className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-primary dark:border-gray-700"
                        >
                          <div className="mb-2 flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold text-sm">
                                {asset.name}
                              </p>
                              {asset.description && (
                                <p className="text-gray-500 text-xs dark:text-gray-400">
                                  {asset.description}
                                </p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              isIconOnly
                              onPress={() => handleDownload(asset)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between text-gray-500 text-xs dark:text-gray-400">
                            <span>{asset.size}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export const Route = createFileRoute("/tools/asset-generator")({
  component: AssetGeneratorPage,
});
