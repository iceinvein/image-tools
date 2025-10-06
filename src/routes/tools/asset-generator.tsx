import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Tab, Tabs } from "@heroui/tabs";
import { createFileRoute } from "@tanstack/react-router";
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
    <section className="py-8 md:py-10 min-h-screen">
      <SEO
        title="Asset Generator - Generate Web & App Icons | Image Tools"
        description="Generate all required image assets for web and mobile app development from a single 1024x1024 image. Create favicons, PWA icons, iOS app icons, Android icons, and social media images."
        keywords="asset generator, favicon generator, app icon generator, pwa icons, ios app icons, android icons, web development, app development"
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Header */}
        <div className="text-center mb-12 relative">
          {/* Animated background gradient */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 mb-6 shadow-lg shadow-orange-500/30 animate-float">
            <Package className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight pb-2 bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-400 bg-clip-text text-transparent">
            Asset Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
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
          <div className="max-w-2xl mx-auto">
            <ImageUpload
              onImageSelect={handleImageSelect}
              acceptedFormats={["image/png", "image/jpeg", "image/webp"]}
            />
          </div>
        ) : (
          <div
            className={`grid gap-8 mt-8 ${generatedAssets.length > 0 ? "lg:grid-cols-2" : ""}`}
          >
            {/* Pack Selection */}
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/30 dark:to-pink-950/30 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold">Select Asset Pack</h2>
              </CardHeader>
              <CardBody className="p-6">
                <Tabs
                  selectedKey={selectedPack.id}
                  onSelectionChange={(key) => {
                    const pack = ASSET_PACKS.find((p) => p.id === key);
                    if (pack) setSelectedPack(pack);
                  }}
                  classNames={{
                    tabList: "w-full",
                    tab: "flex-1",
                  }}
                >
                  {ASSET_PACKS.map((pack) => (
                    <Tab key={pack.id} title={pack.name}>
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {pack.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                          Generates {pack.sizes.length} images
                          {pack.includeIco && " + 1 ICO file"}
                        </p>
                        {(pack.id === "web" || pack.id === "complete") && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
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
                    </Tab>
                  ))}
                </Tabs>

                <div className="flex gap-3 mt-6">
                  <Button
                    color="primary"
                    size="lg"
                    onPress={handleGenerate}
                    isDisabled={isGenerating}
                    startContent={
                      isGenerating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Package className="w-5 h-5" />
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

            {/* Generated Assets */}
            {generatedAssets.length > 0 && (
              <Card className="border-2 border-green-200 dark:border-green-800">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-b border-green-200 dark:border-green-700 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h2 className="text-xl font-bold">
                      Generated Assets ({generatedAssets.length})
                    </h2>
                  </div>
                  <Button
                    color="success"
                    size="sm"
                    onPress={handleDownloadAll}
                    startContent={<Download className="w-4 h-4" />}
                  >
                    Download All
                  </Button>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedAssets.map((asset) => (
                      <div
                        key={asset.name}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {asset.name}
                            </p>
                            {asset.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
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
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{asset.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export const Route = createFileRoute("/tools/asset-generator")({
  component: AssetGeneratorPage,
});
