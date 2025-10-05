import { Tab, Tabs } from "@heroui/tabs";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Edit3, Maximize2, RefreshCw } from "lucide-react";

export function ToolsNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const selectedKey = pathname.includes("/tools/resizer")
    ? "resizer"
    : pathname.includes("/tools/editor")
      ? "editor"
      : "converter";

  return (
    <div className="inline-flex">
      <Tabs
        selectedKey={selectedKey}
        onSelectionChange={(key) => navigate({ to: `/tools/${String(key)}` })}
        aria-label="Tools navigation"
        classNames={{
          tabList: "gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl w-auto",
          cursor: "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg",
          tab: "px-3 py-2 font-semibold text-sm",
          tabContent: "group-data-[selected=true]:text-white",
        }}
      >
        <Tab
          key="converter"
          title={
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span>Converter</span>
            </div>
          }
        />
        <Tab
          key="resizer"
          title={
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4" />
              <span>Resizer</span>
            </div>
          }
        />
        <Tab
          key="editor"
          title={
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              <span>Editor</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
