import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@tanstack/react-router";
import { Edit3, Maximize2, RefreshCw, Sparkles } from "lucide-react";
import { createWebApplicationSchema, SEO } from "@/components/seo";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <SEO
        title="Image Tools - Free Online Image Converter, Resizer & Editor"
        description="Professional-grade image processing tools that run entirely in your browser. Convert, resize, crop, rotate, and enhance images with complete privacy. No uploads, 100% free."
        keywords="image converter, image resizer, image editor, online image tools, convert images, resize images, crop images, browser-based image processing, free image tools, privacy-focused image editor"
        canonicalUrl="https://image-utilities.netlify.app/"
        structuredData={createWebApplicationSchema()}
      />
      <section className="flex flex-col items-center justify-center gap-12 py-12 md:py-20 min-h-[80vh] relative overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="text-center max-w-4xl px-4 relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800 rounded-full mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              100% Browser-Based • Zero Server Upload
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 brand-text-gradient animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
            Image Tools
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed animate-in fade-in slide-in-from-top-8 duration-700 delay-200">
            Professional-grade image processing that runs{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              entirely in your browser
            </span>
            . Convert, resize, crop, and enhance with complete privacy.
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
          <Card className="group relative border-2 border-blue-200/60 dark:border-blue-800/60 hover:border-blue-400/80 dark:hover:border-blue-500/80 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)]">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-purple-100/40 to-blue-50/30 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]" />

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-0 group-hover:opacity-25 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]" />

            <CardHeader className="pb-6 pt-10 relative z-10 justify-center">
              <div className="flex flex-col items-center justify-center text-center">
                {/* Icon container with animation */}
                <div className="relative mb-5 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                  <div className="relative p-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl group-hover:scale-105 group-hover:rotate-2 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg group-hover:shadow-2xl">
                    <RefreshCw className="w-10 h-10 text-white group-hover:rotate-90 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-black text-white mb-2 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                    Converter
                  </h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full group-hover:w-24 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0 pb-8 relative z-10">
              <p className="text-gray-700 dark:text-gray-300 mb-8 text-center leading-relaxed px-6">
                Convert images between different formats with quality control
              </p>
              <div className="px-6">
                <Button
                  as={Link}
                  to="/tools/converter"
                  size="lg"
                  className="w-full font-bold bg-white/90 dark:bg-gray-800/90 text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                >
                  Open Converter
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="group relative border-2 border-purple-200/60 dark:border-purple-800/60 hover:border-purple-400/80 dark:hover:border-purple-500/80 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-gray-900 dark:via-purple-950/20 dark:to-blue-950/20 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)]">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-blue-100/40 to-purple-50/30 dark:from-purple-900/30 dark:via-blue-900/20 dark:to-purple-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]" />

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl blur-2xl opacity-0 group-hover:opacity-25 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]" />

            <CardHeader className="pb-6 pt-10 relative z-10 justify-center">
              <div className="flex flex-col items-center justify-center text-center">
                {/* Icon container with animation */}
                <div className="relative mb-5 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                  <div className="relative p-5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl group-hover:scale-105 group-hover:-rotate-2 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg group-hover:shadow-2xl">
                    <Maximize2 className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-black text-white mb-2 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                    Resizer
                  </h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full group-hover:w-24 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0 pb-8 relative z-10">
              <p className="text-gray-700 dark:text-gray-300 mb-8 text-center leading-relaxed px-6">
                Resize images to specific dimensions while maintaining quality
              </p>
              <div className="px-6">
                <Button
                  as={Link}
                  to="/tools/resizer"
                  size="lg"
                  className="w-full font-bold bg-white/90 dark:bg-gray-800/90 text-purple-600 dark:text-purple-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                >
                  Open Resizer
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="group relative border-2 border-blue-200/60 dark:border-blue-800/60 hover:border-blue-400/80 dark:hover:border-blue-500/80 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000 transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)]">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-purple-100/40 to-blue-50/30 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]" />

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-0 group-hover:opacity-25 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]" />

            <CardHeader className="pb-6 pt-10 relative z-10 justify-center">
              <div className="flex flex-col items-center justify-center text-center">
                {/* Icon container with animation */}
                <div className="relative mb-5 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                  <div className="relative p-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl group-hover:scale-105 group-hover:rotate-3 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg group-hover:shadow-2xl">
                    <Edit3 className="w-10 h-10 text-white group-hover:-rotate-6 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-black text-white mb-2 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                    Editor
                  </h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full group-hover:w-24 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0 pb-8 relative z-10">
              <p className="text-gray-700 dark:text-gray-300 mb-8 text-center leading-relaxed px-6">
                Crop, rotate, flip, and apply filters to enhance your images
              </p>
              <div className="px-6">
                <Button
                  as={Link}
                  to="/tools/editor"
                  size="lg"
                  className="w-full font-bold bg-white/90 dark:bg-gray-800/90 text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                >
                  Open Editor
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
