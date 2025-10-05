import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { Tab, Tabs } from "@heroui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Image as ImageIcon, Smartphone, Type } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { ImageUpload } from "@/components/image-upload";
import {
  createBreadcrumbSchema,
  createSoftwareApplicationSchema,
  SEO,
} from "@/components/seo";

export const Route = createFileRoute("/tools/playstore-designer")({
  component: PlayStoreDesigner,
});

interface PlayStoreConfig {
  width: number;
  height: number;
  bgType: "solid" | "gradient" | "image";
  bgColor1: string;
  bgColor2: string;
  gradientDirection: "horizontal" | "vertical" | "diagonal";
  bgImage: HTMLImageElement | null;
  image: HTMLImageElement | null;
  imagePosition: "left" | "right" | "center" | "none";
  imageSize: number;
  title: string;
  titleSize: number;
  titleColor: string;
  subtitle: string;
  subtitleSize: number;
  subtitleColor: string;
  padding: number;
  titleFont: string;
}

const defaultConfig: PlayStoreConfig = {
  width: 1024,
  height: 500,
  bgType: "gradient",
  bgColor1: "#3b82f6",
  bgColor2: "#a855f7",
  gradientDirection: "horizontal",
  bgImage: null,
  image: null,
  imagePosition: "left",
  imageSize: 60,
  title: "Your App Name",
  titleSize: 56,
  titleColor: "#ffffff",
  subtitle: "Tagline or key feature",
  subtitleSize: 28,
  subtitleColor: "#e9d5ff",
  padding: 60,
  titleFont: "Arial",
};

const gradientPresets = [
  { name: "Blue Purple", color1: "#3b82f6", color2: "#a855f7" },
  { name: "Orange Pink", color1: "#f97316", color2: "#ec4899" },
  { name: "Green Teal", color1: "#10b981", color2: "#06b6d4" },
  { name: "Red Orange", color1: "#ef4444", color2: "#f97316" },
  { name: "Purple Pink", color1: "#a855f7", color2: "#ec4899" },
  { name: "Dark Blue", color1: "#1e3a8a", color2: "#3b82f6" },
];

function PlayStoreDesigner() {
  const [config, setConfig] = useState<PlayStoreConfig>(defaultConfig);
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

  const handleImageUpload = (_file: File, imageUrl: string) => {
    const img = new Image();
    img.onload = () => {
      setConfig({ ...config, image: img });
    };
    img.src = imageUrl;
  };

  const handleBgImageUpload = (_file: File, imageUrl: string) => {
    const img = new Image();
    img.onload = () => {
      setConfig({ ...config, bgImage: img });
    };
    img.src = imageUrl;
  };

  const updateConfig = (updates: Partial<PlayStoreConfig>) => {
    setConfig({ ...config, ...updates });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "playstore-feature-graphic.png";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <section className="py-8 md:py-10 min-h-screen">
      <SEO
        title="Play Store Feature Graphic Designer - Create Promotional Images"
        description="Design professional Play Store feature graphics (1024×500) with custom backgrounds, images, and text. Perfect for app store listings."
        keywords="play store designer, feature graphic, promotional image, app store graphics, android app marketing"
        canonicalUrl="https://image-utilities.netlify.app/tools/playstore-designer"
        structuredData={[
          createSoftwareApplicationSchema(
            "Play Store Feature Graphic Designer",
            "Design professional Play Store feature graphics with custom backgrounds and text",
          ),
          createBreadcrumbSchema([
            { name: "Home", url: "https://image-utilities.netlify.app/" },
            {
              name: "Play Store Designer",
              url: "https://image-utilities.netlify.app/tools/playstore-designer",
            },
          ]),
        ]}
      />

      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Header */}
        <div className="text-center mb-12 relative">
          {/* Animated background gradient */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 mb-6 shadow-lg shadow-green-500/30 animate-float">
            <Smartphone className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight pb-2 bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
            Play Store Designer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Design professional Google Play Store feature graphics with custom
            backgrounds, images, and text.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Chip color="success" variant="flat" size="sm">
              Feature Graphic
            </Chip>
            <Chip color="warning" variant="flat" size="sm">
              Text & Images
            </Chip>
            <Chip color="secondary" variant="flat" size="sm">
              1024×500
            </Chip>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Canvas Preview */}
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">Preview</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="relative w-full aspect-[1024/500] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <Chip size="sm" variant="flat">
                  1024 × 500 px
                </Chip>
                <Button
                  color="success"
                  size="lg"
                  startContent={<Download className="w-5 h-5" />}
                  onPress={handleDownload}
                >
                  Download PNG
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Controls */}
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">Design Controls</h2>
            </CardHeader>
            <CardBody className="p-6">
              <Tabs aria-label="Design controls">
                <Tab
                  key="background"
                  title={
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>Background</span>
                    </div>
                  }
                >
                  <div className="space-y-4 pt-4">
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
                          className="text-sm font-semibold mb-2 block"
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
                          className="w-full h-12 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}

                    {config.bgType === "gradient" && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor={gradientColor1Id}
                              className="text-sm font-semibold mb-2 block"
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
                              className="w-full h-12 rounded-lg cursor-pointer"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={gradientColor2Id}
                              className="text-sm font-semibold mb-2 block"
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
                              className="w-full h-12 rounded-lg cursor-pointer"
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
                          <SelectItem key="horizontal">Horizontal</SelectItem>
                          <SelectItem key="vertical">Vertical</SelectItem>
                          <SelectItem key="diagonal">Diagonal</SelectItem>
                        </Select>

                        <div>
                          <div className="text-sm font-semibold mb-2 block">
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
                                className="h-12 rounded-lg border-2 border-gray-700 hover:border-gray-500 transition-colors"
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
                      <ImageUpload onImageSelect={handleBgImageUpload} />
                    )}
                  </div>
                </Tab>

                <Tab
                  key="image"
                  title={
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>Image</span>
                    </div>
                  }
                >
                  <div className="space-y-4 pt-4">
                    <ImageUpload onImageSelect={handleImageUpload} />

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
                          <SelectItem key="none">None</SelectItem>
                        </Select>

                        <div>
                          <div className="text-sm font-semibold mb-2 block">
                            Size: {config.imageSize}%
                          </div>
                          <Slider
                            aria-label="Image size"
                            value={config.imageSize}
                            onChange={(value) =>
                              updateConfig({ imageSize: value as number })
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
                </Tab>

                <Tab
                  key="text"
                  title={
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      <span>Text</span>
                    </div>
                  }
                >
                  <div className="space-y-4 pt-4">
                    <Input
                      label="Title"
                      value={config.title}
                      onChange={(e) => updateConfig({ title: e.target.value })}
                      placeholder="Your App Name"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-semibold mb-2 block">
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
                          className="text-sm font-semibold mb-2 block"
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
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <Input
                      label="Subtitle"
                      value={config.subtitle}
                      onChange={(e) =>
                        updateConfig({ subtitle: e.target.value })
                      }
                      placeholder="Tagline or key feature"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-semibold mb-2 block">
                          Subtitle Size: {config.subtitleSize}px
                        </div>
                        <Slider
                          aria-label="Subtitle size"
                          value={config.subtitleSize}
                          onChange={(value) =>
                            updateConfig({ subtitleSize: value as number })
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
                          className="text-sm font-semibold mb-2 block"
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
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold mb-2 block">
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
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-6 bg-green-900/20 border-green-800/50">
          <CardBody>
            <div className="flex gap-3">
              <Smartphone className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-400 mb-2">
                  Google Play Store Feature Graphic
                </h3>
                <p className="text-sm text-gray-300">
                  The Google Play Store feature graphic (1024×500) appears at
                  the top of your app's Play Store listing. It's the first
                  visual element users see and is crucial for making a strong
                  first impression. Use it to showcase your app's key features,
                  branding, or screenshots.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
