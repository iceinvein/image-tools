import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Zap } from "lucide-react";
import { createWebApplicationSchema, SEO } from "@/components/seo";
import { featuredTools, toolGroups } from "@/config/tools";
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

      <section className="py-16 md:py-24">
        <div>
          {/* Header — left-aligned to match tool pages */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-xl"
          >
            <h1 className="font-extrabold text-4xl tracking-tight text-zinc-900 md:text-5xl dark:text-zinc-50">
              Image tools that respect your privacy
            </h1>
            <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
              Professional-grade processing that runs entirely in your browser.
              Nothing leaves your machine.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Chip size="sm" variant="flat" startContent={<Lock className="h-3 w-3" />}>
                No uploads
              </Chip>
              <Chip size="sm" variant="flat" startContent={<Zap className="h-3 w-3" />}>
                Instant processing
              </Chip>
            </div>
          </motion.div>

          {/* Featured Tools */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {featuredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.key} to={tool.path} className="group block">
                  <Card className="h-full border border-zinc-200 transition-shadow hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700">
                    <CardBody className="p-6">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-primary group-hover:text-white dark:bg-zinc-800 dark:text-zinc-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {tool.label}
                      </h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {tool.description}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Open tool
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              );
            })}
          </motion.div>

          {/* All Tools by Category */}
          <div className="mt-16">
            <h2 className="mb-6 font-semibold text-sm uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              All tools
            </h2>

            <div className="space-y-8">
              {toolGroups.map((group, groupIndex) => (
                <motion.div
                  key={group.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.3, delay: groupIndex * 0.05 }}
                >
                  <h3 className="mb-2 font-medium text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    {group.label}
                  </h3>
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
                    {group.tools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link key={tool.key} to={tool.path} className="group block">
                          <div className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-zinc-800 dark:hover:bg-zinc-900">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                                {tool.label}
                              </p>
                              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                {tool.hint}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
