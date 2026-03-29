import { useLocation, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { toolGroups } from "@/config/tools";

type ToolsSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ToolsSidebar({ isOpen, onClose }: ToolsSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const handleNavigate = (path: string) => {
    navigate({ to: path });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40"
          />

          <motion.nav
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 z-50 h-full w-[280px] border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Tools
              </span>
            </div>

            <div className="overflow-y-auto p-4" style={{ height: "calc(100% - 4rem)" }}>
              {toolGroups.map((group) => (
                <div key={group.label} className="mb-6">
                  <span className="mb-2 block px-3 font-medium text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    {group.label}
                  </span>
                  <ul className="space-y-0.5">
                    {group.tools.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = pathname.includes(tool.path);

                      return (
                        <li key={tool.key}>
                          <button
                            type="button"
                            onClick={() => handleNavigate(tool.path)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                              isActive
                                ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
                            }`}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span>{tool.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
