import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { Tab, Tabs } from "@heroui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Image as ImageIcon, Palette, Type } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { ImageUpload } from "@/components/image-upload";
import {
  createBreadcrumbSchema,
  createSoftwareApplicationSchema,
  SEO,
} from "@/components/seo";
import { downloadBlob } from "@/utils/image-processing";

interface OGConfig {
  // Canvas
  width: number;
  height: number;

  // Background
  bgType: "solid" | "gradient" | "image";
  bgColor1: string;
  bgColor2: string;
  gradientDirection: "horizontal" | "vertical" | "diagonal";
  bgImage: HTMLImageElement | null;

  // Image
  image: HTMLImageElement | null;
  imagePosition: "left" | "right" | "center" | "none";
  imageSize: number; // percentage

  // Text
  title: string;
  titleSize: number;
  titleColor: string;
  titleFont: string;

  subtitle: string;
  subtitleSize: number;
  subtitleColor: string;

  // Padding
  padding: number;
}

const defaultConfig: OGConfig = {
  width: 1200,
  height: 630,
  bgType: "gradient",
  bgColor1: "#3b82f6",
  bgColor2: "#a855f7",
  gradientDirection: "horizontal",
  bgImage: null,
  image: null,
  imagePosition: "left",
  imageSize: 40,
  title: "Your Awesome Title",
  titleSize: 64,
  titleColor: "#ffffff",
  titleFont: "Inter",
  subtitle: "Add a compelling subtitle here",
  subtitleSize: 32,
  subtitleColor: "#e0e7ff",
  padding: 60,
};

const gradientPresets = [
  { name: "Blue to Purple", color1: "#3b82f6", color2: "#a855f7" },
  { name: "Orange to Pink", color1: "#f97316", color2: "#ec4899" },
  { name: "Green to Teal", color1: "#10b981", color2: "#14b8a6" },
  { name: "Red to Orange", color1: "#ef4444", color2: "#f97316" },
  { name: "Purple to Pink", color1: "#8b5cf6", color2: "#ec4899" },
  { name: "Dark Blue", color1: "#1e3a8a", color2: "#3b82f6" },
];

function OGDesignerPage() {
  const [config, setConfig] = useState<OGConfig>(defaultConfig);
  const [currentTab, setCurrentTab] = useState("background");
  const [prevTab, setPrevTab] = useState("background");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate unique IDs for form inputs
  const bgColorId = useId();
  const gradientColor1Id = useId();
  const gradientColor2Id = useId();
  const titleColorId = useId();
  const subtitleColorId = useId();

  // Helper function to wrap text
  const wrapText = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      text: string,
      maxWidth: number,
    ): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    },
    [],
  );

  const drawBackground = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (config.bgType === "solid") {
        ctx.fillStyle = config.bgColor1;
        ctx.fillRect(0, 0, config.width, config.height);
      } else if (config.bgType === "gradient") {
        let gradient: CanvasGradient;
        if (config.gradientDirection === "horizontal") {
          gradient = ctx.createLinearGradient(0, 0, config.width, 0);
        } else if (config.gradientDirection === "vertical") {
          gradient = ctx.createLinearGradient(0, 0, 0, config.height);
        } else {
          gradient = ctx.createLinearGradient(
            0,
            0,
            config.width,
            config.height,
          );
        }
        gradient.addColorStop(0, config.bgColor1);
        gradient.addColorStop(1, config.bgColor2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, config.width, config.height);
      } else if (config.bgType === "image" && config.bgImage) {
        ctx.drawImage(config.bgImage, 0, 0, config.width, config.height);
      }
    },
    [
      config.bgType,
      config.bgColor1,
      config.bgColor2,
      config.gradientDirection,
      config.width,
      config.height,
      config.bgImage,
    ],
  );

  const drawImage = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!config.image) return;

      const imageSize =
        (config.height - config.padding * 2) * (config.imageSize / 100);
      const scale =
        imageSize / Math.max(config.image.width, config.image.height);
      const scaledWidth = config.image.width * scale;
      const scaledHeight = config.image.height * scale;

      let x = 0;
      const y = (config.height - scaledHeight) / 2;

      if (config.imagePosition === "left") {
        x = config.padding;
      } else if (config.imagePosition === "right") {
        x = config.width - config.padding - scaledWidth;
      } else {
        x = (config.width - scaledWidth) / 2;
      }

      // Draw white rounded background
      const bgPadding = 20;
      const borderRadius = 20;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(
        x - bgPadding,
        y - bgPadding,
        scaledWidth + bgPadding * 2,
        scaledHeight + bgPadding * 2,
        borderRadius,
      );
      ctx.fill();

      // Draw shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;

      // Draw image
      ctx.drawImage(config.image, x, y, scaledWidth, scaledHeight);

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    },
    [
      config.image,
      config.height,
      config.padding,
      config.imageSize,
      config.imagePosition,
      config.width,
    ],
  );

  const drawText = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const imageWidth =
        config.image && config.imagePosition !== "none"
          ? (config.height - config.padding * 2) * (config.imageSize / 100) + 40
          : 0;

      let textX = config.padding;
      let textWidth = config.width - config.padding * 2;

      if (config.imagePosition === "left") {
        textX = config.padding + imageWidth + config.padding;
        textWidth = config.width - textX - config.padding;
      } else if (config.imagePosition === "right") {
        textWidth =
          config.width - config.padding - imageWidth - config.padding * 2;
      }

      // Draw title
      ctx.fillStyle = config.titleColor;
      ctx.font = `bold ${config.titleSize}px ${config.titleFont}, sans-serif`;
      ctx.textBaseline = "top";

      const titleLines = wrapText(ctx, config.title, textWidth);
      const titleHeight = titleLines.length * config.titleSize * 1.2;

      const totalTextHeight = titleHeight + 20 + config.subtitleSize;
      let currentY = (config.height - totalTextHeight) / 2;

      titleLines.forEach((line) => {
        ctx.fillText(line, textX, currentY);
        currentY += config.titleSize * 1.2;
      });

      // Draw subtitle
      currentY += 20;
      ctx.fillStyle = config.subtitleColor;
      ctx.font = `${config.subtitleSize}px ${config.titleFont}, sans-serif`;

      const subtitleLines = wrapText(ctx, config.subtitle, textWidth);
      subtitleLines.forEach((line) => {
        ctx.fillText(line, textX, currentY);
        currentY += config.subtitleSize * 1.2;
      });
    },
    [
      config.image,
      config.imagePosition,
      config.height,
      config.padding,
      config.imageSize,
      config.width,
      config.titleColor,
      config.titleSize,
      config.titleFont,
      config.title,
      config.subtitleSize,
      config.subtitleColor,
      config.subtitle,
      wrapText,
    ],
  );

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = config.width;
    canvas.height = config.height;

    // Draw background
    drawBackground(ctx);

    // Draw image if present
    if (config.image && config.imagePosition !== "none") {
      drawImage(ctx);
    }

    // Draw text
    drawText(ctx);
  }, [config, drawBackground, drawImage, drawText]);

  // Render canvas whenever config changes
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleImageUpload = (file: File) => {
    const img = new Image();
    img.onload = () => {
      setConfig({ ...config, image: img });
    };
    img.src = URL.createObjectURL(file);
  };

  const handleBgImageUpload = (file: File) => {
    const img = new Image();
    img.onload = () => {
      setConfig({ ...config, bgImage: img, bgType: "image" });
    };
    img.src = URL.createObjectURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, "og-image.png");
      }
    }, "image/png");
  };

  const updateConfig = (updates: Partial<OGConfig>) => {
    setConfig({ ...config, ...updates });
  };

  return (
    <section className="min-h-screen py-8 md:py-10">
      <SEO
        title="Free OG Image Designer - Create Custom Open Graph Images | Image Tools"
        description="Free online OG image designer. Design beautiful Open Graph images for social media. Customize backgrounds, add text, images, and gradients. Perfect for Twitter Cards, Facebook, and LinkedIn. 100% browser-based, no uploads required."
        keywords="free og image designer, open graph generator, social media image creator, twitter card designer, facebook image generator, custom og image"
        canonicalUrl="https://image-utilities.netlify.app/tools/og-designer"
        structuredData={{
          ...createSoftwareApplicationSchema(
            "OG Image Designer",
            "Design custom Open Graph images for social media with full control over layout, text, and backgrounds",
          ),
          ...createBreadcrumbSchema([
            { name: "Home", url: "https://image-utilities.netlify.app/" },
            {
              name: "OG Designer",
              url: "https://image-utilities.netlify.app/tools/og-designer",
            },
          ]),
        }}
      />
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero Header */}
        <div className="relative mb-12 text-center">
          <div className="-z-10 absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-500/10 blur-3xl" />
            <div className="absolute top-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-1000" />
          </div>

          <div className="mb-6 inline-flex h-20 w-20 animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/30">
            <Palette className="h-10 w-10 text-white" />
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text pb-2 font-black text-4xl text-transparent leading-tight md:text-5xl dark:from-pink-400 dark:to-purple-400">
            OG Image Designer
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-gray-600 text-lg dark:text-gray-400">
            Design beautiful Open Graph images for social media with full
            control over layout, text, and backgrounds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Chip color="secondary" variant="flat" size="sm">
              Custom Design
            </Chip>
            <Chip color="warning" variant="flat" size="sm">
              Text & Images
            </Chip>
            <Chip color="success" variant="flat" size="sm">
              1200×630
            </Chip>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Canvas Preview */}
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="border-gray-200 border-b bg-gradient-to-r from-pink-50 to-purple-50 dark:border-gray-700 dark:from-pink-950/30 dark:to-purple-950/30">
              <h2 className="font-bold text-xl">Preview</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <canvas
                  ref={canvasRef}
                  className="h-full w-full object-contain"
                />
              </div>
              <Button
                color="primary"
                size="lg"
                className="mt-4 w-full"
                startContent={<Download className="h-5 w-5" />}
                onPress={handleDownload}
              >
                Download OG Image
              </Button>
            </CardBody>
          </Card>

          {/* Controls */}
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="border-gray-200 border-b bg-gradient-to-r from-pink-50 to-purple-50 dark:border-gray-700 dark:from-pink-950/30 dark:to-purple-950/30">
              <h2 className="font-bold text-xl">Design Controls</h2>
            </CardHeader>
            <CardBody className="p-6">
              <Tabs
                selectedKey={currentTab}
                onSelectionChange={(key) => {
                  setPrevTab(currentTab);
                  setCurrentTab(String(key));
                }}
              >
                <Tab
                  key="background"
                  title={
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      <span>Background</span>
                    </div>
                  }
                />
                <Tab
                  key="image"
                  title={
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span>Image</span>
                    </div>
                  }
                />
                <Tab
                  key="text"
                  title={
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      <span>Text</span>
                    </div>
                  }
                />
              </Tabs>

              {/* Animated Tab Content with Two-Layer Crossover */}
              <div className="relative mt-4 min-h-[400px] overflow-hidden">
                <div className="relative">
                  <AnimatePresence initial={false}>
                    {/* Outgoing layer */}
                    {prevTab !== currentTab && (
                      <motion.div
                        key={`out-${prevTab}`}
                        className="absolute inset-0"
                        custom={
                          ["background", "image", "text"].indexOf(currentTab) >=
                          ["background", "image", "text"].indexOf(prevTab)
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
                          x: { type: "spring", stiffness: 300, damping: 25 },
                          opacity: { duration: 0.2 },
                        }}
                      >
                        {prevTab === "background" && (
                          <div className="space-y-4">
                            <Select
                              label="Background Type"
                              selectedKeys={[config.bgType]}
                              onSelectionChange={(keys) =>
                                updateConfig({
                                  bgType: Array.from(keys)[0] as
                                    | "solid"
                                    | "gradient"
                                    | "image",
                                })
                              }
                            >
                              <SelectItem key="solid">Solid Color</SelectItem>
                              <SelectItem key="gradient">Gradient</SelectItem>
                              <SelectItem key="image">Image</SelectItem>
                            </Select>

                            {config.bgType === "solid" && (
                              <div>
                                <label
                                  htmlFor={bgColorId}
                                  className="mb-2 block font-semibold text-sm"
                                >
                                  Color
                                </label>
                                <input
                                  id={bgColorId}
                                  type="color"
                                  value={config.bgColor1}
                                  onChange={(e) =>
                                    updateConfig({ bgColor1: e.target.value })
                                  }
                                  className="h-12 w-full cursor-pointer rounded-lg"
                                />
                              </div>
                            )}

                            {config.bgType === "gradient" && (
                              <>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label
                                      htmlFor={gradientColor1Id}
                                      className="mb-2 block font-semibold text-sm"
                                    >
                                      Color 1
                                    </label>
                                    <input
                                      id={gradientColor1Id}
                                      type="color"
                                      value={config.bgColor1}
                                      onChange={(e) =>
                                        updateConfig({
                                          bgColor1: e.target.value,
                                        })
                                      }
                                      className="h-12 w-full cursor-pointer rounded-lg"
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor={gradientColor2Id}
                                      className="mb-2 block font-semibold text-sm"
                                    >
                                      Color 2
                                    </label>
                                    <input
                                      id={gradientColor2Id}
                                      type="color"
                                      value={config.bgColor2}
                                      onChange={(e) =>
                                        updateConfig({
                                          bgColor2: e.target.value,
                                        })
                                      }
                                      className="h-12 w-full cursor-pointer rounded-lg"
                                    />
                                  </div>
                                </div>

                                <Select
                                  label="Direction"
                                  selectedKeys={[config.gradientDirection]}
                                  onSelectionChange={(keys) =>
                                    updateConfig({
                                      gradientDirection: Array.from(keys)[0] as
                                        | "horizontal"
                                        | "vertical"
                                        | "diagonal",
                                    })
                                  }
                                >
                                  <SelectItem key="horizontal">
                                    Horizontal
                                  </SelectItem>
                                  <SelectItem key="vertical">
                                    Vertical
                                  </SelectItem>
                                  <SelectItem key="diagonal">
                                    Diagonal
                                  </SelectItem>
                                </Select>

                                <div>
                                  <div className="mb-2 block font-semibold text-sm">
                                    Gradient Presets
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                    {gradientPresets.map((preset) => (
                                      <button
                                        key={preset.name}
                                        type="button"
                                        onClick={() =>
                                          updateConfig({
                                            bgColor1: preset.color1,
                                            bgColor2: preset.color2,
                                          })
                                        }
                                        className="h-12 rounded-lg border-2 border-gray-300 transition-colors hover:border-primary dark:border-gray-600"
                                        style={{
                                          background: `linear-gradient(to right, ${preset.color1}, ${preset.color2})`,
                                        }}
                                        title={preset.name}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}

                            {config.bgType === "image" && (
                              <ImageUpload
                                onImageSelect={handleBgImageUpload}
                                acceptedFormats={[
                                  "image/png",
                                  "image/jpeg",
                                  "image/webp",
                                ]}
                              />
                            )}
                          </div>
                        )}
                        {prevTab === "image" && (
                          <div className="space-y-4">
                            {!config.image ? (
                              <ImageUpload
                                onImageSelect={handleImageUpload}
                                acceptedFormats={[
                                  "image/png",
                                  "image/jpeg",
                                  "image/webp",
                                ]}
                              />
                            ) : (
                              <>
                                <Button
                                  color="danger"
                                  variant="flat"
                                  onPress={() => updateConfig({ image: null })}
                                  className="w-full"
                                >
                                  Remove Image
                                </Button>

                                <Select
                                  label="Position"
                                  selectedKeys={[config.imagePosition]}
                                  onSelectionChange={(keys) =>
                                    updateConfig({
                                      imagePosition: Array.from(keys)[0] as
                                        | "left"
                                        | "right"
                                        | "center"
                                        | "none",
                                    })
                                  }
                                >
                                  <SelectItem key="left">Left</SelectItem>
                                  <SelectItem key="right">Right</SelectItem>
                                  <SelectItem key="center">Center</SelectItem>
                                  <SelectItem key="none">None</SelectItem>
                                </Select>

                                <div>
                                  <div className="mb-2 block font-semibold text-sm">
                                    Size: {config.imageSize}%
                                  </div>
                                  <Slider
                                    aria-label="Image size"
                                    value={config.imageSize}
                                    onChange={(value) =>
                                      updateConfig({
                                        imageSize: value as number,
                                      })
                                    }
                                    minValue={20}
                                    maxValue={80}
                                    step={5}
                                    className="w-full"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        )}
                        {prevTab === "text" && (
                          <div className="space-y-4">
                            <Input
                              label="Title"
                              value={config.title}
                              onChange={(e) =>
                                updateConfig({ title: e.target.value })
                              }
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="mb-2 block font-semibold text-sm">
                                  Title Size: {config.titleSize}px
                                </div>
                                <Slider
                                  aria-label="Title size"
                                  value={config.titleSize}
                                  onChange={(value) =>
                                    updateConfig({ titleSize: value as number })
                                  }
                                  minValue={32}
                                  maxValue={96}
                                  step={4}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor={titleColorId}
                                  className="mb-2 block font-semibold text-sm"
                                >
                                  Title Color
                                </label>
                                <input
                                  id={titleColorId}
                                  type="color"
                                  value={config.titleColor}
                                  onChange={(e) =>
                                    updateConfig({ titleColor: e.target.value })
                                  }
                                  className="h-10 w-full cursor-pointer rounded-lg"
                                />
                              </div>
                            </div>

                            <Input
                              label="Subtitle"
                              value={config.subtitle}
                              onChange={(e) =>
                                updateConfig({ subtitle: e.target.value })
                              }
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="mb-2 block font-semibold text-sm">
                                  Subtitle Size: {config.subtitleSize}px
                                </div>
                                <Slider
                                  aria-label="Subtitle size"
                                  value={config.subtitleSize}
                                  onChange={(value) =>
                                    updateConfig({
                                      subtitleSize: value as number,
                                    })
                                  }
                                  minValue={16}
                                  maxValue={48}
                                  step={2}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor={subtitleColorId}
                                  className="mb-2 block font-semibold text-sm"
                                >
                                  Subtitle Color
                                </label>
                                <input
                                  id={subtitleColorId}
                                  type="color"
                                  value={config.subtitleColor}
                                  onChange={(e) =>
                                    updateConfig({
                                      subtitleColor: e.target.value,
                                    })
                                  }
                                  className="h-10 w-full cursor-pointer rounded-lg"
                                />
                              </div>
                            </div>

                            <div>
                              <div className="mb-2 block font-semibold text-sm">
                                Padding: {config.padding}px
                              </div>
                              <Slider
                                aria-label="Padding"
                                value={config.padding}
                                onChange={(value) =>
                                  updateConfig({ padding: value as number })
                                }
                                minValue={20}
                                maxValue={120}
                                step={10}
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Incoming layer (always on top) */}
                  <motion.div
                    key={`in-${currentTab}`}
                    custom={
                      ["background", "image", "text"].indexOf(currentTab) >=
                      ["background", "image", "text"].indexOf(prevTab)
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
                    {currentTab === "background" && (
                      <div className="space-y-4">
                        <Select
                          label="Background Type"
                          selectedKeys={[config.bgType]}
                          onSelectionChange={(keys) =>
                            updateConfig({
                              bgType: Array.from(keys)[0] as
                                | "solid"
                                | "gradient"
                                | "image",
                            })
                          }
                        >
                          <SelectItem key="solid">Solid Color</SelectItem>
                          <SelectItem key="gradient">Gradient</SelectItem>
                          <SelectItem key="image">Image</SelectItem>
                        </Select>

                        {config.bgType === "solid" && (
                          <div>
                            <label
                              htmlFor={bgColorId}
                              className="mb-2 block font-semibold text-sm"
                            >
                              Color
                            </label>
                            <input
                              id={bgColorId}
                              type="color"
                              value={config.bgColor1}
                              onChange={(e) =>
                                updateConfig({ bgColor1: e.target.value })
                              }
                              className="h-12 w-full cursor-pointer rounded-lg border-2 border-gray-300 dark:border-gray-600"
                            />
                          </div>
                        )}

                        {config.bgType === "gradient" && (
                          <>
                            <div>
                              <label
                                htmlFor={gradientColor1Id}
                                className="mb-2 block font-semibold text-sm"
                              >
                                Color 1
                              </label>
                              <input
                                id={gradientColor1Id}
                                type="color"
                                value={config.bgColor1}
                                onChange={(e) =>
                                  updateConfig({ bgColor1: e.target.value })
                                }
                                className="h-12 w-full cursor-pointer rounded-lg border-2 border-gray-300 dark:border-gray-600"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={gradientColor2Id}
                                className="mb-2 block font-semibold text-sm"
                              >
                                Color 2
                              </label>
                              <input
                                id={gradientColor2Id}
                                type="color"
                                value={config.bgColor2}
                                onChange={(e) =>
                                  updateConfig({ bgColor2: e.target.value })
                                }
                                className="h-12 w-full cursor-pointer rounded-lg border-2 border-gray-300 dark:border-gray-600"
                              />
                            </div>

                            <Select
                              label="Direction"
                              selectedKeys={[config.gradientDirection]}
                              onSelectionChange={(keys) =>
                                updateConfig({
                                  gradientDirection: Array.from(keys)[0] as
                                    | "horizontal"
                                    | "vertical"
                                    | "diagonal",
                                })
                              }
                            >
                              <SelectItem key="horizontal">
                                Horizontal
                              </SelectItem>
                              <SelectItem key="vertical">Vertical</SelectItem>
                              <SelectItem key="diagonal">Diagonal</SelectItem>
                            </Select>

                            <div>
                              <div className="mb-2 block font-semibold text-sm">
                                Gradient Presets
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {gradientPresets.map((preset) => (
                                  <button
                                    key={preset.name}
                                    type="button"
                                    onClick={() =>
                                      updateConfig({
                                        bgColor1: preset.color1,
                                        bgColor2: preset.color2,
                                      })
                                    }
                                    className="group relative h-12 overflow-hidden rounded-lg border-2 border-gray-300 transition-all hover:scale-105 hover:border-primary dark:border-gray-600"
                                    style={{
                                      background: `linear-gradient(to right, ${preset.color1}, ${preset.color2})`,
                                    }}
                                  >
                                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 font-medium text-transparent text-xs transition-all group-hover:bg-black/50 group-hover:text-white">
                                      {preset.name}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {config.bgType === "image" && (
                          <ImageUpload
                            onImageSelect={(file) => {
                              const img = new Image();
                              img.onload = () => {
                                updateConfig({ bgImage: img });
                              };
                              img.src = URL.createObjectURL(file);
                            }}
                            acceptedFormats={[
                              "image/png",
                              "image/jpeg",
                              "image/webp",
                            ]}
                          />
                        )}
                      </div>
                    )}
                    {currentTab === "image" && (
                      <div className="space-y-4">
                        <ImageUpload
                          onImageSelect={(file) => {
                            const img = new Image();
                            img.onload = () => {
                              updateConfig({ image: img });
                            };
                            img.src = URL.createObjectURL(file);
                          }}
                          acceptedFormats={[
                            "image/png",
                            "image/jpeg",
                            "image/webp",
                          ]}
                        />

                        {config.image && (
                          <>
                            <Select
                              label="Position"
                              selectedKeys={[config.imagePosition]}
                              onSelectionChange={(keys) =>
                                updateConfig({
                                  imagePosition: Array.from(keys)[0] as
                                    | "left"
                                    | "right"
                                    | "center"
                                    | "none",
                                })
                              }
                            >
                              <SelectItem key="left">Left</SelectItem>
                              <SelectItem key="right">Right</SelectItem>
                              <SelectItem key="center">Center</SelectItem>
                              <SelectItem key="none">None (Hidden)</SelectItem>
                            </Select>

                            <div>
                              <Slider
                                label="Size"
                                value={config.imageSize}
                                onChange={(value) =>
                                  updateConfig({
                                    imageSize: Array.isArray(value)
                                      ? value[0]
                                      : value,
                                  })
                                }
                                minValue={10}
                                maxValue={80}
                                step={5}
                                className="w-full"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {currentTab === "text" && (
                      <div className="space-y-4">
                        <Input
                          label="Title"
                          value={config.title}
                          onChange={(e) =>
                            updateConfig({ title: e.target.value })
                          }
                          placeholder="Your Awesome Title"
                        />

                        <div>
                          <Slider
                            label="Title Size"
                            value={config.titleSize}
                            onChange={(value) =>
                              updateConfig({
                                titleSize: Array.isArray(value)
                                  ? value[0]
                                  : value,
                              })
                            }
                            minValue={24}
                            maxValue={120}
                            step={4}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={titleColorId}
                            className="mb-2 block font-semibold text-sm"
                          >
                            Title Color
                          </label>
                          <input
                            id={titleColorId}
                            type="color"
                            value={config.titleColor}
                            onChange={(e) =>
                              updateConfig({ titleColor: e.target.value })
                            }
                            className="h-12 w-full cursor-pointer rounded-lg border-2 border-gray-300 dark:border-gray-600"
                          />
                        </div>

                        <Input
                          label="Subtitle"
                          value={config.subtitle}
                          onChange={(e) =>
                            updateConfig({ subtitle: e.target.value })
                          }
                          placeholder="Add a compelling subtitle here"
                        />

                        <div>
                          <Slider
                            label="Subtitle Size"
                            value={config.subtitleSize}
                            onChange={(value) =>
                              updateConfig({
                                subtitleSize: Array.isArray(value)
                                  ? value[0]
                                  : value,
                              })
                            }
                            minValue={16}
                            maxValue={64}
                            step={2}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={subtitleColorId}
                            className="mb-2 block font-semibold text-sm"
                          >
                            Subtitle Color
                          </label>
                          <input
                            id={subtitleColorId}
                            type="color"
                            value={config.subtitleColor}
                            onChange={(e) =>
                              updateConfig({ subtitleColor: e.target.value })
                            }
                            className="h-12 w-full cursor-pointer rounded-lg border-2 border-gray-300 dark:border-gray-600"
                          />
                        </div>

                        <div>
                          <Slider
                            label="Padding"
                            value={config.padding}
                            onChange={(value) =>
                              updateConfig({
                                padding: Array.isArray(value)
                                  ? value[0]
                                  : value,
                              })
                            }
                            minValue={20}
                            maxValue={120}
                            step={10}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/tools/og-designer")({
  component: OGDesignerPage,
});
