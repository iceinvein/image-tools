import { HeroUIProvider } from "@heroui/system";
import { useNavigate } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useMemo, useRef } from "react";

type ToolImageTransferContextValue = {
  stageImageTransfer: (file: File) => void;
  peekImageTransfer: () => File | null;
  clearImageTransfer: () => void;
};

const ToolImageTransferContext =
  createContext<ToolImageTransferContextValue | null>(null);

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const pendingImageRef = useRef<File | null>(null);

  const stageImageTransfer = useCallback((file: File) => {
    pendingImageRef.current = file;
  }, []);

  const peekImageTransfer = useCallback(() => {
    return pendingImageRef.current;
  }, []);

  const clearImageTransfer = useCallback(() => {
    pendingImageRef.current = null;
  }, []);

  const transferValue = useMemo(
    () => ({ stageImageTransfer, peekImageTransfer, clearImageTransfer }),
    [clearImageTransfer, peekImageTransfer, stageImageTransfer],
  );

  return (
    <HeroUIProvider navigate={(to) => navigate({ to })} useHref={(to) => to}>
      <ToolImageTransferContext.Provider value={transferValue}>
        {children}
      </ToolImageTransferContext.Provider>
    </HeroUIProvider>
  );
}

export function useToolImageTransfer() {
  const context = useContext(ToolImageTransferContext);

  if (!context) {
    throw new Error(
      "useToolImageTransfer must be used within the app Provider",
    );
  }

  return context;
}
