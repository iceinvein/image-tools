import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { RefreshCw, Maximize2, Edit3, Shield, Zap, Wrench } from "lucide-react";

import DefaultLayout from "@/layouts/default";

const toolCategories = [
  {
    id: "converter",
    title: "Converter",
    description: "Convert images between different formats with quality control",
    icon: RefreshCw,
    href: "/tools/converter",
    color: "bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "resizer",
    title: "Resizer",
    description: "Resize images to specific dimensions while maintaining quality",
    icon: Maximize2,
    href: "/tools/resizer",
    color: "bg-green-50/50 dark:bg-green-950/30 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700",
    iconBg: "bg-green-100 dark:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    id: "editor",
    title: "Editor",
    description: "Crop, rotate, flip, and apply filters to enhance your images",
    icon: Edit3,
    href: "/tools/editor",
    color: "bg-purple-50/50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700",
    iconBg: "bg-purple-100 dark:bg-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

function ToolsPage() {
  const location = useLocation();
  const isToolsIndex = location.pathname === "/tools";

  return (
    <DefaultLayout>
      {isToolsIndex ? (
        <section className="py-12 md:py-16 min-h-screen relative overflow-hidden">
          {/* Animated background gradients */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
          </div>

          <div className="text-center mb-16 px-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl">
                  <Wrench className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Image Processing Tools
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Professional-grade tools organized into <span className="font-bold text-purple-600 dark:text-purple-400">three powerful categories</span>.
              All processing happens in your browser for complete privacy.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Chip
                color="success"
                variant="shadow"
                className="px-4 py-1"
                startContent={<Shield className="w-4 h-4" />}
              >
                Privacy-first
              </Chip>
              <Chip
                color="warning"
                variant="shadow"
                className="px-4 py-1"
                startContent={<Zap className="w-4 h-4" />}
              >
                Lightning fast
              </Chip>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {toolCategories.map((category, index) => {
              const IconComponent = category.icon;
              const gradients = [
                { from: "from-blue-500", to: "to-purple-500", text: "from-blue-600 to-purple-600" },
                { from: "from-green-500", to: "to-emerald-500", text: "from-green-600 to-emerald-600" },
                { from: "from-purple-500", to: "to-pink-500", text: "from-purple-600 to-pink-600" },
              ];
              const gradient = gradients[index];

              return (
                <Card
                  key={category.id}
                  className="group relative border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from}/0 ${gradient.to}/0 group-hover:${gradient.from}/5 group-hover:${gradient.to}/5 transition-all duration-300`} />

                  <CardHeader className="pb-6 pt-8 relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <div className={`absolute inset-0 bg-gradient-to-r ${gradient.from} ${gradient.to} rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
                        <div className={`relative p-5 bg-gradient-to-br ${gradient.from}/10 ${gradient.to}/10 dark:${gradient.from}/20 dark:${gradient.to}/20 rounded-2xl border-2 ${category.color.split(' ')[2]} group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className={`w-10 h-10 ${category.iconColor}`} />
                        </div>
                      </div>
                      <h2 className={`text-2xl font-black bg-gradient-to-r ${gradient.text} dark:${gradient.text.replace('600', '400')} bg-clip-text text-transparent`}>
                        {category.title}
                      </h2>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0 pb-8 relative">
                    <p className="text-gray-700 dark:text-gray-300 mb-6 text-center leading-relaxed px-2">
                      {category.description}
                    </p>
                    <Button
                      as={Link}
                      to={category.href}
                      color="primary"
                      size="lg"
                      className={`w-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r ${gradient.from} ${gradient.to} hover:scale-105`}
                    >
                      Open {category.title}
                    </Button>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </section>
      ) : (
        <Outlet />
      )}
    </DefaultLayout>
  );
}

export const Route = createFileRoute("/tools")({
  component: ToolsPage,
});
