import { Button } from "@heroui/button";
import { Link } from "@tanstack/react-router";
import { Shield, Zap, Wrench, Sparkles, ArrowRight } from "lucide-react";

import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
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

          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
            Image Tools
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed animate-in fade-in slide-in-from-top-8 duration-700 delay-200">
            Professional-grade image processing that runs <span className="font-bold text-blue-600 dark:text-blue-400">entirely in your browser</span>.
            Convert, resize, crop, and enhance with complete privacy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-top-10 duration-700 delay-300">
            <Button
              as={Link}
              to="/tools"
              color="primary"
              size="lg"
              className="px-10 py-6 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105"
              endContent={<ArrowRight className="w-5 h-5" />}
            >
              Explore Tools
            </Button>
            <Button
              as={Link}
              to="/about"
              variant="bordered"
              size="lg"
              className="px-10 py-6 text-lg font-bold border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="group relative text-center p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 rounded-2xl transition-all duration-300" />
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className="relative p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-2xl border-2 border-green-200 dark:border-green-800 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Privacy First
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                All processing happens in your browser. Your images never leave your device.
              </p>
            </div>
          </div>

          <div className="group relative text-center p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/5 group-hover:to-orange-500/5 rounded-2xl transition-all duration-300" />
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className="relative p-4 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50 rounded-2xl border-2 border-yellow-200 dark:border-yellow-800 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                No uploads or downloads. Process images instantly with modern web tech.
              </p>
            </div>
          </div>

          <div className="group relative text-center p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300" />
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className="relative p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl border-2 border-blue-200 dark:border-blue-800 group-hover:scale-110 transition-transform duration-300">
                    <Wrench className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Professional Tools
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Convert formats, resize, crop, and apply filters with precision.
              </p>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
