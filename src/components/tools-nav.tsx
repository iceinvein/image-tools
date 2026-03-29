import { Tab, Tabs } from "@heroui/tabs";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { allTools } from "@/config/tools";

export function ToolsNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const selectedKey = useMemo(() => {
    // Find matching tool by checking path inclusion, most specific first
    const match = allTools.find((t) => pathname.includes(t.path));
    return match?.key ?? "converter";
  }, [pathname]);

  return (
    <div className="hidden md:block">
      <div className="relative">
        {/* Scrollable container — hides the scrollbar while allowing horizontal scroll */}
        <div className="overflow-x-auto scrollbar-none">
          <Tabs
            selectedKey={selectedKey}
            onSelectionChange={(key) => navigate({ to: `/tools/${String(key)}` })}
            aria-label="Tools navigation"
            classNames={{
              tabList: "gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg w-auto",
              cursor: "bg-white dark:bg-zinc-800 shadow-sm",
              tab: "px-3 py-2 text-sm whitespace-nowrap",
              tabContent:
                "text-zinc-600 group-data-[selected=true]:text-zinc-900 dark:text-zinc-400 dark:group-data-[selected=true]:text-zinc-100",
            }}
          >
            {allTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Tab
                  key={tool.key}
                  title={
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tool.label}</span>
                    </div>
                  }
                />
              );
            })}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
