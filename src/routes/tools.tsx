import { createFileRoute, Outlet } from "@tanstack/react-router";

import DefaultLayout from "@/layouts/default";

function ToolsLayout() {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
}

export const Route = createFileRoute("/tools")({
  component: ToolsLayout,
});
