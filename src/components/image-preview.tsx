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
      className={`${className} group overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl dark:border-gray-700`}
    >
      <CardHeader className="flex items-center justify-between border-gray-200 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:border-gray-700 dark:from-blue-950/30 dark:to-purple-950/30">
        <h3 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-lg text-transparent">
          {title}
        </h3>
        {onRemove && (
          <Button
            color="danger"
            variant="flat"
            size="sm"
            onPress={onRemove}
            isIconOnly
            className="transition-transform hover:scale-110"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardBody className="p-0">
        <div className="space-y-0">
          {/* Image container with hover effect */}
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 dark:from-gray-900 dark:to-gray-800">
            <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 shadow-lg transition-all duration-300 group-hover:shadow-2xl dark:border-gray-700">
              {/* Gradient overlay on hover */}
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-blue-500/0 to-purple-500/0 transition-all duration-300 group-hover:from-blue-500/5 group-hover:to-purple-500/5" />

              <img
                src={imageUrl}
                alt="Preview"
                className="h-auto max-h-80 w-full bg-white object-contain dark:bg-gray-950"
              />
            </div>
          </div>

          {/* Info section */}
          {(fileName || fileSize || dimensions) && (
            <div className="space-y-3 bg-white p-4 dark:bg-gray-950">
              {fileName && (
                <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                  <FileImage className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 font-medium text-gray-500 text-xs dark:text-gray-400">
                      Filename
                    </p>
                    <p className="truncate font-semibold text-gray-900 text-sm dark:text-gray-100">
                      {fileName}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {fileSize && (
                  <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-3 dark:border-blue-800 dark:from-blue-950/30 dark:to-purple-950/30">
                    <HardDrive className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-500" />
                    <div>
                      <p className="mb-0.5 font-medium text-gray-500 text-xs dark:text-gray-400">
                        Size
                      </p>
                      <p className="font-bold text-gray-900 text-sm dark:text-gray-100">
                        {formatFileSize(fileSize)}
                      </p>
                    </div>
                  </div>
                )}

                {dimensions && (
                  <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-3 dark:border-blue-800 dark:from-blue-950/30 dark:to-purple-950/30">
                    <Ruler className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <div>
                      <p className="mb-0.5 font-medium text-gray-500 text-xs dark:text-gray-400">
                        Dimensions
                      </p>
                      <p className="font-bold text-gray-900 text-sm dark:text-gray-100">
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
