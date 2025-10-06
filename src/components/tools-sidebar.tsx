import { useLocation, useNavigate } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
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
import { useEffect, useRef } from "react";

const tools = [
  {
    key: "converter",
    label: "Converter",
    icon: RefreshCw,
    path: "/tools/converter",
    color: "#3B82F6", // blue
  },
  {
    key: "ico-converter",
    label: "ICO Converter",
    icon: FileImage,
    path: "/tools/ico-converter",
    color: "#06B6D4", // cyan
  },
  {
    key: "compressor",
    label: "Compressor",
    icon: FileArchive,
    path: "/tools/compressor",
    color: "#F97316", // orange
  },
  {
    key: "background-remover",
    label: "BG Remover",
    icon: Eraser,
    path: "/tools/background-remover",
    color: "#A855F7", // purple
  },
  {
    key: "resizer",
    label: "Resizer",
    icon: Maximize2,
    path: "/tools/resizer",
    color: "#8B5CF6", // purple
  },
  {
    key: "editor",
    label: "Editor",
    icon: Edit3,
    path: "/tools/editor",
    color: "#6366F1", // indigo
  },
  {
    key: "asset-generator",
    label: "Asset Generator",
    icon: Package,
    path: "/tools/asset-generator",
    color: "#F59E0B", // amber
  },
  {
    key: "og-designer",
    label: "OG Designer",
    icon: Palette,
    path: "/tools/og-designer",
    color: "#EC4899", // pink
  },
  {
    key: "playstore-designer",
    label: "Play Store",
    icon: Smartphone,
    path: "/tools/playstore-designer",
    color: "#10B981", // green
  },
];

interface ToolsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ToolsSidebar({ isOpen, onClose }: ToolsSidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(containerRef);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50"
        />
      )}

      {/* Sidebar */}
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        ref={containerRef}
        className="fixed top-16 left-0 z-50"
      >
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-64 bg-white shadow-2xl dark:bg-gray-900"
          variants={sidebarVariants}
        />
        <Navigation onClose={onClose} />
      </motion.nav>
    </>
  );
}

const navVariants: Variants = {
  open: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const Navigation = ({ onClose }: { onClose: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const handleNavigate = (path: string) => {
    navigate({ to: path });
    onClose();
  };

  return (
    <motion.ul
      variants={navVariants}
      className="absolute top-6 m-0 w-56 list-none p-6"
    >
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = pathname.includes(tool.path);

        return (
          <motion.li
            key={tool.key}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-3 cursor-pointer"
            onClick={() => handleNavigate(tool.path)}
          >
            <div
              className={`flex items-center gap-3 rounded-lg p-3 transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.2)"
                    : `${tool.color}20`,
                }}
              >
                <Icon
                  className="h-5 w-5"
                  style={{ color: isActive ? "white" : tool.color }}
                />
              </div>
              <span className="font-semibold text-sm">{tool.label}</span>
            </div>
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

const itemVariants: Variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const sidebarVariants: Variants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

/**
 * ==============   Utils   ================
 */

const useDimensions = (ref: React.RefObject<HTMLDivElement | null>) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};
