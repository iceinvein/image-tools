import { Tab, Tabs } from "@heroui/tabs";
import { useLocation, useNavigate } from "@tanstack/react-router";
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
} from "lucide-react";
import { useMemo } from "react";

export function ToolsNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const selectedKey = useMemo(() => {
    if (pathname.includes("/tools/ico-converter")) return "ico-converter";
    if (pathname.includes("/tools/converter")) return "converter";
    if (pathname.includes("/tools/compressor")) return "compressor";
    if (pathname.includes("/tools/background-remover"))
      return "background-remover";
    if (pathname.includes("/tools/resizer")) return "resizer";
    if (pathname.includes("/tools/editor")) return "editor";
    if (pathname.includes("/tools/asset-generator")) return "asset-generator";
    if (pathname.includes("/tools/og-designer")) return "og-designer";
    if (pathname.includes("/tools/playstore-designer"))
      return "playstore-designer";
    return "converter";
  }, [pathname]);

  return (
    <div className="inline-flex animate-scale-in">
      <Tabs
        selectedKey={selectedKey}
        onSelectionChange={(key) => navigate({ to: `/tools/${String(key)}` })}
        aria-label="Tools navigation"
        classNames={{
          tabList: "gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl w-auto",
          cursor:
            "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg transition-all duration-300",
          tab: "px-3 py-2 font-semibold text-sm transition-all duration-300 hover:scale-105",
          tabContent:
            "group-data-[selected=true]:text-white transition-colors duration-300",
        }}
      >
        <Tab
          key="converter"
          title={
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
              <span>Converter</span>
            </div>
          }
        />
        <Tab
          key="ico-converter"
          title={
            <div className="flex items-center gap-2">
              <FileImage className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              <span>ICO</span>
            </div>
          }
        />
        <Tab
          key="compressor"
          title={
            <div className="flex items-center gap-2">
              <FileArchive className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Compressor</span>
            </div>
          }
        />
        <Tab
          key="background-remover"
          title={
            <div className="flex items-center gap-2">
              <Eraser className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
              <span>BG Remover</span>
            </div>
          }
        />
        <Tab
          key="resizer"
          title={
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Resizer</span>
            </div>
          }
        />
        <Tab
          key="editor"
          title={
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
              <span>Editor</span>
            </div>
          }
        />
        <Tab
          key="asset-generator"
          title={
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Asset Generator</span>
            </div>
          }
        />
        <Tab
          key="og-designer"
          title={
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
              <span>OG Designer</span>
            </div>
          }
        />
        <Tab
          key="playstore-designer"
          title={
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Play Store</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
