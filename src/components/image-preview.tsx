import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { FileImage, HardDrive, Ruler, X } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  title?: string;
  fileName?: string;
  fileSize?: number;
  dimensions?: { width: number; height: number };
  onRemove?: () => void;
  className?: string;
}

export function ImagePreview({
  imageUrl,
  title = "Preview",
  fileName,
  fileSize,
  dimensions,
  onRemove,
  className = "",
}: ImagePreviewProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <Card
      className={`${className} group hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden`}
    >
      <CardHeader className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h3>
        {onRemove && (
          <Button
            color="danger"
            variant="flat"
            size="sm"
            onPress={onRemove}
            isIconOnly
            className="hover:scale-110 transition-transform"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardBody className="p-0">
        <div className="space-y-0">
          {/* Image container with hover effect */}
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg group-hover:shadow-2xl transition-all duration-300">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none z-10" />

              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-auto max-h-80 object-contain bg-white dark:bg-gray-950"
              />
            </div>
          </div>

          {/* Info section */}
          {(fileName || fileSize || dimensions) && (
            <div className="p-4 bg-white dark:bg-gray-950 space-y-3">
              {fileName && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <FileImage className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Filename
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {fileName}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {fileSize && (
                  <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <HardDrive className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                        Size
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {formatFileSize(fileSize)}
                      </p>
                    </div>
                  </div>
                )}

                {dimensions && (
                  <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Ruler className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                        Dimensions
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {dimensions.width} × {dimensions.height}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
