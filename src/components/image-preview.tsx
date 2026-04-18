import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { FileImage, HardDrive, Ruler, X } from "lucide-react";

type ImagePreviewProps = {
  imageUrl: string;
  title?: string;
  fileName?: string;
  fileSize?: number;
  dimensions?: { width: number; height: number };
  onRemove?: () => void;
  className?: string;
};

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
    <Card className={`${className} border border-zinc-200 dark:border-zinc-800`}>
      <CardHeader className="flex items-center justify-between border-zinc-200 border-b px-4 py-3 dark:border-zinc-800">
        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        {onRemove && (
          <Button
            color="danger"
            variant="flat"
            size="sm"
            onPress={onRemove}
            isIconOnly
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardBody className="p-0">
        {/* Image */}
        <div className="bg-zinc-50 p-4 dark:bg-zinc-900">
          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
            <img
              src={imageUrl}
              alt="Preview"
              className="h-auto max-h-80 w-full bg-white object-contain dark:bg-zinc-950"
            />
          </div>
        </div>

        {/* Info */}
        {(fileName || fileSize || dimensions) && (
          <div className="space-y-2 px-4 py-3">
            {fileName && (
              <div className="flex items-center gap-2 text-sm">
                <FileImage className="h-4 w-4 shrink-0 text-zinc-400" />
                <span className="truncate text-zinc-600 dark:text-zinc-400">
                  {fileName}
                </span>
              </div>
            )}
            <div className="flex gap-4">
              {fileSize && (
                <div className="flex items-center gap-1.5 text-sm">
                  <HardDrive className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {formatFileSize(fileSize)}
                  </span>
                </div>
              )}
              {dimensions && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Ruler className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {dimensions.width} x {dimensions.height}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
