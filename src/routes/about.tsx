import { createFileRoute } from "@tanstack/react-router";

import DefaultLayout from "@/layouts/default";

function AboutPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="text-center">
          <h1 className="mb-4 font-bold text-2xl text-zinc-900 dark:text-zinc-50">About</h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            Learn more about our image processing tools
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
}

export const Route = createFileRoute("/about")({
  component: AboutPage,
});
