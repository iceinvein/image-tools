import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { motion } from "framer-motion";
import { Download, Maximize2, RotateCcw } from "lucide-react";
import { memo } from "react";

interface ResizerActionsProps {
  resizedUrl: string;
  isProcessing: boolean;
  handleReset: () => void;
  handleResize: () => void;
  handleDownload: () => void;
}

export const ResizerActions = memo(function ResizerActions({
  resizedUrl,
  isProcessing,
  handleReset,
  handleResize,
  handleDownload,
}: ResizerActionsProps) {
  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardBody className="p-4">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div className="flex-1 text-gray-600 text-sm dark:text-gray-400">
            {resizedUrl ? (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="font-medium text-green-600 dark:text-green-400"
              >
                ✓ Image resized successfully
              </motion.span>
            ) : (
              <span>Adjust settings and click resize</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="lg"
              variant="bordered"
              onPress={handleReset}
              startContent={<RotateCcw className="h-4 w-4" />}
              className="flex-1 sm:flex-initial"
            >
              New
            </Button>
            <Button
              size="lg"
              color="primary"
              onPress={handleResize}
              isLoading={isProcessing}
              className="flex-1 font-bold sm:flex-initial"
              startContent={
                !isProcessing ? <Maximize2 className="h-4 w-4" /> : undefined
              }
            >
              {isProcessing ? "Resizing..." : "Resize"}
            </Button>
            {resizedUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="flex-1 sm:flex-initial"
              >
                <Button
                  size="lg"
                  color="success"
                  onPress={handleDownload}
                  startContent={<Download className="h-4 w-4" />}
                  className="w-full font-bold"
                >
                  Download
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
});
