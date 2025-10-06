import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Edit3,
  Eraser,
  FileArchive,
  FileImage,
  Maximize2,
  Package,
  Palette,
  RefreshCw,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { createWebApplicationSchema, SEO } from "@/components/seo";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <SEO
        title="Image Tools - Free Online Image Converter, ICO Converter, Resizer, Editor, Asset Generator, OG & Play Store Designer"
        description="Professional-grade image processing tools that run entirely in your browser. Convert images, create ICO files for favicons and Windows icons, resize, crop, rotate, enhance images, generate web/app assets, design Open Graph images, and create Play Store feature graphics with complete privacy. No uploads, 100% free."
        keywords="image converter, ico converter, favicon creator, windows icon generator, image resizer, image editor, asset generator, og image designer, play store designer, feature graphic, open graph generator, favicon generator, app icon generator, online image tools, convert images, resize images, crop images, browser-based image processing, free image tools, privacy-focused image editor"
        canonicalUrl="https://image-utilities.netlify.app/"
        structuredData={createWebApplicationSchema()}
      />
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center gap-12 overflow-hidden py-12 md:py-20">
        {/* Animated background gradients */}
        <div className="-z-10 absolute inset-0">
          <div className="absolute top-20 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute top-40 right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-1000" />
          <div className="absolute bottom-20 left-1/3 h-96 w-96 animate-pulse rounded-full bg-pink-500/10 blur-3xl delay-2000" />
        </div>

        <div className="relative max-w-4xl px-4 text-center">
          {/* Badge */}
          <div className="fade-in slide-in-from-top-4 mb-8 inline-flex animate-in items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 duration-700 dark:border-blue-800 dark:from-blue-900/30 dark:to-purple-900/30">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold text-sm text-transparent dark:from-blue-400 dark:to-purple-400">
              100% Browser-Based • Zero Server Upload
            </span>
          </div>

          <h1 className="brand-text-gradient fade-in slide-in-from-top-6 mb-6 animate-in font-black text-5xl delay-100 duration-700 md:text-7xl">
            Image Tools
          </h1>

          <p className="fade-in slide-in-from-top-8 mb-10 animate-in text-gray-600 text-xl leading-relaxed delay-200 duration-700 md:text-2xl dark:text-gray-300">
            Professional-grade image processing that runs{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              entirely in your browser
            </span>
            . Convert formats, create ICO files, resize, edit, generate assets,
            and design promotional graphics with complete privacy.
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
          >
            <Link to="/tools/converter" className="block">
              <Card className="group relative h-full cursor-pointer overflow-hidden border-2 border-blue-200/60 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-md transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-blue-400/80 hover:shadow-2xl hover:shadow-blue-500/20 dark:border-blue-800/60 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 dark:hover:border-blue-500/80">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-purple-100/40 to-blue-50/30 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-blue-950/30" />

                {/* Glow effect */}
                <div className="-inset-1 absolute rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 blur-2xl transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-25" />

                <CardHeader className="relative z-10 justify-center pt-10 pb-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    {/* Icon container with animation */}
                    <div className="relative mb-5 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:opacity-50" />
                      <div className="relative rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-5 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-2 group-hover:scale-105 group-hover:shadow-2xl">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <RefreshCw className="h-10 w-10 text-white" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h2 className="mb-2 font-black text-2xl text-white transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105">
                        Converter
                      </h2>
                      <motion.div
                        className="h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                        animate={{ width: [64, 72, 64] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="relative z-10 pt-0 pb-8">
                  <p className="px-6 text-center text-gray-700 leading-relaxed dark:text-gray-300">
                    Convert images between different formats with quality
                    control
                  </p>
                </CardBody>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
          >
            <Link to="/tools/ico-converter" className="block">
              <Card className="group relative h-full cursor-pointer overflow-hidden border-2 border-cyan-200/60 bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 backdrop-blur-md transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-cyan-400/80 hover:shadow-2xl hover:shadow-cyan-500/20 dark:border-cyan-800/60 dark:from-gray-900 dark:via-cyan-950/20 dark:to-blue-950/20 dark:hover:border-cyan-500/80">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/50 via-blue-100/40 to-cyan-50/30 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100 dark:from-cyan-900/30 dark:via-blue-900/20 dark:to-cyan-950/30" />

                {/* Glow effect */}
                <div className="-inset-1 absolute rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 blur-2xl transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-25" />

                <CardHeader className="relative z-10 justify-center pt-10 pb-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    {/* Icon container with animation */}
                    <div className="relative mb-5 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-30 blur-xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:opacity-50" />
                      <div className="relative rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-5 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-2 group-hover:scale-105 group-hover:shadow-2xl">
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <FileImage className="h-10 w-10 text-white" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h2 className="mb-2 font-black text-2xl text-white transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105">
                        ICO Converter
                      </h2>
                      <motion.div
                        className="h-1 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        animate={{ width: [64, 72, 64] }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="relative z-10 pt-0 pb-8">
                  <p className="px-6 text-center text-gray-700 leading-relaxed dark:text-gray-300">
                    Create multi-resolution ICO files for favicons and Windows
                    icons
                  </p>
                </CardBody>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
          >
            <Link to="/tools/compressor" className="block">
              <Card className="group relative h-full cursor-pointer overflow-hidden border-2 border-orange-200/60 bg-gradient-to-br from-white via-orange-50/30 to-red-50/30 backdrop-blur-md transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-orange-400/80 hover:shadow-2xl hover:shadow-orange-500/20 dark:border-orange-800/60 dark:from-gray-900 dark:via-orange-950/20 dark:to-red-950/20 dark:hover:border-orange-500/80">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 via-red-100/40 to-orange-50/30 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100 dark:from-orange-900/30 dark:via-red-900/20 dark:to-orange-950/30" />

                {/* Glow effect */}
                <div className="-inset-1 absolute rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 opacity-0 blur-2xl transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-25" />

                <CardHeader className="relative z-10 justify-center pt-10 pb-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    {/* Icon container with animation */}
                    <div className="relative mb-5 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 opacity-30 blur-xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:opacity-50" />
                      <div className="relative rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-5 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-2 group-hover:scale-105 group-hover:shadow-2xl">
                        <motion.div
                          animate={{ scale: [1, 0.9, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <FileArchive className="h-10 w-10 text-white" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h2 className="mb-2 font-black text-2xl text-white transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105">
                        Compressor
                      </h2>
                      <motion.div
                        className="h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-red-500"
                        animate={{ width: [64, 72, 64] }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="relative z-10 pt-0 pb-8">
                  <p className="px-6 text-center text-gray-700 leading-relaxed dark:text-gray-300">
                    Reduce image file sizes while maintaining quality
                  </p>
                </CardBody>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
          >
            <Link to="/tools/background-remover" className="block">
              <Card className="group relative h-full cursor-pointer overflow-hidden border-2 border-purple-200/60 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 backdrop-blur-md transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-purple-400/80 hover:shadow-2xl hover:shadow-purple-500/20 dark:border-purple-800/60 dark:from-gray-900 dark:via-purple-950/20 dark:to-pink-950/20 dark:hover:border-purple-500/80">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-pink-100/40 to-purple-50/30 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-purple-950/30" />

                {/* Glow effect */}
                <div className="-inset-1 absolute rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 opacity-0 blur-2xl transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-25" />

                <CardHeader className="relative z-10 justify-center pt-10 pb-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    {/* Icon container with animation */}
                    <div className="relative mb-5 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 opacity-30 blur-xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:opacity-50" />
                      <div className="relative rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-5 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-2 group-hover:scale-105 group-hover:shadow-2xl">
                        <motion.div
                          animate={{ x: [-3, 3, -3] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Eraser className="h-10 w-10 text-white" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h2 className="mb-2 font-black text-2xl text-white transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105">
                        Background Remover
                      </h2>
                      <motion.div
                        className="h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"
                        animate={{ width: [64, 72, 64] }}
                        transition={{
                          duration: 2.3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="relative z-10 pt-0 pb-8">
                  <p className="px-6 text-center text-gray-700 leading-relaxed dark:text-gray-300">
                    Remove backgrounds automatically with AI
                  </p>
                </CardBody>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: 0.4,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
          >
            <Link to="/tools/resizer" className="block">
              <Card className="group relative h-full cursor-pointer overflow-hidden border-2 border-purple-200/60 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 backdrop-blur-md transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-purple-400/80 hover:shadow-2xl hover:shadow-purple-500/20 dark:border-purple-800/60 dark:from-gray-900 dark:via-purple-950/20 dark:to-blue-950/20 dark:hover:border-purple-500/80">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-blue-100/40 to-purple-50/30 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100 dark:from-purple-900/30 dark:via-blue-900/20 dark:to-purple-950/30" />

                {/* Glow effect */}
                <div className="-inset-1 absolute rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 opacity-0 blur-2xl transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-25" />

                <CardHeader className="relative z-10 justify-center pt-10 pb-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    {/* Icon container with animation */}
                    <div className="relative mb-5 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 opacity-30 blur-xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:opacity-50" />
                      <div className="group-hover:-rotate-2 relative rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 p-5 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-hover:shadow-2xl">
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Maximize2 className="h-10 w-10 text-white" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h2 className="mb-2 font-black text-2xl text-white transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105">
                        Resizer
                      </h2>
                      <motion.div
                        className="h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-blue-500"
                        animate={{ width: [64, 72, 64] }}
                        transition={{
                          duration: 2.1,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="relative z-10 pt-0 pb-8">
                  <p className="px-6 text-center text-gray-700 leading-relaxed dark:text-gray-300">
                    Resize images to specific dimensions while maintaining
                    quality
                  </p>
                </CardBody>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
          >
            <Link to="/tools/editor" className="block">
              <Card className="group relative h-full cursor-pointer overflow-hidden border-2 border-blue-200/60 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-md transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-blue-400/80 hover:shadow-2xl hover:shadow-blue-500/20 dark:border-blue-800/60 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 dark:hover:border-blue-500/80">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-purple-100/40 to-blue-50/30 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-blue-950/30" />

                {/* Glow effect */}
                <div className="-inset-1 absolute rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 blur-2xl transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-25" />

                <CardHeader className="relative z-10 justify-center pt-10 pb-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    {/* Icon container with animation */}
                    <div className="relative mb-5 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:opacity-50" />
                      <div className="relative rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-5 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-3 group-hover:scale-105 group-hover:shadow-2xl">
                        <motion.div
                          animate={{ rotate: [-5, 5, -5] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Edit3 className="h-10 w-10 text-white" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h2 className="mb-2 font-black text-2xl text-white transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105">
                        Editor
                      </h2>
                      <motion.div
                        className="h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                        animate={{ width: [64, 72, 64] }}
                        transition={{
                          duration: 1.9,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="relative z-10 pt-0 pb-8">
                  <p className="px-6 text-center text-gray-700 leading-relaxed dark:text-gray-300">
                    Crop, rotate, flip, and apply filters to enhance your images
                  </p>
                </CardBody>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: 0.6,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
          >
            <Link to="/tools/asset-generator" className="block">
              <Card className="group relative h-full cursor-pointer overflow-hidden border-2 border-orange-200/60 bg-gradient-to-br from-white via-orange-50/30 to-pink-50/30 backdrop-blur-md transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-orange-400/80 hover:shadow-2xl hover:shadow-orange-500/20 dark:border-orange-800/60 dark:from-gray-900 dark:via-orange-950/20 dark:to-pink-950/20 dark:hover:border-orange-500/80">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 via-pink-100/40 to-orange-50/30 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100 dark:from-orange-900/30 dark:via-pink-900/20 dark:to-orange-950/30" />

                {/* Glow effect */}
                <div className="-inset-1 absolute rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 opacity-0 blur-2xl transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-25" />

                <CardHeader className="relative z-10 justify-center pt-10 pb-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    {/* Icon container with animation */}
                    <div className="relative mb-5 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 opacity-30 blur-xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:opacity-50" />
                      <div className="relative rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 p-5 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-2 group-hover:scale-105 group-hover:shadow-2xl">
                        <motion.div
                          animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Package className="h-10 w-10 text-white" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h2 className="mb-2 font-black text-2xl text-white transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105">
                        Asset Generator
                      </h2>
                      <motion.div
                        className="h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-pink-500"
                        animate={{ width: [64, 72, 64] }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="relative z-10 pt-0 pb-8">
                  <p className="px-6 text-center text-gray-700 leading-relaxed dark:text-gray-300">
                    Generate all web and app icons from a single 1024×1024 image
                  </p>
                </CardBody>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: 0.7,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
          >
            <Link to="/tools/og-designer" className="block">
              <Card className="group relative h-full cursor-pointer overflow-hidden border-2 border-pink-200/60 bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 backdrop-blur-md transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-pink-400/80 hover:shadow-2xl hover:shadow-pink-500/20 dark:border-pink-800/60 dark:from-gray-900 dark:via-pink-950/20 dark:to-purple-950/20 dark:hover:border-pink-500/80">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 via-purple-100/40 to-pink-50/30 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100 dark:from-pink-900/30 dark:via-purple-900/20 dark:to-pink-950/30" />

                {/* Glow effect */}
                <div className="-inset-1 absolute rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 blur-2xl transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-25" />

                <CardHeader className="relative z-10 justify-center pt-10 pb-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    {/* Icon container with animation */}
                    <div className="relative mb-5 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 opacity-30 blur-xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:opacity-50" />
                      <div className="relative rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 p-5 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-2 group-hover:scale-105 group-hover:shadow-2xl">
                        <motion.div
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Palette className="h-10 w-10 text-white" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h2 className="mb-2 font-black text-2xl text-white transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105">
                        OG Designer
                      </h2>
                      <motion.div
                        className="h-1 w-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-500"
                        animate={{ width: [64, 72, 64] }}
                        transition={{
                          duration: 2.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="relative z-10 pt-0 pb-8">
                  <p className="px-6 text-center text-gray-700 leading-relaxed dark:text-gray-300">
                    Design custom Open Graph images with text, images, and
                    gradients
                  </p>
                </CardBody>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: 0.8,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
          >
            <Link to="/tools/playstore-designer" className="block">
              <Card className="group relative h-full cursor-pointer overflow-hidden border-2 border-green-200/60 bg-gradient-to-br from-white via-green-50/30 to-teal-50/30 backdrop-blur-md transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-green-400/80 hover:shadow-2xl hover:shadow-green-500/20 dark:border-green-800/60 dark:from-gray-900 dark:via-green-950/20 dark:to-teal-950/20 dark:hover:border-green-500/80">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 via-teal-100/40 to-green-50/30 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100 dark:from-green-900/30 dark:via-teal-900/20 dark:to-green-950/30" />

                {/* Glow effect */}
                <div className="-inset-1 absolute rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 opacity-0 blur-2xl transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-25" />

                <CardHeader className="relative z-10 justify-center pt-10 pb-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    {/* Icon container with animation */}
                    <div className="relative mb-5 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 opacity-30 blur-xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:opacity-50" />
                      <div className="relative rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 p-5 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-2 group-hover:scale-105 group-hover:shadow-2xl">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0], y: [0, -3, 0] }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Smartphone className="h-10 w-10 text-white" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h2 className="mb-2 font-black text-2xl text-white transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105">
                        Play Store Designer
                      </h2>
                      <motion.div
                        className="h-1 w-16 rounded-full bg-gradient-to-r from-green-400 to-teal-500"
                        animate={{ width: [64, 72, 64] }}
                        transition={{
                          duration: 2.7,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="relative z-10 pt-0 pb-8">
                  <p className="px-6 text-center text-gray-700 leading-relaxed dark:text-gray-300">
                    Create Google Play Store feature graphics for app listings
                  </p>
                </CardBody>
              </Card>
            </Link>
          </motion.div>
        </div>
      </section>
    </DefaultLayout>
  );
}
